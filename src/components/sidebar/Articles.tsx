import Image from "next/image";
import Panel from "../shared/Panel";
import { articles } from "@/lib/data";

export default function Articles() {
  return (
    <Panel title="مقالات">
      <ul className="divide-y divide-kooora-border/40">
        {articles.map((a) => (
          <li key={a.id} className="py-2 flex gap-2 items-center">
            <Image
              src={a.authorAvatar}
              alt={a.author}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              unoptimized
            />
            <div className="flex-1 min-w-0">
              <a
                href="#"
                className="block text-[12px] font-semibold text-kooora-dark hover:text-kooora-goldDark leading-tight"
              >
                {a.title}
              </a>
              <div className="text-[11px] text-kooora-muted flex items-center gap-1 mt-0.5">
                <span>{a.country}</span>
                <span>{a.author}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
