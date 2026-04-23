export default function Poll() {
  return (
    <section className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark text-white px-3 h-[32px] flex items-center">
        <h3 className="text-[13px] font-bold text-kooora-gold">استفتاء</h3>
      </header>
      <div className="p-3">
        <div className="flex items-start gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-kooora-gold/20 flex items-center justify-center text-kooora-gold text-lg font-bold">
            ؟
          </div>
          <p className="text-[12px] leading-snug flex-1">
            ما توقعاتك لنتيجة مباراة كريستوفيز أو البرشلونة؟
          </p>
        </div>

        <form className="space-y-2 text-[12px]">
          {["فوز كريستوفيز", "تعادل", "فوز البورنتونا"].map((opt, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="poll"
                className="accent-kooora-gold"
                defaultChecked={i === 0}
              />
              <span>{opt}</span>
            </label>
          ))}
          <button
            type="button"
            className="mt-2 w-full bg-kooora-gold text-kooora-dark font-bold py-1.5 rounded text-[12px] hover:bg-kooora-goldDark"
          >
            تصويت
          </button>
        </form>

        <div className="mt-2 text-[11px]">
          <input type="checkbox" id="more" className="accent-kooora-gold" />
          <label htmlFor="more" className="ms-1 text-kooora-muted">
            المزيد
          </label>
        </div>
      </div>
    </section>
  );
}
