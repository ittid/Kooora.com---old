import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import NewsList from "@/components/main/NewsList";
import { createClient } from "@/lib/supabase/server";
import type { DbPost } from "@/lib/data-source";

export const dynamic = "force-dynamic";

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

async function fetchAuthor(id: string): Promise<Profile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", id)
      .maybeSingle();
    return data as Profile | null;
  } catch {
    return null;
  }
}

async function fetchPostsByAuthor(id: string): Promise<DbPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, slug, kind, title, excerpt, body, cover_url, video_url, published_at, view_count, league_id, team_id")
      .eq("author_id", id)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(30);
    return (data ?? []) as DbPost[];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await fetchAuthor(id);
  return { title: a?.display_name ? `${a.display_name} - كووورة` : "كاتب - كووورة" };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = await fetchAuthor(id);
  if (!author) notFound();
  const posts = await fetchPostsByAuthor(id);

  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <Link href="/news" className="text-kooora-gold text-[13px] hover:underline">
            ← الأخبار
          </Link>
        </header>
        <div className="p-6 flex items-center gap-4 border-b border-kooora-border/50">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.display_name ?? ""}
              width={80}
              height={80}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-[80px] h-[80px] rounded-full bg-kooora-border/40" />
          )}
          <div>
            <h1 className="text-[22px] font-bold text-kooora-dark">
              {author.display_name ?? "كاتب"}
            </h1>
            <p className="text-[12px] text-kooora-muted mt-1">
              {posts.length} مقال{posts.length === 1 ? "" : posts.length === 2 ? "ان" : "ات"}
            </p>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <NewsList items={posts} title="مقالات الكاتب" moreHref={`/authors/${id}`} />
      )}
    </SiteShell>
  );
}
