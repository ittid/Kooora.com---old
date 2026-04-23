const columns: string[][] = [
  ["أخبار", "فرق", "لاعبون", "مباريات", "جميع المسابقات", "رياضات أخرى"],
  ["TV", "صور", "منتديات"],
  ["مباريات جارية الآن", "مباريات اليوم", "مباريات الغد", "مباريات الأمس"],
  ["الدوري الاسباني", "الدوري الانجليزي", "الدوري الايطالي", "دوري ابطال اوروبا"],
  ["سياسة الاستخدام", "اتصل بنا", "اعلن معنا"],
];

export default function Footer() {
  return (
    <footer
      className="bg-kooora-page"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      <div className="w-[970px] mx-auto bg-kooora-dark text-white px-6 pt-4 pb-6">
        {/* Logo on the top RIGHT (first in source under RTL) */}
        <div className="flex items-center justify-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-kooora-gold flex items-center justify-center">
              <span className="text-kooora-dark font-black text-lg">K</span>
            </div>
            <span className="text-kooora-gold font-black text-2xl tracking-wide">
              KOOORA
            </span>
          </div>
        </div>

        {/* Gold rule */}
        <div className="h-px bg-kooora-gold mb-5" />

        {/* 5 link columns */}
        <div className="grid grid-cols-5 gap-4 text-[13px] mb-6 text-white/90">
          {columns.map((col, i) => (
            <ul key={i} className="space-y-2">
              {col.map((link, j) => (
                <li key={j}>
                  <a href="#" className="hover:text-kooora-gold">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {/* Social icons — on the LEFT in RTL, so we use justify-start with me-auto in LTR world...
            Under dir="rtl", "start" = right. To place icons on the visual LEFT, we use ms-auto.
            Actually simplest: wrap in a flex row with justify-end (end = left in RTL). */}
        <div className="flex justify-end mb-5">
          <div className="grid grid-cols-3 gap-x-2 gap-y-2">
            {/* Row 1 */}
            <SocialIcon
              label="Instagram"
              bg="linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
              letter="I"
            />
            <SocialIcon label="Twitter" bg="#1da1f2" letter="t" />
            <SocialIcon label="Facebook" bg="#1877f2" letter="f" />
            {/* Row 2 */}
            <SocialIcon label="Phone" bg="#e5e5e5" letter="☎" textColor="#333" />
            <SocialIcon label="TikTok" bg="#000" letter="♪" />
            <SocialIcon label="YouTube" bg="#ff0000" letter="▶" />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[12px] text-white/80">
          جميع الحقوق محفوظة لـ كووورة © 2023
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  label,
  bg,
  letter,
  textColor = "#fff",
}: {
  label: string;
  bg: string;
  letter: string;
  textColor?: string;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold"
      style={{ background: bg, color: textColor }}
    >
      {letter}
    </a>
  );
}
