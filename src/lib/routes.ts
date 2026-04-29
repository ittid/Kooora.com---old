// Single source of truth for navigation labels and their routes.

export const navGroups: { label: string; href: string }[][] = [
  [
    { label: "الرئيسية", href: "/" },
    { label: "أخبار", href: "/news" },
    { label: "مسابقات", href: "/competitions" },
    { label: "فرق", href: "/teams" },
    { label: "لاعبون", href: "/players" },
  ],
  [
    { label: "مباريات", href: "/matches" },
    { label: "الآن", href: "/matches/live" },
    { label: "اليوم", href: "/matches/today" },
    { label: "غداً", href: "/matches/tomorrow" },
    { label: "أمس", href: "/matches/yesterday" },
  ],
  [
    { label: "أحدث حية", href: "/live" },
    { label: "تنس", href: "/tennis" },
    { label: "رياضات", href: "/sports" },
    { label: "TV", href: "/tv" },
    { label: "صور", href: "/photos" },
    { label: "منتديات", href: "/forums" },
    { label: "مزيد", href: "/more" },
    { label: "مفضلتي", href: "/favorites" },
  ],
];

export const footerColumns: { label: string; href: string }[][] = [
  [
    { label: "أخبار", href: "/news" },
    { label: "فرق", href: "/teams" },
    { label: "لاعبون", href: "/players" },
    { label: "مباريات", href: "/matches" },
    { label: "جميع المسابقات", href: "/competitions" },
    { label: "رياضات أخرى", href: "/sports" },
  ],
  [
    { label: "TV", href: "/tv" },
    { label: "صور", href: "/photos" },
    { label: "منتديات", href: "/forums" },
  ],
  [
    { label: "مباريات جارية الآن", href: "/matches/live" },
    { label: "مباريات اليوم", href: "/matches/today" },
    { label: "مباريات الغد", href: "/matches/tomorrow" },
    { label: "مباريات الأمس", href: "/matches/yesterday" },
  ],
  [
    { label: "الدوري الاسباني", href: "/competitions/laliga" },
    { label: "الدوري الانجليزي", href: "/competitions/premier-league" },
    { label: "الدوري الايطالي", href: "/competitions/serie-a" },
    { label: "دوري ابطال اوروبا", href: "/competitions/champions-league" },
  ],
  [
    { label: "سياسة الاستخدام", href: "/policy" },
    { label: "اتصل بنا", href: "/contact" },
    { label: "اعلن معنا", href: "/advertise" },
  ],
];

// Mega-menu data shown when hovering top-nav items.
// `searchPlaceholder` = right-aligned label above the search box on the far left.
export type MegaColumn = {
  title: string;
  items: { label: string; href: string }[];
  footer?: { label: string; href: string };
};

export type MegaMenu = {
  columns: MegaColumn[];
  searchLabel?: string;
  searchPlaceholder?: string;
};

export const megaMenus: Record<string, MegaMenu> = {
  "/news": {
    searchLabel: "ابحث في جميع الأخبار",
    searchPlaceholder: "ابحث",
    columns: [
      {
        title: "الأخبار و المقالات",
        items: [
          { label: "جميع الاخبار", href: "/news" },
          { label: "كرة عالمية", href: "/news/world" },
          { label: "كرة عربية", href: "/news/arab" },
          { label: "رياضات أخرى", href: "/news/other-sports" },
          { label: "تحليلات", href: "/news/analysis" },
          { label: "مقالات", href: "/news/articles" },
          { label: "أخبار مصورة", href: "/news/photo" },
        ],
      },
      {
        title: "أوروبا",
        items: [
          { label: "دوري أبطال أوروبا", href: "/competitions/champions-league" },
          { label: "الدوري الأوروبي", href: "/competitions/europa-league" },
        ],
      },
      {
        title: "إسبانيا",
        items: [
          { label: "الدوري الأول", href: "/competitions/laliga" },
          { label: "الكأس", href: "/competitions/copa-del-rey" },
        ],
      },
      {
        title: "إنجلترا",
        items: [
          { label: "الدوري الممتاز", href: "/competitions/premier-league" },
          { label: "الكأس", href: "/competitions/fa-cup" },
        ],
      },
      {
        title: "إيطاليا",
        items: [
          { label: "الدوري A", href: "/competitions/serie-a" },
          { label: "الكأس", href: "/competitions/coppa-italia" },
        ],
      },
      {
        title: "ألمانيا",
        items: [
          { label: "الدوري الأول", href: "/competitions/bundesliga" },
          { label: "الكأس", href: "/competitions/dfb-pokal" },
        ],
      },
      {
        title: "فرنسا",
        items: [
          { label: "الدوري الأول", href: "/competitions/ligue-1" },
          { label: "الكأس", href: "/competitions/coupe-de-france" },
        ],
      },
    ],
  },

  "/competitions": {
    searchLabel: "ابحث عن مسابقات",
    searchPlaceholder: "ابحث",
    columns: [
      {
        title: "مسابقات دولية و إقليمية",
        items: [
          { label: "مسابقات عالمية", href: "/competitions/world" },
          { label: "أوروبا", href: "/competitions/europe" },
          { label: "الدول العربية", href: "/competitions/arab" },
          { label: "آسيا", href: "/competitions/asia" },
          { label: "أفريقيا", href: "/competitions/africa" },
          { label: "عبر أمريكية", href: "/competitions/copa-america" },
          { label: "أمريكا الجنوبية", href: "/competitions/south-america" },
          { label: "أمريكا الشمالية و الوسطى", href: "/competitions/concacaf" },
          { label: "أوقيانوسيا", href: "/competitions/oceania" },
          { label: "الألعاب الأولمبية", href: "/competitions/olympics" },
        ],
      },
      {
        title: "الدول الأوروبية",
        items: [
          { label: "إسبانيا", href: "/competitions/country/spain" },
          { label: "إنجلترا", href: "/competitions/country/england" },
          { label: "إيطاليا", href: "/competitions/country/italy" },
          { label: "ألمانيا", href: "/competitions/country/germany" },
          { label: "فرنسا", href: "/competitions/country/france" },
          { label: "هولندا", href: "/competitions/country/netherlands" },
          { label: "البرتغال", href: "/competitions/country/portugal" },
          { label: "تركيا", href: "/competitions/country/turkey" },
          { label: "روسيا", href: "/competitions/country/russia" },
          { label: "أوكرانيا", href: "/competitions/country/ukraine" },
        ],
      },
      {
        title: "الدول الآسيوية",
        items: [
          { label: "السعودية", href: "/competitions/country/saudi-arabia" },
          { label: "الكويت", href: "/competitions/country/kuwait" },
          { label: "الإمارات", href: "/competitions/country/uae" },
          { label: "قطر", href: "/competitions/country/qatar" },
          { label: "الأردن", href: "/competitions/country/jordan" },
          { label: "البحرين", href: "/competitions/country/bahrain" },
          { label: "العراق", href: "/competitions/country/iraq" },
          { label: "عمان", href: "/competitions/country/oman" },
          { label: "لبنان", href: "/competitions/country/lebanon" },
          { label: "فلسطين", href: "/competitions/country/palestine" },
        ],
      },
      {
        title: "الدول الأفريقية",
        items: [
          { label: "الجزائر", href: "/competitions/country/algeria" },
          { label: "المغرب", href: "/competitions/country/morocco" },
          { label: "ليبيا", href: "/competitions/country/libya" },
          { label: "مصر", href: "/competitions/country/egypt" },
          { label: "تونس", href: "/competitions/country/tunisia" },
          { label: "السودان", href: "/competitions/country/sudan" },
          { label: "موريتانيا", href: "/competitions/country/mauritania" },
          { label: "الصومال", href: "/competitions/country/somalia" },
          { label: "ساحل العاج", href: "/competitions/country/ivory-coast" },
          { label: "الكاميرون", href: "/competitions/country/cameroon" },
        ],
      },
      {
        title: "الأمريكيتان وأوقيانوسيا",
        items: [
          { label: "البرازيل", href: "/competitions/country/brazil" },
          { label: "الأرجنتين", href: "/competitions/country/argentina" },
          { label: "الولايات المتحدة الأمريكية", href: "/competitions/country/usa" },
          { label: "المكسيك", href: "/competitions/country/mexico" },
          { label: "أوروغواي", href: "/competitions/country/uruguay" },
          { label: "نيو زيلندا", href: "/competitions/country/new-zealand" },
          { label: "تشيلي", href: "/competitions/country/chile" },
          { label: "الإكوادور", href: "/competitions/country/ecuador" },
          { label: "كولومبيا", href: "/competitions/country/colombia" },
          { label: "باراغواي", href: "/competitions/country/paraguay" },
        ],
      },
    ],
  },

  "/teams": {
    searchLabel: "ابحث عن فريق",
    searchPlaceholder: "ابحث",
    columns: [
      {
        title: "إسبانيا",
        items: [
          { label: "أتلتيك بلباو", href: "/teams/athletic-bilbao" },
          { label: "أتلتيكو مدريد", href: "/teams/atletico-madrid" },
          { label: "برشلونة", href: "/teams/barcelona" },
          { label: "ريال مدريد", href: "/teams/real-madrid" },
          { label: "فالنسيا", href: "/teams/valencia" },
        ],
        footer: { label: "فرق إسبانيا", href: "/teams/country/spain" },
      },
      {
        title: "انجلترا",
        items: [
          { label: "ارسنال", href: "/teams/arsenal" },
          { label: "تشيلسي", href: "/teams/chelsea" },
          { label: "ليفربول", href: "/teams/liverpool" },
          { label: "مانشستر سيتي", href: "/teams/manchester-city" },
          { label: "مانشستر يونايتد", href: "/teams/manchester-united" },
        ],
        footer: { label: "فرق إنجلترا", href: "/teams/country/england" },
      },
      {
        title: "إيطاليا",
        items: [
          { label: "انتر ميلان", href: "/teams/inter" },
          { label: "روما", href: "/teams/roma" },
          { label: "ميلان", href: "/teams/milan" },
          { label: "نابولي", href: "/teams/napoli" },
          { label: "يوفنتوس", href: "/teams/juventus" },
        ],
        footer: { label: "فرق إيطاليا", href: "/teams/country/italy" },
      },
      {
        title: "ألمانيا",
        items: [
          { label: "باير ليفركوزن", href: "/teams/leverkusen" },
          { label: "بايرن ميونخ", href: "/teams/bayern" },
          { label: "بروسيا دورتموند", href: "/teams/dortmund" },
          { label: "شالكه", href: "/teams/schalke" },
          { label: "فولفسبورج", href: "/teams/wolfsburg" },
        ],
        footer: { label: "فرق ألمانيا", href: "/teams/country/germany" },
      },
      {
        title: "فرنسا",
        items: [
          { label: "باريس سان جيرمان", href: "/teams/psg" },
          { label: "ليل", href: "/teams/lille" },
          { label: "ليون", href: "/teams/lyon" },
          { label: "مارسيليا", href: "/teams/marseille" },
          { label: "موناكو", href: "/teams/monaco" },
        ],
        footer: { label: "فرق فرنسا", href: "/teams/country/france" },
      },
    ],
  },

  "/players": {
    searchLabel: "ابحث عن لاعب",
    searchPlaceholder: "ابحث",
    columns: [
      {
        title: "الدوري الاسباني",
        items: [
          { label: "انطوان جريزمان", href: "/players/griezmann" },
          { label: "رافينيا", href: "/players/raphinha" },
          { label: "روبرت ليفاندوفسكي", href: "/players/lewandowski" },
          { label: "عثمان ديمبلي", href: "/players/dembele" },
          { label: "فينيسيوس جونيور", href: "/players/vinicius" },
          { label: "كريم بنزيما", href: "/players/benzema" },
        ],
      },
      {
        title: "الدوري الايطالي",
        items: [
          { label: "أنخيل دي ماريا", href: "/players/di-maria" },
          { label: "باولو ديبالا", href: "/players/dybala" },
          { label: "بول بوجبا", href: "/players/pogba" },
          { label: "روميلو لوكاكو", href: "/players/lukaku" },
          { label: "زلاتان إبراهيموفيتش", href: "/players/ibrahimovic" },
          { label: "لاوتارو مارتينيز", href: "/players/lautaro" },
        ],
      },
      {
        title: "الدوري الألماني",
        items: [
          { label: "جوشوا كيميتش", href: "/players/kimmich" },
          { label: "ساديو ماني", href: "/players/mane" },
          { label: "سيرج جنابري", href: "/players/gnabry" },
          { label: "ليروي سانيه", href: "/players/sane" },
          { label: "ماتس دي ليخت", href: "/players/de-ligt" },
          { label: "ماركو رويس", href: "/players/reus" },
        ],
      },
      {
        title: "الدوري الانجليزي",
        items: [
          { label: "إيرلينغ هالاند", href: "/players/haaland" },
          { label: "رياض محرز", href: "/players/mahrez" },
          { label: "غابرييل خيسوس", href: "/players/jesus" },
          { label: "كريستيانو رونالدو", href: "/players/ronaldo" },
          { label: "محمد صلاح", href: "/players/salah" },
          { label: "هاري كين", href: "/players/kane" },
        ],
      },
      {
        title: "الدوري الفرنسي",
        items: [
          { label: "أشرف حكيمي", href: "/players/hakimi" },
          { label: "اليكسيس سانشيز", href: "/players/sanchez" },
          { label: "سيرجيو راموس", href: "/players/ramos" },
          { label: "كيليان مبابي", href: "/players/mbappe" },
          { label: "ليونيل ميسي", href: "/players/messi" },
          { label: "نيمار", href: "/players/neymar" },
        ],
      },
    ],
  },

  "/matches": {
    columns: [
      {
        title: "مباريات حسب التاريخ",
        items: [
          { label: "مباريات جارية حالياً", href: "/matches/live" },
          { label: "مباريات اليوم", href: "/matches/today" },
          { label: "مباريات الغد", href: "/matches/tomorrow" },
          { label: "مباريات الأمس", href: "/matches/yesterday" },
          { label: "مباريات متلفزة", href: "/matches/tv" },
          { label: "أهم المباريات", href: "/matches/top" },
        ],
      },
      {
        title: "كرة القدم حسب المنطقة",
        items: [
          { label: "جميع المباريات", href: "/matches" },
          { label: "خرائط تفاعلية", href: "/matches/map" },
          { label: "مباريات أوروبا", href: "/matches/europe" },
          { label: "مباريات آسيا و أفريقيا", href: "/matches/asia-africa" },
          { label: "مباريات أمريكا وأوقيانوسيا", href: "/matches/americas-oceania" },
        ],
      },
      {
        title: "رياضات أخرى",
        items: [
          { label: "كرة السلة", href: "/sports/basketball" },
          { label: "كرة اليد", href: "/sports/handball" },
          { label: "الكرة الطائرة", href: "/sports/volleyball" },
          { label: "التنس", href: "/tennis" },
          { label: "رياضات أخرى", href: "/sports" },
        ],
      },
    ],
  },

  "/sports": {
    columns: [
      {
        title: "كرة قدم",
        items: [
          { label: "المباريات", href: "/matches" },
          { label: "المسابقات", href: "/competitions" },
          { label: "الأخبار", href: "/news" },
          { label: "اللاعبون", href: "/players" },
          { label: "الأرشيف", href: "/archive" },
          { label: "المنتدى", href: "/forums" },
        ],
      },
      {
        title: "تنس",
        items: [
          { label: "الصفحة الرئيسية", href: "/tennis" },
          { label: "المباريات", href: "/tennis/matches" },
          { label: "المسابقات", href: "/tennis/competitions" },
          { label: "الأخبار", href: "/tennis/news" },
          { label: "اللاعبون", href: "/tennis/players" },
          { label: "الأرشيف", href: "/tennis/archive" },
          { label: "المنتدى", href: "/tennis/forums" },
        ],
      },
      {
        title: "رياضات أخرى",
        items: [
          { label: "الفورملا 1", href: "/sports/f1" },
          { label: "كرة السلة", href: "/sports/basketball" },
          { label: "كرة اليد", href: "/sports/handball" },
          { label: "الكرة الطائرة", href: "/sports/volleyball" },
          { label: "قدم الصالات", href: "/sports/futsal" },
        ],
      },
      {
        title: "المباريات",
        items: [
          { label: "كرة السلة", href: "/sports/basketball/matches" },
          { label: "كرة اليد", href: "/sports/handball/matches" },
          { label: "الكرة الطائرة", href: "/sports/volleyball/matches" },
          { label: "جميع الرياضات", href: "/sports/matches" },
        ],
      },
    ],
  },
};

export const socialLinks = {
  instagram: "#",
  twitter: "#",
  facebook: "#",
  whatsapp: "#",
  tiktok: "#",
  youtube: "#",
};
