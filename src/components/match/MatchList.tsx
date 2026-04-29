import Image from "next/image";
import Link from "next/link";
import type { DbMatchRow } from "@/lib/data-source";

const STATUS_LABEL: Record<DbMatchRow["status"], string> = {
  scheduled: "لم تبدأ",
  live: "مباشر",
  finished: "انتهت",
  postponed: "مؤجلة",
  cancelled: "ملغية",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
  });
}

export default function MatchList({
  matches,
  emptyText = "لا توجد مباريات.",
}: {
  matches: DbMatchRow[];
  emptyText?: string;
}) {
  if (!matches.length) {
    return (
      <p className="text-[12px] text-kooora-muted text-center py-6">{emptyText}</p>
    );
  }
  return (
    <ul className="divide-y divide-kooora-border/40">
      {matches.map((m) => {
        if (!m.home || !m.away) return null;
        const finished = m.status === "finished" && m.home_score !== null && m.away_score !== null;
        const live = m.status === "live";
        return (
          <li key={m.id} className="px-2 py-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <Link
              href={`/teams/${m.home.slug}`}
              className="flex items-center gap-2 justify-end min-w-0 hover:text-kooora-goldDark"
            >
              <span className="truncate text-[13px] font-bold">{m.home.name_ar}</span>
              {m.home.logo_url && (
                <Image
                  src={m.home.logo_url}
                  alt=""
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                  unoptimized
                />
              )}
            </Link>

            <Link
              href={`/matches/${m.id}`}
              className="flex flex-col items-center justify-center px-3 py-1 bg-[#222] text-white min-w-[64px] rounded-sm hover:bg-black"
              title={STATUS_LABEL[m.status]}
            >
              {live && (
                <span className="text-[10px] text-red-400 leading-none animate-pulse">
                  ● مباشر
                </span>
              )}
              {finished ? (
                <span className="font-bold text-[14px]" dir="ltr">
                  {m.home_score} - {m.away_score}
                </span>
              ) : (
                <span className="font-bold text-[13px]" dir="ltr">
                  {formatTime(m.kickoff_at)}
                </span>
              )}
              <span className="text-[10px] text-white/60 mt-0.5">
                {formatDate(m.kickoff_at)}
              </span>
            </Link>

            <Link
              href={`/teams/${m.away.slug}`}
              className="flex items-center gap-2 min-w-0 hover:text-kooora-goldDark"
            >
              {m.away.logo_url && (
                <Image
                  src={m.away.logo_url}
                  alt=""
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                  unoptimized
                />
              )}
              <span className="truncate text-[13px] font-bold">{m.away.name_ar}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
