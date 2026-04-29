import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "البطولات - كووورة" };
export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  name_ar: string;
  logo_url: string | null;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

async function getActiveTournaments(): Promise<Row[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tournaments")
      .select("id, slug, name_ar, logo_url, description, starts_at, ends_at")
      .eq("is_active", true)
      .order("sort_order");
    return (data ?? []) as Row[];
  } catch {
    return [];
  }
}

export default async function TournamentsPage() {
  const tournaments = await getActiveTournaments();
  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <h1 className="text-white text-[14px] font-bold">البطولات الحالية</h1>
        </header>
        <div className="p-4">
          {tournaments.length === 0 ? (
            <p className="text-[13px] text-kooora-dark/80">
              لا توجد بطولات نشطة حالياً.
            </p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {tournaments.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tournaments/${t.slug}`}
                    className="block bg-white border border-kooora-border/60 p-3 hover:border-kooora-gold"
                  >
                    {t.logo_url ? (
                      <div className="relative aspect-square mb-2">
                        <Image
                          src={t.logo_url}
                          alt={t.name_ar}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="aspect-square mb-2 bg-kooora-border/30" />
                    )}
                    <div className="text-[13px] font-bold text-kooora-dark text-center">
                      {t.name_ar}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
