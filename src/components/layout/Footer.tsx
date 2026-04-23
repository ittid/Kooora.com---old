const columns = [
  {
    title: "أخبار",
    links: ["آخر", "لاعبون", "مباريات", "جميع المسابقات", "رياضات أخرى"],
  },
  {
    title: "TV",
    links: ["صور", "منتخبات", "مباريات", "مباريات اليوم", "مباريات الأمس"],
  },
  {
    title: "مباريات جارية الآن",
    links: ["مباريات غدا", "مباريات اليوم", "مباريات الأمس"],
  },
  {
    title: "الدوري الإسباني",
    links: ["الدوري الإيطالي", "الدوري الإنجليزي", "فرنسا", "أوروبا"],
  },
  {
    title: "سياسة الاستخدام",
    links: ["اتصل بنا", "اعلن معنا"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-kooora-page mt-6">
      <div className="w-[970px] mx-auto bg-kooora-dark text-white px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-[12px]">
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-kooora-gold font-bold mb-3">{col.title}</h4>
              <ul className="space-y-2 text-white/80">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="hover:text-kooora-gold">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            <SocialIcon label="Facebook" color="#1877f2" />
            <SocialIcon label="Twitter" color="#1da1f2" />
            <SocialIcon label="Instagram" color="#e1306c" />
            <SocialIcon label="TikTok" color="#000" />
            <SocialIcon label="YouTube" color="#ff0000" />
          </div>
          <div className="text-kooora-gold font-black text-xl">
            k<span className="text-white">o</span>oora
          </div>
        </div>

        <div className="text-center text-[11px] text-white/50 mt-4">
          جميع الحقوق محفوظة لكووورة © 2023
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, color }: { label: string; color: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
      style={{ backgroundColor: color }}
    >
      {label[0]}
    </a>
  );
}
