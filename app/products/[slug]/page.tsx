"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  oldPrice?: number;
  category: string;
  brand?: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  laptops: "حواسيب محمولة",
  tvs: "شاشات وتلفزيونات",
  printers: "طابعات",
  cameras: "كاميرات",
  accessories: "إكسسوارات",
  home_devices: "أجهزة منزلية",
  air_conditioners: "مكيفات",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function parseDescription(desc: string) {
  const sections: { title: string; items: string[] }[] = [];
  let currentTitle = "نبذة عامة";
  let currentItems: string[] = [];

  desc.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.endsWith(":") && !trimmed.startsWith("-")) {
      if (currentItems.length) sections.push({ title: currentTitle, items: currentItems });
      currentTitle = trimmed.slice(0, -1);
      currentItems = [];
    } else if (trimmed.startsWith("-")) {
      currentItems.push(trimmed.slice(1).trim());
    } else {
      currentItems.push(trimmed);
    }
  });
  if (currentItems.length) sections.push({ title: currentTitle, items: currentItems });
  return sections;
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data || data.product || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const getImageUrl = (img: string) =>
    img.startsWith("http") ? img : `${API_URL}/uploads/${img}`;

  const handleAddToCart = () => {
    if (!product || product.stock < 1) return;
    addToCart(
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        stock: product.stock,
      },
      quantity
    );
    router.push("/cart");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="text-center py-32 text-on-surface-variant">
          <span className="material-symbols-outlined text-7xl mb-4 block">error</span>
          <p className="text-xl">المنتج غير موجود</p>
          <a href="/products" className="text-secondary mt-4 inline-block hover:underline">العودة للمنتجات</a>
        </div>
        <Footer />
      </>
    );
  }

  const descSections = product.description ? parseDescription(product.description) : [];
  const tabs = ["التفاصيل", "المواصفات", "الشحن والضمان"];

  return (
    <>
      <Header />
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-on-surface-variant mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
          <a href="/" className="hover:text-secondary transition-colors">الرئيسية</a>
          <span className="text-outline">/</span>
          <a href="/products" className="hover:text-secondary transition-colors">المنتجات</a>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Images Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm sticky top-4">
              <div className="relative aspect-square flex items-center justify-center p-6 sm:p-10">
                {product.oldPrice && (
                  <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-error text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                )}
                {product.images?.[activeImage] ? (
                  <img
                    src={getImageUrl(product.images[activeImage])}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-opacity duration-300"
                  />
                ) : (
                  <span className="material-symbols-outlined text-8xl text-outline/30">image</span>
                )}
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 px-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      activeImage === i ? "border-secondary shadow-md scale-105" : "border-outline-variant/20 hover:border-secondary/50"
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
              {product.brand && (
                <span className="text-[10px] sm:text-xs font-medium text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                  {product.brand}
                </span>
              )}
              {product.isBestSeller && (
                <span className="text-[10px] sm:text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  الأكثر مبيعاً
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface leading-snug">
              {product.name}
            </h1>

            {/* Price Card */}
            <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-secondary">{product.price.toLocaleString()}</span>
                <span className="text-lg sm:text-xl text-secondary font-medium">ر.س</span>
              </div>
              {product.oldPrice && (
                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base text-outline line-through">{product.oldPrice.toLocaleString()} ر.س</span>
                  <span className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                    وفّر {(product.oldPrice - product.price).toLocaleString()} ر.س
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span className="flex items-center gap-2 text-sm text-green-700 font-medium bg-green-50 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  متوفر ({product.stock} قطعة)
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm text-error font-medium bg-error/5 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 bg-error rounded-full"></span>
                  غير متوفر حالياً
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-on-surface-variant">الكمية:</span>
                  <div className="flex items-center border border-outline-variant/30 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="w-12 text-center font-bold text-base border-x border-outline-variant/30">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock < 1}
                className="flex-1 bg-secondary text-on-secondary py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    تمت الإضافة!
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    أضف للسلة
                  </>
                )}
              </button>
              <button className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-outline-variant/30 rounded-xl hover:border-error hover:text-error hover:bg-error/5 text-on-surface-variant transition-all shrink-0">
                <span className="material-symbols-outlined text-[22px]">favorite</span>
              </button>
              <button className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-outline-variant/30 rounded-xl hover:border-secondary hover:text-secondary hover:bg-secondary/5 text-on-surface-variant transition-all shrink-0">
                <span className="material-symbols-outlined text-[22px]">share</span>
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-outline-variant/20">
              {[
                { icon: "local_shipping", label: "توصيل سريع" },
                { icon: "verified_user", label: "ضمان أصلي" },
                { icon: "autorenew", label: "إرجاع مجاني" },
                { icon: "headset_mic", label: "دعم فني 24/7" },
              ].map((f) => (
                <div key={f.icon} className="flex flex-col items-center gap-1.5 text-center p-3 rounded-xl bg-surface-container-low/50">
                  <span className="material-symbols-outlined text-secondary text-[22px] sm:text-[26px]">{f.icon}</span>
                  <span className="text-[10px] sm:text-xs text-on-surface-variant font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Tabs Section */}
        {descSections.length > 0 && (
          <section className="mt-8 sm:mt-12">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-outline-variant/20 overflow-x-auto">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium whitespace-nowrap transition-all border-b-2 ${
                    activeTab === i
                      ? "border-secondary text-secondary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-2xl rounded-tr-2xl p-4 sm:p-6 lg:p-8 border border-t-0 border-outline-variant/10 shadow-sm">
              {activeTab === 0 && (
                <div className="space-y-4">
                  {descSections.filter(s => 
                    !s.title.includes("ضمان") && !s.title.includes("شحن") && !s.title.includes("إرجاع") && !s.title.includes("توصيل")
                  ).map((section, i) => (
                    <div key={i}>
                      <h3 className="text-sm sm:text-base font-bold text-on-surface mb-2 flex items-center gap-2">
                        <span className="w-1 h-5 bg-secondary rounded-full"></span>
                        {section.title}
                      </h3>
                      <ul className="space-y-1.5 pr-4">
                        {section.items.map((item, j) => (
                          <li key={j} className="text-xs sm:text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
                            <span className="text-secondary mt-1 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-4">
                  {descSections.filter(s => 
                    s.title.includes("ميزات") || s.title.includes("مواصفات") || s.title.includes("تقييم") || s.title.includes("دفع") || s.title.includes("عروض") || s.title.includes("خصم")
                  ).length > 0 ? (
                    descSections.filter(s => 
                      s.title.includes("ميزات") || s.title.includes("مواصفات") || s.title.includes("تقييم") || s.title.includes("دفع") || s.title.includes("عروض") || s.title.includes("خصم")
                    ).map((section, i) => (
                      <div key={i} className="bg-surface-container-low/50 rounded-xl p-4">
                        <h3 className="text-sm sm:text-base font-bold text-on-surface mb-3">{section.title}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {section.items.map((item, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant">لا توجد مواصفات إضافية</p>
                  )}
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-4">
                  {descSections.filter(s => 
                    s.title.includes("ضمان") || s.title.includes("شحن") || s.title.includes("إرجاع") || s.title.includes("توصيل") || s.title.includes("استلام")
                  ).length > 0 ? (
                    descSections.filter(s => 
                      s.title.includes("ضمان") || s.title.includes("شحن") || s.title.includes("إرجاع") || s.title.includes("توصيل") || s.title.includes("استلام")
                    ).map((section, i) => (
                      <div key={i} className="flex gap-3 p-4 bg-surface-container-low/50 rounded-xl">
                        <span className="material-symbols-outlined text-secondary text-[24px] shrink-0 mt-0.5">
                          {section.title.includes("ضمان") ? "verified_user" : section.title.includes("إرجاع") ? "autorenew" : "local_shipping"}
                        </span>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-on-surface mb-1.5">{section.title}</h3>
                          <ul className="space-y-1">
                            {section.items.map((item, j) => (
                              <li key={j} className="text-xs sm:text-sm text-on-surface-variant">{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-3 p-4 bg-surface-container-low/50 rounded-xl">
                        <span className="material-symbols-outlined text-secondary text-[24px]">local_shipping</span>
                        <div>
                          <h3 className="text-sm font-bold text-on-surface">الشحن</h3>
                          <p className="text-xs sm:text-sm text-on-surface-variant">توصيل خلال 2-4 أيام عمل</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-4 bg-surface-container-low/50 rounded-xl">
                        <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
                        <div>
                          <h3 className="text-sm font-bold text-on-surface">الضمان</h3>
                          <p className="text-xs sm:text-sm text-on-surface-variant">ضمان شامل من المصنع</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
