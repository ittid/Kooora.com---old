"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups, megaMenus } from "@/lib/routes";
import NavMegaMenu from "./NavMegaMenu";

export default function MainNav() {
  const pathname = usePathname();
  const [openHref, setOpenHref] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenHref(null), 120);
  };

  const open = (href: string) => {
    cancelClose();
    if (megaMenus[href]) setOpenHref(href);
    else setOpenHref(null);
  };

  const activeMenu = openHref ? megaMenus[openHref] : null;

  return (
    <div className="bg-kooora-page">
      <nav
        className="w-[970px] mx-auto bg-kooora-dark border-t border-[#4d4d4d] relative"
        onMouseLeave={scheduleClose}
      >
        <ul
          className="flex items-stretch w-full text-white border-b-[4px] border-[#fb0]"
          style={{ fontSize: "18px", lineHeight: "30px" }}
        >
          {navGroups.map((group, gi) => (
            <Fragment key={`g-${gi}`}>
              {group.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                const isOpen = openHref === item.href;
                return (
                  <li
                    key={item.href}
                    className={`nav_li flex items-stretch ${
                      active || isOpen ? "bg-[#fb0]" : ""
                    }`}
                    onMouseEnter={() => open(item.href)}
                  >
                    <Link
                      href={item.href}
                      className={`h-[30px] px-2 flex items-center whitespace-nowrap hover:bg-[#fb0] hover:text-black ${
                        active || isOpen ? "text-black" : "text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {gi < navGroups.length - 1 && (
                <span aria-hidden className="w-[2px] self-stretch bg-[#fb0]" />
              )}
            </Fragment>
          ))}
        </ul>

        {activeMenu && (
          <NavMegaMenu
            menu={activeMenu}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}
      </nav>
    </div>
  );
}
