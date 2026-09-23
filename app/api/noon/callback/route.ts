import { NextRequest, NextResponse } from "next/server";
import { noonPaymentsService } from "@/app/lib/noon/noonPaymentsService";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function handleCallback(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin;

  // 1. استخراج المتغيرات من URL أو من Body (إذا كان الطلب POST)
  const bodyParams: Record<string, string> = {};
  if (req.method === "POST") {
    const contentType = req.headers.get("content-type") || "";
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      try {
        const formData = await req.formData();
        formData.forEach((val, key) => {
          if (typeof val === "string") bodyParams[key] = val;
        });
      } catch {}
    } else if (contentType.includes("application/json")) {
      try {
        const json = await req.json();
        if (json && typeof json === "object") {
          Object.entries(json).forEach(([k, v]) => {
            bodyParams[k] = String(v);
          });
        }
      } catch {}
    }
  }

  // جمع كافة قيم orderId الممكنة
  const allValues = [
    searchParams.get("merchantOrderId"),
    searchParams.get("merchantOrderReference"),
    searchParams.get("order.reference"),
    ...searchParams.getAll("orderId"),
    bodyParams.merchantOrderId,
    bodyParams.orderId,
  ].filter(Boolean) as string[];

  // تمييز معرّف قاعدة البيانات (24 حرف سداسي عشري)
  let merchantOrderId = allValues.find((v) => /^[0-9a-fA-F]{24}$/.test(v)) || "";

  // تمييز معرّف نون (رقمي)
  let noonOrderId =
    searchParams.get("order.id") ||
    searchParams.get("noon_order_id") ||
    bodyParams["order.id"] ||
    bodyParams.noonOrderId ||
    "";

  if (!noonOrderId) {
    const numericVal = allValues.find((v) => /^\d+$/.test(v));
    if (numericVal) noonOrderId = numericVal;
  }

  // إذا لم نجد معرّف نون ولكن لدينا معرّف الطلب، نحاول جلبه من قاعدة البيانات
  if (merchantOrderId && !noonOrderId) {
    try {
      const orderRes = await fetch(`${BACKEND_API_URL}/api/orders/${merchantOrderId}/public`, {
        cache: "no-store",
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData.data?.noonOrderId) {
          noonOrderId = orderData.data.noonOrderId;
        }
      }
    } catch (e) {
      console.warn("[Noon Callback] Could not fetch saved noonOrderId from backend:", e);
    }
  }

  // إذا لم يتوفر أي معرّف
  if (!merchantOrderId && !noonOrderId) {
    console.error("[Noon Callback] Missing both merchantOrderId and noonOrderId.");
    return NextResponse.redirect(`${appBaseUrl}/checkout?error=${encodeURIComponent("بيانات الدفع غير مكتملة")}`);
  }

  try {
    let noonStatus = "FAILED";
    let isSuccess = false;
    let errorMessage = "فشلت عملية الدفع، يرجى المحاولة مرة أخرى";

    // 2. التحقق الأمني المباشر من سيرفرات نون
    if (noonOrderId) {
      const verifyResponse = await noonPaymentsService.getOrder(noonOrderId);
      const noonOrder = verifyResponse.result?.order;
      noonStatus = noonOrder?.status || "FAILED";

      // التحقق من تطابق المبلغ مع قاعدة البيانات
      if (merchantOrderId) {
        try {
          const dbOrderRes = await fetch(`${BACKEND_API_URL}/api/orders/${merchantOrderId}/public`, {
            cache: "no-store",
          });
          if (dbOrderRes.ok) {
            const dbData = await dbOrderRes.json();
            const expectedAmount = Number(dbData.data?.totalPrice);
            const paidAmount = Number(noonOrder?.totalAmount ?? noonOrder?.amount);

            if (paidAmount && expectedAmount && Math.abs(paidAmount - expectedAmount) > 0.05) {
              console.error(
                `[Noon Callback Security] Price Mismatch for order ${merchantOrderId}: Expected ${expectedAmount}, Paid ${paidAmount}`
              );
              noonStatus = "FAILED";
              errorMessage = "فشل التحقق الأمني: عدم تطابق قيمة الدفع";
            }
          }
        } catch (priceCheckErr) {
          console.warn("[Noon Callback] Price check failed:", priceCheckErr);
        }
      }

      if (noonStatus === "PAID" || noonStatus === "CAPTURED") {
        isSuccess = true;
      } else if (noonStatus === "CANCELLED" || noonStatus === "EXPIRED") {
        errorMessage = "تم إلغاء عملية الدفع بواسطة العميل";
      } else {
        errorMessage = "فشلت عملية الدفع، يرجى استخدام بطاقة أخرى أو إعادة المحاولة";
      }
    } else {
      errorMessage = "تعذر العثور على مرجع عملية الدفع لدى نون";
    }

    console.log(
      `[Noon Callback] Processed order: ${merchantOrderId}, noonId: ${noonOrderId}, status: ${noonStatus}, success: ${isSuccess}`
    );

    // 3. تحديث حالة الطلب في الباك إند
    if (merchantOrderId) {
      try {
        await fetch(`${BACKEND_API_URL}/api/orders/${merchantOrderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: "noon_payments",
            orderStatus: isSuccess ? "confirmed" : (noonStatus === "CANCELLED" ? "cancelled" : "pending"),
            paymentStatus: isSuccess ? "paid" : "failed",
            noonOrderId,
          }),
        });
      } catch (err) {
        console.warn(`[Noon Callback] Failed to update backend order status for ${merchantOrderId}:`, err);
      }
    }

    // 4. توجيه العميل بوضوح: صفحة النجاح في حال النجاح، أو صفحة تفاصيل الفشل في حال الفشل
    if (isSuccess) {
      return NextResponse.redirect(
        `${appBaseUrl}/order-success?id=${encodeURIComponent(merchantOrderId)}&noon_order_id=${encodeURIComponent(noonOrderId)}&status=success`
      );
    } else {
      return NextResponse.redirect(
        `${appBaseUrl}/order-success?id=${encodeURIComponent(merchantOrderId)}&noon_order_id=${encodeURIComponent(noonOrderId)}&status=failed&reason=${encodeURIComponent(errorMessage)}`
      );
    }
  } catch (error) {
    console.error("[Noon Callback] Error verifying payment with noon payments:", error);
    return NextResponse.redirect(
      `${appBaseUrl}/order-success?id=${encodeURIComponent(merchantOrderId)}&status=failed&reason=${encodeURIComponent("حدث خطأ أثناء معالجة الدفع، يرجى التواصل مع الدعم أو المحاولة مرة أخرى")}`
    );
  }
}

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}
