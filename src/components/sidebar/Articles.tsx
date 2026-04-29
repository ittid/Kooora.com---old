import Image from "next/image";
import Link from "next/link";
import SidebarPanel from "../shared/SidebarPanel";
import { fetchArticles, type DbArticle } from "@/lib/data-source";

const FALLBACK: DbArticle[] = [
  {
    id: "a1",
    slug: "a1",
    title: "الجناح الثابت في الكرة الآسيوية",
    cover_url: "https://picsum.photos/seed/author1/50",
    author: null,
  },
  {
    id: "a2",
    slug: "a2",
    title: "الدوري ما زال حائرا",
    cover_url: "https://picsum.photos/seed/author2/50",
    author: null,
  },
  {
    id: "a3",
    slug: "a3",
    title: "خماسية صنداونز جرس انذار للهلال..!",
    cover_url: "https://picsum.photos/seed/author3/50",
    author: null,
  },
];

export default async function Articles() {
  const fromDb = await fetchArticles(3);
  const articles = fromDb.length > 0 ? fromDb : FALLBACK;

  return (
    <SidebarPanel title="مقالات">
      <ul className="divide-y divide-kooora-border/40">
        {articles.map((a) => {
          const avatar =
            a.author?.avatar_url ?? a.cover_url ?? `https://picsum.photos/seed/${a.id}/50`;
          return (
            <li key={a.id} className="p-3 flex gap-3 items-center">
              {a.author ? (
                <Link href={`/authors/${a.author.id}`} aria-label={a.author.display_name ?? ""}>
                  <Image
                    src={avatar}
                    alt={a.author.display_name ?? ""}
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover flex-shrink-0"
                    unoptimized
                  />
                </Link>
              ) : (
                <Image
                  src={avatar}
                  alt=""
                  width={50}
                  height={50}
                  className="w-[50px] h-[50px] rounded-full object-cover flex-shrink-0"
                  unoptimized
                />
              )}
              <div className="flex-1 min-w-0 text-end">
                <Link
                  href={`/news/${a.slug}`}
                  className="block text-[13.5px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-tight"
                >
                  {a.title}
                </Link>
                {a.author?.display_name && (
                  <Link
                    href={`/authors/${a.author.id}`}
                    className="block text-[11px] text-kooora-muted hover:text-kooora-goldDark mt-1"
                  >
                    {a.author.display_name}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </SidebarPanel>
  );
}
