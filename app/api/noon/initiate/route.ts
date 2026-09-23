import { NextRequest, NextResponse } from "next/server";
import { noonPaymentsService } from "@/app/lib/noon/noonPaymentsService";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    // 1. التحقق من صحة معرّف الطلب
    if (!orderId || typeof orderId !== "string" || !/^[0-9a-fA-F]{24}$/.test(orderId)) {
      return NextResponse.json(
        { success: false, message: "معرف الطلب غير صالح" },
        { status: 400 }
      );
    }

    // 2. فحص أمني: جلب الطلب الفعلي من قاعدة البيانات والتحقق من حالته وسعره الحقيقي
    let backendOrder: {
      totalPrice: number;
      paymentStatus: string;
      customerName: string;
      phone: string;
      status: string;
    } | null = null;

    try {
      const orderRes = await fetch(`${BACKEND_API_URL}/api/orders/${orderId}/public`, {
        cache: "no-store",
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        backendOrder = orderData.data;
      }
    } catch (fetchErr) {
      console.warn(`[Noon Initiate] Could not fetch order ${orderId} from backend:`, fetchErr);
    }

    if (!backendOrder) {
      return NextResponse.json(
        { success: false, message: "الطلب غير موجود في النظام" },
        { status: 404 }
      );
    }

    // منع الدفع المزدوج إذا كان الطلب مسدداً بالفعل
    if (backendOrder.paymentStatus === "paid") {
      return NextResponse.json(
        { success: false, message: "تم سداد هذا الطلب مسبقاً بنجاح" },
        { status: 400 }
      );
    }

    const secureAmount = Number(backendOrder.totalPrice);
    if (!secureAmount || secureAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "مبلغ الطلب غير صالح" },
        { status: 400 }
      );
    }

    // 3. إنشاء جلسة الدفع في نون باستخدام المبلغ والبيانات المؤكدة من السيرفر
    const result = await noonPaymentsService.initiatePayment({
      orderId,
      amount: secureAmount,
      currency: "SAR",
      name: `طلب رقم #${orderId}`,
      customerName: backendOrder.customerName,
      customerPhone: backendOrder.phone,
    });

    // 4. حفظ معرّف نون (noonOrderId) في قاعدة البيانات فوراً لربط الجلسة بالطلب
    if (result.noonOrderId) {
      try {
        await fetch(`${BACKEND_API_URL}/api/orders/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: "noon_payments",
            noonOrderId: String(result.noonOrderId),
          }),
        });
      } catch (err) {
        console.warn(`[Noon Initiate] Failed to save noonOrderId to backend:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: result.orderId,
        noonOrderId: result.noonOrderId,
        postUrl: result.postUrl,
        jsUrl: result.jsUrl,
      },
    });
  } catch (error: unknown) {
    console.error("[API /api/noon/initiate] Error:", error);
    const message = error instanceof Error ? error.message : "فشل بدء عملية الدفع";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
