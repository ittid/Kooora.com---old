import Panel from "../shared/Panel";
import { topClubs } from "@/lib/data";

export default function TopClubs() {
  return (
    <Panel title="أهم الأندية العالمية">
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
        {topClubs.map((c) => (
          <li key={c.id} className="flex items-center gap-1.5 py-0.5">
            <span className="text-[12px]">{c.flag}</span>
            <a href="#" className="text-kooora-dark hover:text-kooora-goldDark truncate">
              {c.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-2 text-center">
        <a
          href="#"
          className="inline-block text-[11px] bg-kooora-gold text-kooora-dark px-3 py-1 font-semibold rounded"
        >
          StriveME
        </a>
      </div>
    </Panel>
  );
}
