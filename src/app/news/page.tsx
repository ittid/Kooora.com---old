import SiteShell from "@/components/layout/SiteShell";
import NewsList from "@/components/main/NewsList";
import { fetchTopNews } from "@/lib/data-source";

export const metadata = { title: "أخبار - كووورة" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const items = await fetchTopNews(30);
  return (
    <SiteShell>
      <NewsList items={items} title="جميع الأخبار" moreHref="/news" />
    </SiteShell>
  );
}
