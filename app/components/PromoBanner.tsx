export default function PromoBanner() {
  return (
    <section className="my-unit-xl bg-secondary-container py-unit-lg">
      <div className="max-w-[1280px] mx-auto px-margin flex flex-row-reverse justify-between items-center">
        <div className="flex flex-row-reverse items-center gap-unit-md">
          <span className="material-symbols-outlined text-on-secondary-container text-4xl">campaign</span>
          <h3 className="text-[24px] leading-[32px] font-semibold text-on-secondary-container">عروض خاصة لفترة محدودة</h3>
        </div>
        <button className="bg-secondary text-white px-unit-lg py-unit-sm rounded-full text-[14px] font-medium">اكتشف العروض</button>
      </div>
    </section>
  );
}
