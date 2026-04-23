import TimezoneWidget from "./TimezoneWidget";

const flags = [
  { code: "ma", name: "المغرب", src: "https://flagcdn.com/w40/ma.png" },
  { code: "eg", name: "مصر", src: "https://flagcdn.com/w40/eg.png" },
  { code: "sa", name: "السعودية", src: "https://flagcdn.com/w40/sa.png" },
  { code: "fr", name: "فرنسا", src: "https://flagcdn.com/w40/fr.png" },
  { code: "de", name: "ألمانيا", src: "https://flagcdn.com/w40/de.png" },
  { code: "it", name: "إيطاليا", src: "https://flagcdn.com/w40/it.png" },
  { code: "gb-eng", name: "إنجلترا", src: "https://flagcdn.com/w40/gb-eng.png" },
  { code: "es", name: "إسبانيا", src: "https://flagcdn.com/w40/es.png" },
];

export default function TopBar() {
  return (
    <div className="bg-kooora-page">
      <div
        dir="ltr"
        className="w-[970px] mx-auto bg-kooora-dark text-white border-b border-[#4d4d4d]"
      >
        <div className="px-3 h-[51.5px] flex items-center gap-4">
          {/* Logo (left) */}
          <a href="#" className="flex items-center" aria-label="كووورة">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo-top.png" alt="KOOORA" className="h-[22px] w-auto" />
          </a>

          <div className="flex-1" />

          {/* Country pill with flags */}
          <div
            className="headerFlags flex items-center"
            style={{
              width: "355.14px",
              height: "31px",
              background: "#444444",
              padding: "5px",
              marginTop: "3px",
              marginLeft: "25px",
            }}
          >
            <div className="flex items-center gap-[2px] h-full">
              {flags.map((f) => (
                <div key={f.code} className="relative group h-full">
                  <button
                    className="w-[26px] h-full overflow-hidden block"
                    aria-label={f.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.src} alt="" className="w-full h-full object-cover" />
                  </button>
                  <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-kooora-gold text-kooora-dark text-[11px] font-semibold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20">
                    أخبار ومسابقات {f.name}
                  </span>
                </div>
              ))}
            </div>
            <span aria-hidden className="w-px self-stretch bg-[#6a6a6a] ms-auto" />
            <span
              className="text-[12px] text-[#fb0] whitespace-nowrap px-2 h-full flex items-center"
              dir="rtl"
            >
              جميع الدول
            </span>
          </div>

          {/* Search */}
          <button aria-label="بحث" className="hover:opacity-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/search.png" alt="" className="w-[20px] h-[20px]" />
          </button>

          {/* Time & timezone (far right) */}
          <TimezoneWidget />
        </div>
      </div>
    </div>
  );
}
