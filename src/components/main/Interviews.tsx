import Image from "next/image";

export default function Interviews() {
  return (
    <section className="bg-kooora-card shadow-card mb-3">
      <header className="bg-kooora-dark px-3 h-[32px] flex items-center">
        <h3 className="text-kooora-gold text-[13px] font-bold">مقابلات</h3>
      </header>
      <div className="p-3 flex gap-3">
        <div className="flex-1 min-w-0">
          <a
            href="#"
            className="block text-[14px] font-bold text-kooora-dark hover:text-kooora-goldDark leading-snug"
          >
            أحمد صالح في حوار لكووورة: &quot;الأهلي لم يشرف مصر بالمونديال.. وعودة فيريرا خطأ&quot;
          </a>
          <p className="text-[12px] text-kooora-muted leading-relaxed mt-2 line-clamp-3">
            يتحدث أحمد صالح، المدرب العام الأسبق لنادي منتخب الشباب المصري، أحد عناصر الجيل الذهبي للزمالك الذي حقق البطولات في بداية الألفية الحالية.
          </p>
        </div>
        <div className="relative w-[180px] h-[110px] flex-shrink-0">
          <Image
            src="https://picsum.photos/seed/interview/180/110"
            alt=""
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
