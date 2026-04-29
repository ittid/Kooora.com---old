import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { createClient } from "@/lib/supabase/server";
import { createThreadAction } from "./actions";

export const metadata = { title: "المنتديات - كووورة" };
export const dynamic = "force-dynamic";

type Thread = {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  last_activity_at: string;
  author: { id: string; display_name: string | null } | null;
};

async function getAuth() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { user: null };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { user };
}

async function getThreads(): Promise<Thread[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("threads")
      .select(`
        id, title, body, is_pinned, is_locked, reply_count, last_activity_at,
        author:author_id (id, display_name)
      `)
      .order("is_pinned", { ascending: false })
      .order("last_activity_at", { ascending: false })
      .limit(50);
    return ((data ?? []) as unknown) as Thread[];
  } catch {
    return [];
  }
}

export default async function ForumsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [{ user }, threads] = await Promise.all([getAuth(), getThreads()]);

  return (
    <SiteShell>
      <section className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <h1 className="text-white text-[14px] font-bold">المنتديات</h1>
        </header>

        {/* New thread form */}
        <div className="p-4 border-b border-kooora-border/50">
          {!user ? (
            <p className="text-[13px] text-kooora-muted">
              <Link href="/login?next=/forums" className="text-kooora-goldDark hover:underline">
                سجل دخول
              </Link>{" "}
              لإنشاء موضوع جديد.
            </p>
          ) : (
            <form action={createThreadAction} className="space-y-2 text-[13px]">
              <input
                name="title"
                placeholder="عنوان الموضوع"
                required
                className="w-full h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold"
              />
              <textarea
                name="body"
                placeholder="محتوى الموضوع"
                rows={3}
                required
                className="w-full px-2 py-1 border border-kooora-border outline-none focus:border-kooora-gold"
              />
              {error && (
                <p className="text-red-700 bg-red-50 border border-red-200 px-2 py-1">{error}</p>
              )}
              <button className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold">
                نشر موضوع
              </button>
            </form>
          )}
        </div>

        {/* Threads list */}
        <ul className="divide-y divide-kooora-border/40">
          {threads.length === 0 && (
            <li className="p-6 text-center text-kooora-muted text-[13px]">
              لا توجد مواضيع بعد.
            </li>
          )}
          {threads.map((t) => (
            <li key={t.id} className="p-4 hover:bg-kooora-page/40">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/forums/${t.id}`}
                    className="block text-[14px] font-bold text-kooora-dark hover:text-kooora-goldDark"
                  >
                    {t.is_pinned && <span className="text-kooora-gold ml-1">📌</span>}
                    {t.title}
                  </Link>
                  <p className="text-[12px] text-kooora-muted line-clamp-2 mt-1 leading-relaxed">
                    {t.body}
                  </p>
                  <div className="text-[11px] text-kooora-muted mt-2 flex items-center gap-3">
                    <span>
                      {t.author?.display_name ?? "زائر"}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(t.last_activity_at).toLocaleString("ar-EG", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-[18px] font-black text-kooora-dark">
                    {t.reply_count}
                  </span>
                  <span className="text-[11px] text-kooora-muted">رد</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
