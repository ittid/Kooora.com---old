import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import { deletePlayerAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  name_ar: string;
  position: string | null;
  photo_url: string | null;
  team: { name_ar: string } | null;
};

async function getPlayers(): Promise<Row[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("players")
      .select("id, slug, name_ar, position, photo_url, team:team_id (name_ar)")
      .order("name_ar");
    return ((data ?? []) as unknown) as Row[];
  } catch {
    return null;
  }
}

export default async function PlayersAdminPage() {
  const players = await getPlayers();
  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold">اللاعبون</h1>
        <div className="flex-1" />
        <Link
          href="/admin/players/new"
          className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold flex items-center"
        >
          + لاعب جديد
        </Link>
      </div>

      {players === null && <SetupNotice />}

      {players && (
        <div className="bg-white border border-kooora-border/60">
          <table className="w-full text-sm">
            <thead className="bg-kooora-dark text-white">
              <tr>
                <th className="text-start px-3 py-2 w-12"></th>
                <th className="text-start px-3 py-2">الاسم</th>
                <th className="text-start px-3 py-2 w-40">الفريق</th>
                <th className="text-start px-3 py-2 w-32">المركز</th>
                <th className="px-3 py-2 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-kooora-dark/70">
                    لا يوجد لاعبون بعد.
                  </td>
                </tr>
              )}
              {players.map((p) => (
                <tr key={p.id} className="border-t border-kooora-border/50">
                  <td className="px-3 py-2">
                    {p.photo_url ? (
                      <Image
                        src={p.photo_url}
                        alt=""
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-[28px] h-[28px] rounded-full bg-kooora-border/40" />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/players/${p.id}`}
                      className="font-bold hover:text-kooora-goldDark"
                    >
                      {p.name_ar}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{p.team?.name_ar ?? "—"}</td>
                  <td className="px-3 py-2">{p.position ?? "—"}</td>
                  <td className="px-3 py-2 text-end">
                    <form action={deletePlayerAction} className="inline">
                      <input type="hidden" name="id" value={p.id} />
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
