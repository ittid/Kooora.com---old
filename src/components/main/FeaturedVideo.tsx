import Image from "next/image";
import VideoPlayer from "@/components/shared/VideoPlayer";

const FEATURED_VIDEO =
  "https://www.youtube.com/watch?v=BHACKCNDMW8";

const thumbs = [
  { id: "t1", image: "https://picsum.photos/seed/fv1/260/120", time: "07:20" },
  { id: "t2", image: "https://picsum.photos/seed/fv2/260/120", time: "10:11" },
  { id: "t3", image: "https://picsum.photos/seed/fv3/260/120", time: "23:53" },
];

export default function FeaturedVideo() {
  return (
    <div className="bg-kooora-card shadow-card mb-3">
      <VideoPlayer src={FEATURED_VIDEO} />
      <div className="grid grid-cols-3 gap-[1px] bg-kooora-dark/10">
        {thumbs.map((t) => (
          <button
            key={t.id}
            className="relative block bg-black aspect-[16/8]"
            aria-label="تشغيل المقطع"
          >
            <Image
              src={t.image}
              alt=""
              fill
              className="object-cover opacity-90"
              unoptimized
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-kooora-gold/90 text-kooora-dark flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M2 1.5v7l6-3.5z" />
                </svg>
              </span>
            </span>
            <span className="absolute bottom-1 start-2 text-white text-[10px] bg-black/60 px-1 rounded">
              {t.time}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
