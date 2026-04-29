import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import Flag from "@/components/shared/Flag";
import { fetchTopLeagues, type DbLeagueRow } from "@/lib/data-source";

export const metadata = { title: "مسابقات - كووورة" };
export const dynamic = "force-dynamic";

function groupByCountry(leagues: DbLeagueRow[]) {
  const map = new Map<string, { name: string; flag: string; leagues: DbLeagueRow[] }>();
  for (const l of leagues) {
    const code = l.country?.code ?? "eu";
    const name = l.country?.name_ar ?? code;
    if (!map.has(code)) map.set(code, { name, flag: code, leagues: [] });
    map.get(code)!.leagues.push(l);
  }
  return [...map.values()];
}

export default async function CompetitionsPage() {
  const leagues = (await fetchTopLeagues()) ?? [];
  const groups = groupByCountry(leagues);

  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <h1 className="text-white text-[14px] font-bold">المسابقات</h1>
        </header>
        <div className="p-4">
          {groups.length === 0 ? (
            <p className="text-[13px] text-kooora-dark/80">
              لا توجد مسابقات في قاعدة البيانات بعد. شغّل <code>supabase/seed.sql</code>.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {groups.map((g) => (
                <div key={g.flag}>
                  <h2 className="flex items-center gap-2 font-bold text-kooora-dark border-b border-kooora-border/60 pb-1 mb-2 text-[13px]">
                    <Flag code={g.flag} />
                    <span>{g.name}</span>
                  </h2>
                  <ul className="space-y-1 text-[13px]">
                    {g.leagues.map((l) => (
                      <li key={l.id}>
                        <Link
                          href={`/competitions/${l.slug}`}
                          className="hover:text-kooora-goldDark"
                        >
                          {l.name_ar}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
