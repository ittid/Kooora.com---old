import SidebarPanel from "../shared/SidebarPanel";
import { fetchActivePoll } from "@/lib/data-source";
import PollForm from "./PollForm";

export default async function Poll() {
  const poll = await fetchActivePoll();

  // Fallback content when there's no poll yet (or Supabase isn't set up).
  const question = poll?.question ?? "من سيذهب للنهائي العراق أم اليابان؟";
  const options = poll?.poll_options ?? [
    { id: "fallback-iraq",  label: "العراق",  votes: 0, sort_order: 0 },
    { id: "fallback-japan", label: "اليابان", votes: 0, sort_order: 1 },
  ];

  return (
    <SidebarPanel title="استفتاء">
      <div className="relative p-4 bg-kooora-card" style={{ minHeight: 110 }}>
        <div
          aria-hidden
          className="absolute top-2 left-2 text-[110px] leading-none font-black select-none pointer-events-none"
          style={{ color: "#f1e6e6" }}
        >
          ؟
        </div>
        <p className="relative text-[13px] text-kooora-dark leading-snug text-end">
          {question}
        </p>
      </div>

      <PollForm pollId={poll?.id ?? null} options={options} />

      <div className="bg-[#f2f2f2] border-t border-kooora-border/50 px-3 py-1.5">
        <a
          href="#"
          className="text-[11px] text-kooora-muted hover:text-kooora-goldDark inline-flex items-center gap-1"
        >
          <span>◀</span>
          <span>المزيد</span>
        </a>
      </div>
    </SidebarPanel>
  );
}
