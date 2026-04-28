import SidebarPanel from "../shared/SidebarPanel";
import Flag from "../shared/Flag";

type Row = {
  flag: string;
  country: string;
  division1: string;
  division2: string;
};

const rows: Row[] = [
  { flag: "eu", country: "أوروبا", division1: "أبطال أوروبا", division2: "الدوري الأوروبي" },
  { flag: "es", country: "إسبانيا", division1: "الدوري الأول", division2: "الكأس" },
  { flag: "it", country: "إيطاليا", division1: "الدوري A", division2: "الدوري B" },
  { flag: "gb-eng", country: "إنجلترا", division1: "الدوري الممتاز", division2: "الدوري الأول" },
  { flag: "de", country: "ألمانيا", division1: "الدوري الأول", division2: "الدوري الثاني" },
  { flag: "fr", country: "فرنسا", division1: "الدوري الأول", division2: "الدوري الثاني" },
  { flag: "nl", country: "هولندا", division1: "الدوري الممتاز", division2: "الكأس" },
  { flag: "pt", country: "البرتغال", division1: "الدوري الممتاز", division2: "الدوري الثاني" },
];

export default function TopLeagues() {
  return (
    <SidebarPanel title="أهم الدوريات العالمية">
      <ul className="divide-y divide-kooora-border/40 text-[11.5px]">
        {rows.map((r, i) => (
          <li
            key={i}
            className="py-1.5 px-2 grid grid-cols-[20px_1fr_1fr_1fr] items-center gap-2"
          >
            <Flag code={r.flag} title={r.country} className="text-[14px]" />
            <span className="font-semibold text-kooora-dark">{r.country}</span>
            <span className="text-kooora-goldDark text-center">{r.division1}</span>
            <span className="text-kooora-goldDark text-end">{r.division2}</span>
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
