import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import { deleteMatchAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  kickoff_at: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  league: { name_ar: string } | null;
  home: { name_ar: string } | null;
  away: { name_ar: string } | null;
};

const STATUS_LABEL: Record<string, string> = {
  scheduled: "لم تبدأ",
  live: "مباشر",
  finished: "انتهت",
  postponed: "مؤجلة",
  cancelled: "ملغية",
};

async function getMatches(): Promise<Row[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("matches")
      .select(`
        id, kickoff_at, status, home_score, away_score,
        league:league_id (name_ar),
        home:home_team_id (name_ar),
        away:away_team_id (name_ar)
      `)
      .order("kickoff_at", { ascending: false })
      .limit(200);
    return ((data ?? []) as unknown) as Row[];
  } catch {
    return null;
  }
}

export default async function MatchesAdminPage() {
  const matches = await getMatches();

  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold">المباريات</h1>
        <div className="flex-1" />
        <Link
          href="/admin/matches/new"
          className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold flex items-center"
        >
          + مباراة جديدة
        </Link>
      </div>

      {matches === null && <SetupNotice />}

      {matches && (
        <div className="bg-white border border-kooora-border/60">
          <table className="w-full text-sm">
            <thead className="bg-kooora-dark text-white">
              <tr>
                <th className="text-start px-3 py-2 w-40">الموعد</th>
                <th className="text-start px-3 py-2">المضيف</th>
                <th className="text-start px-3 py-2 w-24">النتيجة</th>
                <th className="text-start px-3 py-2">الضيف</th>
                <th className="text-start px-3 py-2 w-32">المسابقة</th>
                <th className="text-start px-3 py-2 w-24">الحالة</th>
                <th className="px-3 py-2 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {matches.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-kooora-dark/70">
                    لا توجد مباريات.
                  </td>
                </tr>
              )}
              {matches.map((m) => (
                <tr key={m.id} className="border-t border-kooora-border/50">
                  <td className="px-3 py-2 text-kooora-muted">
                    {new Date(m.kickoff_at).toLocaleString("ar-EG", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-3 py-2 font-bold">
                    <Link
                      href={`/admin/matches/${m.id}`}
                      className="hover:text-kooora-goldDark"
                    >
                      {m.home?.name_ar ?? "—"}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-center" dir="ltr">
                    {m.home_score !== null && m.away_score !== null
                      ? `${m.home_score} - ${m.away_score}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2 font-bold">{m.away?.name_ar ?? "—"}</td>
                  <td className="px-3 py-2">{m.league?.name_ar ?? "—"}</td>
                  <td className="px-3 py-2">{STATUS_LABEL[m.status] ?? m.status}</td>
                  <td className="px-3 py-2 text-end">
                    <form action={deleteMatchAction} className="inline">
                      <input type="hidden" name="id" value={m.id} />
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
