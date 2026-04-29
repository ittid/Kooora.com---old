import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import { createClient } from "@/lib/supabase/server";
import { createReplyAction } from "../actions";

export const dynamic = "force-dynamic";

type Author = { id: string; display_name: string | null; avatar_url: string | null } | null;

type Thread = {
  id: string;
  title: string;
  body: string;
  is_locked: boolean;
  is_pinned: boolean;
  created_at: string;
  reply_count: number;
  author: Author;
};

type Reply = {
  id: string;
  body: string;
  created_at: string;
  author: Author;
};

async function fetchThread(id: string): Promise<Thread | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("threads")
      .select(`
        id, title, body, is_locked, is_pinned, created_at, reply_count,
        author:author_id (id, display_name, avatar_url)
      `)
      .eq("id", id)
      .maybeSingle();
    return data as unknown as Thread | null;
  } catch {
    return null;
  }
}

async function fetchReplies(threadId: string): Promise<Reply[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("thread_replies")
      .select(`
        id, body, created_at,
        author:author_id (id, display_name, avatar_url)
      `)
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .limit(200);
    return ((data ?? []) as unknown) as Reply[];
  } catch {
    return [];
  }
}

async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await fetchThread(id);
  return { title: t ? `${t.title} - كووورة` : "موضوع - كووورة" };
}

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const [thread, replies, user] = await Promise.all([
    fetchThread(id),
    fetchReplies(id),
    getUser(),
  ]);
  if (!thread) notFound();

  return (
    <SiteShell>
      <article className="bg-kooora-card border border-kooora-border/40 mb-3">
        <header className="bg-kooora-dark h-[34px] flex items-center px-3 border-b-2 border-kooora-gold">
          <Link href="/forums" className="text-kooora-gold text-[13px] hover:underline">
            ← المنتديات
          </Link>
        </header>

        <div className="p-5 border-b border-kooora-border/50">
          <h1 className="text-[20px] font-bold text-kooora-dark mb-2">{thread.title}</h1>
          <div className="flex items-center gap-3 text-[12px] text-kooora-muted mb-3">
            {thread.author && (
              <Link
                href={`/authors/${thread.author.id}`}
                className="font-bold hover:text-kooora-goldDark"
              >
                {thread.author.display_name ?? "زائر"}
              </Link>
            )}
            <span>
              {new Date(thread.created_at).toLocaleString("ar-EG", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
          <p className="text-[14px] leading-loose whitespace-pre-line">{thread.body}</p>
        </div>

        <ul className="divide-y divide-kooora-border/40">
          {replies.map((r) => (
            <li key={r.id} className="p-4">
              <div className="flex items-center gap-3 text-[12px] text-kooora-muted mb-2">
                {r.author && (
                  <Link
                    href={`/authors/${r.author.id}`}
                    className="font-bold hover:text-kooora-goldDark"
                  >
                    {r.author.display_name ?? "زائر"}
                  </Link>
                )}
                <span>
                  {new Date(r.created_at).toLocaleString("ar-EG", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed whitespace-pre-line">{r.body}</p>
            </li>
          ))}
          {replies.length === 0 && (
            <li className="p-4 text-[12px] text-kooora-muted text-center">
              لا توجد ردود بعد.
            </li>
          )}
        </ul>

        <div className="p-4 bg-[#f4f4f4]">
          {thread.is_locked ? (
            <p className="text-[12px] text-kooora-muted">الموضوع مغلق.</p>
          ) : !user ? (
            <p className="text-[13px] text-kooora-muted">
              <Link href={`/login?next=/forums/${id}`} className="text-kooora-goldDark hover:underline">
                سجل دخول
              </Link>{" "}
              للرد.
            </p>
          ) : (
            <form action={createReplyAction} className="space-y-2 text-[13px]">
              <input type="hidden" name="thread_id" value={id} />
              <textarea
                name="body"
                placeholder="اكتب ردك..."
                rows={3}
                required
                className="w-full px-2 py-1 border border-kooora-border outline-none focus:border-kooora-gold"
              />
              {error && (
                <p className="text-red-700 bg-red-50 border border-red-200 px-2 py-1">{error}</p>
              )}
              <button className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold">
                إرسال الرد
              </button>
            </form>
          )}
        </div>
      </article>
    </SiteShell>
  );
}
