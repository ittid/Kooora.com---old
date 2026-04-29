import Image from "next/image";
import Link from "next/link";
import type { DbPost } from "@/lib/data-source";

type Props = {
  title: string;
  items: DbPost[];
  moreHref?: string;
};

export default function LeagueSection({ title, items, moreHref }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
        <h3
          className="text-kooora-gold"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "16px",
            lineHeight: "30px",
            fontWeight: 600,
          }}
        >
          {moreHref ? (
            <Link href={moreHref} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
      </header>
      <div className="grid grid-cols-3 gap-2 p-2">
        {items.map((n) => (
          <Link
            href={`/news/${n.slug}`}
            key={n.id}
            className="block group"
            aria-label={n.title}
          >
            <div className="relative aspect-[16/10] rounded overflow-hidden mb-1">
              <Image
                src={n.cover_url ?? "https://picsum.photos/seed/" + n.id + "/200/120"}
                alt=""
                fill
                className="object-cover"
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
            </div>
            <h4 className="text-[12px] font-semibold text-kooora-dark group-hover:text-kooora-goldDark leading-snug line-clamp-3">
              {n.title}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
