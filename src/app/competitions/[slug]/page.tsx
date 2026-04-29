import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import StandingsTable from "@/components/league/StandingsTable";
import {
  fetchLeagueBySlug,
  fetchPostsByLeagueSlug,
  fetchMatchesForLeague,
  fetchTeamsForLeague,
} from "@/lib/data-source";
import { fetchStandings } from "@/lib/standings";
import type { DbMatchRow, DbPost } from "@/lib/data-source";

export const dynamic = "force-dynamic";

const FALLBACK_TITLES: Record<string, string> = {
  laliga: "الدوري الإسباني",
  "premier-league": "الدوري الإنجليزي الممتاز",
  "serie-a": "الدوري الإيطالي",
  "champions-league": "دوري أبطال أوروبا",
};

const SUB_NAV: { label: string; href: string }[] = [
  { label: "الفرق", href: "#teams" },
  { label: "المراكز", href: "#standings" },
  { label: "المباريات", href: "#matches" },
  { label: "المراحل", href: "#stages" },
  { label: "الأخبار", href: "#news" },
  { label: "الهدافين", href: "#scorers" },
  { label: "الملاعب", href: "#venues" },
  { label: "الصور", href: "#photos" },
  { label: "أرشيف", href: "#archive" },
];

const PLACEHOLDER_SCORERS = [
  { player: "فيستون كالالا مايلي", team: "ياتو أفريكانز", goals: 7 },
  { player: "كاسيمس مايلولا", team: "مامالودي صن داونز", goals: 6 },
  { player: "أحمد سيد زيزو", team: "الزمالك", goals: 6 },
  { player: "موسى مارفي", team: "سيمبا", goals: 5 },
  { player: "ماكاي لينلي", team: "الهلال", goals: 5 },
  { player: "ياغر اتاكي", team: "بيترو أتلتيكو", goals: 5 },
  { player: "بولي سامبو", team: "الوداد الرياضي", goals: 4 },
];

const PLACEHOLDER_ARTICLES = [
  { author: "بكر مختار", title: "خماسية صنداونز جرس الذرّ للهلال!", avatar: "https://picsum.photos/seed/auth1/40" },
  { author: "بكر مختار", title: "ياتو جمهور .. يا كاف (الهنا)..!", avatar: "https://picsum.photos/seed/auth2/40" },
  { author: "حسام سالم", title: "ملك السوبر", avatar: "https://picsum.photos/seed/auth3/40" },
];

const PLACEHOLDER_CHANNELS = [
  "المغربية الرياضية",
  "الرياضية الأرضية",
  "SuperSport Maximo 1",
  "beIN Sports HD 3",
  "beIN Sports HD 4",
  "beIN Sports HD 6",
  "beIN Sports HD 7",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const league = await fetchLeagueBySlug(slug);
  return {
    title: `${league?.name_ar ?? FALLBACK_TITLES[slug] ?? slug} - كووورة`,
  };
}

type LeagueRow = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string | null;
  country: { code: string; name_ar: string } | null;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
}

function StripMatchCard({ m, label }: { m: DbMatchRow; label: string }) {
  if (!m.home || !m.away) return null;
  const finished = m.status === "finished" && m.home_score !== null && m.away_score !== null;
  return (
    <Link
      href={`/matches/${m.id}`}
      className="flex flex-col items-center px-3 py-2 border-l border-kooora-border/40 last:border-l-0 hover:bg-kooora-page/40 min-w-[140px] flex-1"
    >
      <div className="text-[10px] text-kooora-muted">{label}</div>
      <div className="flex items-center gap-2 mt-1">
        {m.home.logo_url && (
          <Image src={m.home.logo_url} alt="" width={20} height={20} unoptimized />
        )}
        <span
          className="text-[11px] font-bold text-kooora-dark min-w-[44px] text-center"
          dir="ltr"
        >
          {finished ? `${m.home_score}-${m.away_score}` : formatTime(m.kickoff_at)}
        </span>
        {m.away.logo_url && (
          <Image src={m.away.logo_url} alt="" width={20} height={20} unoptimized />
        )}
      </div>
      <div className="text-[10.5px] text-kooora-muted mt-1 text-center line-clamp-1">
        {m.home.name_ar} - {m.away.name_ar}
      </div>
    </Link>
  );
}

function NewsRow({ post }: { post: DbPost }) {
  return (
    <li className="p-3 flex gap-3 border-b border-kooora-border/40 hover:bg-kooora-page/40">
      <div className="relative w-[110px] h-[68px] flex-shrink-0">
        {post.cover_url ? (
          <Image src={post.cover_url} alt="" fill className="object-cover rounded" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-kooora-border/40 rounded" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/news/${post.slug}`}
          className="block text-[13px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-snug"
        >
          {post.title}
        </Link>
        {post.excerpt && (
          <p className="text-[11.5px] text-kooora-muted mt-1 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>
    </li>
  );
}

function PanelHeader({ title, id }: { title: string; id?: string }) {
  return (
    <header
      id={id}
      className="bg-kooora-dark px-3 h-[34px] flex items-center border-b-2 border-kooora-gold scroll-mt-4"
    >
      <h2
        className="text-white"
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        {title}
      </h2>
    </header>
  );
}

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [league, posts, upcoming, recent, teams, standings] = await Promise.all([
    fetchLeagueBySlug(slug),
    fetchPostsByLeagueSlug(slug, 12),
    fetchMatchesForLeague(slug, { upcoming: true, limit: 4 }),
    fetchMatchesForLeague(slug, { finished: true, limit: 4 }),
    fetchTeamsForLeague(slug),
    fetchStandings(slug),
  ]);
  const leagueRow = league as LeagueRow | null;
  const title = leagueRow?.name_ar ?? FALLBACK_TITLES[slug] ?? slug;

  // Strip: prefer recent results first, then upcoming
  const stripMatches: { m: DbMatchRow; label: string }[] = [
    ...recent.slice(0, 2).map((m) => ({ m, label: "يوم أمس" })),
    ...upcoming.slice(0, 2).map((m) => ({ m, label: "اليوم" })),
  ];
  // For sidebar "current matches"
  const currentMatches = [...upcoming, ...recent].slice(0, 10);

  return (
    <SiteShell withSidebar={false}>
      {/* Sub-nav: anchor tabs */}
      <nav className="bg-kooora-dark border-b-2 border-kooora-gold mb-3">
        <ul className="flex items-stretch text-white text-[13px]">
          {SUB_NAV.map((t, i) => (
            <li
              key={t.href}
              className={`flex-1 ${i > 0 ? "border-r border-[#3a3a3a]" : ""}`}
            >
              <a
                href={t.href}
                className="block text-center px-2 py-2 hover:bg-[#fb0] hover:text-black"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid grid-cols-[1fr_280px] gap-3">
        {/* MAIN COLUMN */}
        <div className="min-w-0">
          {/* Hero / title */}
          <section className="bg-kooora-card border border-kooora-border/40 mb-3">
            <header className="bg-kooora-dark h-[36px] flex items-center justify-between px-3 border-b-2 border-kooora-gold">
              <h1
                className="text-white flex items-center gap-2"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                <span className="text-kooora-gold">★</span>
                {title}
              </h1>
              <div className="flex items-center gap-3 text-[11.5px] text-white/80">
                <a href="#news" className="hover:text-kooora-gold">مقالات</a>
                <a href="#matches" className="hover:text-kooora-gold">المباراة</a>
                <a href="#news" className="hover:text-kooora-gold">الفيديو</a>
                <a href="#matches" className="hover:text-kooora-gold">المباريات</a>
              </div>
            </header>

            {/* Match strip */}
            {stripMatches.length > 0 && (
              <div className="flex bg-white" id="matches">
                {stripMatches.map(({ m, label }) => (
                  <StripMatchCard key={m.id} m={m} label={label} />
                ))}
              </div>
            )}
          </section>

          {/* Standings (real data when available) */}
          {standings.length > 0 && (
            <section
              id="standings"
              className="bg-kooora-card border border-kooora-border/40 mb-3 scroll-mt-4"
            >
              <PanelHeader title="النقاط والمراكز" />
              <StandingsTable rows={standings} />
            </section>
          )}

          {/* News */}
          <section
            id="news"
            className="bg-kooora-card border border-kooora-border/40 mb-3 scroll-mt-4"
          >
            {posts.length > 0 ? (
              <ul>
                {posts.map((p) => (
                  <NewsRow key={p.id} post={p} />
                ))}
              </ul>
            ) : (
              <p className="p-6 text-center text-[12px] text-kooora-muted">
                لا توجد أخبار مرتبطة بهذه المسابقة بعد.
              </p>
            )}
            <div className="bg-kooora-dark text-center py-2">
              <a
                href="#"
                className="inline-block bg-kooora-gold text-kooora-dark text-[12px] px-4 py-1 font-bold hover:brightness-95"
              >
                المزيد
              </a>
            </div>
          </section>

          {/* Teams */}
          {teams.length > 0 && (
            <section
              id="teams"
              className="bg-kooora-card border border-kooora-border/40 mb-3 scroll-mt-4"
            >
              <PanelHeader title="الفرق" />
              <ul className="grid grid-cols-4 gap-2 p-3">
                {teams.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/teams/${t.slug}`}
                      className="flex flex-col items-center gap-1 hover:text-kooora-goldDark p-2"
                    >
                      {t.logo_url ? (
                        <Image
                          src={t.logo_url}
                          alt={t.name_ar}
                          width={36}
                          height={36}
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="w-9 h-9 bg-kooora-border/40 rounded-full" />
                      )}
                      <span className="text-[11.5px] text-center line-clamp-1">{t.name_ar}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Interviews */}
          <section className="bg-kooora-card border border-kooora-border/40 mb-3">
            <PanelHeader title="مقابلات" />
            <div className="p-3 flex gap-3 border-b border-kooora-border/40">
              <div className="relative w-[120px] h-[80px] flex-shrink-0">
                <Image
                  src="https://picsum.photos/seed/interview/180/110"
                  alt=""
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <a
                  href="#"
                  className="block text-[13px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-snug"
                >
                  أحمد صالح في حوار لكووورة: &quot;الأهلي لم يشرف مصر بالمونديال.. وعودة فيريرا خطأ&quot;
                </a>
                <p className="text-[11.5px] text-kooora-muted mt-1 line-clamp-2">
                  بعد أحمد صالح، المدرب العام الأسبق لمنتخب الشباب المصري، أحد عناصر الجيل الذهبي للزمالك الذي حقق العديد من البطولات في بداية الألفية.
                </p>
              </div>
            </div>
            <div className="bg-kooora-dark text-center py-2">
              <a
                href="#"
                className="inline-block bg-kooora-gold text-kooora-dark text-[12px] px-4 py-1 font-bold hover:brightness-95"
              >
                المزيد
              </a>
            </div>
          </section>
        </div>

        {/* SIDEBAR (competition-specific) */}
        <aside>
          {/* Top scorers (placeholder until we wire up player goal aggregates) */}
          <section
            id="scorers"
            className="bg-white border border-kooora-border/40 mb-3 scroll-mt-4"
          >
            <PanelHeader title="قائمة الهدافين" />
            <table className="w-full text-[11px]">
              <thead className="bg-[#2a2a2a] text-white">
                <tr>
                  <th className="px-2 py-1 text-right">اسم اللاعب</th>
                  <th className="px-2 py-1">الفريق</th>
                  <th className="px-2 py-1">الأهداف</th>
                </tr>
              </thead>
              <tbody>
                {PLACEHOLDER_SCORERS.map((s, i) => (
                  <tr key={i} className="border-t border-kooora-border/30">
                    <td className="px-2 py-1">{s.player}</td>
                    <td className="px-2 py-1 text-kooora-muted">{s.team}</td>
                    <td className="px-2 py-1 text-center font-bold">{s.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Articles */}
          <section className="bg-white border border-kooora-border/40 mb-3">
            <PanelHeader title="مقالات" />
            <ul>
              {PLACEHOLDER_ARTICLES.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 px-2 py-2 border-b border-kooora-border/30 last:border-b-0"
                >
                  <Image
                    src={a.avatar}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                    unoptimized
                  />
                  <div className="flex-1 min-w-0">
                    <a
                      href="#"
                      className="block text-[12px] font-bold text-kooora-dark hover:text-kooora-goldDark line-clamp-2 leading-tight"
                    >
                      {a.title}
                    </a>
                    <span className="text-[10.5px] text-kooora-muted">{a.author}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Current matches (real data when available) */}
          {currentMatches.length > 0 && (
            <section className="bg-white border border-kooora-border/40 mb-3">
              <PanelHeader title="المباريات الحالية" />
              <ul className="text-[11px]">
                {currentMatches.map((m) => {
                  if (!m.home || !m.away) return null;
                  return (
                    <li
                      key={m.id}
                      className="grid grid-cols-[14px_1fr_auto] items-center gap-2 px-2 py-1.5 border-b border-kooora-border/30 last:border-b-0"
                    >
                      <span className="w-3 h-3 rounded-full bg-[#1f7a3a]" aria-hidden />
                      <Link
                        href={`/matches/${m.id}`}
                        className="truncate hover:text-kooora-goldDark"
                      >
                        <span className="text-kooora-dark">{m.home.name_ar}</span>
                        <span className="mx-1 text-kooora-muted">×</span>
                        <span className="text-kooora-dark">{m.away.name_ar}</span>
                      </Link>
                      <span className="text-kooora-muted text-[10.5px]" dir="ltr">
                        {shortDate(m.kickoff_at)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Channels */}
          <section className="bg-white border border-kooora-border/40 mb-3">
            <PanelHeader title="القنوات الناقلة للمسابقة" />
            <ul className="text-[12px]">
              {PLACEHOLDER_CHANNELS.map((c) => (
                <li
                  key={c}
                  className="px-3 py-1.5 border-b border-kooora-border/30 last:border-b-0"
                >
                  {c}
                </li>
              ))}
            </ul>
            <div className="text-center py-2 bg-[#f5f5f5]">
              <a href="#" className="text-[11.5px] text-kooora-goldDark hover:underline">
                المزيد
              </a>
            </div>
          </section>
        </aside>
      </div>

      {/* Hidden anchor placeholders for sub-nav targets that don't have content yet */}
      <div id="stages" />
      <div id="venues" />
      <div id="photos" />
      <div id="archive" />
    </SiteShell>
  );
}
