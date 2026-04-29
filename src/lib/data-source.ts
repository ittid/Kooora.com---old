// Single source of truth for fetching homepage data.
// Tries Supabase first; falls back to dummy data in src/lib/data.ts so the
// site renders even before .env.local is configured.

import { createClient } from "@/lib/supabase/server";
import * as dummy from "@/lib/data";

function hasSupabase() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export type DbPost = {
  id: string;
  slug: string;
  kind: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  video_url: string | null;
  published_at: string | null;
  view_count: number;
  league_id: number | null;
  team_id: number | null;
};

export type DbMatchRow = {
  id: number;
  kickoff_at: string;
  status: "scheduled" | "live" | "finished" | "postponed" | "cancelled";
  home_score: number | null;
  away_score: number | null;
  home: { name_ar: string; slug: string; logo_url: string | null } | null;
  away: { name_ar: string; slug: string; logo_url: string | null } | null;
};

export type DbLeagueRow = {
  id: number;
  slug: string;
  name_ar: string;
  is_top: boolean;
  sort_order: number;
  country: { code: string; name_ar: string } | null;
};

export type DbTeamRow = {
  id: number;
  slug: string;
  name_ar: string;
  logo_url: string | null;
  is_top: boolean;
  sort_order: number;
  country: { code: string; name_ar: string } | null;
};

export type DbPoll = {
  id: string;
  question: string;
  is_active: boolean;
  poll_options: { id: string; label: string; votes: number; sort_order: number }[];
};

// =====================================================================
// Posts
// =====================================================================
export async function fetchTopNews(limit = 8) {
  if (!hasSupabase()) {
    return dummy.topNews.slice(0, limit).map(toDummyDbPost);
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, slug, kind, title, excerpt, body, cover_url, video_url, published_at, view_count, league_id, team_id")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (!data || data.length === 0) {
      return dummy.topNews.slice(0, limit).map(toDummyDbPost);
    }
    return data as DbPost[];
  } catch {
    return dummy.topNews.slice(0, limit).map(toDummyDbPost);
  }
}

export async function fetchPostsByLeagueSlug(leagueSlug: string, limit = 3) {
  if (!hasSupabase()) {
    return dummy.topNews.slice(0, limit).map(toDummyDbPost);
  }
  try {
    const supabase = await createClient();
    const { data: league } = await supabase
      .from("leagues")
      .select("id")
      .eq("slug", leagueSlug)
      .maybeSingle();
    if (!league) return [];
    const { data } = await supabase
      .from("posts")
      .select("id, slug, kind, title, excerpt, body, cover_url, video_url, published_at, view_count, league_id, team_id")
      .eq("is_published", true)
      .eq("league_id", league.id)
      .order("published_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as DbPost[];
  } catch {
    return [];
  }
}

export async function fetchPostBySlug(slug: string) {
  if (!hasSupabase()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data as DbPost | null;
  } catch {
    return null;
  }
}

export async function fetchMostRead(limit = 6) {
  if (!hasSupabase()) {
    return dummy.mostRead.slice(0, limit).map(toDummyDbPost);
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, slug, kind, title, excerpt, body, cover_url, video_url, published_at, view_count, league_id, team_id")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(limit);
    if (!data || data.length === 0) {
      return dummy.mostRead.slice(0, limit).map(toDummyDbPost);
    }
    return data as DbPost[];
  } catch {
    return dummy.mostRead.slice(0, limit).map(toDummyDbPost);
  }
}

export type DbArticle = {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  author: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export async function fetchArticles(limit = 3): Promise<DbArticle[]> {
  if (!hasSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select(`
        id, slug, title, cover_url,
        author:author_id (id, display_name, avatar_url)
      `)
      .eq("is_published", true)
      .eq("kind", "article")
      .order("published_at", { ascending: false })
      .limit(limit);
    return ((data ?? []) as unknown) as DbArticle[];
  } catch {
    return [];
  }
}

// =====================================================================
// Matches
// =====================================================================
export async function fetchMatchesForLeague(
  leagueSlug: string,
  opts: { upcoming?: boolean; finished?: boolean; limit?: number } = {},
): Promise<DbMatchRow[]> {
  if (!hasSupabase()) return [];
  const limit = opts.limit ?? 10;
  try {
    const supabase = await createClient();
    const { data: league } = await supabase
      .from("leagues")
      .select("id")
      .eq("slug", leagueSlug)
      .maybeSingle();
    if (!league) return [];
    let q = supabase
      .from("matches")
      .select(`
        id, kickoff_at, status, home_score, away_score,
        home:home_team_id (name_ar, slug, logo_url),
        away:away_team_id (name_ar, slug, logo_url)
      `)
      .eq("league_id", league.id)
      .limit(limit);
    if (opts.upcoming) {
      q = q.gte("kickoff_at", new Date().toISOString()).order("kickoff_at", { ascending: true });
    } else if (opts.finished) {
      q = q.eq("status", "finished").order("kickoff_at", { ascending: false });
    } else {
      q = q.order("kickoff_at", { ascending: true });
    }
    const { data } = await q;
    return ((data ?? []) as unknown) as DbMatchRow[];
  } catch {
    return [];
  }
}

export async function fetchMatchesForTeam(
  teamSlug: string,
  opts: { upcoming?: boolean; finished?: boolean; limit?: number } = {},
): Promise<DbMatchRow[]> {
  if (!hasSupabase()) return [];
  const limit = opts.limit ?? 10;
  try {
    const supabase = await createClient();
    const { data: team } = await supabase
      .from("teams")
      .select("id")
      .eq("slug", teamSlug)
      .maybeSingle();
    if (!team) return [];
    let q = supabase
      .from("matches")
      .select(`
        id, kickoff_at, status, home_score, away_score,
        home:home_team_id (name_ar, slug, logo_url),
        away:away_team_id (name_ar, slug, logo_url)
      `)
      .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
      .limit(limit);
    if (opts.upcoming) {
      q = q.gte("kickoff_at", new Date().toISOString()).order("kickoff_at", { ascending: true });
    } else if (opts.finished) {
      q = q.eq("status", "finished").order("kickoff_at", { ascending: false });
    } else {
      q = q.order("kickoff_at", { ascending: false });
    }
    const { data } = await q;
    return ((data ?? []) as unknown) as DbMatchRow[];
  } catch {
    return [];
  }
}

export async function fetchTeamsForLeague(leagueSlug: string): Promise<DbTeamRow[]> {
  if (!hasSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data: league } = await supabase
      .from("leagues")
      .select("id")
      .eq("slug", leagueSlug)
      .maybeSingle();
    if (!league) return [];
    const { data } = await supabase
      .from("teams")
      .select("id, slug, name_ar, logo_url, is_top, sort_order, country:country_id (code, name_ar)")
      .eq("league_id", league.id)
      .order("sort_order");
    return ((data ?? []) as unknown) as DbTeamRow[];
  } catch {
    return [];
  }
}

export type DbTag = { id: number; slug: string; label: string; kind: string };

export async function fetchTagsForPost(postId: string): Promise<DbTag[]> {
  if (!hasSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("post_tags")
      .select("tag:tag_id (id, slug, label, kind)")
      .eq("post_id", postId);
    return ((data ?? []) as unknown as { tag: DbTag }[])
      .map((r) => r.tag)
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchPostsByTagSlug(tagSlug: string, limit = 6, excludeId?: string): Promise<DbPost[]> {
  if (!hasSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data: tag } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", tagSlug)
      .maybeSingle();
    if (!tag) return [];
    const { data: links } = await supabase
      .from("post_tags")
      .select("post_id")
      .eq("tag_id", tag.id);
    const ids = ((links ?? []) as { post_id: string }[]).map((l) => l.post_id);
    if (ids.length === 0) return [];
    let q = supabase
      .from("posts")
      .select("id, slug, kind, title, excerpt, body, cover_url, video_url, published_at, view_count, league_id, team_id")
      .eq("is_published", true)
      .in("id", ids)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q;
    return (data ?? []) as DbPost[];
  } catch {
    return [];
  }
}

// Related posts for any team — uses both team_id link and the auto-created `team-{slug}` tag.
export async function fetchRelatedPostsForTeam(teamSlug: string, limit = 6): Promise<DbPost[]> {
  return fetchPostsByTagSlug(`team-${teamSlug}`, limit);
}

export async function fetchRelatedPostsForPlayer(playerSlug: string, limit = 6): Promise<DbPost[]> {
  return fetchPostsByTagSlug(`player-${playerSlug}`, limit);
}

export async function fetchPostsForTeam(teamSlug: string, limit = 6): Promise<DbPost[]> {
  if (!hasSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data: team } = await supabase
      .from("teams")
      .select("id")
      .eq("slug", teamSlug)
      .maybeSingle();
    if (!team) return [];
    const { data } = await supabase
      .from("posts")
      .select("id, slug, kind, title, excerpt, body, cover_url, video_url, published_at, view_count, league_id, team_id")
      .eq("is_published", true)
      .eq("team_id", team.id)
      .order("published_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as DbPost[];
  } catch {
    return [];
  }
}

export async function fetchTopMatches(limit = 6) {
  if (!hasSupabase()) {
    return dummy.topMatches.slice(0, limit).map((m, i) => ({
      id: i,
      kickoff_at: new Date().toISOString(),
      status: "scheduled" as const,
      home_score: null,
      away_score: null,
      home: { name_ar: m.home.name, slug: slugify(m.home.name), logo_url: m.home.logo },
      away: { name_ar: m.away.name, slug: slugify(m.away.name), logo_url: m.away.logo },
    })) as DbMatchRow[];
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("matches")
      .select(`
        id, kickoff_at, status, home_score, away_score,
        home:home_team_id (name_ar, slug, logo_url),
        away:away_team_id (name_ar, slug, logo_url)
      `)
      .order("kickoff_at", { ascending: true })
      .limit(limit);
    return ((data ?? []) as unknown) as DbMatchRow[];
  } catch {
    return [];
  }
}

// =====================================================================
// Leagues / Teams (sidebar widgets)
// =====================================================================
export async function fetchTopLeagues() {
  if (!hasSupabase()) return null; // signal: caller should render dummy
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("leagues")
      .select("id, slug, name_ar, is_top, sort_order, country:country_id (code, name_ar)")
      .eq("is_top", true)
      .order("sort_order");
    return ((data ?? []) as unknown) as DbLeagueRow[];
  } catch {
    return null;
  }
}

export async function fetchTopTeams() {
  if (!hasSupabase()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("teams")
      .select("id, slug, name_ar, logo_url, is_top, sort_order, country:country_id (code, name_ar)")
      .eq("is_top", true)
      .order("sort_order");
    return ((data ?? []) as unknown) as DbTeamRow[];
  } catch {
    return null;
  }
}

export async function fetchTeamBySlug(slug: string) {
  if (!hasSupabase()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("teams")
      .select("id, slug, name_ar, name_en, logo_url, country:country_id (code, name_ar)")
      .eq("slug", slug)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function fetchLeagueBySlug(slug: string) {
  if (!hasSupabase()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("leagues")
      .select("id, slug, name_ar, name_en, country:country_id (code, name_ar)")
      .eq("slug", slug)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

// =====================================================================
// Polls
// =====================================================================
export async function fetchActivePoll(): Promise<DbPoll | null> {
  if (!hasSupabase()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("polls")
      .select("id, question, is_active, poll_options(id, label, votes, sort_order)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return null;
    const poll = data as DbPoll;
    poll.poll_options.sort((a, b) => a.sort_order - b.sort_order);
    return poll;
  } catch {
    return null;
  }
}

// =====================================================================
// Helpers
// =====================================================================
function slugify(s: string) {
  return s.trim().replace(/\s+/g, "-").toLowerCase();
}

function toDummyDbPost(n: dummy.NewsItem): DbPost {
  return {
    id: n.id,
    slug: n.id,
    kind: n.hasVideo ? "video" : "news",
    title: n.title,
    excerpt: n.excerpt || null,
    body: null,
    cover_url: n.image,
    video_url: null,
    published_at: null,
    view_count: 0,
    league_id: null,
    team_id: null,
  };
}
