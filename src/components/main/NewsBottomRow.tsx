import { topNews } from "@/lib/data";

export default function NewsBottomRow() {
  const items = topNews.slice(8, 16);
  return (
    <div className="bg-kooora-card shadow-card mb-3">
      <ul className="grid grid-cols-2 divide-x divide-y divide-kooora-border/40" style={{ direction: "rtl" }}>
        {items.map((n) => (
          <li key={n.id} className="p-3">
            <a
              href="#"
              className="flex items-start gap-2 text-[12px] text-kooora-dark hover:text-kooora-goldDark"
            >
              <span className="text-kooora-gold mt-0.5">»</span>
              <span className="leading-snug line-clamp-2">{n.title}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="text-center py-2 border-t border-kooora-border/40">
        <a href="#" className="text-[12px] text-kooora-goldDark hover:underline">
          المزيد
        </a>
      </div>
    </div>
  );
}
