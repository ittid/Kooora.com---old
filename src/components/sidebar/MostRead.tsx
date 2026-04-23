import Image from "next/image";
import Panel from "../shared/Panel";
import { mostRead } from "@/lib/data";

export default function MostRead() {
  return (
    <Panel
      title="الأكثر قراءة"
      tabs={[
        { label: "اليوم", active: true },
        { label: "آخر أسبوع" },
      ]}
    >
      <ul className="divide-y divide-kooora-border/40">
        {mostRead.map((item) => (
          <li key={item.id} className="py-2 flex gap-2 items-start">
            <Image
              src={item.image}
              alt=""
              width={70}
              height={50}
              className="w-[70px] h-[50px] object-cover rounded flex-shrink-0"
              unoptimized
            />
            <a
              href="#"
              className="text-[11.5px] leading-snug text-kooora-dark hover:text-kooora-goldDark line-clamp-3"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
