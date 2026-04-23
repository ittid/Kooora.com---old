import Image from "next/image";
import SidebarPanel from "../shared/SidebarPanel";

const featured = {
  id: "f1",
  image: "https://picsum.photos/seed/svfeat/300/170",
  title: "أبرز الهدافين الحاليين في كأس العالم ... الصدارة ليست لمهاجم!",
};

const thumbs = [
  { id: "1", image: "https://picsum.photos/seed/sv1/140/80", title: "" },
  { id: "2", image: "https://picsum.photos/seed/sv2/140/80", title: "جماهير المغرب تهب للدفاع عن حمدالله... لا يحصل على الدعم المطلوب!" },
  { id: "3", image: "https://picsum.photos/seed/sv3/140/80", title: "رونالدو يفاجئ بيبي بصورة كوميدية.. والمدافع يرد بنفس الطريقة!" },
  { id: "4", image: "https://picsum.photos/seed/sv4/140/80", title: "استراتيجية سعودية تمهد الطريق للعالمية.. فهل تنجح الخطة؟" },
  { id: "5", image: "https://picsum.photos/seed/sv5/140/80", title: "صراع ميسي ورونالدو ينتقل لمونديال قطر.. 4 أرقام يمكن تحطيمها!" },
  { id: "6", image: "https://picsum.photos/seed/sv6/140/80", title: "مشجع إكوادوري حاول استفزاز الجماهير المارتنية.. وهكذا كانت النتيجة!" },
];

function PlayOverlay({ size = 36 }: { size?: number }) {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span
        className="rounded-full bg-[#fb0]/90 text-kooora-dark flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.35} height={size * 0.35} viewBox="0 0 10 10" fill="currentColor">
          <path d="M2 1.5v7l6-3.5z" />
        </svg>
      </span>
    </span>
  );
}

function WatermarkLogo() {
  return (
    <span className="absolute top-1.5 start-1.5 text-[10px] font-bold text-[#fb0] flex items-center gap-1 z-10">
      <span className="w-3 h-3 rounded-full bg-[#fb0] text-kooora-dark flex items-center justify-center text-[8px]">
        K
      </span>
      KOOORA
    </span>
  );
}

export default function SidebarVideos() {
  return (
    <>
      <SidebarPanel
        title="فيديوهات"
        tabs={[
          { label: "الأحدث", active: true },
          { label: "الأكثر مشاهدة" },
        ]}
      >
        {/* Featured video with bottom overlay */}
        <a href="#" className="block relative group">
          <Image
            src={featured.image}
            alt=""
            width={300}
            height={170}
            className="w-full h-auto"
            unoptimized
          />
          <WatermarkLogo />
          <PlayOverlay size={50} />
          <div className="absolute bottom-0 inset-x-0 p-2 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <h4 className="text-[12px] font-bold leading-tight pb-1 border-b-2 border-[#fb0] inline-block">
              {featured.title}
            </h4>
          </div>
        </a>

        {/* 2-column thumbs */}
        <div className="grid grid-cols-2 gap-[2px] bg-kooora-border/40">
          {thumbs.slice(1).map((t) => (
            <a key={t.id} href="#" className="block relative group bg-kooora-dark text-white">
              <Image
                src={t.image}
                alt=""
                width={140}
                height={80}
                className="w-full h-auto opacity-80 group-hover:opacity-100"
                unoptimized
              />
              <WatermarkLogo />
              <PlayOverlay size={28} />
              <div className="absolute bottom-0 inset-x-0 p-1.5 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="text-[10px] leading-tight line-clamp-2">{t.title}</div>
              </div>
            </a>
          ))}
        </div>
      </SidebarPanel>

      {/* Separate "أحداث رياضية" panel */}
      <SidebarPanel title="أحداث رياضية">
        <ul className="p-3 text-[12.5px]">
          <li className="flex items-start gap-1.5">
            <span className="text-kooora-dark">•</span>
            <a href="#" className="hover:text-kooora-goldDark leading-snug">
              سحب قرعة: نهائيات كأس العالم للشباب تحت 20 - إندونيسيا يوم 3/31
            </a>
          </li>
        </ul>
        <div className="border-t border-kooora-border/40 px-3 py-2 flex justify-center">
          <a href="#" className="text-[13px] text-kooora-dark hover:text-kooora-goldDark">
            المزيد
          </a>
        </div>
      </SidebarPanel>
    </>
  );
}
