export default function LatestAdditions() {
  return (
    <section className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
        <h3 className="text-kooora-gold text-[13px] font-bold">
          آخر الإضافات للموقع
        </h3>
      </header>
      <div className="p-3">
        <a
          href="#"
          className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3 hover:bg-green-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-green-600 flex items-center justify-center text-green-700 font-black text-xs">
              SBF
            </div>
            <div>
              <div className="font-bold text-[13px] text-kooora-dark">
                دوري كرة السلة للسيدات
              </div>
              <div className="text-[11px] text-kooora-muted">
                المملكة العربية السعودية
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
