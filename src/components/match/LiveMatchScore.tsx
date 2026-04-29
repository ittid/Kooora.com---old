"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "scheduled" | "live" | "finished" | "postponed" | "cancelled";

const STATUS_LABEL: Record<Status, string> = {
  scheduled: "لم تبدأ",
  live: "مباشر",
  finished: "انتهت",
  postponed: "مؤجلة",
  cancelled: "ملغية",
};

type Initial = {
  matchId: number;
  status: Status;
  homeScore: number | null;
  awayScore: number | null;
  kickoffAt: string;
};

export default function LiveMatchScore({ initial }: { initial: Initial }) {
  const [state, setState] = useState({
    status: initial.status,
    home_score: initial.homeScore,
    away_score: initial.awayScore,
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`match-${initial.matchId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${initial.matchId}`,
        },
        (payload) => {
          const row = payload.new as {
            status: Status;
            home_score: number | null;
            away_score: number | null;
          };
          setState({
            status: row.status,
            home_score: row.home_score,
            away_score: row.away_score,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initial.matchId]);

  const finished = state.status === "finished" && state.home_score !== null && state.away_score !== null;
  const live = state.status === "live";
  const kickoff = new Date(initial.kickoffAt);

  return (
    <div className="flex flex-col items-center">
      <span
        className={`text-[11px] mb-1 ${live ? "text-red-600 font-bold animate-pulse" : "text-kooora-muted"}`}
      >
        {live && "● "}
        {STATUS_LABEL[state.status]}
      </span>
      {live || finished ? (
        <div className="text-[36px] font-black text-kooora-dark" dir="ltr">
          {state.home_score ?? 0} - {state.away_score ?? 0}
        </div>
      ) : (
        <div className="text-[26px] font-bold text-kooora-dark" dir="ltr">
          {String(kickoff.getHours()).padStart(2, "0")}
          :
          {String(kickoff.getMinutes()).padStart(2, "0")}
        </div>
      )}
      <span className="text-[12px] text-kooora-muted mt-1">
        {kickoff.toLocaleDateString("ar-EG", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </span>
    </div>
  );
}
