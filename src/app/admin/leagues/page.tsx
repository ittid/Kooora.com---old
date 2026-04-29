import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import { deleteLeagueAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  name_ar: string;
  is_top: boolean;
  sort_order: number;
  country: { name_ar: string } | null;
};

async function getLeagues(): Promise<Row[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("leagues")
      .select("id, slug, name_ar, is_top, sort_order, country:country_id (name_ar)")
      .order("sort_order");
    return ((data ?? []) as unknown) as Row[];
  } catch {
    return null;
  }
}

export default async function LeaguesAdminPage() {
  const leagues = await getLeagues();

  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold">المسابقات</h1>
        <div className="flex-1" />
        <Link
          href="/admin/leagues/new"
          className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold flex items-center"
        >
          + مسابقة جديدة
        </Link>
      </div>

      {leagues === null && <SetupNotice />}

      {leagues && (
        <div className="bg-white border border-kooora-border/60">
          <table className="w-full text-sm">
            <thead className="bg-kooora-dark text-white">
              <tr>
                <th className="text-start px-3 py-2">الاسم</th>
                <th className="text-start px-3 py-2 w-32">slug</th>
                <th className="text-start px-3 py-2 w-32">البلد</th>
                <th className="text-start px-3 py-2 w-20">الترتيب</th>
                <th className="text-start px-3 py-2 w-20">الأهم</th>
                <th className="px-3 py-2 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {leagues.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-kooora-dark/70">
                    لا توجد مسابقات بعد.
                  </td>
                </tr>
              )}
              {leagues.map((l) => (
                <tr key={l.id} className="border-t border-kooora-border/50">
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/leagues/${l.id}`}
                      className="font-bold hover:text-kooora-goldDark"
                    >
                      {l.name_ar}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-kooora-muted">{l.slug}</td>
                  <td className="px-3 py-2">{l.country?.name_ar ?? "—"}</td>
                  <td className="px-3 py-2">{l.sort_order}</td>
                  <td className="px-3 py-2">
                    {l.is_top ? <span className="text-green-700">✓</span> : "—"}
                  </td>
                  <td className="px-3 py-2 text-end">
                    <form action={deleteLeagueAction} className="inline">
                      <input type="hidden" name="id" value={l.id} />
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
