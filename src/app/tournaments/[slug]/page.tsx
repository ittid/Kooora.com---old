import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string | null;
  logo_url: string | null;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

async function fetchTournament(slug: string): Promise<Row | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tournaments")
      .select("id, slug, name_ar, name_en, logo_url, description, starts_at, ends_at")
      .eq("slug", slug)
      .maybeSingle();
    return data as Row | null;
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
  const t = await fetchTournament(slug);
  return { title: t ? `${t.name_ar} - كووورة` : "بطولة - كووورة" };
}

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await fetchTournament(slug);
  if (!t) notFound();

  return (
    <SiteShell>
      <article className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <Link href="/tournaments" className="text-kooora-gold text-[13px] hover:underline">
            ← البطولات
          </Link>
        </header>
        <div className="p-6 flex items-center gap-4 border-b border-kooora-border/50">
          {t.logo_url && (
            <Image src={t.logo_url} alt={t.name_ar} width={96} height={96} unoptimized />
          )}
          <div>
            <h1 className="text-[22px] font-bold text-kooora-dark mb-1">{t.name_ar}</h1>
            {t.name_en && <p className="text-[13px] text-kooora-muted">{t.name_en}</p>}
            {(t.starts_at || t.ends_at) && (
              <p className="text-[13px] mt-2 text-kooora-muted">
                {t.starts_at ?? "—"} → {t.ends_at ?? "—"}
              </p>
            )}
          </div>
        </div>
        {t.description && (
          <div className="p-6 text-[14px] text-kooora-dark leading-loose whitespace-pre-line">
            {t.description}
          </div>
        )}
      </article>
    </SiteShell>
  );
}
