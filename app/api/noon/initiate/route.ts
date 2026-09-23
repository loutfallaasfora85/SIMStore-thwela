import { NextRequest, NextResponse } from "next/server";
import { noonPaymentsService } from "@/app/lib/noon/noonPaymentsService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, customerName, customerPhone, currency, name } = body;

    // Validate parameters
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { success: false, message: "orderId is required and must be a string." },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "amount is required and must be a positive number." },
        { status: 400 }
      );
    }

    // Initiate payment with noon payments
    const result = await noonPaymentsService.initiatePayment({
      orderId,
      amount,
      currency: currency || "SAR",
      name: name || `طلب رقم #${orderId}`,
      customerName,
      customerPhone,
    });

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
