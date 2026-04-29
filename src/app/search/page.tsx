import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "نتائج البحث - كووورة" };
export const dynamic = "force-dynamic";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
  category: string | null;
};

const CATEGORY_LABEL: Record<string, string> = {
  world: "كرة عالمية",
  arab: "كرة عربية",
  "other-sports": "رياضات أخرى",
  analysis: "تحليلات",
  articles: "مقالات",
  photo: "أخبار مصورة",
};

const KIND_LABEL: Record<string, string> = {
  news: "خبر",
  article: "مقال",
  video: "فيديو",
  interview: "حوار",
};

async function searchPosts(
  q: string,
  filters: { category?: string; kind?: string; tag?: string },
): Promise<Post[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();

    // If a tag is selected, resolve it first to get post ids.
    let postIdsByTag: string[] | null = null;
    if (filters.tag) {
      const { data: tag } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", filters.tag)
        .maybeSingle();
      if (!tag) return [];
      const { data: links } = await supabase
        .from("post_tags")
        .select("post_id")
        .eq("tag_id", tag.id);
      postIdsByTag = (links ?? []).map((l) => l.post_id as string);
      if (postIdsByTag.length === 0) return [];
    }

    if (q.trim()) {
      // Run RPC + ilike in parallel and merge — RPC ranks well for English/long
      // queries, ilike covers short Arabic ones the `simple` tsconfig misses.
      const [{ data: rpcRows }, { data: ilikeRows }] = await Promise.all([
        supabase.rpc("search_posts", { q, max_results: 60 }),
        supabase
          .from("posts")
          .select("id, slug, title, excerpt, cover_url, published_at, category, kind")
          .eq("is_published", true)
          .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
          .order("published_at", { ascending: false })
          .limit(60),
      ]);
      const seen = new Set<string>();
      let rows: Post[] = [];
      for (const list of [rpcRows ?? [], ilikeRows ?? []]) {
        for (const r of list as unknown as Post[]) {
          if (seen.has(r.id)) continue;
          seen.add(r.id);
          rows.push(r);
        }
      }
      if (filters.category) rows = rows.filter((r) => r.category === filters.category);
      if (filters.kind) rows = rows.filter((r) => (r as unknown as { kind?: string }).kind === filters.kind);
      if (postIdsByTag) rows = rows.filter((r) => postIdsByTag!.includes(r.id));
      return rows.slice(0, 30);
    }

    // No query: filter-only browse.
    let query = supabase
      .from("posts")
      .select("id, slug, title, excerpt, cover_url, published_at, category, kind")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(30);
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.kind) query = query.eq("kind", filters.kind);
    if (postIdsByTag) query = query.in("id", postIdsByTag);
    const { data } = await query;
    return ((data ?? []) as unknown) as Post[];
  } catch {
    return [];
  }
}

async function fetchTagFacets(): Promise<{ slug: string; label: string }[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tags")
      .select("slug, label")
      .order("label")
      .limit(20);
    return data ?? [];
  } catch {
    return [];
  }
}

function chipHref(
  base: { q: string; category?: string; kind?: string; tag?: string },
  override: { category?: string | null; kind?: string | null; tag?: string | null },
) {
  const params = new URLSearchParams();
  if (base.q) params.set("q", base.q);
  const cat = override.category === null ? undefined : override.category ?? base.category;
  const kind = override.kind === null ? undefined : override.kind ?? base.kind;
  const tag = override.tag === null ? undefined : override.tag ?? base.tag;
  if (cat) params.set("category", cat);
  if (kind) params.set("kind", kind);
  if (tag) params.set("tag", tag);
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; kind?: string; tag?: string }>;
}) {
  const { q = "", category, kind, tag } = await searchParams;
  const [results, tagFacets] = await Promise.all([
    searchPosts(q, { category, kind, tag }),
    fetchTagFacets(),
  ]);
  const filterActive = !!(category || kind || tag);
  const base = { q, category, kind, tag };

  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <h1 className="text-white text-[14px] font-bold">
            نتائج البحث {q && `عن "${q}"`}
          </h1>
        </header>

        <div className="p-4 border-b border-kooora-border/50 space-y-2 text-[12px]">
          <FacetRow
            label="التصنيف"
            options={Object.entries(CATEGORY_LABEL).map(([slug, label]) => ({
              value: slug,
              label,
            }))}
            currentValue={category}
            hrefFor={(v) =>
              chipHref(base, { category: v === category ? null : v })
            }
          />
          <FacetRow
            label="النوع"
            options={Object.entries(KIND_LABEL).map(([k, label]) => ({
              value: k,
              label,
            }))}
            currentValue={kind}
            hrefFor={(v) => chipHref(base, { kind: v === kind ? null : v })}
          />
          {tagFacets.length > 0 && (
            <FacetRow
              label="وسم"
              options={tagFacets.map((t) => ({ value: t.slug, label: t.label }))}
              currentValue={tag}
              hrefFor={(v) => chipHref(base, { tag: v === tag ? null : v })}
            />
          )}
          {filterActive && (
            <Link
              href={chipHref(
                { q },
                { category: null, kind: null, tag: null },
              )}
              className="inline-block text-kooora-goldDark hover:underline"
            >
              مسح الفلاتر
            </Link>
          )}
        </div>

        <div className="p-4 text-[13px] text-kooora-dark min-h-[300px]">
          {!q && !filterActive && <p>اكتب كلمة أو اختر فلتراً.</p>}
          {(q || filterActive) && results.length === 0 && (
            <p>لا توجد نتائج.</p>
          )}
          <ul className="divide-y divide-kooora-border/40">
            {results.map((p) => (
              <li key={p.id} className="py-3">
                <Link
                  href={`/news/${p.slug}`}
                  className="font-bold text-kooora-dark hover:text-kooora-goldDark"
                >
                  {p.title}
                </Link>
                {p.excerpt && (
                  <p className="text-kooora-dark/80 mt-1 leading-6">{p.excerpt}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}

function FacetRow({
  label,
  options,
  currentValue,
  hrefFor,
}: {
  label: string;
  options: { value: string; label: string }[];
  currentValue: string | undefined;
  hrefFor: (v: string) => string;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-bold w-14 inline-block">{label}:</span>
      {options.map((o) => {
        const active = o.value === currentValue;
        return (
          <Link
            key={o.value}
            href={hrefFor(o.value)}
            className={`px-2 py-0.5 border rounded ${
              active
                ? "bg-kooora-gold text-kooora-dark border-kooora-gold font-bold"
                : "border-kooora-border/60 hover:border-kooora-gold"
            }`}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}
