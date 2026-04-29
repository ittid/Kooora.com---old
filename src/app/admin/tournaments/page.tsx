import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import { deleteTournamentAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  name_ar: string;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
};

async function getTournaments(): Promise<Row[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tournaments")
      .select("id, slug, name_ar, logo_url, is_active, sort_order, starts_at, ends_at")
      .order("sort_order");
    return (data ?? []) as Row[];
  } catch {
    return null;
  }
}

export default async function TournamentsAdminPage() {
  const tournaments = await getTournaments();
  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold">البطولات</h1>
        <div className="flex-1" />
        <Link
          href="/admin/tournaments/new"
          className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold flex items-center"
        >
          + بطولة جديدة
        </Link>
      </div>

      {tournaments === null && <SetupNotice />}

      {tournaments && (
        <div className="bg-white border border-kooora-border/60">
          <table className="w-full text-sm">
            <thead className="bg-kooora-dark text-white">
              <tr>
                <th className="text-start px-3 py-2 w-12"></th>
                <th className="text-start px-3 py-2">الاسم</th>
                <th className="text-start px-3 py-2 w-32">slug</th>
                <th className="text-start px-3 py-2 w-32">الفترة</th>
                <th className="text-start px-3 py-2 w-20">نشطة</th>
                <th className="px-3 py-2 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {tournaments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-kooora-dark/70">
                    لا توجد بطولات.
                  </td>
                </tr>
              )}
              {tournaments.map((t) => (
                <tr key={t.id} className="border-t border-kooora-border/50">
                  <td className="px-3 py-2">
                    {t.logo_url && (
                      <Image src={t.logo_url} alt="" width={28} height={28} unoptimized />
                    )}
                  </td>
                  <td className="px-3 py-2 font-bold">
                    <Link
                      href={`/admin/tournaments/${t.id}`}
                      className="hover:text-kooora-goldDark"
                    >
                      {t.name_ar}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-kooora-muted">{t.slug}</td>
                  <td className="px-3 py-2 text-kooora-muted text-[12px]">
                    {t.starts_at ?? "—"} → {t.ends_at ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    {t.is_active ? <span className="text-green-700">✓</span> : "—"}
                  </td>
                  <td className="px-3 py-2 text-end">
                    <form action={deleteTournamentAction} className="inline">
                      <input type="hidden" name="id" value={t.id} />
                      <button className="text-red-700 hover:underline text-xs">حذف</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
