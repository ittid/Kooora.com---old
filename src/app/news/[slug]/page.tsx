import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import VideoPlayer from "@/components/shared/VideoPlayer";
import NewsList from "@/components/main/NewsList";
import { fetchPostBySlug, fetchTopNews, fetchTagsForPost } from "@/lib/data-source";
import { createClient } from "@/lib/supabase/server";
import { topNews } from "@/lib/data";

export const dynamic = "force-dynamic";

const KNOWN_CATEGORIES: Record<string, string> = {
  world: "كرة عالمية",
  arab: "كرة عربية",
  "other-sports": "رياضات أخرى",
  analysis: "تحليلات",
  articles: "مقالات",
  photo: "أخبار مصورة",
};

async function fetchPostsByCategory(slug: string, limit = 30) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    let q = supabase
      .from("posts")
      .select(
        "id, slug, kind, title, excerpt, body, cover_url, video_url, published_at, view_count, league_id, team_id",
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (slug === "articles") q = q.eq("kind", "article");
    else if (slug === "photo") q = q.not("cover_url", "is", null);
    else q = q.eq("category", slug);

    const { data } = await q;
    return data ?? [];
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
  const post = await fetchPostBySlug(slug);
  if (post) return { title: `${post.title} - كووورة` };
  if (slug in KNOWN_CATEGORIES) {
    return { title: `${KNOWN_CATEGORIES[slug]} - كووورة` };
  }
  return { title: "خبر - كووورة" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dbPost = await fetchPostBySlug(slug);

  // 1. If a real post matches this slug, render it.
  if (dbPost) {
    const [author, tags] = await Promise.all([
      fetchAuthorForPost(dbPost.id),
      fetchTagsForPost(dbPost.id),
    ]);
    return <PostView post={dbPost} author={author} tags={tags} />;
  }

  // 2. If no post but the slug is a known category, render category listing.
  if (slug in KNOWN_CATEGORIES) {
    const items = await fetchPostsByCategory(slug);
    const fallback = items.length === 0 ? await fetchTopNews(20) : [];
    return (
      <SiteShell>
        <NewsList
          items={items.length > 0 ? items : fallback}
          title={KNOWN_CATEGORIES[slug]}
          moreHref={`/news/${slug}`}
        />
        {items.length === 0 && fallback.length > 0 && (
          <p className="text-[12px] text-kooora-muted px-3 -mt-2 mb-3">
            لا توجد أخبار في هذا التصنيف بعد، يتم عرض أحدث الأخبار.
          </p>
        )}
      </SiteShell>
    );
  }

  // 3. Pre-Supabase-setup fallback to dummy ids.
  const dummyMatch = topNews.find((n) => n.id === slug);
  if (dummyMatch) {
    return (
      <PostView
        post={{
          id: dummyMatch.id,
          slug: dummyMatch.id,
          kind: dummyMatch.hasVideo ? "video" : "news",
          title: dummyMatch.title,
          excerpt: dummyMatch.excerpt,
          body: dummyMatch.excerpt,
          cover_url: dummyMatch.image,
          video_url: null,
          published_at: null,
          view_count: 0,
        }}
      />
    );
  }

  notFound();
}

type PostLike = {
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
};

type AuthorRow = { id: string; display_name: string | null; avatar_url: string | null } | null;
type TagRow = { id: number; slug: string; label: string; kind: string };

async function fetchAuthorForPost(postId: string): Promise<AuthorRow> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("author:author_id (id, display_name, avatar_url)")
      .eq("id", postId)
      .maybeSingle();
    const row = data as unknown as { author: AuthorRow } | null;
    return row?.author ?? null;
  } catch {
    return null;
  }
}

function PostView({
  post,
  author,
  tags = [],
}: {
  post: PostLike;
  author?: AuthorRow;
  tags?: TagRow[];
}) {
  return (
    <SiteShell>
      <article className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark px-3 h-[34px] flex items-center border-b-2 border-kooora-gold">
          <Link href="/news" className="text-kooora-gold text-[13px] hover:underline">
            ← العودة للأخبار
          </Link>
        </header>

        <div className="p-5">
          <h1 className="text-[22px] font-bold text-kooora-dark leading-tight mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mb-4 text-[12px] text-kooora-muted">
            {author && (
              <Link
                href={`/authors/${author.id}`}
                className="flex items-center gap-2 hover:text-kooora-goldDark"
              >
                {author.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt={author.display_name ?? ""}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-kooora-border/50 inline-block" />
                )}
                <span className="font-bold text-kooora-dark">
                  {author.display_name ?? "كاتب"}
                </span>
              </Link>
            )}
            {post.published_at && (
              <span>
                {new Date(post.published_at).toLocaleString("ar-EG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            )}
          </div>

          {post.video_url ? (
            <div className="mb-4">
              <VideoPlayer src={post.video_url} poster={post.cover_url ?? undefined} />
            </div>
          ) : post.cover_url ? (
            <div className="relative w-full aspect-[16/9] mb-4">
              <Image src={post.cover_url} alt="" fill className="object-cover" unoptimized />
            </div>
          ) : null}

          {post.excerpt && (
            <p className="text-[15px] font-bold text-kooora-dark leading-relaxed mb-3">
              {post.excerpt}
            </p>
          )}

          {post.body && (
            <div className="text-[14px] text-kooora-dark leading-loose whitespace-pre-line">
              {post.body}
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-5 pt-3 border-t border-kooora-border/50 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-kooora-muted me-1">الوسوم:</span>
              {tags.map((t) => (
                <Link
                  key={t.id}
                  href={`/search?tag=${encodeURIComponent(t.slug)}`}
                  className="text-[11.5px] px-2 py-0.5 border border-kooora-border/60 hover:border-kooora-gold hover:bg-kooora-gold/10"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>
    </SiteShell>
  );
}
