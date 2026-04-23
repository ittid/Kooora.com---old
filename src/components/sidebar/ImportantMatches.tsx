import Image from "next/image";
import Panel from "../shared/Panel";
import { topMatches } from "@/lib/data";

export default function ImportantMatches() {
  return (
    <Panel title="أهم المباريات">
      <ul className="divide-y divide-kooora-border/50">
        {topMatches.map((m) => (
          <li
            key={m.id}
            className="py-2 grid grid-cols-[1fr_auto_auto] items-center gap-2 text-[12px]"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <TeamRow name={m.home.name} logo={m.home.logo} />
              <TeamRow name={m.away.name} logo={m.away.logo} />
            </div>
            <div className="text-center text-kooora-muted text-[11px]">
              <div>{m.dayLabel}</div>
              <div className="font-bold text-kooora-dark">{m.time}</div>
            </div>
            <button
              aria-label="تشغيل"
              className="w-6 h-6 rounded-full bg-kooora-gold text-kooora-dark flex items-center justify-center"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M2 1.5v7l6-3.5z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function TeamRow({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Image src={logo} alt="" width={18} height={18} className="rounded-sm" unoptimized />
      <span className="truncate">{name}</span>
    </div>
  );
}
