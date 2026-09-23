import crypto from "crypto";
import type {
  NoonConfig,
  NoonInitiateOrderPayload,
  NoonApiResponse,
  NoonInitiateResult,
  NoonGetOrderResult,
  NoonApiOrderStatus,
  OrderInternalStatus,
  PaymentInternalStatus,
} from "./types.ts";

export class NoonPaymentsService {
  private config: NoonConfig;

  constructor(customConfig?: Partial<NoonConfig>) {
    const mode = (customConfig?.mode || process.env.NOON_MODE || "test") as "test" | "live";
    const defaultBaseUrl =
      mode === "live"
        ? "https://api.sa.noonpayments.com"
        : "https://api-test.sa.noonpayments.com";

    this.config = {
      mode,
      businessId: customConfig?.businessId || process.env.NOON_BUSINESS_ID || "",
      appId: customConfig?.appId || process.env.NOON_APP_ID || "",
      appKey: customConfig?.appKey || process.env.NOON_APP_KEY || "",
      webhookKey: customConfig?.webhookKey || process.env.NOON_WEBHOOK_KEY || "",
      baseUrl: customConfig?.baseUrl || process.env.NOON_BASE_URL || defaultBaseUrl,
      returnUrl: customConfig?.returnUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    };
  }

  /**
   * Generates the official noon payments Authorization Header:
   * Header: "Key_Test <base64>" or "Key_Live <base64>"
   * String to encode: `${BusinessIdentifier}.${ApplicationIdentifier}:${ApplicationKey}`
   */
  public getAuthHeader(): string {
    const { businessId, appId, appKey, mode } = this.config;
    if (!businessId || !appId || !appKey) {
      throw new Error(
        "Missing noon payments credentials: NOON_BUSINESS_ID, NOON_APP_ID, and NOON_APP_KEY are required."
      );
    }

    const rawCredentials = `${businessId}.${appId}:${appKey}`;
    const base64Credentials = Buffer.from(rawCredentials).toString("base64");
    const scheme = mode === "live" ? "Key_Live" : "Key_Test";

    return `${scheme} ${base64Credentials}`;
  }

  /**
   * Sanitizes payloads for safe logging (removes sensitive data like tokens or secrets)
   */
  private sanitizeForLog(data: unknown): unknown {
    if (!data || typeof data !== "object") return data;
    try {
      const cloned = JSON.parse(JSON.stringify(data));
      const redactKeys = ["appKey", "webhookKey", "Authorization", "cardNumber", "cvv", "token"];
      const redactObject = (obj: Record<string, unknown>) => {
        for (const key of Object.keys(obj)) {
          if (redactKeys.some((k) => k.toLowerCase() === key.toLowerCase())) {
            obj[key] = "[REDACTED]";
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            redactObject(obj[key] as Record<string, unknown>);
          }
        }
      };
      redactObject(cloned);
      return cloned;
    } catch {
      return "[Unserializable Data]";
    }
  }

  /**
   * Safe fetch with timeout and error handling
   */
  private async executeRequest<T>(
    endpoint: string,
    options: RequestInit,
    timeoutMs: number = 15000
  ): Promise<NoonApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers = {
      "Content-Type": "application/json",
      Authorization: this.getAuthHeader(),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      const data = (await response.json()) as NoonApiResponse<T>;

      if (!response.ok) {
        console.error(
          `[NoonPayments] HTTP Error ${response.status} from ${endpoint}:`,
          this.sanitizeForLog(data)
        );
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error(`[NoonPayments] Request to ${endpoint} timed out after ${timeoutMs}ms`);
        throw new Error(`noon payments API request timed out after ${timeoutMs}ms`);
      }
      console.error(`[NoonPayments] Network error calling ${endpoint}:`, error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Initiate an Order with noon payments
   */
  public async initiatePayment(params: {
    orderId: string;
    amount: number;
    currency?: string;
    name?: string;
    customerName?: string;
    customerPhone?: string;
    returnUrl?: string;
  }): Promise<{
    orderId: string;
    noonOrderId: string | number;
    postUrl: string;
    jsUrl?: string;
    raw: NoonApiResponse<NoonInitiateResult>;
  }> {
    if (!params.orderId || params.amount <= 0) {
      throw new Error("Invalid payment parameters: orderId and a positive amount are required.");
    }

    const returnUrl =
      params.returnUrl ||
      `${this.config.returnUrl}/api/noon/callback?orderId=${encodeURIComponent(params.orderId)}`;

    // Sanitize reference to avoid special characters rejected by gateways
    const sanitizedReference = params.orderId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50);

    const fullName = (params.customerName || "عميل").trim();
    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || "عميل";
    const lastName = nameParts.slice(1).join(" ") || undefined;

    const contact: { firstName: string; lastName?: string; phone?: string } = {
      firstName,
    };
    if (lastName) contact.lastName = lastName;
    if (params.customerPhone) contact.phone = params.customerPhone;

    const payload: NoonInitiateOrderPayload = {
      apiOperation: "INITIATE",
      order: {
        amount: Number(params.amount.toFixed(2)),
        currency: params.currency || "SAR",
        name: params.name || `Order ${params.orderId}`,
        reference: sanitizedReference,
        category: "pay",
        channel: "web",
      },
      configuration: {
        paymentAction: "SALE",
        returnUrl,
        locale: "ar",
      },
      billing: {
        contact,
      },
    };

    const response = await this.executeRequest<NoonInitiateResult>("/payment/v1/order", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.resultCode !== 0 || !response.result?.checkoutData?.postUrl) {
      throw new Error(
        response.message ||
          response.classDescription ||
          `Failed to initiate payment with noon payments (Code: ${response.resultCode})`
      );
    }

    return {
      orderId: params.orderId,
      noonOrderId: response.result.order.id,
      postUrl: response.result.checkoutData.postUrl,
      jsUrl: response.result.checkoutData.jsUrl,
      raw: response,
    };
  }

  /**
   * Retrieve order details and verify payment status from noon payments server
   */
  public async getOrder(noonOrderId: string | number): Promise<NoonApiResponse<NoonGetOrderResult>> {
    if (!noonOrderId) {
      throw new Error("noonOrderId is required to get order status.");
    }

    const endpoint = `/payment/v1/order/${encodeURIComponent(noonOrderId)}`;
    return await this.executeRequest<NoonGetOrderResult>(endpoint, {
      method: "GET",
    });
  }

  /**
   * Maps noon payments order status to internal order and payment statuses
   */
  public mapStatus(noonStatus: NoonApiOrderStatus): {
    orderStatus: OrderInternalStatus;
    paymentStatus: PaymentInternalStatus;
  } {
    switch (noonStatus) {
      case "PAID":
      case "CAPTURED":
        return { orderStatus: "paid", paymentStatus: "captured" };
      case "AUTHORIZED":
        return { orderStatus: "pending", paymentStatus: "authorized" };
      case "AUTHENTICATED":
        return { orderStatus: "pending", paymentStatus: "authenticated" };
      case "INITIATED":
      case "PENDING":
        return { orderStatus: "pending", paymentStatus: "initiated" };
      case "FAILED":
      case "REVERSED":
        return { orderStatus: "failed", paymentStatus: "failed" };
      case "EXPIRED":
      case "CANCELLED":
        return { orderStatus: "cancelled", paymentStatus: "cancelled" };
      default:
        return { orderStatus: "pending", paymentStatus: "pending" };
    }
  }

  /**
   * Verifies Webhook Signature
   * Supports JWS (Version 2) and HMAC (Version 1)
   */
  public verifyWebhook(rawBody: string, headers: Headers): boolean {
    const webhookKey = this.config.webhookKey;
    if (!webhookKey) {
      console.warn("[NoonPayments] Webhook received but NOON_WEBHOOK_KEY is not configured.");
      return false;
    }

    const version = headers.get("np-webhook-version");

    if (version === "2") {
      // JWS Format: Header.Payload.Signature
      const parts = rawBody.split(".");
      if (parts.length !== 3) return false;

      const [headerB64, payloadB64, signatureB64] = parts;
      const content = `${headerB64}.${payloadB64}`;
      const expectedSignature = crypto
        .createHmac("sha256", webhookKey)
        .update(content)
        .digest("base64url");

      const sigBuf = Buffer.from(signatureB64);
      const expectedBuf = Buffer.from(expectedSignature);
      if (sigBuf.length !== expectedBuf.length) return false;

      return crypto.timingSafeEqual(sigBuf, expectedBuf);
    } else {
      // Version 1 HMAC check if signature header provided
      const providedSignature = headers.get("x-signature") || headers.get("np-signature");
      if (!providedSignature) return false;

      const expectedSignature = crypto
        .createHmac("sha256", webhookKey)
        .update(rawBody)
        .digest("hex");

      const sigBuf = Buffer.from(providedSignature);
      const expectedBuf = Buffer.from(expectedSignature);
      if (sigBuf.length !== expectedBuf.length) return false;

      return crypto.timingSafeEqual(sigBuf, expectedBuf);
    }
  }
}

export const noonPaymentsService = new NoonPaymentsService();
