import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import Flag from "@/components/shared/Flag";
import NewsList from "@/components/main/NewsList";
import { createClient } from "@/lib/supabase/server";
import { fetchRelatedPostsForPlayer } from "@/lib/data-source";

export const dynamic = "force-dynamic";

type Player = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string | null;
  position: string | null;
  photo_url: string | null;
  birth_date: string | null;
  team: { name_ar: string; slug: string; logo_url: string | null } | null;
  country: { code: string; name_ar: string } | null;
};

async function fetchPlayerBySlug(slug: string): Promise<Player | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("players")
      .select(`
        id, slug, name_ar, name_en, position, photo_url, birth_date,
        team:team_id (name_ar, slug, logo_url),
        country:country_id (code, name_ar)
      `)
      .eq("slug", slug)
      .maybeSingle();
    return data as unknown as Player | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await fetchPlayerBySlug(slug);
  return { title: p ? `${p.name_ar} - كووورة` : "لاعب - كووورة" };
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = await fetchPlayerBySlug(slug);

  if (!player) {
    return (
      <SiteShell>
        <section className="bg-kooora-card border border-kooora-border/40 mb-3">
          <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
            <Link href="/players" className="text-kooora-gold text-[13px] hover:underline">
              ← اللاعبون
            </Link>
          </header>
          <div className="p-6 text-[13px]">
            لم يتم العثور على بيانات لهذا اللاعب ({slug}).
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <Link href="/players" className="text-kooora-gold text-[13px] hover:underline">
            ← اللاعبون
          </Link>
        </header>
        <div className="p-6 flex items-center gap-4">
          {player.photo_url ? (
            <Image
              src={player.photo_url}
              alt={player.name_ar}
              width={96}
              height={96}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-[96px] h-[96px] rounded-full bg-kooora-border/40" />
          )}
          <div>
            <h1 className="text-[22px] font-bold text-kooora-dark mb-1">
              {player.name_ar}
            </h1>
            {player.name_en && (
              <p className="text-[13px] text-kooora-muted">{player.name_en}</p>
            )}
            <dl className="text-[13px] grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 mt-3">
              {player.team && (
                <>
                  <dt className="text-kooora-muted">الفريق</dt>
                  <dd>
                    <Link
                      href={`/teams/${player.team.slug}`}
                      className="hover:text-kooora-goldDark inline-flex items-center gap-2"
                    >
                      {player.team.logo_url && (
                        <Image
                          src={player.team.logo_url}
                          alt=""
                          width={20}
                          height={20}
                          unoptimized
                        />
                      )}
                      <span>{player.team.name_ar}</span>
                    </Link>
                  </dd>
                </>
              )}
              {player.country && (
                <>
                  <dt className="text-kooora-muted">الجنسية</dt>
                  <dd className="inline-flex items-center gap-2">
                    <Flag code={player.country.code} />
                    <span>{player.country.name_ar}</span>
                  </dd>
                </>
              )}
              {player.position && (
                <>
                  <dt className="text-kooora-muted">المركز</dt>
                  <dd>{player.position}</dd>
                </>
              )}
              {player.birth_date && (
                <>
                  <dt className="text-kooora-muted">تاريخ الميلاد</dt>
                  <dd>
                    {new Date(player.birth_date).toLocaleDateString("ar-EG", {
                      dateStyle: "long",
                    })}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </section>

      <RelatedPlayerPosts slug={slug} />
    </SiteShell>
  );
}

async function RelatedPlayerPosts({ slug }: { slug: string }) {
  const posts = await fetchRelatedPostsForPlayer(slug, 6);
  if (posts.length === 0) return null;
  return <NewsList items={posts} title="أخبار ذات صلة" moreHref={`/players/${slug}`} />;
}
