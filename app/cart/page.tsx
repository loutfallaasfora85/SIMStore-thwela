"use client";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const getImageUrl = (img: string) =>
    img.startsWith("http") ? img : `${API_URL}/uploads/${img}`;

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50/50">
          <div className="text-center">
            <div className="relative inline-flex mb-6">
              <div className="w-28 h-28 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-gray-200">shopping_cart</span>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">0</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">سلتك فارغة!</h1>
            <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
              لم تضف أي منتجات بعد. اكتشف تشكيلتنا الرائعة من المفروشات والأجهزة المنزلية
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-secondary/85 transition-all shadow-lg shadow-secondary/25 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              تصفح المنتجات
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main dir="rtl" className="bg-gray-50/60 min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <a href="/" className="hover:text-secondary transition-colors">الرئيسية</a>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-gray-700 font-medium">سلة التسوق</span>
          </div>

          {/* Title */}
          <div className="flex items-center justify-between mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              سلة التسوق
            </h1>
            <span className="bg-secondary/10 text-secondary text-sm font-bold px-4 py-1.5 rounded-full">
              {totalItems} {totalItems === 1 ? "منتج" : "منتجات"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Items List ── */}
            <div className="flex-1 flex flex-col gap-3">
              {items.map((item, index) => (
                <div
                  key={item.productId}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100/80 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-0">
                    {/* Color accent bar */}
                    <div className="w-1 bg-gradient-to-b from-secondary/60 to-secondary/20 flex-shrink-0" />

                    <div className="flex-1 p-4 sm:p-5 flex gap-4 items-center">
                      {/* Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-snug line-clamp-2 mb-1.5">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-secondary font-extrabold text-base sm:text-lg">
                            {item.price.toLocaleString()}
                          </span>
                          <span className="text-secondary text-sm">ر.س</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        {/* Delete */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                          aria-label="حذف"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>

                        {/* Qty */}
                        <div className="flex items-center gap-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-secondary hover:text-white transition-all text-gray-500"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-8 sm:w-10 text-center font-bold text-sm text-gray-800 border-x border-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-secondary hover:text-white transition-all text-gray-500"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>

                        {/* Subtotal */}
                        <span className="text-xs sm:text-sm font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg">
                          {(item.price * item.quantity).toLocaleString()} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <a
                href="/products"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-secondary transition-colors w-fit mt-1 group"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                متابعة التسوق
              </a>
            </div>

            {/* ── Summary ── */}
            <div className="lg:w-[340px] xl:w-[380px]">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden sticky top-24">
                {/* Header */}
                <div className="bg-gradient-to-l from-secondary/5 to-transparent px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-lg">ملخص الطلب</h2>
                </div>

                <div className="px-6 py-5">
                  {/* Items preview */}
                  <div className="flex flex-col gap-2.5 mb-5">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 truncate flex-1 ml-3">
                          {item.name}
                          <span className="text-gray-400"> ×{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-gray-700 whitespace-nowrap">
                          {(item.price * item.quantity).toLocaleString()} ر.س
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-200 my-4" />

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">المجموع الفرعي</span>
                      <span className="font-semibold text-gray-700">{totalPrice.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">التوصيل</span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        مجاني
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-lg">الإجمالي</span>
                      <div className="text-left">
                        <span className="font-extrabold text-secondary text-2xl">{totalPrice.toLocaleString()}</span>
                        <span className="text-secondary text-sm font-medium mr-1">ر.س</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="/checkout"
                    className="mt-5 w-full bg-secondary text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-secondary/85 active:scale-95 transition-all shadow-lg shadow-secondary/20 text-base"
                  >
                    <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                    إتمام الطلب
                  </a>

                  {/* Security note */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    دفع آمن ومشفور 100%
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
