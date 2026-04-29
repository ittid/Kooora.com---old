import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "لاعبون - كووورة" };
export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  name_ar: string;
  position: string | null;
  photo_url: string | null;
  team: { name_ar: string; slug: string; logo_url: string | null } | null;
};

async function getPlayers(): Promise<Row[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("players")
      .select(`
        id, slug, name_ar, position, photo_url,
        team:team_id (name_ar, slug, logo_url)
      `)
      .order("name_ar")
      .limit(100);
    return (data ?? []) as unknown as Row[];
  } catch {
    return [];
  }
}

export default async function PlayersPage() {
  const players = await getPlayers();
  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <h1 className="text-white text-[14px] font-bold">اللاعبون</h1>
        </header>
        <div className="p-4">
          {players.length === 0 ? (
            <p className="text-[13px] text-kooora-dark/80">
              لا توجد بيانات لاعبين بعد.
            </p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="bg-white border border-kooora-border/60 p-3 flex items-center gap-3"
                >
                  {p.photo_url ? (
                    <Image
                      src={p.photo_url}
                      alt={p.name_ar}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-[48px] h-[48px] rounded-full bg-kooora-border/40" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/players/${p.slug}`}
                      className="font-bold text-[13px] hover:text-kooora-goldDark line-clamp-1"
                    >
                      {p.name_ar}
                    </Link>
                    {p.team && (
                      <Link
                        href={`/teams/${p.team.slug}`}
                        className="text-[11px] text-kooora-muted hover:text-kooora-goldDark line-clamp-1"
                      >
                        {p.team.name_ar}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
