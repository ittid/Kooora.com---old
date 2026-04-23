import Image from "next/image";
import SidebarPanel from "../shared/SidebarPanel";

const articles = [
  {
    id: "a1",
    title: "الجناح الثابت في الكرة الآسيوية",
    author: "حسن المسكاوي",
    flag: "🇪🇬",
    avatar: "https://picsum.photos/seed/author1/50",
  },
  {
    id: "a2",
    title: "الدوري ما زال حائرا",
    author: "عبدالكريم الجاسر",
    flag: "🇸🇦",
    avatar: "https://picsum.photos/seed/author2/50",
  },
  {
    id: "a3",
    title: "خماسية صنداونز جرس انذار للهلال..!",
    author: "بابكر مختار",
    flag: "🇸🇩",
    avatar: "https://picsum.photos/seed/author3/50",
  },
];

export default function Articles() {
  return (
    <SidebarPanel title="مقالات">
      <ul className="divide-y divide-kooora-border/40">
        {articles.map((a) => (
          <li key={a.id} className="p-3 flex gap-3 items-center">
            <Image
              src={a.avatar}
              alt={a.author}
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full object-cover flex-shrink-0"
              unoptimized
            />
            <div className="flex-1 min-w-0 text-end">
              <a
                href="#"
                className="block text-[13.5px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-tight mb-1"
              >
                {a.title}
              </a>
              <div className="text-[11px] text-kooora-muted flex items-center gap-1 justify-end">
                <span className="text-[13px]">{a.flag}</span>
                <span>{a.author}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
