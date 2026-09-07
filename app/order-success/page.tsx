"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const shouldVerify = searchParams.get("verify") === "true";
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "success" | "failed">(
    shouldVerify ? "loading" : "idle"
  );

  useEffect(() => {
    if (!shouldVerify || !orderId) return;
    const tap_id = searchParams.get("tap_id");
    if (!tap_id) { setVerifyStatus("failed"); return; }
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
  }, [orderId, shouldVerify, searchParams]);

  if (verifyStatus === "loading") {
    return (
      <main className="max-w-[1280px] mx-auto px-margin py-unit-xl min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-on-surface-variant">جاري التحقق من الدفع...</p>
      </main>
    );
  }

  if (verifyStatus === "failed") {
    return (
      <main className="max-w-[1280px] mx-auto px-margin py-unit-xl min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-red-600">cancel</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-3">فشل التحقق من الدفع</h1>
        <p className="text-on-surface-variant mb-6">يرجى التواصل مع الدعم وذكر رقم الطلب</p>
        {orderId && (
          <p className="text-sm text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-lg mb-6">
            رقم الطلب: <span className="font-bold text-on-surface">{orderId}</span>
          </p>
        )}
        <a href="/" className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          الرئيسية
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-[1280px] mx-auto px-margin py-unit-xl min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
      </div>
      <h1 className="text-3xl font-bold text-on-surface mb-3">تم تأكيد طلبك بنجاح!</h1>
      <p className="text-on-surface-variant mb-2">شكراً لك، سيتم التواصل معك قريباً لتأكيد التوصيل</p>
      {orderId && (
        <p className="text-sm text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-lg mb-6">
          رقم الطلب: <span className="font-bold text-on-surface">{orderId}</span>
        </p>
      )}
      <div className="flex items-center gap-4 mt-4">
        <a href="/" className="border-2 border-secondary text-secondary px-6 py-3 rounded-xl font-bold hover:bg-secondary/5 transition-all">
          الرئيسية
        </a>
        <a href="/products" className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          متابعة التسوق
        </a>
      </div>
      <div className="mt-8 bg-white rounded-xl border border-outline-variant/20 p-6 max-w-md w-full">
        <h3 className="font-bold text-on-surface mb-3">طريقة الدفع</h3>
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          {shouldVerify && verifyStatus === "success" ? (
            <>
              <span className="material-symbols-outlined text-secondary">splitscreen</span>
              <span>تم الدفع عبر Tap بنجاح ✓</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-secondary">local_shipping</span>
              <span>الدفع نقداً عند الاستلام</span>
            </>
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
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" /></div>}>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
