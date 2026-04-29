const tournaments = [
  { id: "cl", name: "دوري أبطال أوروبا", abbr: "CL", bg: "#0a2668" },
  { id: "el", name: "الدوري الأوروبي", abbr: "EL", bg: "#fd6a27" },
  { id: "ecl", name: "دوري المؤتمر الأوروبي", abbr: "ECL", bg: "#14794d" },
  { id: "cafcl", name: "دوري أبطال أفريقيا", abbr: "CAF", bg: "#d4a017" },
  { id: "cafcup", name: "كأس الكونفدرالية الأفريقية", abbr: "CC", bg: "#b8902b" },
  { id: "afcu20", name: "كأس آسيا تحت 20 سنة", abbr: "U20", bg: "#1a6bb8" },
];

export default function Tournaments() {
  return (
    <section className="mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center border-b-2 border-kooora-gold">
        <h3
          className="text-white"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "16px",
            lineHeight: "30px",
            fontWeight: 600,
          }}
        >
          أهم البطولات الحالية
        </h3>
      </header>
      <div className="bg-kooora-card p-3">
        <ul className="grid grid-cols-6 gap-2">
          {tournaments.map((t) => (
            <li key={t.id} className="flex flex-col items-center gap-1 text-center">
              <div
                className="w-16 h-16 rounded-sm flex items-center justify-center text-white font-black text-[12px] shadow"
                style={{ background: t.bg }}
              >
                {t.abbr}
              </div>
              <span className="text-[11px] text-kooora-dark leading-tight mt-1">
                {t.name}
              </span>
            </li>
          ))}
        </ul>
        {/* Extra tournament row — right-aligned */}
        <div className="flex justify-end mt-4">
          <div className="flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center text-white font-black text-[11px] shadow"
              style={{ background: "#0a4f2b" }}
            >
              SBF
            </div>
            <span className="text-[11px] text-kooora-dark leading-tight mt-1 max-w-[90px]">
              كأس خادم الحرمين الشريفين - السعودية
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
