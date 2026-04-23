import Image from "next/image";
import { NewsItem } from "@/lib/data";

export default function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
        <h2 className="text-kooora-gold text-[14px] font-bold">أهم الأخبار</h2>
      </header>
      <ul className="divide-y divide-kooora-border/50">
        {items.map((n) => (
          <li key={n.id} className="p-3 flex gap-3 hover:bg-kooora-page/40">
            <div className="flex-1 min-w-0">
              <a
                href="#"
                className="text-[13.5px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-snug block"
              >
                {n.title}
              </a>
              {n.excerpt && (
                <p className="text-[12px] text-kooora-muted leading-relaxed mt-1 line-clamp-2">
                  {n.excerpt}
                </p>
              )}
            </div>
            <div className="relative w-[120px] h-[72px] flex-shrink-0">
              <Image
                src={n.image}
                alt=""
                fill
                className="object-cover rounded"
                unoptimized
              />
              {n.hasVideo && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-8 h-8 rounded-full bg-kooora-gold/90 text-kooora-dark flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M2 1.5v7l6-3.5z" />
                    </svg>
                  </span>
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="text-center py-2 border-t border-kooora-border/50">
        <a href="#" className="text-[12px] text-kooora-goldDark hover:underline">
          المزيد
        </a>
      </div>
    </div>
  );
}
