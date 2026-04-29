"use client";

import Link from "next/link";
import { MegaMenu } from "@/lib/routes";

type Props = {
  menu: MegaMenu;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function NavMegaMenu({ menu, onMouseEnter, onMouseLeave }: Props) {
  const colCount = menu.columns.length + (menu.searchLabel ? 1 : 0);

  return (
    <div
      className="absolute right-0 left-0 top-full z-40 bg-white border border-[#d9d9d9] shadow-lg"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="grid gap-x-6 px-4 py-4"
        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
      >
        {menu.columns.map((col, i) => (
          <div key={i} className="min-w-0">
            <h4 className="text-[#c00] text-[13px] font-bold mb-1 pb-1">
              {col.title}
            </h4>
            <ul className="text-[12.5px]">
              {col.items.map((it, j) => (
                <li key={j} className="border-t border-[#e5e5e5]">
                  <Link
                    href={it.href}
                    className="block py-1.5 text-kooora-dark hover:text-kooora-goldDark whitespace-nowrap"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
            {col.footer && (
              <div className="border-t border-[#e5e5e5] mt-0">
                <Link
                  href={col.footer.href}
                  className="block py-1.5 text-[12.5px] text-[#c00] font-bold hover:underline whitespace-nowrap"
                >
                  {col.footer.label}
                </Link>
              </div>
            )}
          </div>
        ))}

        {menu.searchLabel && (
          <div className="self-end">
            <div className="border border-[#d9d9d9] bg-[#f5f5f5] p-2">
              <div className="text-[12px] text-kooora-dark text-end mb-1">
                {menu.searchLabel}
              </div>
              <div className="flex items-center bg-white border border-[#d9d9d9] px-2 py-1">
                <input
                  type="text"
                  placeholder={menu.searchPlaceholder ?? "ابحث"}
                  className="flex-1 bg-transparent outline-none text-[12px] text-kooora-dark"
                  dir="rtl"
                />
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
