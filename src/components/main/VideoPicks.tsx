import Image from "next/image";

const picks = [
  {
    id: 1,
    image: "https://picsum.photos/seed/vp1/180/110",
    title: "جماهير بيلباو تهاجم برشلونة على طريقتها بسبب قضية الرشاوي!",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/vp2/180/110",
    title: "لم يبد ضحية.. إحصائية صادمة تثبت تناقض فينيسيوس",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/vp3/180/110",
    title: "لعلم من لعبة إلكترونية ولا يحمل شهادة.. مدرب ريمس معجزة كروية",
  },
  {
    id: 4,
    image: "https://picsum.photos/seed/vp4/180/110",
    title: "موار بطل من شأن ميسي لصالح رونالدو.. ما السبب؟",
  },
];

export default function VideoPicks() {
  return (
    <section className="mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center border-b-2 border-kooora-gold">
        <h3 className="text-white text-[13px] font-bold">مختارات الفيديو</h3>
      </header>
      <div className="bg-kooora-darkSoft p-3">
        <div className="grid grid-cols-4 gap-2">
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
              <h4 className="text-[11.5px] text-white/90 group-hover:text-kooora-gold leading-snug line-clamp-3">
                {p.title}
              </h4>
            </a>
          ))}
        </div>
        <div className="mt-3">
          <a
            href="#"
            className="inline-block bg-kooora-gold text-kooora-dark text-[11px] font-bold px-3 py-1"
          >
            المزيد
          </a>
        </div>
      </div>
    </section>
  );
}
