import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import { deleteTeamAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  name_ar: string;
  logo_url: string | null;
  is_top: boolean;
  sort_order: number;
  country: { name_ar: string } | null;
};

async function getTeams(): Promise<Row[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("teams")
      .select("id, slug, name_ar, logo_url, is_top, sort_order, country:country_id (name_ar)")
      .order("sort_order");
    return ((data ?? []) as unknown) as Row[];
  } catch {
    return null;
  }
}

export default async function TeamsAdminPage() {
  const teams = await getTeams();

  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold">الفرق</h1>
        <div className="flex-1" />
        <Link
          href="/admin/teams/new"
          className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold flex items-center"
        >
          + فريق جديد
        </Link>
      </div>

      {teams === null && <SetupNotice />}

      {teams && (
        <div className="bg-white border border-kooora-border/60">
          <table className="w-full text-sm">
            <thead className="bg-kooora-dark text-white">
              <tr>
                <th className="text-start px-3 py-2 w-12"></th>
                <th className="text-start px-3 py-2">الاسم</th>
                <th className="text-start px-3 py-2 w-32">slug</th>
                <th className="text-start px-3 py-2 w-32">البلد</th>
                <th className="text-start px-3 py-2 w-20">الترتيب</th>
                <th className="text-start px-3 py-2 w-20">الأهم</th>
                <th className="px-3 py-2 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-kooora-dark/70">
                    لا توجد فرق بعد.
                  </td>
                </tr>
              )}
              {teams.map((t) => (
                <tr key={t.id} className="border-t border-kooora-border/50">
                  <td className="px-3 py-2">
                    {t.logo_url && (
                      <Image
                        src={t.logo_url}
                        alt=""
                        width={24}
                        height={24}
                        unoptimized
                      />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/admin/teams/${t.id}`} className="font-bold hover:text-kooora-goldDark">
                      {t.name_ar}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-kooora-muted">{t.slug}</td>
                  <td className="px-3 py-2">{t.country?.name_ar ?? "—"}</td>
                  <td className="px-3 py-2">{t.sort_order}</td>
                  <td className="px-3 py-2">
                    {t.is_top ? <span className="text-green-700">✓</span> : "—"}
                  </td>
                  <td className="px-3 py-2 text-end">
                    <form action={deleteTeamAction} className="inline">
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
