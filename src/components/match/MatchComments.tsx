"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  body: string;
  created_at: string;
  author: { display_name: string | null; avatar_url: string | null } | null;
};

export default function MatchComments({
  matchId,
  initial,
}: {
  matchId: number;
  initial: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [text, setText] = useState("");
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    supabaseRef.current = supabase;

    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));

    const channel = supabase
      .channel(`match-comments-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_comments",
          filter: `match_id=eq.${matchId}`,
        },
        async (payload) => {
          const row = payload.new as { id: string; body: string; created_at: string; author_id: string | null };
          // fetch author profile
          let author: Comment["author"] = null;
          if (row.author_id) {
            const { data } = await supabase
              .from("profiles")
              .select("display_name, avatar_url")
              .eq("id", row.author_id)
              .maybeSingle();
            author = data ?? null;
          }
          setComments((prev) =>
            prev.find((c) => c.id === row.id)
              ? prev
              : [...prev, { id: row.id, body: row.body, created_at: row.created_at, author }],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    if (!supabaseRef.current) return;
    setBusy(true);
    setError(null);
    const { data: { user } } = await supabaseRef.current.auth.getUser();
    if (!user) {
      setBusy(false);
      setAuthed(false);
      return;
    }
    const { error } = await supabaseRef.current
      .from("match_comments")
      .insert({ match_id: matchId, body, author_id: user.id });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setText("");
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold text-[15px] text-kooora-dark mb-3 border-b border-kooora-border/50 pb-1">
        التعليقات المباشرة
      </h3>

      <ul className="space-y-2 mb-4 max-h-[420px] overflow-y-auto">
        {comments.length === 0 && (
          <li className="text-[12px] text-kooora-muted">لا تعليقات بعد. كن أول المعلقين.</li>
        )}
        {comments.map((c) => (
          <li
            key={c.id}
            className="flex gap-2 items-start bg-white border border-kooora-border/50 px-3 py-2 text-[13px]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-[12px]">
                  {c.author?.display_name ?? "زائر"}
                </span>
                <span className="text-[11px] text-kooora-muted">
                  {new Date(c.created_at).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="leading-relaxed whitespace-pre-line">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>

      {authed === false ? (
        <p className="text-[12px] text-kooora-muted">
          <a href="/login" className="text-kooora-goldDark hover:underline">سجل دخول</a> للمشاركة في التعليقات.
        </p>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب تعليقك..."
            disabled={busy}
            className="flex-1 h-9 px-2 border border-kooora-border outline-none focus:border-kooora-gold text-[13px]"
          />
          <button
            type="submit"
            disabled={busy || !text.trim()}
            className="h-9 px-4 bg-kooora-gold text-kooora-dark font-bold disabled:opacity-50"
          >
            إرسال
          </button>
        </form>
      )}
      {error && <p className="text-[12px] text-red-700 mt-1">{error}</p>}
    </div>
  );
}
