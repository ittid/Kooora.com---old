import Panel from "../shared/Panel";
import { topLeagues } from "@/lib/data";

export default function TopLeagues() {
  return (
    <Panel title="أهم الدوريات العالمية">
      <table className="w-full text-[11px]">
        <thead className="text-kooora-muted">
          <tr>
            <th className="text-start font-normal pb-1"></th>
            <th className="text-start font-normal pb-1">الدوري الأوروبي</th>
            <th className="text-center font-normal pb-1">أبطال أوروبا</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-kooora-border/40">
          {topLeagues.map((l) => (
            <tr key={l.id}>
              <td className="py-1.5 w-5 text-[14px]">{l.flag}</td>
              <td className="py-1.5">{l.name}</td>
              <td className="py-1.5 text-center text-kooora-muted">{l.round}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
