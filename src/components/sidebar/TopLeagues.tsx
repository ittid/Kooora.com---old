import SidebarPanel from "../shared/SidebarPanel";

type Row = { flag: string; country: string; division1: string; division2: string };

const rows: Row[] = [
  { flag: "🇪🇺", country: "أوروبا", division1: "أبطال أوروبا", division2: "الدوري الأوروبي" },
  { flag: "🇪🇸", country: "إسبانيا", division1: "الدوري الأول", division2: "الكأس" },
  { flag: "🇮🇹", country: "إيطاليا", division1: "الدوري A", division2: "الدوري B" },
  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "إنجلترا", division1: "الدوري الممتاز", division2: "الدوري الأول" },
  { flag: "🇩🇪", country: "ألمانيا", division1: "الدوري الأول", division2: "الدوري الثاني" },
  { flag: "🇫🇷", country: "فرنسا", division1: "الدوري الأول", division2: "الدوري الثاني" },
  { flag: "🇳🇱", country: "هولندا", division1: "الدوري الممتاز", division2: "الكأس" },
  { flag: "🇵🇹", country: "البرتغال", division1: "الدوري الممتاز", division2: "الدوري الثاني" },
];

export default function TopLeagues() {
  return (
    <SidebarPanel title="أهم الدوريات العالمية">
      <ul className="divide-y divide-kooora-border/40 text-[11.5px]">
        {rows.map((r, i) => (
          <li
            key={i}
            className="py-1.5 px-2 grid grid-cols-[18px_1fr_1fr_1fr] items-center gap-2"
          >
            <span className="text-[14px]">{r.flag}</span>
            <span className="font-semibold text-kooora-dark">{r.country}</span>
            <span className="text-kooora-goldDark text-center">{r.division1}</span>
            <span className="text-kooora-goldDark text-end">{r.division2}</span>
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
