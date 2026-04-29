import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import Flag from "@/components/shared/Flag";
import NewsList from "@/components/main/NewsList";
import MatchList from "@/components/match/MatchList";
import {
  fetchTeamBySlug,
  fetchMatchesForTeam,
  fetchPostsForTeam,
  fetchRelatedPostsForTeam,
} from "@/lib/data-source";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Player = {
  id: number;
  slug: string;
  name_ar: string;
  position: string | null;
  photo_url: string | null;
  birth_date: string | null;
};

async function fetchPlayersForTeam(teamId: number): Promise<Player[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("players")
      .select("id, slug, name_ar, position, photo_url, birth_date")
      .eq("team_id", teamId)
      .order("name_ar");
    return (data ?? []) as Player[];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await fetchTeamBySlug(slug);
  return { title: team ? `${team.name_ar} - كووورة` : "فريق - كووورة" };
}

type TeamRow = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string | null;
  logo_url: string | null;
  country: { code: string; name_ar: string } | null;
  league: { slug: string; name_ar: string } | null;
};

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Pull team with its league join (data-source helper doesn't include it).
  const supabase = await createClient();
  const { data: teamRow } = await supabase
    .from("teams")
    .select(`
      id, slug, name_ar, name_en, logo_url,
      country:country_id (code, name_ar),
      league:league_id (slug, name_ar)
    `)
    .eq("slug", slug)
    .maybeSingle();
  const team = teamRow as unknown as TeamRow | null;

  if (!team) {
    return (
      <SiteShell>
        <section className="bg-kooora-card border border-kooora-border/40 mb-3">
          <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
            <Link href="/teams" className="text-kooora-gold text-[13px] hover:underline">
              ← الفرق
            </Link>
          </header>
          <div className="p-6 text-[13px]">
            لم يتم العثور على بيانات لهذا الفريق ({slug}). شغّل
            <code> supabase/seed.sql </code>
            أو أضف الفريق من لوحة التحكم.
          </div>
        </section>
      </SiteShell>
    );
  }

  const [players, upcoming, recent, directPosts, taggedPosts] = await Promise.all([
    fetchPlayersForTeam(team.id),
    fetchMatchesForTeam(slug, { upcoming: true, limit: 4 }),
    fetchMatchesForTeam(slug, { finished: true, limit: 4 }),
    fetchPostsForTeam(slug, 6),
    fetchRelatedPostsForTeam(slug, 12),
  ]);

  // Merge direct (team_id link) with tagged ones, dedupe, cap.
  const seenIds = new Set<string>();
  const posts = [...directPosts, ...taggedPosts]
    .filter((p) => (seenIds.has(p.id) ? false : (seenIds.add(p.id), true)))
    .slice(0, 8);

  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <Link href="/teams" className="text-kooora-gold text-[13px] hover:underline">
            ← الفرق
          </Link>
        </header>
        <div className="p-6 flex items-center gap-4">
          {team.logo_url && (
            <Image
              src={team.logo_url}
              alt={team.name_ar}
              width={80}
              height={80}
              unoptimized
            />
          )}
          <div>
            <h1 className="text-[22px] font-bold text-kooora-dark mb-1">
              {team.name_ar}
            </h1>
            {team.name_en && (
              <p className="text-[13px] text-kooora-muted">{team.name_en}</p>
            )}
            <div className="flex items-center gap-3 text-[13px] mt-2">
              {team.country && (
                <span className="flex items-center gap-2">
                  <Flag code={team.country.code} />
                  <span>{team.country.name_ar}</span>
                </span>
              )}
              {team.league && (
                <Link
                  href={`/competitions/${team.league.slug}`}
                  className="text-kooora-goldDark hover:underline"
                >
                  {team.league.name_ar}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming + recent in 2-col on wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <section className="bg-kooora-card border border-kooora-border/40">
          <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
            <h2 className="text-kooora-gold text-[13px] font-bold">المباريات القادمة</h2>
          </header>
          <MatchList matches={upcoming} emptyText="لا توجد مباريات قادمة." />
        </section>
        <section className="bg-kooora-card border border-kooora-border/40">
          <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
            <h2 className="text-kooora-gold text-[13px] font-bold">آخر النتائج</h2>
          </header>
          <MatchList matches={recent} emptyText="لا توجد نتائج بعد." />
        </section>
      </div>

      {/* Players */}
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
          <h2 className="text-kooora-gold text-[13px] font-bold">اللاعبون</h2>
        </header>
        <div className="p-3">
          {players.length === 0 ? (
            <p className="text-[13px] text-kooora-dark/80 text-center py-6">
              لا توجد بيانات لاعبين لهذا الفريق بعد.
            </p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="bg-white border border-kooora-border/60 p-3 flex items-center gap-3"
                >
                  {p.photo_url ? (
                    <Image
                      src={p.photo_url}
                      alt={p.name_ar}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-[48px] h-[48px] rounded-full bg-kooora-border/40" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/players/${p.slug}`}
                      className="font-bold text-[13px] hover:text-kooora-goldDark line-clamp-1"
                    >
                      {p.name_ar}
                    </Link>
                    {p.position && (
                      <p className="text-[12px] text-kooora-muted">{p.position}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Recent posts about this team */}
      {posts.length > 0 && (
        <NewsList items={posts} title={`أخبار ${team.name_ar}`} moreHref={`/teams/${slug}`} />
      )}
    </SiteShell>
  );
}
