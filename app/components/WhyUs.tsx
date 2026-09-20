const features = [
  {
    icon: "verified",
    title: "منتجات أصلية مضمونة",
    desc: "جميع منتجاتنا من مصادر موثوقة مع ضمان الجودة وإمكانية الإرجاع",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    icon: "local_shipping",
    title: "توصيل لجميع المناطق",
    desc: "نوصل لكل مناطق المملكة العربية السعودية بسرعة وأمان",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: "payments",
    title: "أسعار تنافسية",
    desc: "أفضل الأسعار في السوق مع عروض وخصومات دورية على الأجهزة المنزلية",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    icon: "support_agent",
    title: "خدمة عملاء متميزة",
    desc: "فريقنا متاح لمساعدتك في اختيار المنتج المناسب والرد على استفساراتك",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
  },
];

export default function WhyUs() {
  return (
    <section dir="rtl" className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-[32px] font-bold text-gray-900 mb-2 sm:mb-3">
          لماذا برج المبدع؟
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            نحن نفهم أن بيتك يستحق الأفضل — لذلك نقدم لك جودة عالية بسعر عادل
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`${f.bg} rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3 sm:mb-4`}
              >
                <span className="material-symbols-outlined text-white text-lg sm:text-xl">{f.icon}</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-1.5 sm:mb-2">{f.title}</h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="mt-8 sm:mt-10 md:mt-14 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center sm:text-right">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1">
              جاهز تبدأ تسوق الأجهزة المنزلية؟
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">تصفح آلاف المنتجات واطلب أونلاين بكل سهولة</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/products"
              className="bg-secondary text-white px-5 sm:px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors whitespace-nowrap"
            >
              تسوق الآن
            </a>
            <a
              href="/contact"
              className="border border-gray-200 text-gray-600 px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              استشارة مجانية
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
