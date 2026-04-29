import Image from "next/image";
import Link from "next/link";
import SidebarPanel from "../shared/SidebarPanel";
import { fetchMostRead } from "@/lib/data-source";

export default async function MostRead() {
  const items = await fetchMostRead(6);

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
            <Link
              href={`/news/${it.slug}`}
              className="flex-1 text-[12px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-snug line-clamp-2"
            >
              {it.title}
            </Link>
            <Image
              src={it.cover_url ?? `https://picsum.photos/seed/${it.id}/80/60`}
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
