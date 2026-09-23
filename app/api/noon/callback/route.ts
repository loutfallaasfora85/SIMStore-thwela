import { NextRequest, NextResponse } from "next/server";
import { noonPaymentsService } from "@/app/lib/noon/noonPaymentsService";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function handleCallback(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // noon payments returns orderId, order.id, or merchantOrderReference
  const orderId = searchParams.get("orderId") || searchParams.get("merchantOrderReference") || "";
  const noonOrderId =
    searchParams.get("order.id") ||
    searchParams.get("orderId") ||
    searchParams.get("id") ||
    "";

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin;

  if (!orderId && !noonOrderId) {
    console.error("[Noon Callback] Missing order identifier in callback query parameters.");
    return NextResponse.redirect(`${appBaseUrl}/checkout?error=${encodeURIComponent("بيانات الدفع غير مكتملة")}`);
  }

  try {
    // SECURITY: Always verify directly with noon payments server
    // Never rely solely on client redirect parameters!
    const targetNoonId = noonOrderId || orderId;
    const verifyResponse = await noonPaymentsService.getOrder(targetNoonId);

    const noonStatus = verifyResponse.result?.order?.status || "FAILED";
    const { orderStatus, paymentStatus } = noonPaymentsService.mapStatus(noonStatus);

    console.log(`[Noon Callback] Order ${orderId} (noonId: ${noonOrderId}) status: ${noonStatus} -> order: ${orderStatus}, payment: ${paymentStatus}`);

    // Update backend order status if orderId exists
    if (orderId) {
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
        console.warn(`[Noon Callback] Failed to update backend order status for ${orderId}:`, err);
      }
    }

    if (orderStatus === "paid" && paymentStatus === "captured") {
      return NextResponse.redirect(
        `${appBaseUrl}/order-success?id=${encodeURIComponent(orderId)}&noon_order_id=${encodeURIComponent(noonOrderId)}&status=success`
      );
    } else {
      const errorMessage =
        noonStatus === "CANCELLED" || noonStatus === "EXPIRED"
          ? "تم إلغاء عملية الدفع"
          : "فشلت عملية الدفع، يرجى المحاولة مرة أخرى";
      return NextResponse.redirect(
        `${appBaseUrl}/checkout?error=${encodeURIComponent(errorMessage)}&orderId=${encodeURIComponent(orderId)}`
      );
    }
  } catch (error) {
    console.error("[Noon Callback] Error verifying payment with noon payments:", error);
    return NextResponse.redirect(
      `${appBaseUrl}/checkout?error=${encodeURIComponent("حدث خطأ أثناء التحقق من الدفع، يرجى المحاولة مجدداً")}`
    );
  }
}

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}
