"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const REDIRECT_SECONDS = 10;

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  tapChargeId?: string;
  createdAt: string;
}

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/orders/${id}/public`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setOrder(d.data);
          timerRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timerRef.current!);
                router.push("/");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError(d.message || "حدث خطأ");
        }
      })
      .catch(() => setError("تعذر تحميل الفاتورة"));

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/" className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold">الرئيسية</a>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const invoiceDate = new Date(order.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <>
      {/* شريط العد التنازلي - مخفي عند الطباعة */}
      <div className="print:hidden bg-secondary/10 border-b border-secondary/20 py-3 px-6 flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">
          سيتم توجيهك للصفحة الرئيسية خلال <span className="font-bold text-secondary">{countdown}</span> ثانية
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { if (timerRef.current) clearInterval(timerRef.current); window.print(); }}
            className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            طباعة الفاتورة
          </button>
          <a href="/" className="border border-secondary text-secondary px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary/5 transition-all">
            الرئيسية
          </a>
        </div>
      </div>

      {/* الفاتورة */}
      <main className="max-w-2xl mx-auto px-6 py-10 print:py-4 print:px-2">
        {/* رأس الفاتورة */}
        <div className="text-center mb-8 print:mb-4">
          <img src="/logo.png" alt="Homly" className="h-14 mx-auto mb-3 print:h-10" />
          <h1 className="text-2xl font-bold text-on-surface">فاتورة ضريبية</h1>
          <p className="text-sm text-on-surface-variant mt-1">شكراً لتسوقك معنا!</p>
        </div>

        <div className="border border-outline-variant/30 rounded-xl overflow-hidden print:border-gray-300">
          {/* معلومات الفاتورة */}
          <div className="bg-surface-container-low print:bg-gray-50 px-6 py-4 flex flex-wrap justify-between gap-4 border-b border-outline-variant/30 print:border-gray-300">
            <div>
              <p className="text-xs text-on-surface-variant mb-1">رقم الطلب</p>
              <p className="font-bold text-on-surface text-sm">{order._id}</p>
            </div>
            {order.tapChargeId && (
              <div>
                <p className="text-xs text-on-surface-variant mb-1">رقم العملية</p>
                <p className="font-bold text-on-surface text-sm">{order.tapChargeId}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-on-surface-variant mb-1">تاريخ الطلب</p>
              <p className="font-bold text-on-surface text-sm">{invoiceDate}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-1">حالة الدفع</p>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">مدفوع ✓</span>
            </div>
          </div>

          {/* بيانات العميل */}
          <div className="px-6 py-4 border-b border-outline-variant/30 print:border-gray-300">
            <h2 className="font-bold text-on-surface mb-3 text-sm">بيانات العميل</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-on-surface-variant text-xs">الاسم</p>
                <p className="font-medium text-on-surface">{order.customerName}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs">رقم الهاتف</p>
                <p className="font-medium text-on-surface" dir="ltr">{order.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-on-surface-variant text-xs">العنوان</p>
                <p className="font-medium text-on-surface">{order.address}</p>
              </div>
            </div>
          </div>

          {/* المنتجات */}
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low print:bg-gray-50">
              <tr className="border-b border-outline-variant/30 print:border-gray-300">
                <th className="text-right px-6 py-3 text-on-surface-variant font-medium">المنتج</th>
                <th className="text-center px-4 py-3 text-on-surface-variant font-medium">الكمية</th>
                <th className="text-center px-4 py-3 text-on-surface-variant font-medium">السعر</th>
                <th className="text-left px-6 py-3 text-on-surface-variant font-medium">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-outline-variant/20 print:border-gray-200">
                  <td className="px-6 py-3 text-on-surface font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-center text-on-surface-variant">{item.quantity}</td>
                  <td className="px-4 py-3 text-center text-on-surface-variant">{item.price.toLocaleString()} ر.س</td>
                  <td className="px-6 py-3 text-left font-bold text-on-surface">{(item.price * item.quantity).toLocaleString()} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* الإجمالي */}
          <div className="px-6 py-4 bg-surface-container-low print:bg-gray-50">
            <div className="flex justify-between text-sm text-on-surface-variant mb-2">
              <span>المجموع الفرعي</span>
              <span>{order.totalPrice.toLocaleString()} ر.س</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant mb-3">
              <span>التوصيل</span>
              <span className="text-green-600 font-medium">مجاني</span>
            </div>
            <div className="flex justify-between font-bold text-on-surface text-lg border-t border-outline-variant/30 print:border-gray-300 pt-3">
              <span>الإجمالي المدفوع</span>
              <span className="text-secondary">{order.totalPrice.toLocaleString()} ر.س</span>
            </div>
          </div>
        </div>

        {/* ملاحظة الطباعة */}
        <p className="text-center text-xs text-on-surface-variant mt-6 print:mt-4">
          شكراً لثقتك بنا — homly.sa
        </p>
      </main>
    </>
  );
}
