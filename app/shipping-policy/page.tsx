import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الشحن | لمسة للأجهزة المنزلية",
  description: "سياسة الشحن والتوصيل للمسة للأجهزة المنزلية",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main dir="rtl" className="max-w-[900px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-6 sm:mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-secondary/10 mb-3 sm:mb-4">
            <span className="material-symbols-outlined text-secondary text-[28px] sm:text-[40px]">
              local_shipping
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-on-surface">
            سياسة الشحن
          </h1>
          <p className="text-xs sm:text-base text-on-surface-variant mt-2 max-w-md mx-auto">
            نوفر لك خدمة شحن سريعة وموثوقة داخل المملكة العربية السعودية
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4 sm:space-y-6">
          {/* General Info */}
          <div className="bg-white border border-outline-variant/15 rounded-2xl p-4 sm:p-7 shadow-sm">
            <div className="flex items-start gap-2.5 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 bg-secondary/10">
                <span className="material-symbols-outlined text-[18px] sm:text-[24px] text-secondary">
                  info
                </span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface mb-2">معلومات عامة</h2>
                <p className="text-sm sm:text-[15px] text-on-surface-variant leading-relaxed">
                  يتم احتساب الشحن والضرائب على أساس البلد وطريقة التسليم ويشار إليها عند إكمال الطلب.
                  خدمة الدفع نقداً عند التسليم متوفرة في المملكة العربية السعودية.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Fees */}
          <div className="bg-white border border-outline-variant/15 rounded-2xl p-4 sm:p-7 shadow-sm">
            <div className="flex items-start gap-2.5 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 bg-green-100">
                <span className="material-symbols-outlined text-[18px] sm:text-[24px] text-green-600">
                  payments
                </span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface mb-2">رسوم الشحن</h2>
                <p className="text-sm sm:text-[15px] text-on-surface-variant leading-relaxed">
                  شحن مجاني للطلبات الأعلى من <span className="font-bold text-green-600">150 ريال</span>، داخل المملكة العربية السعودية
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Duration */}
          <div className="bg-white border border-outline-variant/15 rounded-2xl p-4 sm:p-7 shadow-sm">
            <div className="flex items-start gap-2.5 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-100">
                <span className="material-symbols-outlined text-[18px] sm:text-[24px] text-blue-600">
                  schedule
                </span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface mb-2">مدة الشحن</h2>
                <p className="text-sm sm:text-[15px] text-on-surface-variant leading-relaxed">
                  كل الطلبات سيتم شحنها وتسليمها من خلال شركات الشحن في حدود{" "}
                  <span className="font-bold text-blue-600">1 إلى 5 أيام عمل</span>.
                </p>
                <p className="text-sm sm:text-[15px] text-on-surface-variant leading-relaxed mt-2">
                  يمكنك تتبع شحنتك من خلال تفاصيل الطلبات من صفحة طلباتي.
                </p>
              </div>
            </div>
          </div>
        </div>

      
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
