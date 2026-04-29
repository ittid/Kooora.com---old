import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import { deleteThreadAction } from "@/app/forums/actions";
import { togglePinAction, toggleLockAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  created_at: string;
  last_activity_at: string;
  author: { display_name: string | null } | null;
};

async function getThreads(): Promise<Row[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("threads")
      .select(`
        id, title, is_pinned, is_locked, reply_count, created_at, last_activity_at,
        author:author_id (display_name)
      `)
      .order("last_activity_at", { ascending: false })
      .limit(100);
    return ((data ?? []) as unknown) as Row[];
  } catch {
    return null;
  }
}

export default async function ThreadsAdminPage() {
  const threads = await getThreads();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">إدارة المنتدى</h1>
      {threads === null && <SetupNotice />}
      {threads && (
        <div className="bg-white border border-kooora-border/60">
          <table className="w-full text-sm">
            <thead className="bg-kooora-dark text-white">
              <tr>
                <th className="text-start px-3 py-2">العنوان</th>
                <th className="text-start px-3 py-2 w-32">الكاتب</th>
                <th className="text-start px-3 py-2 w-20">الردود</th>
                <th className="text-start px-3 py-2 w-32">آخر نشاط</th>
                <th className="px-3 py-2 w-44"></th>
              </tr>
            </thead>
            <tbody>
              {threads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-kooora-dark/70">
                    لا توجد مواضيع.
                  </td>
                </tr>
              )}
              {threads.map((t) => (
                <tr key={t.id} className="border-t border-kooora-border/50">
                  <td className="px-3 py-2">
                    <Link
                      href={`/forums/${t.id}`}
                      className="font-bold hover:text-kooora-goldDark"
                      target="_blank"
                    >
                      {t.is_pinned && "📌 "}
                      {t.is_locked && "🔒 "}
                      {t.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{t.author?.display_name ?? "—"}</td>
                  <td className="px-3 py-2">{t.reply_count}</td>
                  <td className="px-3 py-2 text-[12px] text-kooora-muted">
                    {new Date(t.last_activity_at).toLocaleString("ar-EG", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-3 py-2 flex gap-2 justify-end text-xs">
                    <form action={togglePinAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="is_pinned" value={String(t.is_pinned)} />
                      <button className="hover:underline">
                        {t.is_pinned ? "إلغاء التثبيت" : "تثبيت"}
                      </button>
                    </form>
                    <form action={toggleLockAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="is_locked" value={String(t.is_locked)} />
                      <button className="hover:underline">
                        {t.is_locked ? "فتح" : "إغلاق"}
                      </button>
                    </form>
                    <form action={deleteThreadAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <button className="text-red-700 hover:underline">حذف</button>
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
