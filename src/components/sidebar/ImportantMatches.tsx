import Image from "next/image";
import SidebarPanel from "../shared/SidebarPanel";

type Match = {
  id: string;
  home: { name: string; logo: string };
  away: { name: string; logo: string };
  homeScore: number;
  awayScore: number;
  status: string;
};

const matches: Match[] = [
  {
    id: "1",
    home: { name: "مانشستر سيتي", logo: "https://picsum.photos/seed/mcity/50" },
    away: { name: "لايبزيج", logo: "https://picsum.photos/seed/rbl/50" },
    homeScore: 7,
    awayScore: 0,
    status: "انتهت",
  },
  {
    id: "2",
    home: { name: "بورتو", logo: "https://picsum.photos/seed/porto/50" },
    away: { name: "انتر ميلان", logo: "https://picsum.photos/seed/inter/50" },
    homeScore: 0,
    awayScore: 0,
    status: "انتهت",
  },
  {
    id: "3",
    home: { name: "النصر", logo: "https://picsum.photos/seed/nassr/50" },
    away: { name: "أبها", logo: "https://picsum.photos/seed/abha/50" },
    homeScore: 3,
    awayScore: 1,
    status: "انتهت",
  },
  {
    id: "4",
    home: { name: "الوحدة", logo: "https://picsum.photos/seed/wehda/50" },
    away: { name: "الباطن", logo: "https://picsum.photos/seed/baten/50" },
    homeScore: 2,
    awayScore: 1,
    status: "انتهت",
  },
  {
    id: "5",
    home: { name: "الهلال", logo: "https://picsum.photos/seed/hilal/50" },
    away: { name: "الفتح", logo: "https://picsum.photos/seed/fath/50" },
    homeScore: 3,
    awayScore: 1,
    status: "انتهت",
  },
  {
    id: "6",
    home: { name: "الوداد الرياضي", logo: "https://picsum.photos/seed/wydad/50" },
    away: { name: "اتحاد طنجة", logo: "https://picsum.photos/seed/ittihadtanja/50" },
    homeScore: 3,
    awayScore: 0,
    status: "انتهت",
  },
];

function TeamCol({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <Image
        src={logo}
        alt=""
        width={50}
        height={50}
        className="w-[50px] h-[50px] object-contain"
        unoptimized
      />
      <span className="text-[11.5px] text-kooora-dark text-center truncate w-full">
        {name}
      </span>
    </div>
  );
}

export default function ImportantMatches() {
  return (
    <SidebarPanel title="أهم المباريات">
      <ul className="divide-y divide-kooora-border/50">
        {matches.map((m) => (
          <li
            key={m.id}
            className="py-3 px-2 grid grid-cols-3 items-center gap-1"
          >
            {/* Home team (right side in RTL, first in source) */}
            <TeamCol name={m.home.name} logo={m.home.logo} />

            {/* Score box (center) */}
            <div className="flex flex-col items-center">
              <div
                className="px-3 py-0.5 text-kooora-dark font-bold text-[14px]"
                style={{
                  background: "#fff4d0",
                  border: "1px solid #d9b94a",
                  minWidth: "56px",
                  textAlign: "center",
                }}
                dir="ltr"
              >
                {m.homeScore} : {m.awayScore}
              </div>
              <div className="text-[10px] text-kooora-muted mt-0.5">{m.status}</div>
            </div>

            {/* Away team (left in RTL) */}
            <TeamCol name={m.away.name} logo={m.away.logo} />
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
