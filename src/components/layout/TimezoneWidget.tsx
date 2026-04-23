"use client";

import { useEffect, useMemo, useState } from "react";

// GMT offsets from -12 to +13 in 0.5 steps, matching the Kooora dialog
const OFFSETS: number[] = [];
for (let x = -12; x <= 13; x += 0.5) OFFSETS.push(x);

function formatOffsetLabel(offset: number): string {
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  // Kept as decimal (e.g. 3.5) to match the screenshot
  const display = Number.isInteger(abs) ? `${abs}` : `${abs}`;
  return `جرينتش ${sign}${display}`;
}

function formatTime(date: Date, offsetHours: number): string {
  // Convert to target offset from UTC
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60_000;
  const shifted = new Date(utcMs + offsetHours * 3_600_000);
  const hh = shifted.getHours().toString().padStart(2, "0");
  const mm = shifted.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function getBrowserOffsetHours(): number {
  // getTimezoneOffset returns minutes *behind* UTC, so negate
  return -new Date().getTimezoneOffset() / 60;
}

const STORAGE_KEY = "kooora:tz-offset";

export default function TimezoneWidget() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [offset, setOffset] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // Initialize from localStorage or browser on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setOffset(stored !== null ? parseFloat(stored) : getBrowserOffsetHours());
    setMounted(true);
  }, []);

  // Tick clock every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = useMemo(() => formatTime(now, offset), [now, offset]);
  const offsetLabel = useMemo(() => formatOffsetLabel(offset), [offset]);

  function choose(o: number) {
    setOffset(o);
    try {
      localStorage.setItem(STORAGE_KEY, String(o));
    } catch {}
    setOpen(false);
  }

  // Render a non-interactive placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-3 text-[13px] whitespace-nowrap">
        <span className="text-kooora-gold font-bold">--:--</span>
        <span className="text-white/80">جرينتش</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 text-[13px] whitespace-nowrap">
        <span className="text-kooora-gold font-bold">{time}</span>
        <button
          onClick={() => setOpen(true)}
          className="text-white/80 hover:text-[#d60]"
          title="تغيير التوقيت"
        >
          {offsetLabel}
        </button>
      </div>

      {open && <TimezoneDialog current={offset} onClose={() => setOpen(false)} onChoose={choose} />}
    </>
  );
}

function TimezoneDialog({
  current,
  onClose,
  onChoose,
}: {
  current: number;
  onClose: () => void;
  onChoose: (o: number) => void;
}) {
  // Split into 3 columns of ~17 items like the screenshot
  const perCol = Math.ceil(OFFSETS.length / 3);
  const columns = [
    OFFSETS.slice(0, perCol),
    OFFSETS.slice(perCol, perCol * 2),
    OFFSETS.slice(perCol * 2),
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-2xl w-[320px]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="bg-kooora-dark text-white px-3 h-[34px] flex items-center justify-between">
          <button
            onClick={onClose}
            className="bg-kooora-gold text-kooora-dark text-[11px] font-bold px-2 py-0.5 rounded"
          >
            إغلاق
          </button>
          <h3 className="text-kooora-gold font-bold text-[13px]">التوقيت المستخدم</h3>
        </header>

        <div className="p-3 text-[12px] text-kooora-dark">
          <p className="font-bold mb-2">
            الرجاء اختيار توقيتك المحلي أدناه لتغيير توقيت عرض الجداول
          </p>
          <p className="text-kooora-muted text-[11px] mb-1">
            سيتم حفظ هذا الخيار في جهازك للزيارات القادمة
          </p>
          <p className="text-red-600 text-[11px] mb-3">
            ملاحظة هامة: يجب أن تكون خاصية &quot;الكوكيز&quot; مفعلة في متصفحك حتى يتم تغيير وقتك المحلي في الموقع
          </p>

          <div className="grid grid-cols-3 gap-x-1 gap-y-0.5">
            {columns.map((col, ci) => (
              <ul key={ci} className="space-y-0.5">
                {col.map((o) => {
                  const selected = o === current;
                  return (
                    <li key={o}>
                      <button
                        onClick={() => onChoose(o)}
                        className={`w-full text-start px-2 py-1 rounded text-[11.5px] ${
                          selected
                            ? "bg-kooora-gold text-kooora-dark font-bold"
                            : "hover:bg-kooora-page"
                        }`}
                      >
                        {formatOffsetLabel(o)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
