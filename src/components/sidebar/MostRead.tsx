import Image from "next/image";
import SidebarPanel from "../shared/SidebarPanel";

const items = [
  { id: "1", title: "أزمة كبيرة.. القضاء يبطل تسجيل عقد جافي", image: "https://picsum.photos/seed/mr1/80/60" },
  { id: "2", title: "ريال مدريد يصعّد ضد برشلونة ويطالب بتعويضات", image: "https://picsum.photos/seed/mr2/80/60" },
  { id: "3", title: "أنشيلوتي يلبي رغبة بيريز أمام ليفربول", image: "https://picsum.photos/seed/mr3/80/60" },
  { id: "4", title: "حكم سابق يكشف عن واقعة خطيرة لبيريز", image: "https://picsum.photos/seed/mr4/80/60" },
  { id: "5", title: "فالفيردي: ما حدث أمام برشلونة بعيد عن كرة القدم الحقيقية", image: "https://picsum.photos/seed/mr5/80/60" },
  { id: "6", title: "تشافي عن هتافات الدرجة الثانية: أشعر بالدهشة والحزن", image: "https://picsum.photos/seed/mr6/80/60" },
];

export default function MostRead() {
  return (
    <SidebarPanel
      title="الأكثر قراءة"
      tabs={[
        { label: "اليوم", active: true },
        { label: "آخر أسبوع" },
      ]}
    >
      <ul className="divide-y divide-kooora-border/40">
        {items.map((it) => (
          <li key={it.id} className="p-2 flex gap-2 items-center">
            <a href="#" className="flex-1 text-[12px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-snug line-clamp-2">
              {it.title}
            </a>
            <Image
              src={it.image}
              alt=""
              width={70}
              height={50}
              className="w-[70px] h-[50px] object-cover flex-shrink-0"
              unoptimized
            />
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
