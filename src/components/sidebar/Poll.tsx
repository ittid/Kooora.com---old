"use client";

import { useState } from "react";
import SidebarPanel from "../shared/SidebarPanel";

export default function Poll() {
  const [choice, setChoice] = useState<string>("اليابان");

  return (
    <SidebarPanel title="استفتاء">
      {/* Top: question + faded ? */}
      <div className="relative p-4 bg-kooora-card" style={{ minHeight: 110 }}>
        <div
          aria-hidden
          className="absolute top-2 left-2 text-[110px] leading-none font-black select-none pointer-events-none"
          style={{ color: "#f1e6e6" }}
        >
          ؟
        </div>
        <p className="relative text-[13px] text-kooora-dark leading-snug text-end">
          من سيذهب للنهائي العراق او اليابان؟
        </p>
      </div>

      {/* Bottom: radios + button in light grey area */}
      <div className="bg-[#f2f2f2] p-3">
        <form className="space-y-2 text-[13px]">
          {["العراق", "اليابان"].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 cursor-pointer justify-end"
            >
              <span>{opt}</span>
              <input
                type="radio"
                name="poll"
                value={opt}
                checked={choice === opt}
                onChange={(e) => setChoice(e.target.value)}
                className="kooora-radio"
              />
            </label>
          ))}

          <button
            type="button"
            className="w-full bg-kooora-dark text-white font-bold py-1.5 text-[14px] mt-3"
          >
            تصويت
          </button>
        </form>
      </div>

      {/* المزيد link bottom-left */}
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
