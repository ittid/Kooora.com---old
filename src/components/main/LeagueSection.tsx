import Image from "next/image";
import { NewsItem } from "@/lib/data";

type Props = {
  title: string;
  items: NewsItem[];
};

export default function LeagueSection({ title, items }: Props) {
  return (
    <section className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
        <h3 className="text-kooora-gold text-[13px] font-bold">{title}</h3>
      </header>
      <div className="grid grid-cols-3 gap-2 p-2">
        {items.map((n) => (
          <a
            href="#"
            key={n.id}
            className="block group"
            aria-label={n.title}
          >
            <div className="relative aspect-[16/10] rounded overflow-hidden mb-1">
              <Image src={n.image} alt="" fill className="object-cover" unoptimized />
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
            <h4 className="text-[12px] font-semibold text-kooora-dark group-hover:text-kooora-goldDark leading-snug line-clamp-3">
              {n.title}
            </h4>
          </a>
        ))}
      </div>
    </section>
  );
}
