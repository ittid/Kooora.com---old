"use client";

import { useEffect, useMemo, useState } from "react";

function formatTime(date: Date, offsetHours: number, hour12: boolean): string {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60_000;
  const shifted = new Date(utcMs + offsetHours * 3_600_000);
  let hh = shifted.getHours();
  const mm = shifted.getMinutes().toString().padStart(2, "0");
  if (hour12) {
    const suffix = hh >= 12 ? "PM" : "AM";
    hh = hh % 12;
    if (hh === 0) hh = 12;
    return `${hh.toString().padStart(2, "0")}:${mm} ${suffix}`;
  }
  return `${hh.toString().padStart(2, "0")}:${mm}`;
}

function getBrowserOffsetHours(): number {
  return -new Date().getTimezoneOffset() / 60;
}

const TZ_KEY = "kooora:tz-offset";
const FMT_KEY = "kooora:tz-format"; // "24" | "12"

export default function TimezoneWidget() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [offset, setOffset] = useState<number>(0);
  const [hour12, setHour12] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedTz = typeof window !== "undefined" ? localStorage.getItem(TZ_KEY) : null;
    const storedFmt = typeof window !== "undefined" ? localStorage.getItem(FMT_KEY) : null;
    setOffset(storedTz !== null ? parseFloat(storedTz) : getBrowserOffsetHours());
    setHour12(storedFmt === "12");
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = useMemo(
    () => formatTime(now, offset, hour12),
    [now, offset, hour12],
  );

  function chooseFormat(h12: boolean) {
    setHour12(h12);
    try {
      localStorage.setItem(FMT_KEY, h12 ? "12" : "24");
    } catch {}
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-[13px] whitespace-nowrap">
        <span
          style={{
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "35px",
            color: "#FFFFFF",
          }}
        >
          جرينتش
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "35px",
            color: "#FFFFFF",
          }}
        >
          --:--
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2 text-[13px] whitespace-nowrap">
      <span
        className="hover:!text-[#DD6600]"
        style={{
          fontWeight: 700,
          fontSize: "14px",
          lineHeight: "35px",
          color: "#FFFFFF",
        }}
      >
        جرينتش
      </span>
      <span
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          fontWeight: 700,
          fontSize: "14px",
          lineHeight: "35px",
          color: "#FFFFFF",
          cursor: "default",
        }}
      >
        {time}
      </span>

      {/* Tooltip — tooltipster-style, 350ms fade, matches Kooora inspector */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          zIndex: 9999999,
          transitionDuration: "350ms",
          animationDuration: "350ms",
        }}
        className={`absolute top-full end-0 pt-[2px] transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="relative rounded shadow-lg"
          style={{
            background: "#eeeeee",
            border: "1px solid #999999",
            width: "236.594px",
            height: "44px",
          }}
        >
          <span
            aria-hidden
            className="absolute -top-[6px] end-6 w-[10px] h-[10px] rotate-45"
            style={{
              background: "#eeeeee",
              borderTop: "1px solid #999999",
              borderLeft: "1px solid #999999",
            }}
          />
          <div
            dir="rtl"
            className="flex items-center justify-center gap-3 text-[12px] text-kooora-dark h-full px-3"
            style={{ fontWeight: 400 }}
          >
            <span>التوقيت المستخدم</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="hfmt"
                checked={!hour12}
                onChange={() => chooseFormat(false)}
                className="kooora-radio"
              />
              <span>24 ساعة</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="hfmt"
                checked={hour12}
                onChange={() => chooseFormat(true)}
                className="kooora-radio"
              />
              <span>12 ساعة</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
