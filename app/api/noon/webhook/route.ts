import { NextRequest, NextResponse } from "next/server";
import { noonPaymentsService } from "@/app/lib/noon/noonPaymentsService";
import { NoonApiOrderStatus } from "@/app/lib/noon/types";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verify webhook signature (JWS v2 or HMAC v1)
    const isValid = noonPaymentsService.verifyWebhook(rawBody, req.headers);
    if (!isValid) {
      console.warn("[Noon Webhook] Unauthorized webhook attempt: invalid signature.");
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
    }

    // Parse event payload
    let eventData: Record<string, unknown> = {};
    const version = req.headers.get("np-webhook-version");

    if (version === "2") {
      const parts = rawBody.split(".");
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
        eventData = JSON.parse(payloadJson);
      }
    } else {
      eventData = JSON.parse(rawBody);
    }

    console.log("[Noon Webhook] Received valid event:", eventData.eventType || eventData.eventName);

    const orderId = (eventData.orderId || eventData.merchantOrderReference) as string;
    const noonOrderId = (eventData.noonOrderId || eventData.orderId) as string;
    const noonStatus = (eventData.orderStatus || eventData.status) as NoonApiOrderStatus;

    if (orderId && noonStatus) {
      const { orderStatus, paymentStatus } = noonPaymentsService.mapStatus(noonStatus);

      console.log(
        `[Noon Webhook] Updating order ${orderId} -> orderStatus: ${orderStatus}, paymentStatus: ${paymentStatus}`
      );

      try {
        await fetch(`${BACKEND_API_URL}/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: "noon_payments",
            orderStatus,
            paymentStatus,
            noonOrderId,
          }),
        });
      } catch (err) {
        console.error(`[Noon Webhook] Failed to update backend order ${orderId}:`, err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Noon Webhook] Error processing webhook:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
