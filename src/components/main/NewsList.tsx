import Image from "next/image";
import Link from "next/link";
import type { DbPost } from "@/lib/data-source";

export default function NewsList({
  items,
  title = "أهم الأخبار",
  moreHref = "/news",
}: {
  items: DbPost[];
  title?: string;
  moreHref?: string;
}) {
  return (
    <div className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
        <h2
          className="text-kooora-gold"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "16px",
            lineHeight: "30px",
            fontWeight: 600,
          }}
        >
          {title}
        </h2>
      </header>
      <ul className="divide-y divide-kooora-border/50">
        {items.map((n) => (
          <li key={n.id} className="p-3 flex gap-3 hover:bg-kooora-page/40">
            <div className="flex-1 min-w-0">
              <Link
                href={`/news/${n.slug}`}
                className="text-[13.5px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-snug block"
              >
                {n.title}
              </Link>
              {n.excerpt && (
                <p className="text-[12px] text-kooora-muted leading-relaxed mt-1 line-clamp-2">
                  {n.excerpt}
                </p>
              )}
            </div>
            <Link
              href={`/news/${n.slug}`}
              className="relative w-[120px] h-[72px] flex-shrink-0 block"
            >
              <Image
                src={n.cover_url ?? "https://picsum.photos/seed/" + n.id + "/200/120"}
                alt=""
                fill
                className="object-cover rounded"
                unoptimized
              />
              {n.kind === "video" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-8 h-8 rounded-full bg-kooora-gold/90 text-kooora-dark flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M2 1.5v7l6-3.5z" />
                    </svg>
                  </span>
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="text-center py-2 border-t border-kooora-border/50">
        <Link href={moreHref} className="text-[12px] text-kooora-goldDark hover:underline">
          المزيد
        </Link>
      </div>
    </div>
  );
}
