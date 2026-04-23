// Dummy data for the Kooora homepage. Replace with real API + DB later.

export type Match = {
  id: string;
  home: { name: string; logo: string };
  away: { name: string; logo: string };
  time: string;
  status: "scheduled" | "live" | "finished";
  dayLabel: string;
};

export type LeagueRow = {
  id: string;
  name: string;
  country: string;
  flag: string;
  stage: string;
  round: string;
};

export type Club = {
  id: string;
  name: string;
  country: string;
  flag: string;
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  time?: string;
  source?: string;
  hasVideo?: boolean;
};

export type VideoItem = {
  id: string;
  title: string;
  image: string;
};

export type Article = {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  country: string;
};

export const topMatches: Match[] = [
  {
    id: "m1",
    home: { name: "برشلونة", logo: "https://picsum.photos/seed/barca/40" },
    away: { name: "ريال مدريد", logo: "https://picsum.photos/seed/rma/40" },
    time: "21:00",
    status: "scheduled",
    dayLabel: "اليوم",
  },
  {
    id: "m2",
    home: { name: "الهلال", logo: "https://picsum.photos/seed/hilal/40" },
    away: { name: "الوحدة", logo: "https://picsum.photos/seed/wehda/40" },
    time: "18:30",
    status: "scheduled",
    dayLabel: "اليوم",
  },
  {
    id: "m3",
    home: { name: "الزمالك", logo: "https://picsum.photos/seed/zamalek/40" },
    away: { name: "العهد من لبنان", logo: "https://picsum.photos/seed/ahed/40" },
    time: "14:30",
    status: "scheduled",
    dayLabel: "اليوم",
  },
  {
    id: "m4",
    home: { name: "شباب الأهلي دبي", logo: "https://picsum.photos/seed/shabab/40" },
    away: { name: "اتحاد كلباء", logo: "https://picsum.photos/seed/kalba/40" },
    time: "17:15",
    status: "scheduled",
    dayLabel: "اليوم",
  },
  {
    id: "m5",
    home: { name: "تعرج", logo: "https://picsum.photos/seed/taar/40" },
    away: { name: "المغرب", logo: "https://picsum.photos/seed/mag/40" },
    time: "17:30",
    status: "scheduled",
    dayLabel: "اليوم",
  },
  {
    id: "m6",
    home: { name: "هلال شقرور العيد", logo: "https://picsum.photos/seed/hiz/40" },
    away: { name: "شباب رياضي بلوزداد", logo: "https://picsum.photos/seed/cha/40" },
    time: "15:00",
    status: "scheduled",
    dayLabel: "اليوم",
  },
];

export const topLeagues: LeagueRow[] = [
  {
    id: "l1",
    name: "أبطال أوروبا",
    country: "أوروبا",
    flag: "🇪🇺",
    stage: "الدور الأول",
    round: "الثامن",
  },
  {
    id: "l2",
    name: "الدوري الإسباني",
    country: "إسبانيا",
    flag: "🇪🇸",
    stage: "الدور الأول",
    round: "الثامن",
  },
  {
    id: "l3",
    name: "الدوري الإيطالي A",
    country: "إيطاليا",
    flag: "🇮🇹",
    stage: "الدور الأول",
    round: "الثامن",
  },
  {
    id: "l4",
    name: "الدوري الإيطالي B",
    country: "إيطاليا",
    flag: "🇮🇹",
    stage: "الدور الأول",
    round: "الثامن",
  },
  {
    id: "l5",
    name: "الدوري الألماني",
    country: "ألمانيا",
    flag: "🇩🇪",
    stage: "الدور الأول",
    round: "الثامن",
  },
  {
    id: "l6",
    name: "الدوري الإنجليزي",
    country: "إنجلترا",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    stage: "الدور الأول",
    round: "الثامن",
  },
  {
    id: "l7",
    name: "الدوري الفرنسي",
    country: "فرنسا",
    flag: "🇫🇷",
    stage: "الدور الأول",
    round: "الثامن",
  },
  {
    id: "l8",
    name: "الدوري البرتغالي",
    country: "البرتغال",
    flag: "🇵🇹",
    stage: "الدور الأول",
    round: "الثامن",
  },
];

export const topClubs: Club[] = [
  { id: "c1", name: "ريال مدريد", country: "إسبانيا", flag: "🇪🇸" },
  { id: "c2", name: "برشلونة", country: "إسبانيا", flag: "🇪🇸" },
  { id: "c3", name: "أتلتيكو مدريد", country: "إسبانيا", flag: "🇪🇸" },
  { id: "c4", name: "أرسنال", country: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "c5", name: "مانشستر سيتي", country: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "c6", name: "مانشستر يونايتد", country: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "c7", name: "ليفربول", country: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "c8", name: "تشيلسي", country: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "c9", name: "إنتر ميلان", country: "إيطاليا", flag: "🇮🇹" },
  { id: "c10", name: "روما", country: "إيطاليا", flag: "🇮🇹" },
  { id: "c11", name: "ميلان", country: "إيطاليا", flag: "🇮🇹" },
  { id: "c12", name: "يوفنتوس", country: "إيطاليا", flag: "🇮🇹" },
  { id: "c13", name: "بايرن ميونيخ", country: "ألمانيا", flag: "🇩🇪" },
  { id: "c14", name: "بوروسيا دورتموند", country: "ألمانيا", flag: "🇩🇪" },
  { id: "c15", name: "شالكه", country: "ألمانيا", flag: "🇩🇪" },
  { id: "c16", name: "باريس سان جيرمان", country: "فرنسا", flag: "🇫🇷" },
];

export const topNews: NewsItem[] = [
  {
    id: "n1",
    title: "قرعة صعبة لليوفنتوس وسهلة للسيتي في ربع نهائي كأس الاتحاد الإنجليزي",
    excerpt:
      "أوقعت قرعة ربع نهائي كأس الاتحاد الإنجليزي يوفنتوس الإيطالي في مواجهة صعبة أمام مانشستر سيتي الإنجليزي بطل الموسم الماضي.",
    image: "https://picsum.photos/seed/news1/200/120",
    time: "07:20",
    hasVideo: true,
  },
  {
    id: "n2",
    title: "ريال مدريد يخطط لضم نجم سيلتا فيغو",
    excerpt:
      "وجه مسؤولو ريال مدريد أنظارهم صوب أحد اللاعبين البارزين في صفوف سيلتا فيغو، لضمه خلال الميركاتو الصيفي المقبل، وفقا لصحيفة موندو ديبورتيفو.",
    image: "https://picsum.photos/seed/news2/200/120",
    time: "",
  },
  {
    id: "n3",
    title: "أنت كذلك.. تمن وجه بنزيما أصابع الاتهام بسرقة جائزة الأفضل منه؟",
    excerpt:
      "لمن يوجّه أسامة الاتهام بسرقة جائزة الأفضل منه... شاهد التفاصيل في هذا الفيديو.",
    image: "https://picsum.photos/seed/news3/200/120",
    hasVideo: true,
  },
  {
    id: "n4",
    title: "إدارة سان جيرمان مصدومة من انسحاب حكيمي",
    excerpt:
      "تحدث تقرير صحفي عن موقف باريس سان جيرمان من الانسحاب المثير الذي ارتكبه لاعبه المغربي أشرف حكيمي...",
    image: "https://picsum.photos/seed/news4/200/120",
  },
  {
    id: "n5",
    title: "رونالدو بين عدلاين.. هل يكسر الدون تفوق الثنائي الأسطوري في الدوري؟",
    excerpt:
      "رونالدو بين عدلاين.. هل يكسر الدون تفوق الثنائي الأسطوري في الدوري؟ تعرف على التفاصيل في هذا الفيديو.",
    image: "https://picsum.photos/seed/news5/200/120",
    hasVideo: true,
  },
  {
    id: "n6",
    title: "بالصور.. أرسنال يطير بصدارة البريميرليج على أنقاض إفرتون",
    excerpt:
      "حقق أرسنال بصدارة الدوري الإنجليزي الممتاز، بعدما هزم الضيف إفرتون (4-0)، في مباراة مؤجلة من الجولة السادسة.",
    image: "https://picsum.photos/seed/news6/200/120",
  },
  {
    id: "n7",
    title: "لحظة تاريخ ميسي ونظرات ميلي لإنارتينيز.. شاهد كواليس حفل لا بست",
    excerpt:
      "تعرف من خلال الفيديو المرفق، على أبرز كواليس حفل جوائز الأفضل، والمقدمة من الاتحاد الدولي لكرة القدم.",
    image: "https://picsum.photos/seed/news7/200/120",
    hasVideo: true,
  },
  {
    id: "n8",
    title: "تشافي يحسم موقف كريستينسن من الكلاسيكو",
    excerpt:
      "حسم تشافي هيرنانديز، المدير الفني لبرشلونة، موقف أندرياس كريستينسن، المدافع الدنماركي من المشاركة أمام ريال مدريد.",
    image: "https://picsum.photos/seed/news8/200/120",
  },
  {
    id: "n9",
    title: "فورد موستانج نادرة تستطيع مغادرة وجهتها فيرون بسهولة",
    excerpt:
      "تعرف من خلال الفيديو، على أبرز النسخة المميزة من فورد موستانج والتي تستطيع أن تؤاد لفترة نادرة.",
    image: "https://picsum.photos/seed/news9/200/120",
    hasVideo: true,
  },
  {
    id: "n10",
    title: "صرودي من منتصف الملعب يتصدر أفضل أهداف الجولة 24 بالكالتشيو",
    excerpt:
      "شاهد في هذا الفيديو أفضل 5 أهداف بالمرحلة 24 من الدوري الإيطالي.",
    image: "https://picsum.photos/seed/news10/200/120",
    hasVideo: true,
  },
  {
    id: "n11",
    title: "الجزائري كوبوروز: الوحدة قادر على تحقيق إيجابية أمام الهلال",
    excerpt:
      "شدد مدير كرة القدم بنادي الوحدة الإماراتي، محمد الهزامي، على جاهزية فريقه أمام حامل اللقب الهلال.",
    image: "https://picsum.photos/seed/news11/200/120",
  },
  {
    id: "n12",
    title: "سان جيرمان يجهز مقاومة سارة مفاجأة لـ ميسي في الصيف",
    excerpt:
      "يجهز مسؤولو باريس سان جيرمان، مفاجأة سارة لنجمه الأرجنتيني ليونيل ميسي، نجم الفريق.",
    image: "https://picsum.photos/seed/news12/200/120",
  },
  {
    id: "n13",
    title: "بيانيج يخطف كأس السوبر الأرجنتيني لبوكا جونيورز",
    excerpt:
      "توج فريق بوكا جونيورز بكأس السوبر الأرجنتيني بعد تغلبه على نادي راسينغ كلوب بثلاثة أهداف.",
    image: "https://picsum.photos/seed/news13/200/120",
  },
  {
    id: "n14",
    title: "استمرار حلم اليونايتد ومصاعبة شبابية الأبرز في صحف إنجلترا",
    excerpt:
      "اهتمت الصحف الإنجليزية الصادرة صباح اليوم الخميس، بأنهل مانشستر يونايتد إلى ربع نهائي كأس الاتحاد الإنجليزي.",
    image: "https://picsum.photos/seed/news14/200/120",
  },
  {
    id: "n15",
    title: "بعد خماسية البيلي.. هل يواصل البرسا مسلسل الانتقام أمام برشلونة؟",
    excerpt:
      "بخماسية شبلتة تقع على أنقاض الكلاسيكو، يرتدي ريال مدريد وبرشلونة إلى ذهاب نهائي كأس ملك إسبانيا.",
    image: "https://picsum.photos/seed/news15/200/120",
  },
  {
    id: "n16",
    title: "موتا يرد على أنباء ترشيحه لتدريب سان جيرمان",
    excerpt:
      "كسر تياجو موتا، مدرب بولونيا الإيطالي، حاجز الصمت بشأن إمكانية قيادة فريقه الجديد، باريس سان جيرمان الفرنسي.",
    image: "https://picsum.photos/seed/news16/200/120",
  },
  {
    id: "n17",
    title: "اخترا بالكلك الآن.. عروض مثيرة لمتابعة الدوري السعودي على شاهد VIP",
    excerpt:
      "لقد منحت شاهد VIP تغطية حصرية لمتابعة دوري 'روشن' السعودي، بإذاعة جميع المباريات مباشرة.",
    image: "https://picsum.photos/seed/news17/200/120",
  },
];

export const mostRead: NewsItem[] = [
  {
    id: "mr1",
    title: "عرض فني سعودي يستهدف ميسي",
    excerpt: "",
    image: "https://picsum.photos/seed/mr1/80/60",
  },
  {
    id: "mr2",
    title: "تشكيلة الكلاسيكو المتوقعة.. تشيلوني في خير.. ويشتكة إيجابية ليمكيه...",
    excerpt: "",
    image: "https://picsum.photos/seed/mr2/80/60",
  },
  {
    id: "mr3",
    title: "برشلونة يحسم القرار الصعب بشأن لـيفاندوفسكي قبل الكلاسيكو",
    excerpt: "",
    image: "https://picsum.photos/seed/mr3/80/60",
  },
  {
    id: "mr4",
    title: "قرعة صعبة لليوفنتوس وسهلة للسيتي في ربع نهائي كأس الاتحاد الإنجليزي",
    excerpt: "",
    image: "https://picsum.photos/seed/mr4/80/60",
  },
  {
    id: "mr5",
    title: "نبأ سار لبرشلونة قبل الكلاسيكو",
    excerpt: "",
    image: "https://picsum.photos/seed/mr5/80/60",
  },
  {
    id: "mr6",
    title: "أشنيرتي بعدد لاعبا لا في عش غد في ريال مدريد",
    excerpt: "",
    image: "https://picsum.photos/seed/mr6/80/60",
  },
];

export const articles: Article[] = [
  {
    id: "a1",
    title: 'معضلة التحكيم وتقنية الـ"VAR"',
    author: "أحمد اليدياني",
    authorAvatar: "https://picsum.photos/seed/author1/60",
    country: "🇦🇪",
  },
  {
    id: "a2",
    title: "تهانينا وانشادة",
    author: "هاشم إبراهيم",
    authorAvatar: "https://picsum.photos/seed/author2/60",
    country: "🇦🇪",
  },
  {
    id: "a3",
    title: "أزمة قطر في لا قراءة الكلم الصمانية",
    author: "ريال البحصلي",
    authorAvatar: "https://picsum.photos/seed/author3/60",
    country: "🇸🇦",
  },
];

export const videoPicks: VideoItem[] = [
  { id: "v1", title: "فيديو 1", image: "https://picsum.photos/seed/v1/220/140" },
  { id: "v2", title: "فيديو 2", image: "https://picsum.photos/seed/v2/220/140" },
  { id: "v3", title: "فيديو 3", image: "https://picsum.photos/seed/v3/220/140" },
];

export const leagueSections = [
  {
    id: "epl",
    title: "الدوري الإنجليزي الممتاز",
    items: topNews.slice(0, 3),
  },
  {
    id: "serieA",
    title: "الدوري الإيطالي الدرجة A",
    items: topNews.slice(3, 6),
  },
  {
    id: "laliga",
    title: "الدوري الإسباني الدرجة الأولى",
    items: topNews.slice(6, 9),
  },
  {
    id: "acl",
    title: "دوري أبطال آسيا",
    items: topNews.slice(9, 12),
  },
];

export const currentTournaments = [
  { id: "t1", name: "كأس الكونفدرالية", logo: "https://picsum.photos/seed/t1/80" },
  { id: "t2", name: "دوري أبطال أفريقيا", logo: "https://picsum.photos/seed/t2/80" },
  { id: "t3", name: "دوري أبطال آسيا", logo: "https://picsum.photos/seed/t3/80" },
  { id: "t4", name: "الدوري الأوروبي", logo: "https://picsum.photos/seed/t4/80" },
  { id: "t5", name: "دوري أبطال أوروبا", logo: "https://picsum.photos/seed/t5/80" },
];

export const sidebarVideos: VideoItem[] = [
  {
    id: "sv1",
    title: "مؤامرة فيينسي ورونالدو.. لتستبر أولوياتي الكبرى",
    image: "https://picsum.photos/seed/sv1/260/150",
  },
  {
    id: "sv2",
    title: "4 أندية أبدت أدي تحكمها",
    image: "https://picsum.photos/seed/sv2/100/70",
  },
  {
    id: "sv3",
    title: "فيديو",
    image: "https://picsum.photos/seed/sv3/100/70",
  },
  {
    id: "sv4",
    title: "فيديو",
    image: "https://picsum.photos/seed/sv4/100/70",
  },
];
