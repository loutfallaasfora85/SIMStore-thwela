"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const noonOrderId = searchParams.get("noon_order_id");
  const noonStatus = searchParams.get("status");
  const shouldVerifyTap = searchParams.get("verify") === "true";

  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "success" | "failed">(
    shouldVerifyTap ? "loading" : noonStatus === "failed" ? "failed" : "idle"
  );

  useEffect(() => {
    if (!shouldVerifyTap || !orderId) return;
    const tap_id = searchParams.get("tap_id");
    if (!tap_id) {
      setVerifyStatus("failed");
      return;
    }
    fetch(`${API_URL}/api/orders/${orderId}/verify-payment?tap_id=${tap_id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          window.location.href = `/invoice/${orderId}`;
        } else {
          setVerifyStatus("failed");
        }
      })
      .catch(() => setVerifyStatus("failed"));
  }, [orderId, shouldVerifyTap, searchParams]);

  if (verifyStatus === "loading") {
    return (
      <main className="max-w-[1280px] mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500">جاري التحقق من الدفع...</p>
      </main>
    );
  }

  if (verifyStatus === "failed") {
    return (
      <main className="max-w-[1280px] mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-red-600">cancel</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">فشلت عملية الدفع</h1>
        <p className="text-gray-500 mb-6">لم يتم خصم أي مبالغ، يرجى إعادة المحاولة من صفحة الدفع</p>
        {orderId && (
          <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg mb-6 border border-gray-200">
            رقم الطلب: <span className="font-bold text-gray-900">{orderId}</span>
          </p>
        )}
        <div className="flex gap-4">
          <a href="/checkout" className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
            العودة للدفع
          </a>
          <a href="/" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
            الرئيسية
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-emerald-600">check_circle</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">تم تأكيد طلبك بنجاح!</h1>
      <p className="text-gray-500 mb-2">شكراً لك، تم استلام طلبك وجاري العمل على تجهيزه للشحن</p>

      {orderId && (
        <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg mb-6 border border-gray-200">
          رقم الطلب: <span className="font-bold text-gray-900">{orderId}</span>
        </p>
      )}

      <div className="flex items-center gap-4 mt-2">
        <a href="/" className="border-2 border-secondary text-secondary px-6 py-3 rounded-xl font-bold hover:bg-secondary/5 transition-all">
          الرئيسية
        </a>
        <a href="/products" className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          متابعة التسوق
        </a>
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 max-w-md w-full shadow-sm text-right">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">تفاصيل الدفع</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">طريقة الدفع:</span>
            {noonOrderId || noonStatus === "success" ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                دفع إلكتروني مؤكد (noon payments)
              </span>
            ) : shouldVerifyTap && verifyStatus === "success" ? (
              <span className="font-bold text-emerald-600">تم الدفع عبر Tap بنجاح ✓</span>
            ) : (
              <span className="font-bold text-gray-800">الدفع نقداً عند الاستلام</span>
            )}
          </div>

          {noonOrderId && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-400">مرجع نون:</span>
              <span className="font-mono text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">
                {noonOrderId}
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
