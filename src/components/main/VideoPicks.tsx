import Image from "next/image";

const picks = [
  {
    id: 1,
    image: "https://picsum.photos/seed/vp1/260/150",
    title: "الحل الذهبي لوقف كابوس الإصابات لـريال مدريد.. ولأول مرة في التاريخ",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/vp2/260/150",
    title: "عنف سوسيداد بالعسرة مخضار.. أهل مقدمة التاليف الجهاز الألماني",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/vp3/260/150",
    title: "براهيمي لقاءة كافة رئيس وكلاف ميفرا.. حاج سرعة الميز كنايز كارلي منالني يقليله",
  },
];

export default function VideoPicks() {
  return (
    <section className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
        <h3 className="text-kooora-gold text-[13px] font-bold">مختارات الفيديو</h3>
      </header>
      <div className="grid grid-cols-3 gap-2 p-2">
        {picks.map((p) => (
          <a href="#" key={p.id} className="block group">
            <div className="relative aspect-[16/10] rounded overflow-hidden mb-1">
              <Image src={p.image} alt="" fill className="object-cover" unoptimized />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-9 h-9 rounded-full bg-kooora-gold/90 text-kooora-dark flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2 1.5v7l6-3.5z" />
                  </svg>
                </span>
              </span>
            </div>
            <h4 className="text-[11.5px] font-semibold text-kooora-dark group-hover:text-kooora-goldDark leading-snug line-clamp-3">
              {p.title}
            </h4>
          </a>
        ))}
      </div>
      <div className="text-center py-2 border-t border-kooora-border/40">
        <a href="#" className="text-[11px] text-kooora-goldDark hover:underline">
          المزيد
        </a>
      </div>
    </section>
  );
}
