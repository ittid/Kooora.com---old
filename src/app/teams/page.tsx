import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import Flag from "@/components/shared/Flag";
import TeamLogo from "@/components/shared/TeamLogo";
import { fetchTopTeams, type DbTeamRow } from "@/lib/data-source";

export const metadata = { title: "فرق - كووورة" };
export const dynamic = "force-dynamic";

function groupByCountry(teams: DbTeamRow[]) {
  const map = new Map<string, { name: string; flag: string; teams: DbTeamRow[] }>();
  for (const t of teams) {
    const code = t.country?.code ?? "eu";
    const name = t.country?.name_ar ?? code;
    if (!map.has(code)) map.set(code, { name, flag: code, teams: [] });
    map.get(code)!.teams.push(t);
  }
  return [...map.values()];
}

export default async function TeamsPage() {
  const teams = (await fetchTopTeams()) ?? [];
  const groups = groupByCountry(teams);

  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <h1 className="text-white text-[14px] font-bold">فرق</h1>
        </header>
        <div className="p-4">
          {groups.length === 0 ? (
            <p className="text-[13px] text-kooora-dark/80">
              لا توجد فرق في قاعدة البيانات بعد. شغّل ملف <code>supabase/seed.sql</code>.
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
                    {g.teams.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/teams/${t.slug}`}
                          className="inline-flex items-center gap-2 hover:text-kooora-goldDark"
                        >
                          <TeamLogo name={t.name_ar} size={18} />
                          <span>{t.name_ar}</span>
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
