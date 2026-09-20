export default function Footer() {
  return (
    <footer dir="rtl" className="bg-gray-900 text-gray-300 mt-8 sm:mt-12 md:mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">

        {/* Main Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 pb-8 md:pb-10 border-b border-gray-700/60">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 md:mb-3">برج المبدع للأجهزة المنزلية</h3>
            <p className="text-gray-400 leading-relaxed text-xs sm:text-sm mb-4">
              وجهتك الأولى للأجهزة المنزلية في المملكة العربية السعودية — جودة تثق بها بسعر يناسبك.
            </p>
            <a
              href="https://qr.saudibusiness.gov.sa/viewcr?nCrNumber=Q5EZfdtz9yY8ZHsLf1ZCGw=="
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl p-3 border border-gray-700 inline-block"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-amber-400 text-base">verified</span>
                <span className="text-xs text-gray-400">السجل التجاري</span>
              </div>
              <span className="text-white font-bold text-sm sm:text-base">7055187582</span>
            </a>
            <a
              href="https://eauthenticate.saudibusiness.gov.sa/inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl p-3 border border-gray-700 inline-block mt-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-amber-400 text-base">business_center</span>
                <span className="text-xs text-gray-400">مركز الأعمال</span>
              </div>
              <span className="text-white font-bold text-sm sm:text-base">0000325572</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-3 md:mb-4">روابط سريعة</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/products", label: "جميع المنتجات" },
                { href: "/about", label: "من نحن" },
                { href: "/contact", label: "تواصل معنا" },
              ].map((l) => (
                <li key={l.href}>
                  <a className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-1.5" href={l.href}>
                    <span className="text-secondary text-[14px] material-symbols-outlined">chevron_left</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-3 md:mb-4">سياسات الموقع</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { href: "/privacy", label: "سياسة الخصوصية" },
                { href: "/terms", label: "الشروط والأحكام" },
                { href: "/return-policy", label: "سياسة الإرجاع" },
                { href: "/shipping-policy", label: "سياسة الشحن" },
              ].map((l) => (
                <li key={l.href}>
                  <a className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-1.5" href={l.href}>
                    <span className="text-secondary text-[14px] material-symbols-outlined">chevron_left</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-white font-bold text-sm sm:text-base mb-3 md:mb-4">تواصل معنا</h4>
            <a
              href="https://wa.me/966599535798"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white rounded-xl px-4 py-3 transition-colors mb-3"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div>
                <span className="text-[10px] opacity-75 block">واتساب - نرد بسرعة</span>
                <span className="font-bold text-sm" dir="ltr">0599535798</span>
              </div>
            </a>
            <p className="text-gray-500 text-xs leading-relaxed">
              متاحون للرد على استفساراتك وتوصيل أفضل تجربة تسوق
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-gray-500">
          <span>© 2026 برج المبدع للأجهزة المنزلية. جميع الحقوق محفوظة</span>
          <span className="text-gray-600">المملكة العربية السعودية 🇸🇦</span>
        </div>
      </div>
    </footer>
  );
}
