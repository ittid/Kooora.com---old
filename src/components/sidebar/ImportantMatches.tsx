import Image from "next/image";
import Link from "next/link";
import SidebarPanel from "../shared/SidebarPanel";
import { fetchTopMatches } from "@/lib/data-source";

function TeamCol({
  name,
  logo,
  slug,
}: {
  name: string;
  logo: string;
  slug: string;
}) {
  return (
    <Link
      href={`/teams/${slug}`}
      className="flex flex-col items-center gap-1 min-w-0 group"
    >
      <Image
        src={logo}
        alt={name}
        width={44}
        height={44}
        className="w-[44px] h-[44px] object-contain"
        unoptimized
      />
      <span className="text-[11.5px] text-kooora-dark text-center truncate w-full group-hover:text-kooora-goldDark">
        {name}
      </span>
    </Link>
  );
}

function TimeBox({ time, dayLabel }: { time: string; dayLabel: string }) {
  return (
    <div className="relative flex justify-center group/tip">
      <div
        className="flex flex-col items-center justify-center bg-[#222] text-white rounded-md shadow-sm"
        style={{
          width: "70px",
          height: "48px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <span className="text-[11px] leading-none mb-1">{dayLabel}</span>
        <span
          className="font-bold leading-none inline-flex items-center gap-1"
          style={{ fontSize: "14px" }}
          dir="ltr"
        >
          <span>{time}</span>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <span
        role="tooltip"
        className="pointer-events-none absolute -top-6 right-0 translate-x-1/4 whitespace-nowrap bg-[#fff4d0] text-kooora-dark text-[11px] px-2 py-0.5 border border-[#d9b94a] rounded-sm opacity-0 group-hover/tip:opacity-100 transition-opacity"
      >
        توقيت المباراة
      </span>
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function dayLabelFromIso(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const delta = Math.round((dayStart - today) / dayMs);
  if (delta === 0) return "اليوم";
  if (delta === 1) return "غدا";
  if (delta === -1) return "أمس";
  return d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
}

export default async function ImportantMatches() {
  const matches = await fetchTopMatches(6);

  return (
    <SidebarPanel title="أهم المباريات">
      <ul className="divide-y divide-kooora-border/40">
        {matches.length === 0 && (
          <li className="py-3 px-2 text-center text-[12px] text-kooora-muted">
            لا توجد مباريات.
          </li>
        )}
        {matches.map((m) => {
          const home = m.home;
          const away = m.away;
          if (!home || !away) return null;
          const isFinished =
            m.status === "finished" && m.home_score !== null && m.away_score !== null;
          return (
            <li
              key={m.id}
              className="py-2.5 px-2 grid grid-cols-3 items-center gap-1"
            >
              <TeamCol
                name={home.name_ar}
                logo={home.logo_url ?? `https://picsum.photos/seed/${home.slug}/40`}
                slug={home.slug}
              />
              <Link href={`/matches/${m.id}`} aria-label="تفاصيل المباراة">
                <TimeBox
                  time={isFinished ? `${m.home_score} - ${m.away_score}` : formatTime(m.kickoff_at)}
                  dayLabel={dayLabelFromIso(m.kickoff_at)}
                />
              </Link>
              <TeamCol
                name={away.name_ar}
                logo={away.logo_url ?? `https://picsum.photos/seed/${away.slug}/40`}
                slug={away.slug}
              />
            </li>
          );
        })}
      </ul>
    </SidebarPanel>
  );
}
