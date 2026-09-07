"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone" && value.length > 10) return;
    if (name === "customerName" && /\d/.test(value)) return;
    setForm({ ...form, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.customerName.trim() || form.customerName.trim().length < 3)
      errors.customerName = "الاسم يجب أن يكون 3 أحرف على الأقل";
    if (!/^(05|5)\d{8}$/.test(form.phone))
      errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!form.address.trim() || form.address.trim().length < 3)
      errors.address = "العنوان يجب أن يكون 3 أحرف على الأقل";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    if (items.length === 0) { setError("السلة فارغة"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          address: form.address,
          notes: form.notes,
          paymentMethod: "cash_on_delivery",
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");

      clearCart();
      router.push(`/order-success?id=${data.data._id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50/50">
          <div className="text-center">
            <div className="w-28 h-28 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-6xl text-gray-200">remove_shopping_cart</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">السلة فارغة</h1>
            <p className="text-gray-400 text-sm mb-8">أضف منتجات للسلة أولاً لإتمام الطلب</p>
            <a href="/products" className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-secondary/85 transition-all shadow-lg shadow-secondary/25">
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
            <a href="/cart" className="hover:text-secondary transition-colors">السلة</a>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-gray-700 font-medium">إتمام الطلب</span>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-0 mb-8 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[15px]">check</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">السلة</span>
            </div>
            <div className="flex-1 h-px bg-secondary/30 mx-3" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shadow shadow-secondary/30">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <span className="text-xs text-secondary font-bold">تأكيد الطلب</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-3" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400 font-bold">3</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">الدفع</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">

              {/* Error banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3.5 rounded-2xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] flex-shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Delivery Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
                <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-l from-transparent to-secondary/3">
                  <div className="w-9 h-9 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[20px]">local_shipping</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-sm sm:text-base">بيانات التوصيل</h2>
                    <p className="text-xs text-gray-400">أدخل بياناتك لاستلام طلبك</p>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <InputField
                      label="الاسم الكامل"
                      required
                      error={fieldErrors.customerName}
                      icon="person"
                    >
                      <input
                        name="customerName"
                        value={form.customerName}
                        onChange={handleChange}
                        required
                        placeholder="مثال: محمد أحمد"
                        className={iCls(!!fieldErrors.customerName)}
                      />
                    </InputField>

                    <InputField
                      label="رقم الجوال"
                      required
                      error={fieldErrors.phone}
                      icon="phone"
                    >
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        type="tel"
                        dir="ltr"
                        maxLength={10}
                        placeholder="05XXXXXXXX"
                        className={iCls(!!fieldErrors.phone) + " tracking-widest"}
                      />
                    </InputField>

                    <div className="sm:col-span-2">
                      <InputField
                        label="العنوان التفصيلي"
                        required
                        error={fieldErrors.address}
                        icon="location_on"
                      >
                        <input
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          required
                          placeholder="المدينة — الحي — الشارع — رقم المبنى"
                          className={iCls(!!fieldErrors.address)}
                        />
                      </InputField>
                    </div>

                    <div className="sm:col-span-2">
                      <InputField label="ملاحظات للتوصيل" icon="sticky_note_2" hint="اختياري">
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={handleChange}
                          rows={3}
                          placeholder="مثال: اتصل قبل التوصيل، الدور الثاني..."
                          className={iCls(false) + " resize-none"}
                        />
                      </InputField>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
                <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-gray-100">
                  <div className="w-9 h-9 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-sm sm:text-base">طريقة الدفع</h2>
                    <p className="text-xs text-gray-400">اختر طريقة الدفع المناسبة لك</p>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 rounded-2xl p-4 border-2 border-secondary bg-secondary/5">
                    <span className="text-2xl">💵</span>
                    <div>
                      <p className="font-bold text-sm text-secondary">الدفع عند الاستلام</p>
                      <p className="text-xs text-gray-400 mt-0.5">ادفع نقداً عند استلام طلبك</p>
                    </div>
                    <div className="mr-auto w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-secondary/85 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-xl shadow-secondary/25"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    جاري معالجة الطلب...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    تأكيد الطلب
                  </>
                )}
              </button>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-5 text-xs text-gray-400 pb-2">
                {["lock|دفع آمن", "verified|منتجات أصلية", "local_shipping|توصيل مجاني"].map((s) => {
                  const [icon, label] = s.split("|");
                  return (
                    <div key={icon} className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">{icon}</span>
                      {label}
                    </div>
                  );
                })}
              </div>
            </form>

            {/* ── Order Summary ── */}
            <div className="lg:w-[340px] xl:w-[380px]">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden sticky top-24">
                {/* Header */}
                <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-l from-secondary/5 to-transparent">
                  <h2 className="font-bold text-gray-900 text-base">
                    ملخص طلبك
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{items.length} منتج في سلتك</p>
                </div>

                {/* Items */}
                <div className="px-5 sm:px-6 py-4 flex flex-col gap-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image.startsWith("http") ? item.image : `${API_URL}/uploads/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-contain p-1.5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 line-clamp-2 leading-snug">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.quantity} × {item.price.toLocaleString()} ر.س
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-800 whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString()} ر.س
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-5 sm:px-6 pb-5 border-t border-dashed border-gray-100 pt-4">
                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">المجموع الفرعي</span>
                      <span className="font-semibold text-gray-700">{totalPrice.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">رسوم التوصيل</span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        مجاني
                      </span>
                    </div>
                  </div>

                  <div className="bg-secondary/5 rounded-xl px-4 py-3 flex items-center justify-between border border-secondary/10">
                    <span className="font-bold text-gray-900">الإجمالي</span>
                    <div>
                      <span className="font-extrabold text-secondary text-xl">{totalPrice.toLocaleString()}</span>
                      <span className="text-secondary text-sm font-medium mr-1">ر.س</span>
                    </div>
                  </div>

                  <a
                    href="/cart"
                    className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    تعديل السلة
                  </a>
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

/* ─── Helpers ─── */

function iCls(hasError: boolean) {
  return `w-full rounded-xl px-4 py-3 text-sm border transition-all outline-none
    placeholder:text-gray-300 bg-gray-50/70 focus:bg-white
    focus:ring-2 focus:ring-secondary/25 focus:border-secondary/40
    ${hasError ? "border-red-300 bg-red-50/30 focus:ring-red-200" : "border-gray-200"}`;
}

function InputField({
  label, required, hint, error, icon, children,
}: {
  label: string; required?: boolean; hint?: string; error?: string; icon?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        {icon && <span className="material-symbols-outlined text-[15px] text-gray-400">{icon}</span>}
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
        {hint && <span className="text-gray-400 font-normal text-xs mr-auto">({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[13px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

