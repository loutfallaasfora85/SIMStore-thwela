"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface OrderData {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  noonOrderId?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const orderId = searchParams.get("id");
  const noonOrderId = searchParams.get("noon_order_id");
  const queryStatus = searchParams.get("status");
  const failureReason = searchParams.get("reason");
  const shouldVerifyTap = searchParams.get("verify") === "true";

  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "success" | "failed">(
    shouldVerifyTap ? "loading" : queryStatus === "failed" ? "failed" : queryStatus === "success" ? "success" : "idle"
  );
  const [order, setOrder] = useState<OrderData | null>(null);
  const [errorMessage, setErrorMessage] = useState(
    failureReason || "لم يتم إتمام عملية الدفع بنجاح، يرجى المحاولة مجدداً."
  );

  // 1. عند نجاح الطلب: تفريغ السلة مرة واحدة فقط
  useEffect(() => {
    if (queryStatus === "success" || verifyStatus === "success") {
      clearCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryStatus, verifyStatus]); // clearCart مستثناة عمداً لتجنب infinite loop

  // 2. جلب بيانات الطلب مرة واحدة فقط للتأكد من الحالة وعرض التفاصيل
  useEffect(() => {
    if (!orderId) return;

    fetch(`${API_URL}/api/orders/${orderId}/public`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          setOrder(data.data);
          if (data.data.paymentStatus === "paid") {
            setVerifyStatus("success");
            clearCart();
          } else if (data.data.paymentStatus === "failed" || queryStatus === "failed") {
            setVerifyStatus("failed");
          }
        }
      })
      .catch((err) => console.warn("Error fetching order details:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]); // مرة واحدة عند mount فقط

  // 3. التحقق من Tap إذا كان التحويل من Tap
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
          setVerifyStatus("success");
          clearCart();
        } else {
          setVerifyStatus("failed");
          setErrorMessage(d.message || "فشلت عملية التحقق من الدفع عبر Tap");
        }
      })
      .catch(() => {
        setVerifyStatus("failed");
        setErrorMessage("تعذر الاتصال بخادم التحقق من الدفع");
      });
  }, [orderId, shouldVerifyTap, searchParams, clearCart]);

  // ── شاشة التحميل أثناء التحقق ──
  if (verifyStatus === "loading") {
    return (
      <main className="w-full px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-5" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">جاري التحقق من أمان وحالة الدفع...</h2>
        <p className="text-gray-400 text-sm">يرجى الانتظار لحظات وعدم إغلاق الصفحة</p>
      </main>
    );
  }

  // ── شاشة الفشل أو إلغاء الدفع ──
  if (verifyStatus === "failed") {
    return (
      <main dir="rtl" className="w-full px-4 py-10 sm:py-16 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="bg-white border border-red-100 rounded-3xl p-6 sm:p-10 w-full max-w-md text-center shadow-xl shadow-red-500/5">
          {/* أيقونة الفشل */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <span className="material-symbols-outlined text-4xl sm:text-5xl">cancel</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
            لم تكتمل عملية الدفع
          </h1>

          <p className="text-gray-600 text-sm mb-5 leading-relaxed">
            {errorMessage}
          </p>

          <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 mb-5 text-right">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600 text-xl mt-0.5 flex-shrink-0">info</span>
              <div className="text-xs text-amber-800 leading-relaxed">
                <p className="font-bold mb-0.5">ملاحظة أمان:</p>
                <p>لم يتم خصم أي مبالغ من حسابك أو بطاقتك. تم الاحتفاظ بمنتجاتك في سلة التسوق لإعادة المحاولة.</p>
              </div>
            </div>
          </div>

          {orderId && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-6 flex items-center justify-between gap-2 text-sm flex-wrap">
              <span className="text-gray-400">رقم الطلب المسجل:</span>
              <span className="font-mono font-bold text-gray-800 break-all">{orderId}</span>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex flex-col gap-3">
            <a
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/25 text-sm sm:text-base"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
              إعادة المحاولة والدفع
            </a>
            <a
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3.5 px-6 rounded-2xl font-bold hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              الرئيسية
            </a>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <a
              href={`https://wa.me/966500000000?text=${encodeURIComponent(`مرحباً، أواجه مشكلة في إتمام الدفع للطلب رقم ${orderId || ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">support_agent</span>
              هل تحتاج مساعدة؟ تواصل مع خدمة العملاء
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ── شاشة النجاح وتأكيد الطلب ──
  return (
    <main dir="rtl" className="w-full px-4 py-10 sm:py-16 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 w-full max-w-md text-center shadow-xl shadow-emerald-500/5">
        {/* أيقونة النجاح */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-inner animate-bounce">
          <span className="material-symbols-outlined text-4xl sm:text-5xl">check_circle</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
          تم تأكيد طلبك بنجاح!
        </h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          شكراً لتسوقك معنا، تم استلام طلبك وتأكيد الدفع وجاري تجهيزه للشحن
        </p>

        {/* بطاقة تفاصيل الطلب والدفع */}
        <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 sm:p-5 mb-6 text-right space-y-3">
          {orderId && (
            <div className="flex items-center justify-between gap-2 text-sm flex-wrap">
              <span className="text-gray-400 flex-shrink-0">رقم الطلب:</span>
              <span className="font-mono font-bold text-gray-900 break-all text-xs sm:text-sm">{orderId}</span>
            </div>
          )}

          {order && (
            <>
              <div className="flex items-center justify-between gap-2 text-sm pt-2 border-t border-gray-200/50 flex-wrap">
                <span className="text-gray-400 flex-shrink-0">اسم العميل:</span>
                <span className="font-semibold text-gray-800">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-sm pt-2 border-t border-gray-200/50">
                <span className="text-gray-400 flex-shrink-0">إجمالي المبلغ:</span>
                <span className="font-bold text-secondary text-base">
                  {order.totalPrice.toLocaleString("ar-SA")} ر.س
                </span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-2 text-sm pt-2 border-t border-gray-200/50 flex-wrap">
            <span className="text-gray-400 flex-shrink-0">طريقة الدفع:</span>
            {noonOrderId || queryStatus === "success" ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1 text-xs sm:text-sm">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                دفع إلكتروني (Noon)
              </span>
            ) : shouldVerifyTap ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1 text-xs sm:text-sm">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                دفع إلكتروني (Tap)
              </span>
            ) : (
              <span className="font-bold text-gray-700 text-xs sm:text-sm">الدفع نقداً عند الاستلام</span>
            )}
          </div>

          {noonOrderId && (
            <div className="flex items-center justify-between gap-2 text-xs pt-2 border-t border-gray-200/50 flex-wrap">
              <span className="text-gray-400 flex-shrink-0">رقم العملية (نون):</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 break-all">
                {noonOrderId}
              </span>
            </div>
          )}
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-col gap-3">
          {orderId && (
            <a
              href={`/invoice/${orderId}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/25 text-sm sm:text-base"
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              عرض الفاتورة
            </a>
          )}
          <a
            href="/products"
            className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3.5 px-6 rounded-2xl font-bold hover:bg-gray-50 transition-all text-sm sm:text-base"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            متابعة التسوق
          </a>
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
