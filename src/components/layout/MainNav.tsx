import { Fragment } from "react";

const navGroups: string[][] = [
  // right group (5)
  ["الرئيسية", "أخبار", "مسابقات", "فرق", "لاعبون"],
  // middle group (5)
  ["مباريات", "الآن", "اليوم", "غداً", "أمس"],
  // left group (rest)
  ["أحدث حية", "تنس", "رياضات", "TV", "صور", "منتديات", "مزيد", "مفضلتي"],
];

export default function MainNav() {
  let globalIndex = 0;
  return (
    <div className="bg-kooora-page">
      <nav className="w-[970px] mx-auto bg-kooora-dark border-t border-[#4d4d4d]">
        <ul
          className="flex items-stretch w-full text-white border-b-[4px] border-[#fb0]"
          style={{ fontSize: "18px", lineHeight: "30px" }}
        >
          {navGroups.map((group, gi) => (
            <Fragment key={`g-${gi}`}>
              {group.map((item) => {
                const idx = globalIndex++;
                const active = idx === 0;
                return (
                  <li
                    key={idx}
                    className={`nav_li flex items-stretch ${
                      active ? "bg-[#fb0]" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className={`h-[30px] px-2 flex items-center whitespace-nowrap hover:bg-[#fb0] hover:text-black ${
                        active ? "text-black" : "text-white"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
              {/* thick separator between groups */}
              {gi < navGroups.length - 1 && (
                <span aria-hidden className="w-[2px] self-stretch bg-[#fb0]" />
              )}
            </Fragment>
          ))}
        </ul>
      </nav>
    </div>
  );
}
