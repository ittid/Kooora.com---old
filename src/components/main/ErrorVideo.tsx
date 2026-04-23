export default function ErrorVideo() {
  return (
    <div className="bg-kooora-card shadow-card mb-3">
      <div className="bg-black aspect-[16/8] w-full flex items-center justify-center relative">
        <div className="absolute top-2 inset-x-0 text-center text-white text-[12px]">
          An unanticipated problem was encountered, check back soon and try again
          <div className="text-white/70 text-[10px] mt-1">
            Error Code: MEDIA_ERR_UNKNOWN
          </div>
        </div>
        <div className="text-white/30 text-8xl font-bold">×</div>
        <button className="absolute bottom-4 start-1/2 -translate-x-1/2 bg-kooora-gold text-kooora-dark px-6 py-1 rounded font-bold text-[12px]">
          OK
        </button>
      </div>
    </div>
  );
}
