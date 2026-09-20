import Image from "next/image";

export default function Hero() {
  return (
    <section dir="rtl" className="relative w-full h-[400px] sm:h-[500px] md:h-[620px] overflow-hidden">
      <Image
        src="/hhhhh.webp"
        alt="برج المبدع للأجهزة المنزلية - أجهزة منزلية بأعلى جودة"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay - قوي على اليمين، شفاف على اليسار */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/60 to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-8 lg:px-12 flex justify-start">
          <div className="max-w-xl text-right">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/25 border border-secondary/50 backdrop-blur-sm text-secondary text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4 sm:mb-5">
              <span>🏠</span>
              <span>أجهزة منزلية</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] lg:leading-[1.15] font-black text-white mb-4 sm:mb-5 drop-shadow-lg">
              اصنع بيتك
              <br />
              <span className="text-secondary drop-shadow-[0_0_20px_rgba(0,106,97,0.8)]">
                على ذوقك
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-white/85 mb-6 sm:mb-8 leading-relaxed font-medium drop-shadow-md">
              آلاف المنتجات من الأجهزة المنزلية
              <br className="hidden sm:block" />
              بأسعار تنافسية وتوصيل لجميع مناطق المملكة
            </p>

            {/* Buttons */}
            <div className="flex flex-row gap-3 justify-start">
              <a
                href="/products"
                className="bg-secondary hover:bg-secondary/85 active:scale-95 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all shadow-[0_4px_20px_rgba(0,106,97,0.5)] hover:shadow-[0_6px_28px_rgba(0,106,97,0.65)]"
              >
                تسوق الآن
              </a>
              <a
                href="/contact"
                className="border-2 border-white/70 hover:border-white text-white hover:bg-white/15 active:scale-95 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-semibold transition-all backdrop-blur-sm"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 flex justify-start gap-8 sm:gap-14">
          {[
            { num: "500+", label: "منتج" },
            { num: "1000+", label: "عميل سعيد" },
            { num: "جميع", label: "مناطق المملكة" },
          ].map((s, i) => (
            <div key={i} className="text-center flex flex-col items-center gap-0.5">
              <div className="text-secondary font-black text-base sm:text-xl drop-shadow-sm">{s.num}</div>
              <div className="text-white/65 text-[10px] sm:text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
