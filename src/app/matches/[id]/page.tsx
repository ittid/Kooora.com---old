import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import LiveMatchScore from "@/components/match/LiveMatchScore";
import MatchComments from "@/components/match/MatchComments";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Match = {
  id: number;
  kickoff_at: string;
  status: "scheduled" | "live" | "finished" | "postponed" | "cancelled";
  home_score: number | null;
  away_score: number | null;
  round_label: string | null;
  venue: string | null;
  league: { name_ar: string; slug: string } | null;
  home: { name_ar: string; slug: string; logo_url: string | null } | null;
  away: { name_ar: string; slug: string; logo_url: string | null } | null;
};

async function fetchMatch(id: string): Promise<Match | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("matches")
      .select(`
        id, kickoff_at, status, home_score, away_score, round_label, venue,
        league:league_id (name_ar, slug),
        home:home_team_id (name_ar, slug, logo_url),
        away:away_team_id (name_ar, slug, logo_url)
      `)
      .eq("id", id)
      .maybeSingle();
    return data as unknown as Match | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = await fetchMatch(id);
  if (!m || !m.home || !m.away) return { title: "مباراة - كووورة" };
  return { title: `${m.home.name_ar} ضد ${m.away.name_ar} - كووورة` };
}

const STATUS_LABEL: Record<Match["status"], string> = {
  scheduled: "لم تبدأ",
  live: "مباشر",
  finished: "انتهت",
  postponed: "مؤجلة",
  cancelled: "ملغية",
};

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = await fetchMatch(id);
  if (!m || !m.home || !m.away) notFound();

  // Initial server-rendered comments (Realtime subscribe takes over on the client).
  const initialComments = await fetchInitialComments(m.id);

  return (
    <SiteShell>
      <article className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark px-3 h-[34px] flex items-center border-b-2 border-kooora-gold">
          <Link href="/matches" className="text-kooora-gold text-[13px] hover:underline">
            ← المباريات
          </Link>
          {m.league && (
            <>
              <span className="text-white/40 mx-2">|</span>
              <Link
                href={`/competitions/${m.league.slug}`}
                className="text-white/80 text-[13px] hover:text-white"
              >
                {m.league.name_ar}
              </Link>
            </>
          )}
        </header>

        <div className="p-6">
          <div className="grid grid-cols-3 items-center gap-4 mb-4">
            <Link
              href={`/teams/${m.home.slug}`}
              className="flex flex-col items-center gap-2 group"
            >
              {m.home.logo_url && (
                <Image
                  src={m.home.logo_url}
                  alt={m.home.name_ar}
                  width={80}
                  height={80}
                  unoptimized
                />
              )}
              <span className="font-bold text-[15px] group-hover:text-kooora-goldDark">
                {m.home.name_ar}
              </span>
            </Link>

            <LiveMatchScore
              initial={{
                matchId: m.id,
                status: m.status,
                homeScore: m.home_score,
                awayScore: m.away_score,
                kickoffAt: m.kickoff_at,
              }}
            />

            <Link
              href={`/teams/${m.away.slug}`}
              className="flex flex-col items-center gap-2 group"
            >
              {m.away.logo_url && (
                <Image
                  src={m.away.logo_url}
                  alt={m.away.name_ar}
                  width={80}
                  height={80}
                  unoptimized
                />
              )}
              <span className="font-bold text-[15px] group-hover:text-kooora-goldDark">
                {m.away.name_ar}
              </span>
            </Link>
          </div>

          <dl className="text-[13px] grid grid-cols-2 gap-y-1 max-w-md mx-auto border-t border-kooora-border/50 pt-4">
            {m.round_label && m.round_label !== "seed" && (
              <>
                <dt className="text-kooora-muted">الجولة</dt>
                <dd>{m.round_label}</dd>
              </>
            )}
            {m.venue && (
              <>
                <dt className="text-kooora-muted">الملعب</dt>
                <dd>{m.venue}</dd>
              </>
            )}
            <dt className="text-kooora-muted">الحالة</dt>
            <dd>{STATUS_LABEL[m.status]}</dd>
          </dl>

          <MatchComments matchId={m.id} initial={initialComments} />
        </div>
      </article>
    </SiteShell>
  );
}

type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  author: { display_name: string | null; avatar_url: string | null } | null;
};

async function fetchInitialComments(matchId: number): Promise<CommentRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("match_comments")
      .select(`
        id, body, created_at,
        author:author_id (display_name, avatar_url)
      `)
      .eq("match_id", matchId)
      .order("created_at", { ascending: true })
      .limit(100);
    return ((data ?? []) as unknown) as CommentRow[];
  } catch {
    return [];
  }
}
