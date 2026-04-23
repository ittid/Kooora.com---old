export default function HeaderBanner() {
  return (
    <div className="bg-kooora-page">
      <div
        className="w-[970px] mx-auto h-[104px] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/img/header-bg.jpg')" }}
      >
        {/* Logo absolutely positioned on the RIGHT */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4" style={{ direction: "ltr" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/logo.png"
            alt="كووورة"
            className="h-[84px] w-auto"
          />
        </div>
      </div>
    </div>
  );
}
