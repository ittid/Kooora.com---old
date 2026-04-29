import Link from "next/link";
import SidebarPanel from "../shared/SidebarPanel";
import Flag from "../shared/Flag";
import TeamLogo from "../shared/TeamLogo";
import { fetchTopTeams, type DbTeamRow } from "@/lib/data-source";

type StaticGroup = { flag: string; clubs: { name: string; slug: string }[] };

const STATIC_GROUPS: StaticGroup[] = [
  {
    flag: "es",
    clubs: [
      { name: "ريال مدريد", slug: "real-madrid" },
      { name: "برشلونة", slug: "barcelona" },
      { name: "أتلتيكو مدريد", slug: "atletico-madrid" },
    ],
  },
  {
    flag: "gb-eng",
    clubs: [
      { name: "مانشستر يونايتد", slug: "manchester-united" },
      { name: "تشيلسي", slug: "chelsea" },
      { name: "أرسنال", slug: "arsenal" },
    ],
  },
  {
    flag: "gb-eng",
    clubs: [
      { name: "توتنهام هوتسبير", slug: "tottenham" },
      { name: "مانشستر سيتي", slug: "manchester-city" },
      { name: "ليفربول", slug: "liverpool" },
    ],
  },
  {
    flag: "it",
    clubs: [
      { name: "ميلان", slug: "milan" },
      { name: "روما", slug: "roma" },
      { name: "إنتر ميلان", slug: "inter" },
    ],
  },
  {
    flag: "de",
    clubs: [
      { name: "بوروسيا دورتموند", slug: "dortmund" },
      { name: "بايرن ميونيخ", slug: "bayern-munich" },
      { name: "شالكه", slug: "schalke" },
    ],
  },
  {
    flag: "fr",
    clubs: [
      { name: "باريس سان جيرمان", slug: "psg" },
      { name: "موناكو", slug: "monaco" },
      { name: "", slug: "" },
    ],
  },
];

function groupsFromDb(teams: DbTeamRow[]): StaticGroup[] {
  // Chunks of 3 by country, in sort order.
  const byCountry = new Map<string, DbTeamRow[]>();
  for (const t of teams) {
    const code = t.country?.code ?? "eu";
    if (!byCountry.has(code)) byCountry.set(code, []);
    byCountry.get(code)!.push(t);
  }
  const groups: StaticGroup[] = [];
  for (const [code, list] of byCountry.entries()) {
    list.sort((a, b) => a.sort_order - b.sort_order);
    for (let i = 0; i < list.length; i += 3) {
      const slice = list.slice(i, i + 3);
      groups.push({
        flag: code,
        clubs: [0, 1, 2].map((j) => ({
          name: slice[j]?.name_ar ?? "",
          slug: slice[j]?.slug ?? "",
        })),
      });
    }
  }
  return groups;
}

export default async function TopClubs() {
  const fromDb = await fetchTopTeams();
  const groups = fromDb && fromDb.length > 0 ? groupsFromDb(fromDb) : STATIC_GROUPS;

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
                {c.name && (
                  <Link
                    href={`/teams/${c.slug}`}
                    className="hover:text-kooora-goldDark inline-flex items-center gap-1"
                  >
                    <TeamLogo name={c.name} size={16} />
                    <span>{c.name}</span>
                  </Link>
                )}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
