import { Fragment } from "react";

const navItems = [
  "الرئيسية",
  "أخبار",
  "مسابقات",
  "فرق",
  "لاعبون",
  "مباريات",
  "الآن",
  "اليوم",
  "غداً",
  "أمس",
  "أحدث حية",
  "تنس",
  "رياضات",
  "TV",
  "صور",
  "منتديات",
  "مزيد",
  "مفضلتي",
];

export default function MainNav() {
  return (
    <div className="bg-kooora-page">
      <nav className="w-[970px] mx-auto bg-kooora-dark border-t border-[#4d4d4d]">
        <ul className="flex items-stretch w-full text-[12.5px] text-white font-semibold border-b-[4px] border-[#fb0]">
          {navItems.map((item, i) => {
            const active = i === 0;
            const isLast = i === navItems.length - 1;
            return (
              <Fragment key={i}>
                <li
                  className={`nav_li flex items-stretch ${
                    active ? "bg-[#fb0]" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`h-[30px] px-3 flex items-center whitespace-nowrap hover:bg-[#fb0] hover:text-kooora-dark ${
                      active ? "text-kooora-dark" : "text-white"
                    }`}
                  >
                    {item}
                  </a>
                </li>
                {!isLast && (
                  <span aria-hidden className="w-px self-stretch bg-[#fb0]" />
                )}
              </Fragment>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
