import SidebarAd from "@/components/sidebar/SidebarAd";
import ImportantMatches from "@/components/sidebar/ImportantMatches";
import SidebarVideos from "@/components/sidebar/SidebarVideos";
import TopLeagues from "@/components/sidebar/TopLeagues";
import TopClubs from "@/components/sidebar/TopClubs";
import MostRead from "@/components/sidebar/MostRead";
import Articles from "@/components/sidebar/Articles";
import Poll from "@/components/sidebar/Poll";

export default function Sidebar() {
  return (
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
  );
}
