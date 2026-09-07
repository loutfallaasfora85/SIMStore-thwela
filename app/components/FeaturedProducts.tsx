"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images: string[];
  category: string;
  subCategory?: string;
  isFeatured?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SUBCATEGORY_LABELS: Record<string, string> = {
  tvs: "شاشات",
  refrigerators: "تلاجات",
  washing_machines: "غسالات",
  air_conditioners: "مكيفات",
  ovens: "أفران",
  small_appliances: "أجهزة صغيرة",
};

export default function FeaturedProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [randomHomeDevices, setRandomHomeDevices] = useState<Product[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/api/products?limit=500`)
      .then((res) => res.json())
      .then((data) => {
        const products: Product[] = data.data || [];
        setAllProducts(products);
        const homeDevices = products.filter((p) => p.category === "home_devices" && p.price >= 1000);
        const shuffled = [...homeDevices].sort(() => Math.random() - 0.5).slice(0, 6);
        setRandomHomeDevices(shuffled);
      })
      .catch(() => {});
  }, []);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      stock: product.stock,
    });
    setAddedId(product._id);
    setTimeout(() => {
      setAddedId(null);
      router.push("/cart");
    }, 1500);
  };

  const featured = [...allProducts.filter((p) => p.category === "home_devices" && p.price >= 1000)].sort(() => Math.random() - 0.5).slice(0, 6);

  const VISIBLE_CATEGORIES = Object.keys(SUBCATEGORY_LABELS);

  const categoryMap = new Map<string, Product[]>();
  for (const p of allProducts) {
    if (p.category !== "home_devices") continue;
    const key = p.subCategory || "other";
    if (!categoryMap.has(key)) categoryMap.set(key, []);
    categoryMap.get(key)!.push(p);
  }
  const categoryGroups = Array.from(categoryMap.entries())
    .filter(([key]) => VISIBLE_CATEGORIES.includes(key))
    .map(([key, products]) => ({
      key,
      label: SUBCATEGORY_LABELS[key] || key,
      products: [...products].sort((a, b) => b.price - a.price).slice(0, 6),
    }))
    .sort((a, b) => {
      if (a.key === "small_appliances") return 1;
      if (b.key === "small_appliances") return -1;
      return 0;
    });

  return (
    <div dir="rtl" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {featured.length > 0 && (
        <div>
          <div className="border-t border-gray-100 my-2" />
          <section className="py-8 sm:py-12 md:py-16">
            <SectionHeader title="منتجاتنا المميزة" href="/products?featured=true" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} addedId={addedId} onAdd={handleAdd} />
              ))}
            </div>
          </section>
        </div>
      )}

      {randomHomeDevices.length > 0 && (
        <div>
          <div className="border-t border-gray-100 my-2" />
          <section className="py-8 sm:py-12 md:py-16">
            <SectionHeader title="أجهزة منزلية" href="/products?category=home_devices" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
              {randomHomeDevices.map((p) => (
                <ProductCard key={p._id} product={p} addedId={addedId} onAdd={handleAdd} />
              ))}
            </div>
          </section>
        </div>
      )}

      {categoryGroups.map(({ key, label, products }) => (
        <div key={key}>
          <div className="border-t border-gray-100 my-2" />
          <section className="py-8 sm:py-12 md:py-16">
            <SectionHeader title={label} href={`/products?subCategory=${key}`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} addedId={addedId} onAdd={handleAdd} />
              ))}
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex justify-between items-center mb-5 sm:mb-7">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 bg-secondary rounded-full" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface">{title}</h2>
      </div>
      <a
        href={href}
        className="text-secondary text-xs sm:text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
      >
        عرض الكل
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
      </a>
    </div>
  );
}

function ProductCard({
  product,
  addedId,
  onAdd,
}: {
  product: Product;
  addedId: string | null;
  onAdd: (e: React.MouseEvent, product: Product) => void;
}) {
  const isAdded = addedId === product._id;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const imgSrc = product.images?.[0]
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : `${API_URL}/uploads/${product.images[0]}`
    : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-secondary/30 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <a href={`/products/${product.slug}`} className="relative bg-gray-50 h-40 sm:h-48 md:h-56 overflow-hidden block">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="material-symbols-outlined text-5xl text-gray-200">image</span>
          </div>
        )}
        {discount && (
          <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg shadow">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border">نفذت الكمية</span>
          </div>
        )}
      </a>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <a href={`/products/${product.slug}`}>
          <h3 className="text-on-surface font-semibold text-xs sm:text-sm leading-snug mb-2 line-clamp-2 flex-1 hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </a>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-secondary font-extrabold text-base sm:text-lg md:text-xl">
              {product.price.toLocaleString()}
            </span>
            <span className="text-secondary text-xs sm:text-sm font-medium">ر.س</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-xs sm:text-sm">
                {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={(e) => onAdd(e, product)}
            disabled={product.stock === 0}
            className={`w-full py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              isAdded
                ? "bg-green-500 text-white"
                : product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-secondary text-white hover:bg-secondary/85 active:scale-95"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
              {isAdded ? "check_circle" : "add_shopping_cart"}
            </span>
            {isAdded ? "تمت الإضافة" : "أضف للسلة"}
          </button>
        </div>
      </div>
    </div>
  );
}
