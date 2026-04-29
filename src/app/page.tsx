import SiteShell from "@/components/layout/SiteShell";

import FeaturedVideo from "@/components/main/FeaturedVideo";
import NewsList from "@/components/main/NewsList";
import NewsBottomRow from "@/components/main/NewsBottomRow";
import LeagueSection from "@/components/main/LeagueSection";
import ErrorVideo from "@/components/main/ErrorVideo";
import VideoPicks from "@/components/main/VideoPicks";
import Interviews from "@/components/main/Interviews";
import Tournaments from "@/components/main/Tournaments";
import LatestAdditions from "@/components/main/LatestAdditions";

import { fetchTopNews, fetchPostsByLeagueSlug } from "@/lib/data-source";

const FEATURED_LEAGUES: { slug: string; title: string }[] = [
  { slug: "premier-league", title: "الدوري الإنجليزي الممتاز" },
  { slug: "serie-a", title: "الدوري الإيطالي الدرجة A" },
  { slug: "laliga", title: "الدوري الإسباني الدرجة الأولى" },
  { slug: "champions-league", title: "دوري أبطال أوروبا" },
];

export default async function HomePage() {
  const [topNews, ...leagueNewsArrays] = await Promise.all([
    fetchTopNews(8),
    ...FEATURED_LEAGUES.map((l) => fetchPostsByLeagueSlug(l.slug, 3)),
  ]);

  return (
    <SiteShell>
      <FeaturedVideo />
      <NewsList items={topNews} />
      <NewsBottomRow />

      {FEATURED_LEAGUES.map((sec, i) => (
        <LeagueSection
          key={sec.slug}
          title={sec.title}
          items={leagueNewsArrays[i]}
          moreHref={`/competitions/${sec.slug}`}
        />
      ))}

      <ErrorVideo />
      <VideoPicks />
      <Interviews />
      <Tournaments />
      <LatestAdditions />
    </SiteShell>
  );
}
