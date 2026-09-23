import { test, describe } from "node:test";
import assert from "node:assert";
import crypto from "crypto";
import { NoonPaymentsService } from "../app/lib/noon/noonPaymentsService.ts";

describe("NoonPaymentsService Unit Tests", () => {
  const mockConfig = {
    mode: "test" as const,
    businessId: "biz_test_123",
    appId: "app_test_456",
    appKey: "key_secret_789",
    webhookKey: "webhook_secret_abc",
    baseUrl: "https://api-test.sa.noonpayments.com",
    returnUrl: "http://localhost:3000",
  };

  test("1. Generates correct Authorization Header for Test environment", () => {
    const service = new NoonPaymentsService(mockConfig);
    const authHeader = service.getAuthHeader();

    assert.ok(authHeader.startsWith("Key_Test "));
    const encoded = authHeader.replace("Key_Test ", "");
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");

    assert.strictEqual(decoded, "biz_test_123.app_test_456:key_secret_789");
  });

  test("2. Generates correct Authorization Header for Live environment", () => {
    const service = new NoonPaymentsService({ ...mockConfig, mode: "live" });
    const authHeader = service.getAuthHeader();

    assert.ok(authHeader.startsWith("Key_Live "));
    const encoded = authHeader.replace("Key_Live ", "");
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");

    assert.strictEqual(decoded, "biz_test_123.app_test_456:key_secret_789");
  });

  test("3. Throws error if credentials are missing", () => {
    const service = new NoonPaymentsService({
      businessId: "",
      appId: "",
      appKey: "",
    });

    assert.throws(
      () => service.getAuthHeader(),
      /Missing noon payments credentials/
    );
  });

  test("4. Status Mapping correctly separates Order and Payment statuses", () => {
    const service = new NoonPaymentsService(mockConfig);

    // Success / Captured
    const paid = service.mapStatus("PAID");
    assert.strictEqual(paid.orderStatus, "paid");
    assert.strictEqual(paid.paymentStatus, "captured");

    const captured = service.mapStatus("CAPTURED");
    assert.strictEqual(captured.orderStatus, "paid");
    assert.strictEqual(captured.paymentStatus, "captured");

    // Authorized
    const auth = service.mapStatus("AUTHORIZED");
    assert.strictEqual(auth.orderStatus, "pending");
    assert.strictEqual(auth.paymentStatus, "authorized");

    // Authenticated (3DS passed)
    const authenticated = service.mapStatus("AUTHENTICATED");
    assert.strictEqual(authenticated.orderStatus, "pending");
    assert.strictEqual(authenticated.paymentStatus, "authenticated");

    // Failed
    const failed = service.mapStatus("FAILED");
    assert.strictEqual(failed.orderStatus, "failed");
    assert.strictEqual(failed.paymentStatus, "failed");

    // Cancelled / Expired
    const cancelled = service.mapStatus("CANCELLED");
    assert.strictEqual(cancelled.orderStatus, "cancelled");
    assert.strictEqual(cancelled.paymentStatus, "cancelled");

    const expired = service.mapStatus("EXPIRED");
    assert.strictEqual(expired.orderStatus, "cancelled");
    assert.strictEqual(expired.paymentStatus, "cancelled");
  });

  test("5. Validates input parameters for initiatePayment", async () => {
    const service = new NoonPaymentsService(mockConfig);

    await assert.rejects(
      async () => service.initiatePayment({ orderId: "", amount: 100 }),
      /Invalid payment parameters/
    );

    await assert.rejects(
      async () => service.initiatePayment({ orderId: "ORD123", amount: -10 }),
      /Invalid payment parameters/
    );
  });

  test("6. Webhook verification: Version 1 HMAC", () => {
    const service = new NoonPaymentsService(mockConfig);
    const payload = JSON.stringify({
      orderId: "ORD_999",
      orderStatus: "PAID",
      eventType: "PAYMENT_SUCCESS",
    });

    // Valid signature
    const validSignature = crypto
      .createHmac("sha256", mockConfig.webhookKey)
      .update(payload)
      .digest("hex");

    const headersValid = new Headers({ "x-signature": validSignature });
    assert.strictEqual(service.verifyWebhook(payload, headersValid), true);

    // Invalid signature
    const headersInvalid = new Headers({ "x-signature": "wrong_signature" });
    assert.strictEqual(service.verifyWebhook(payload, headersInvalid), false);
  });

  test("7. Webhook verification: Version 2 JWS", () => {
    const service = new NoonPaymentsService(mockConfig);
    const headerB64 = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const payloadB64 = Buffer.from(
      JSON.stringify({ orderId: "ORD_999", orderStatus: "PAID" })
    ).toString("base64url");
    const content = `${headerB64}.${payloadB64}`;
    const validSig = crypto
      .createHmac("sha256", mockConfig.webhookKey)
      .update(content)
      .digest("base64url");

    const validJws = `${headerB64}.${payloadB64}.${validSig}`;
    const headers = new Headers({ "np-webhook-version": "2" });

    assert.strictEqual(service.verifyWebhook(validJws, headers), true);

    // Tampered payload
    const tamperedJws = `${headerB64}.${payloadB64}.tamperedsignature`;
    assert.strictEqual(service.verifyWebhook(tamperedJws, headers), false);
  });

  test("8. Initiate Payment handles successful API response correctly", async () => {
    const service = new NoonPaymentsService(mockConfig);

    // Mock global fetch for this test
    const originalFetch = global.fetch;
    try {
      global.fetch = async () => {
        return new Response(
          JSON.stringify({
            resultCode: 0,
            message: "Success",
            result: {
              order: { id: 987654, status: "INITIATED" },
              checkoutData: {
                postUrl: "https://checkout.noonpayments.com/payment/987654",
                jsUrl: "https://checkout.noonpayments.com/sdk/checkout.js",
              },
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      };

      const result = await service.initiatePayment({
        orderId: "ORD_TEST_101",
        amount: 250.5,
        customerName: "فهد العتيبي",
        customerPhone: "0501234567",
      });

      assert.strictEqual(result.orderId, "ORD_TEST_101");
      assert.strictEqual(result.noonOrderId, 987654);
      assert.strictEqual(
        result.postUrl,
        "https://checkout.noonpayments.com/payment/987654"
      );
      assert.strictEqual(
        result.jsUrl,
        "https://checkout.noonpayments.com/sdk/checkout.js"
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("9. Initiate Payment handles API error (non-zero resultCode)", async () => {
    const service = new NoonPaymentsService(mockConfig);

    const originalFetch = global.fetch;
    try {
      global.fetch = async () => {
        return new Response(
          JSON.stringify({
            resultCode: 19012,
            message: "Order already initiated",
            classDescription: "Duplicate Order Reference",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      };

      await assert.rejects(
        async () =>
          service.initiatePayment({
            orderId: "ORD_DUPLICATE_001",
            amount: 150,
          }),
        /Order already initiated/
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("10. Handles Request Timeout gracefully", async () => {
    const service = new NoonPaymentsService(mockConfig);

    const originalFetch = global.fetch;
    try {
      global.fetch = async (_, init) => {
        // Wait for abort signal
        return new Promise((_, reject) => {
          if (init?.signal) {
            init.signal.addEventListener("abort", () => {
              const abortErr = new Error("The operation was aborted");
              abortErr.name = "AbortError";
              reject(abortErr);
            });
          }
        });
      };

      // Set timeout in executeRequest to 10ms for fast test
      await assert.rejects(
        async () =>
          (service as unknown as { executeRequest: (e: string, o: RequestInit, t: number) => Promise<unknown> })
            .executeRequest("/payment/v1/order", { method: "POST" }, 50),
        /timed out/
      );
    } finally {
      global.fetch = originalFetch;
    }
  });
});
