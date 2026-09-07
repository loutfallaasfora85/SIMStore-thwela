import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata = {
  title: "سياسة الاسترجاع | لمسة للأجهزة المنزلية",
};

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <main dir="rtl" className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary/10 mb-4">
            <span className="material-symbols-outlined text-secondary text-[32px] sm:text-[40px]">
              assignment_return
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface">
            سياسة الاسترجاع
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 max-w-md mx-auto leading-relaxed">
            نحن في لمسة للأجهزة المنزلية نسعى دائمًا لضمان رضا عملائنا. إذا لم تكن راضيًا عن عملية الشراء، يمكنك استبدال أو استرجاع المنتجات وفقًا للشروط التالية:
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4 sm:space-y-5">
          {/* فترة الاستبدال والاسترجاع */}
          <section className="bg-white border border-outline-variant/15 rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-secondary/10">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-secondary">schedule</span>
              </div>
              <h2 className="text-[15px] sm:text-lg font-bold text-on-surface">فترة الاستبدال والاسترجاع</h2>
            </div>
            <ul className="space-y-2.5 pr-2">
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-secondary">check_circle</span>
                <span>يمكن استرجاع العطور خلال <strong>3 أيام</strong> من تاريخ الشراء</span>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-secondary">check_circle</span>
                <span>يمكن استبدال العطور خلال <strong>7 أيام</strong> من تاريخ الشراء</span>
              </li>
            </ul>
          </section>

          {/* شروط الاستبدال والاسترجاع */}
          <section className="bg-white border border-outline-variant/15 rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-secondary/10">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-secondary">checklist</span>
              </div>
              <h2 className="text-[15px] sm:text-lg font-bold text-on-surface">شروط الاستبدال والاسترجاع</h2>
            </div>
            <ul className="space-y-2.5 pr-2">
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-secondary">check_circle</span>
                <span>يجب أن يكون المنتج في حالته الأصلية وغير مفتوح</span>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-secondary">check_circle</span>
                <span>يجب أن يكون المنتج في عبوته الأصلية مع جميع الملحقات والملصقات</span>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-secondary">check_circle</span>
                <span>يجب تقديم إيصال الشراء أو إثبات الدفع</span>
              </li>
            </ul>
          </section>

          {/* المنتجات غير القابلة للاستبدال */}
          <section className="bg-white border border-outline-variant/15 rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-red-500">block</span>
              </div>
              <h2 className="text-[15px] sm:text-lg font-bold text-on-surface">المنتجات غير القابلة للاستبدال أو الاسترجاع</h2>
            </div>
            <ul className="space-y-2.5 pr-2">
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-red-500">close</span>
                <span>الأجهزة الإلكترونية التي تم فتحها أو استخدامها</span>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-red-500">close</span>
                <span>لا يسمح باسترجاع الأجهزة التي تم تفعيلها أو تسجيلها بحساب المستخدم</span>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-red-500">close</span>
                <span>لا يسمح باسترجاع الملحقات والإكسسوارات بعد فتحها</span>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-red-500">close</span>
                <span>المنتج المستخدم لا يتم استرجاعه إلا في حالة وجود عيب مصنعي</span>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-red-500">close</span>
                <span>الاستبدال سيكون بنفس المنتج في حال وجود عيب مصنعي. غير متاح استبدال المنتج بمنتج آخر، فقط استرجاع وعمل طلب بالمنتج الجديد</span>
              </li>
            </ul>
          </section>

          {/* إجراءات الاستبدال والاسترجاع */}
          <section className="bg-white border border-outline-variant/15 rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-secondary/10">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-secondary">store</span>
              </div>
              <h2 className="text-[15px] sm:text-lg font-bold text-on-surface">إجراءات الاستبدال والاسترجاع</h2>
            </div>
            <p className="text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed pr-2">
              يتم توجيه العملاء إلى أي من فروعنا لإتمام عملية الاستبدال أو الاسترجاع.
            </p>
          </section>

          {/* استرداد المبلغ */}
          <section className="bg-white border border-outline-variant/15 rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-green-50">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-green-600">payments</span>
              </div>
              <h2 className="text-[15px] sm:text-lg font-bold text-on-surface">استرداد المبلغ</h2>
            </div>
            <ul className="space-y-2.5 pr-2">
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-green-600">check_circle</span>
                <span>يتم استرداد المبلغ بنفس طريقة الدفع الأصلية</span>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0 text-green-600">check_circle</span>
                <span>قد يستغرق استرداد المبلغ من <strong>3 إلى 7 أيام عمل</strong>، وقد تصل المدة إلى 14 يوم عمل في بعض الحالات</span>
              </li>
            </ul>
          </section>

          {/* التواصل */}
          <section className="bg-white border border-outline-variant/15 rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-secondary/10">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-secondary">support_agent</span>
              </div>
              <h2 className="text-[15px] sm:text-lg font-bold text-on-surface">للمزيد من المعلومات</h2>
            </div>
            <ul className="space-y-3 pr-2">
              <li className="flex items-center gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-secondary">phone</span>
                <a href="tel:0591031747" className="text-blue-600 underline font-medium" dir="ltr">0591031747</a>
              </li>
              <li className="flex items-center gap-2.5 text-[13px] sm:text-[15px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-green-600">chat</span>
                <a href="https://wa.me/966591031747" target="_blank" rel="noopener noreferrer" className="text-green-600 underline font-medium" dir="ltr">0591031747</a>
              </li>

            </ul>
          </section>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
