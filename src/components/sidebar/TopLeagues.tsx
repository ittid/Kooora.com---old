import Link from "next/link";
import SidebarPanel from "../shared/SidebarPanel";
import Flag from "../shared/Flag";
import { fetchTopLeagues, type DbLeagueRow } from "@/lib/data-source";

type StaticRow = {
  flag: string;
  country: string;
  division1: { label: string; href?: string };
  division2: { label: string; href?: string };
};

const STATIC_ROWS: StaticRow[] = [
  {
    flag: "eu",
    country: "أوروبا",
    division1: { label: "أبطال أوروبا", href: "/competitions/champions-league" },
    division2: { label: "الدوري الأوروبي", href: "/competitions/europa-league" },
  },
  {
    flag: "es",
    country: "إسبانيا",
    division1: { label: "الدوري الأول", href: "/competitions/laliga" },
    division2: { label: "الكأس", href: "/competitions/copa-del-rey" },
  },
  {
    flag: "it",
    country: "إيطاليا",
    division1: { label: "الدوري A", href: "/competitions/serie-a" },
    division2: { label: "الدوري B", href: "/competitions/serie-b" },
  },
  {
    flag: "gb-eng",
    country: "إنجلترا",
    division1: { label: "الدوري الممتاز", href: "/competitions/premier-league" },
    division2: { label: "الكأس", href: "/competitions/fa-cup" },
  },
  {
    flag: "de",
    country: "ألمانيا",
    division1: { label: "الدوري الأول", href: "/competitions/bundesliga" },
    division2: { label: "الكأس", href: "/competitions/dfb-pokal" },
  },
  {
    flag: "fr",
    country: "فرنسا",
    division1: { label: "الدوري الأول", href: "/competitions/ligue-1" },
    division2: { label: "الكأس", href: "/competitions/coupe-de-france" },
  },
  {
    flag: "nl",
    country: "هولندا",
    division1: { label: "الدوري الممتاز", href: "/competitions/eredivisie" },
    division2: { label: "الكأس", href: "#" },
  },
  {
    flag: "pt",
    country: "البرتغال",
    division1: { label: "الدوري الممتاز", href: "/competitions/primeira-liga" },
    division2: { label: "الدوري الثاني", href: "#" },
  },
];

function rowsFromDb(leagues: DbLeagueRow[]): StaticRow[] {
  const byCountry = new Map<string, DbLeagueRow[]>();
  for (const l of leagues) {
    const code = l.country?.code ?? "eu";
    if (!byCountry.has(code)) byCountry.set(code, []);
    byCountry.get(code)!.push(l);
  }
  const rows: StaticRow[] = [];
  for (const [code, list] of byCountry.entries()) {
    list.sort((a, b) => a.sort_order - b.sort_order);
    rows.push({
      flag: code,
      country: list[0].country?.name_ar ?? code,
      division1: list[0]
        ? { label: list[0].name_ar, href: `/competitions/${list[0].slug}` }
        : { label: "" },
      division2: list[1]
        ? { label: list[1].name_ar, href: `/competitions/${list[1].slug}` }
        : { label: "" },
    });
  }
  return rows;
}

export default async function TopLeagues() {
  const fromDb = await fetchTopLeagues();
  const rows = fromDb && fromDb.length > 0 ? rowsFromDb(fromDb) : STATIC_ROWS;

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
            {[r.division1, r.division2].map((d, j) => (
              <span key={j} className={j === 0 ? "text-center" : "text-end"}>
                {d.href ? (
                  <Link href={d.href} className="text-kooora-goldDark hover:underline">
                    {d.label}
                  </Link>
                ) : (
                  <span className="text-kooora-goldDark">{d.label}</span>
                )}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
