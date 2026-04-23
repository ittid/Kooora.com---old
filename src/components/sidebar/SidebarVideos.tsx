import Image from "next/image";
import Panel from "../shared/Panel";
import { sidebarVideos } from "@/lib/data";

export default function SidebarVideos() {
  const [featured, ...others] = sidebarVideos;
  return (
    <Panel title="فيديوهات" tabs={[{ label: "الأحدث", active: true }]}>
      <div className="relative mb-2">
        <Image
          src={featured.image}
          alt={featured.title}
          width={260}
          height={150}
          className="w-full h-auto rounded"
          unoptimized
        />
        <button className="absolute inset-0 flex items-center justify-center">
          <span className="w-10 h-10 rounded-full bg-kooora-gold/90 text-kooora-dark flex items-center justify-center shadow">
            <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor">
              <path d="M2 1.5v7l6-3.5z" />
            </svg>
          </span>
        </button>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] p-2 leading-tight">
          {featured.title}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {others.map((v) => (
          <div key={v.id} className="relative">
            <Image
              src={v.image}
              alt={v.title}
              width={100}
              height={70}
              className="w-full h-auto rounded"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/20 rounded" />
          </div>
        ))}
      </div>
    </Panel>
  );
}
