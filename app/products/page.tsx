"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  oldPrice?: number;
  category: string;
  subCategory?: string;
  brand?: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  home_devices: "أجهزة منزلية",
  tvs: "شاشات",
  refrigerators: "تلاجات",
  washing_machines: "غسالات",
  air_conditioners: "مكيفات",
  ovens: "أفران",
  small_appliances: "أجهزة صغيرة",
};

const VISIBLE_CATEGORIES = Object.keys(CATEGORY_LABELS);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || searchParams.get("subCategory") || "all";

  const setFilter = (key: string) => {
    if (key === "all") router.push("/products");
    else router.push(`/products?subCategory=${key}`);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || data.products || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock < 1) return;
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      stock: product.stock,
    });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = products.filter((p) => {
    const matchCategory =
      activeCategory === "all" ||
      p.category === activeCategory ||
      p.subCategory === activeCategory;
    const matchSearch = !searchQuery || p.name.includes(searchQuery) || p.brand?.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Header />
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-on-surface mb-4 sm:mb-6">جميع المنتجات</h1>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative">
            <input
              className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 sm:py-3 text-sm border border-outline-variant/40 focus:ring-2 focus:ring-secondary/40 focus:outline-none placeholder:text-outline"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 sm:top-3 text-outline text-[20px]">search</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                activeCategory === "all"
                  ? "bg-secondary text-on-secondary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-secondary/10"
              }`}
            >
              الكل
            </button>
            {VISIBLE_CATEGORIES.map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === key
                    ? "bg-secondary text-on-secondary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-secondary/10"
                }`}
              >
                {CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl sm:text-6xl mb-4 block">inventory_2</span>
            <p className="text-base sm:text-lg">لا توجد منتجات</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filtered.map((product) => (
              <a
                href={`/products/${product.slug}`}
                key={product._id}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-outline-variant/10 block"
              >
                <div className="relative h-36 sm:h-44 md:h-56 bg-white overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].startsWith("http") ? product.images[0] : `${API_URL}/uploads/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 sm:p-4 md:p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="material-symbols-outlined text-4xl sm:text-6xl text-outline/40">image</span>
                    </div>
                  )}
                  {product.oldPrice && (
                    <span className="absolute top-2 start-2 sm:top-3 sm:start-3 bg-error text-on-error text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="absolute top-2 end-2 sm:top-3 sm:end-3 bg-secondary text-on-secondary text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                      الأكثر مبيعاً
                    </span>
                  )}
                  <button
                    onClick={(e) => handleAdd(e, product)}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 hidden sm:flex items-center gap-1.5 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[14px] sm:text-[16px]">
                      {addedId === product._id ? "check" : "add_shopping_cart"}
                    </span>
                    {addedId === product._id ? "تمت" : "أضف للسلة"}
                  </button>
                </div>

                <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-1.5 sm:gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-[11px] text-secondary font-semibold bg-secondary/10 px-1.5 sm:px-2.5 py-0.5 rounded-md truncate">
                      {CATEGORY_LABELS[product.subCategory || product.category] || product.category}
                    </span>
                    {product.stock > 0 ? (
                      <span className="text-[9px] sm:text-[11px] text-green-600 font-medium flex items-center gap-0.5">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full"></span>
                        متوفر
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[11px] text-error font-medium">غير متوفر</span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-on-surface line-clamp-2 leading-relaxed">
                    {product.name}
                  </h3>
                  {product.brand && (
                    <span className="text-[10px] sm:text-xs text-on-surface-variant/70 hidden sm:block">{product.brand}</span>
                  )}
                  <div className="flex items-end justify-between mt-auto pt-2 sm:pt-3 border-t border-outline-variant/10">
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base md:text-xl font-bold text-secondary">{product.price.toLocaleString()} ر.س</span>
                      {product.oldPrice && (
                        <span className="text-[10px] sm:text-xs text-outline line-through">{product.oldPrice.toLocaleString()} ر.س</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAdd(e, product)}
                      className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-secondary/10 hover:bg-secondary hover:text-on-secondary text-secondary rounded-lg sm:rounded-xl transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[20px]">
                        {addedId === product._id ? "check" : "add_shopping_cart"}
                      </span>
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
