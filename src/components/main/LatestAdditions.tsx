import Image from "next/image";

export default function LatestAdditions() {
  return (
    <section className="mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center border-b-2 border-kooora-gold">
        <h3 className="text-white text-[13px] font-bold">آخر الإضافات للموقع</h3>
      </header>
      <div className="bg-kooora-card p-3 flex justify-end">
        <a href="#" className="flex flex-col items-center text-center w-[120px]">
          <Image
            src="https://picsum.photos/seed/kingsalman/80/80"
            alt=""
            width={80}
            height={80}
            className="w-[80px] h-[80px] object-contain bg-white"
            unoptimized
          />
          <span className="text-[12px] font-bold text-red-800 mt-2 leading-tight">
            كأس الملك سلمان للأندية الأبطال
          </span>
        </a>
      </div>
    </section>
  );
}
