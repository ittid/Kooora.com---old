import SidebarPanel from "../shared/SidebarPanel";
import Flag from "../shared/Flag";
import TeamLogo from "../shared/TeamLogo";

type Group = { flag: string; clubs: string[] };

const groups: Group[] = [
  { flag: "es", clubs: ["ريال مدريد", "برشلونة", "أتلتيكو مدريد"] },
  { flag: "gb-eng", clubs: ["مانشستر يونايتد", "تشيلسي", "أرسنال"] },
  { flag: "gb-eng", clubs: ["توتنهام هوتسبير", "مانشستر سيتي", "ليفربول"] },
  { flag: "it", clubs: ["ميلان", "روما", "إنتر ميلان"] },
  { flag: "de", clubs: ["بوروسيا دورتموند", "بايرن ميونيخ", "شالكه"] },
  { flag: "fr", clubs: ["باريس سان جيرمان", "موناكو", ""] },
];

export default function TopClubs() {
  return (
    <SidebarPanel title="أهم الأندية العالمية">
      <ul className="divide-y divide-kooora-border/40 text-[11.5px]">
        {groups.map((g, i) => (
          <li
            key={i}
            className="py-1.5 px-2 grid grid-cols-[20px_1fr_1fr_1fr] items-center gap-2"
          >
            <Flag code={g.flag} className="text-[14px]" />
            {g.clubs.map((c, j) => (
              <span key={j} className="text-kooora-dark">
                {c && (
                  <a
                    href="#"
                    className="hover:text-kooora-goldDark inline-flex items-center gap-1"
                  >
                    <TeamLogo name={c} size={16} />
                    <span>{c}</span>
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
