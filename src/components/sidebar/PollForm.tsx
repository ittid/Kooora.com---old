"use client";

import { useState, useTransition } from "react";
import { votePollAction } from "./poll-actions";

type Option = { id: string; label: string; votes: number };

export default function PollForm({
  pollId,
  options,
}: {
  pollId: string | null;
  options: Option[];
}) {
  const [choice, setChoice] = useState<string>(options[0]?.id ?? "");
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalVotes = options.reduce((s, o) => s + o.votes, 0);

  async function submit() {
    if (!pollId) {
      setError("التصويت غير مفعل في الوضع التجريبي");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await votePollAction(pollId, choice);
      if (result?.error) setError(result.error);
      else setVoted(true);
    });
  }

  return (
    <div className="bg-[#f2f2f2] p-3">
      {voted ? (
        <ul className="space-y-2 text-[13px]">
          {options.map((o) => {
            const pct =
              totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0;
            return (
              <li key={o.id}>
                <div className="flex justify-between text-[12px] mb-0.5">
                  <span>{o.label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 bg-white border border-kooora-border/60 overflow-hidden">
                  <div
                    className="h-full bg-kooora-gold"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
          <li className="text-[11px] text-kooora-muted text-end pt-1">
            شكرا على تصويتك
          </li>
        </ul>
      ) : (
        <form
          action={submit}
          className="space-y-2 text-[13px]"
        >
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 cursor-pointer justify-end"
            >
              <span>{opt.label}</span>
              <input
                type="radio"
                name="poll"
                value={opt.id}
                checked={choice === opt.id}
                onChange={(e) => setChoice(e.target.value)}
                className="kooora-radio"
              />
            </label>
          ))}

          {error && (
            <p className="text-red-700 text-[11px] text-end">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-kooora-dark text-white font-bold py-1.5 text-[14px] mt-3 disabled:opacity-60"
          >
            {isPending ? "..." : "تصويت"}
          </button>
        </form>
      )}
    </div>
  );
}
