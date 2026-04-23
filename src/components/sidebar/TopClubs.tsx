import SidebarPanel from "../shared/SidebarPanel";

type Group = { flag: string; clubs: string[] };

const groups: Group[] = [
  { flag: "🇪🇸", clubs: ["ريال مدريد", "برشلونة", "أتلتيكو مدريد"] },
  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", clubs: ["مانشستر يونايتد", "تشيلسي", "أرسنال"] },
  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", clubs: ["توتنهام هوتسبير", "مانشستر سيتي", "ليفربول"] },
  { flag: "🇮🇹", clubs: ["ميلان", "روما", "إنتر ميلان"] },
  { flag: "🇩🇪", clubs: ["بوروسيا دورتموند", "بايرن ميونيخ", "شالكه"] },
  { flag: "🇫🇷", clubs: ["باريس سان جيرمان", "موناكو", ""] },
];

export default function TopClubs() {
  return (
    <SidebarPanel title="أهم الأندية العالمية">
      <ul className="divide-y divide-kooora-border/40 text-[11.5px]">
        {groups.map((g, i) => (
          <li
            key={i}
            className="py-1.5 px-2 grid grid-cols-[18px_1fr_1fr_1fr] items-center gap-2"
          >
            <span className="text-[14px]">{g.flag}</span>
            {g.clubs.map((c, j) => (
              <span key={j} className="text-kooora-dark">
                {c && (
                  <a href="#" className="hover:text-kooora-goldDark">
                    {c}
                  </a>
                )}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
