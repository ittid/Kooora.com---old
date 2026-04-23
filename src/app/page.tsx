import TopBar from "@/components/layout/TopBar";
import HeaderBanner from "@/components/layout/HeaderBanner";
import MainNav from "@/components/layout/MainNav";
import Footer from "@/components/layout/Footer";

import SidebarAd from "@/components/sidebar/SidebarAd";
import ImportantMatches from "@/components/sidebar/ImportantMatches";
import SidebarVideos from "@/components/sidebar/SidebarVideos";
import TopLeagues from "@/components/sidebar/TopLeagues";
import TopClubs from "@/components/sidebar/TopClubs";
import MostRead from "@/components/sidebar/MostRead";
import Articles from "@/components/sidebar/Articles";
import Poll from "@/components/sidebar/Poll";

import FeaturedVideo from "@/components/main/FeaturedVideo";
import NewsList from "@/components/main/NewsList";
import NewsBottomRow from "@/components/main/NewsBottomRow";
import LeagueSection from "@/components/main/LeagueSection";
import ErrorVideo from "@/components/main/ErrorVideo";
import VideoPicks from "@/components/main/VideoPicks";
import Interviews from "@/components/main/Interviews";
import Tournaments from "@/components/main/Tournaments";
import LatestAdditions from "@/components/main/LatestAdditions";

import { topNews, leagueSections } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <HeaderBanner />
      <MainNav />

      <main className="w-[970px] mx-auto py-3 grid grid-cols-[300px_1fr] gap-2">
        {/* Sidebar (visually on the left in RTL) */}
        <aside>
          <SidebarAd />
          <ImportantMatches />
          <SidebarVideos />
          <TopLeagues />
          <TopClubs />
          <MostRead />
          <Articles />
          <Poll />
        </aside>

        {/* Main content */}
        <div>
          <FeaturedVideo />
          <NewsList items={topNews.slice(0, 8)} />
          <NewsBottomRow />

          {leagueSections.map((sec) => (
            <LeagueSection key={sec.id} title={sec.title} items={sec.items} />
          ))}

          <ErrorVideo />
          <VideoPicks />
          <Interviews />
          <Tournaments />
          <LatestAdditions />
        </div>
      </main>

      <Footer />
    </>
  );
}
