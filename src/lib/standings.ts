import { createAdminClient } from "@/lib/supabase/admin";

const CACHE_MINUTES = 90;

export type StandingRow = {
  position: number;
  team_name: string;
  team_slug: string | null;
  team_logo: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
};

type SDBLeagueRow = {
  intRank: string;
  strTeam: string;
  strBadge: string | null;
  intPlayed: string | null;
  intWin: string | null;
  intDraw: string | null;
  intLoss: string | null;
  intGoalsFor: string | null;
  intGoalsAgainst: string | null;
  intGoalDifference: string | null;
  intPoints: string;
};

function currentSeasonString() {
  // TheSportsDB seasons look like "2024-2025". After June, advance.
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

async function fetchFromSdb(externalId: number): Promise<StandingRow[]> {
  const season = currentSeasonString();
  const url = `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${externalId}&s=${season}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = (await res.json()) as { table: SDBLeagueRow[] | null };
    const rows = json.table ?? [];
    return rows.map((r) => ({
      position: Number(r.intRank),
      team_name: r.strTeam,
      team_slug: null,
      team_logo: r.strBadge,
      played: Number(r.intPlayed ?? 0),
      won: Number(r.intWin ?? 0),
      drawn: Number(r.intDraw ?? 0),
      lost: Number(r.intLoss ?? 0),
      goals_for: Number(r.intGoalsFor ?? 0),
      goals_against: Number(r.intGoalsAgainst ?? 0),
      goal_diff: Number(r.intGoalDifference ?? 0),
      points: Number(r.intPoints),
    }));
  } catch {
    return [];
  }
}

// Returns up-to-date standings for a league. Uses the `standings` table as a
// 90-minute cache. If the cache is fresh, returns the cached rows. Otherwise
// fetches from TheSportsDB and writes through.
export async function fetchStandings(leagueSlug: string): Promise<StandingRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

  const admin = createAdminClient();

  // Look up league + its TheSportsDB id
  const { data: league } = await admin
    .from("leagues")
    .select("id, external_id_sdb")
    .eq("slug", leagueSlug)
    .maybeSingle();

  if (!league) return [];

  // Read cached rows
  const { data: cached } = await admin
    .from("standings")
    .select("*")
    .eq("league_id", league.id)
    .order("position");

  const rows = (cached ?? []) as Array<StandingRow & { fetched_at: string }>;
  const fresh =
    rows.length > 0 &&
    new Date(rows[0].fetched_at).getTime() > Date.now() - CACHE_MINUTES * 60_000;

  if (fresh) {
    return rows;
  }

  // No external id → can't refresh; return whatever we have.
  if (!league.external_id_sdb) {
    return rows;
  }

  const fetched = await fetchFromSdb(league.external_id_sdb);
  if (fetched.length === 0) {
    return rows; // stale-but-better-than-nothing
  }

  // Resolve team slugs against our `teams` table by english/arabic name.
  const { data: teams } = await admin
    .from("teams")
    .select("slug, name_en, name_ar");
  const lookup = new Map<string, string>();
  for (const t of (teams ?? []) as { slug: string; name_en: string | null; name_ar: string }[]) {
    if (t.name_en) lookup.set(t.name_en.toLowerCase(), t.slug);
    lookup.set(t.name_ar.toLowerCase(), t.slug);
  }
  const enriched = fetched.map((r) => ({
    ...r,
    team_slug: lookup.get(r.team_name.toLowerCase()) ?? null,
  }));

  // Write-through cache: replace the league's rows.
  await admin.from("standings").delete().eq("league_id", league.id);
  await admin.from("standings").insert(
    enriched.map((r) => ({
      league_id: league.id,
      position: r.position,
      team_name: r.team_name,
      team_slug: r.team_slug,
      team_logo: r.team_logo,
      played: r.played,
      won: r.won,
      drawn: r.drawn,
      lost: r.lost,
      goals_for: r.goals_for,
      goals_against: r.goals_against,
      goal_diff: r.goal_diff,
      points: r.points,
    })),
  );

  return enriched;
}
