import Image from "next/image";

const TEAM_IDS: Record<string, number> = {
  "ريال مدريد": 541,
  "برشلونة": 529,
  "أتلتيكو مدريد": 530,
  "مانشستر يونايتد": 33,
  "تشيلسي": 49,
  "أرسنال": 42,
  "توتنهام هوتسبير": 47,
  "مانشستر سيتي": 50,
  "ليفربول": 40,
  "ميلان": 489,
  "روما": 497,
  "إنتر ميلان": 505,
  "يوفنتوس": 496,
  "بوروسيا دورتموند": 165,
  "بايرن ميونيخ": 157,
  "شالكه": 176,
  "باريس سان جيرمان": 85,
  "موناكو": 91,
  "الهلال": 2932,
  "الوحدة": 2939,
  "الزمالك": 1037,
};

type Props = {
  name: string;
  size?: number;
  className?: string;
};

export default function TeamLogo({ name, size = 18, className = "" }: Props) {
  const id = TEAM_IDS[name];
  if (!id) {
    return (
      <span
        className={`inline-block bg-kooora-border/40 rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <Image
      src={`https://media.api-sports.io/football/teams/${id}.png`}
      alt={name}
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}
