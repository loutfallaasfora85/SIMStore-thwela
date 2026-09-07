import Link from "next/link";

const categories = [
  {
    label: "شاشات",
    desc: "LED & OLED",
    image: "/cat1.webp",
    href: "/products?subCategory=tvs",
  },
  {
    label: "تلاجات",
    desc: "موفرة للطاقة",
    image: "/cat2.webp",
    href: "/products?subCategory=refrigerators",
  },
  {
    label: "غسالات",
    desc: "أوتوماتيك وشبه أوتوماتيك",
    image: "/cat3.webp",
    href: "/products?subCategory=washing_machines",
  },
  {
    label: "مكيفات",
    desc: "سبليت وشباك",
    image: "/cat4.webp",
    href: "/products?subCategory=air_conditioners",
  },
  {
    label: "أفران",
    desc: "كهربائية وغاز",
    image: "/cat5.webp",
    href: "/products?subCategory=ovens",
  },
  {
    label: "أجهزة صغيرة",
    desc: "خلاطات ومكانس",
    image: "/cat6.webp",
    href: "/products?subCategory=small_appliances",
  },
];

const doubled = [...categories, ...categories];

export default function ProductCategories() {
  return (
    <section dir="rtl" className="py-10 sm:py-14 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-1 h-7 bg-secondary rounded-full" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface">تسوق حسب القسم</h2>
      </div>

      <div className="overflow-hidden">
        <div className="flex gap-3 sm:gap-4 animate-scroll-right">
          {doubled.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group relative flex-shrink-0 w-[140px] sm:w-[180px] md:w-[200px] h-[190px] sm:h-[240px] md:h-[260px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-3 sm:p-4">
                <p className="text-white font-bold text-sm sm:text-base leading-tight">{cat.label}</p>
                <p className="text-white/70 text-[11px] sm:text-xs mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
