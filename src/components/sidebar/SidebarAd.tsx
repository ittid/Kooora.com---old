export default function SidebarAd() {
  return (
    <a
      href="#"
      className="block mb-3 relative overflow-hidden shadow-card h-[70px]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(20,20,40,0.95) 0%, rgba(20,20,40,0.3) 60%), url('https://picsum.photos/seed/strive-ad/300/100')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative h-full p-2 flex items-center gap-2">
        <div className="bg-[#fb0] text-kooora-dark text-[11px] font-bold px-2 py-1 text-center leading-tight rounded-sm flex-shrink-0">
          تابع
          <br />
          ستـرايف
          <br />
          الآن
        </div>
        <div className="text-white text-[12px] font-bold leading-tight">
          وحده هاوي السيارات سيفهم!
          <br />
          عن أي شغف نتكلم
        </div>
      </div>
    </a>
  );
}
