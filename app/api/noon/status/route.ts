import { NextRequest, NextResponse } from "next/server";
import { noonPaymentsService } from "@/app/lib/noon/noonPaymentsService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const noonOrderId = searchParams.get("noonOrderId");

  if (!noonOrderId) {
    return NextResponse.json(
      { success: false, message: "noonOrderId is required" },
      { status: 400 }
    );
  }

  try {
    const noonResponse = await noonPaymentsService.getOrder(noonOrderId);
    const noonStatus = noonResponse.result?.order?.status || "PENDING";
    const mapped = noonPaymentsService.mapStatus(noonStatus);

    return NextResponse.json({
      success: true,
      data: {
        noonStatus,
        orderStatus: mapped.orderStatus,
        paymentStatus: mapped.paymentStatus,
        order: noonResponse.result?.order,
      },
    });
  } catch (error) {
    console.error("[API /api/noon/status] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payment status" },
      { status: 500 }
    );
  }
}
