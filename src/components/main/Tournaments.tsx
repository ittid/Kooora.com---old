const tournaments = [
  { id: "t1", name: "UEFA Champions League", abbr: "CL" },
  { id: "t2", name: "UEFA Europa", abbr: "EL" },
  { id: "t3", name: "الدوري الأوروبي", abbr: "EUR" },
  { id: "t4", name: "دوري أبطال أفريقيا", abbr: "CAF" },
  { id: "t5", name: "كأس الكونفدرالية", abbr: "CNF" },
];

export default function Tournaments() {
  return (
    <section className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
        <h3 className="text-kooora-gold text-[13px] font-bold">أهم البطولات الحالية</h3>
      </header>
      <ul className="p-3 grid grid-cols-5 gap-2">
        {tournaments.map((t) => (
          <li key={t.id} className="flex flex-col items-center gap-1 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-kooora-gold/90 to-kooora-goldDark text-kooora-dark font-black flex items-center justify-center text-[14px] shadow">
              {t.abbr}
            </div>
            <span className="text-[10.5px] text-kooora-muted leading-tight">
              {t.name}
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-kooora-border/40 p-3">
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded text-white p-3 text-center">
          <div className="font-bold text-[13px]">AFC U20 Asian Cup</div>
          <div className="text-[11px] opacity-80 mt-1">كأس آسيا تحت 20 سنة</div>
        </div>
      </div>
    </section>
  );
}
