-- Seed data for kooora.com
-- Idempotent: re-running this updates existing rows by unique columns.

-- =====================================================================
-- countries
-- =====================================================================
insert into public.countries (code, name_ar, name_en) values
  ('eu',     'أوروبا',     'Europe'),
  ('es',     'إسبانيا',    'Spain'),
  ('it',     'إيطاليا',    'Italy'),
  ('gb-eng', 'إنجلترا',    'England'),
  ('gb-wls', 'ويلز',       'Wales'),
  ('de',     'ألمانيا',    'Germany'),
  ('fr',     'فرنسا',      'France'),
  ('nl',     'هولندا',     'Netherlands'),
  ('pt',     'البرتغال',   'Portugal'),
  ('be',     'بلجيكا',     'Belgium'),
  ('hr',     'كرواتيا',    'Croatia'),
  ('pl',     'بولندا',     'Poland'),
  ('no',     'النرويج',    'Norway'),
  ('ar',     'الأرجنتين',  'Argentina'),
  ('br',     'البرازيل',   'Brazil'),
  ('uy',     'الأوروغواي', 'Uruguay'),
  ('sn',     'السنغال',    'Senegal'),
  ('sa',     'السعودية',   'Saudi Arabia'),
  ('eg',     'مصر',        'Egypt'),
  ('ma',     'المغرب',     'Morocco'),
  ('ae',     'الإمارات',   'UAE')
on conflict (code) do update set name_ar = excluded.name_ar;

-- =====================================================================
-- leagues / competitions
-- =====================================================================
-- external_id_sdb is TheSportsDB's idLeague — used by the standings + fixtures
-- sync. Major European leagues are well covered; cup competitions and Champions
-- League standings vary in quality on TheSportsDB.
insert into public.leagues (slug, name_ar, name_en, country_id, is_top, sort_order, external_id_sdb)
select v.slug, v.name_ar, v.name_en,
       (select id from public.countries where code = v.country_code),
       v.is_top, v.sort_order, nullif(v.external_id_sdb, 0)
from (values
  ('champions-league', 'دوري أبطال أوروبا',  'Champions League',  'eu',     true,  1,  4480),
  ('europa-league',    'الدوري الأوروبي',     'Europa League',     'eu',     true,  2,  4481),
  ('laliga',           'الدوري الإسباني',     'LaLiga',            'es',     true,  3,  4335),
  ('copa-del-rey',     'كأس ملك إسبانيا',     'Copa del Rey',      'es',     false, 4,  0),
  ('serie-a',          'الدوري الإيطالي A',   'Serie A',           'it',     true,  5,  4332),
  ('serie-b',          'الدوري الإيطالي B',   'Serie B',           'it',     false, 6,  0),
  ('premier-league',   'الدوري الإنجليزي',    'Premier League',    'gb-eng', true,  7,  4328),
  ('bundesliga',       'الدوري الألماني',     'Bundesliga',        'de',     true,  8,  4331),
  ('ligue-1',          'الدوري الفرنسي',      'Ligue 1',           'fr',     true,  9,  4334),
  ('eredivisie',       'الدوري الهولندي',     'Eredivisie',        'nl',     true,  10, 4337),
  ('primeira-liga',    'الدوري البرتغالي',    'Primeira Liga',     'pt',     true,  11, 4344)
) as v(slug, name_ar, name_en, country_code, is_top, sort_order, external_id_sdb)
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  country_id = excluded.country_id,
  is_top = excluded.is_top,
  sort_order = excluded.sort_order,
  external_id_sdb = excluded.external_id_sdb;

-- =====================================================================
-- teams
-- =====================================================================
insert into public.teams
  (slug, name_ar, name_en, country_id, league_id, external_id, is_top, sort_order, logo_url)
select v.slug, v.name_ar, v.name_en,
       (select id from public.countries where code = v.country_code),
       (select id from public.leagues   where slug = v.league_slug),
       v.external_id, v.is_top, v.sort_order,
       'https://media.api-sports.io/football/teams/' || v.external_id || '.png'
from (values
  ('real-madrid',       'ريال مدريد',          'Real Madrid',       'es',     'laliga',         541,  true, 1),
  ('barcelona',         'برشلونة',             'FC Barcelona',      'es',     'laliga',         529,  true, 2),
  ('atletico-madrid',   'أتلتيكو مدريد',       'Atletico Madrid',   'es',     'laliga',         530,  true, 3),
  ('manchester-united', 'مانشستر يونايتد',     'Manchester United', 'gb-eng', 'premier-league', 33,   true, 4),
  ('chelsea',           'تشيلسي',              'Chelsea',           'gb-eng', 'premier-league', 49,   true, 5),
  ('arsenal',           'أرسنال',              'Arsenal',           'gb-eng', 'premier-league', 42,   true, 6),
  ('tottenham',         'توتنهام هوتسبير',     'Tottenham',         'gb-eng', 'premier-league', 47,   true, 7),
  ('manchester-city',   'مانشستر سيتي',        'Manchester City',   'gb-eng', 'premier-league', 50,   true, 8),
  ('liverpool',         'ليفربول',             'Liverpool',         'gb-eng', 'premier-league', 40,   true, 9),
  ('milan',             'ميلان',               'AC Milan',          'it',     'serie-a',        489,  true, 10),
  ('roma',              'روما',                'AS Roma',           'it',     'serie-a',        497,  true, 11),
  ('inter',             'إنتر ميلان',          'Inter Milan',       'it',     'serie-a',        505,  true, 12),
  ('juventus',          'يوفنتوس',             'Juventus',          'it',     'serie-a',        496,  false, 13),
  ('bayern-munich',     'بايرن ميونيخ',        'Bayern Munich',     'de',     'bundesliga',     157,  true, 14),
  ('dortmund',          'بوروسيا دورتموند',    'Borussia Dortmund', 'de',     'bundesliga',     165,  true, 15),
  ('schalke',           'شالكه',               'Schalke 04',        'de',     'bundesliga',     176,  true, 16),
  ('psg',               'باريس سان جيرمان',    'PSG',               'fr',     'ligue-1',        85,   true, 17),
  ('monaco',            'موناكو',              'AS Monaco',         'fr',     'ligue-1',        91,   true, 18)
) as v(slug, name_ar, name_en, country_code, league_slug, external_id, is_top, sort_order)
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  league_id = excluded.league_id,
  external_id = excluded.external_id,
  logo_url = excluded.logo_url,
  is_top = excluded.is_top,
  sort_order = excluded.sort_order;

-- =====================================================================
-- matches (top matches today)
-- =====================================================================
delete from public.matches where round_label = 'seed';

insert into public.matches (league_id, home_team_id, away_team_id, kickoff_at, status, round_label)
select
  (select id from public.leagues where slug = v.league_slug),
  (select id from public.teams where slug = v.home_slug),
  (select id from public.teams where slug = v.away_slug),
  (now() at time zone 'utc') + (v.minutes_from_now || ' minutes')::interval,
  v.status::match_status,
  'seed'
from (values
  ('laliga',         'barcelona',       'real-madrid',       180, 'scheduled'),
  ('premier-league', 'manchester-city', 'arsenal',           90,  'scheduled'),
  ('serie-a',        'milan',           'inter',             120, 'scheduled'),
  ('bundesliga',     'bayern-munich',   'dortmund',          240, 'scheduled'),
  ('ligue-1',        'psg',             'monaco',            60,  'scheduled'),
  ('premier-league', 'liverpool',       'chelsea',           300, 'scheduled')
) as v(league_slug, home_slug, away_slug, minutes_from_now, status);

-- =====================================================================
-- posts (news / articles)
-- =====================================================================
insert into public.posts (slug, kind, title, excerpt, body, cover_url, is_published, is_featured, published_at)
values
  (
    'real-madrid-celta-vigo-target',
    'news',
    'ريال مدريد يخطط لضم نجم سيلتا فيغو',
    'وجه مسؤولو ريال مدريد أنظارهم صوب أحد اللاعبين البارزين في صفوف سيلتا فيغو، لضمه خلال الميركاتو الصيفي المقبل.',
    'تشير صحيفة موندو ديبورتيفو إلى أن إدارة ريال مدريد تتابع عن كثب الموهبة الشابة في صفوف سيلتا فيغو منذ بداية الموسم. اللاعب يقدم أداءات لافتة ولفت أنظار العديد من الأندية الأوروبية الكبرى.',
    'https://picsum.photos/seed/news2/600/360',
    true, true, now() - interval '1 hour'
  ),
  (
    'fa-cup-quarter-final-draw',
    'news',
    'قرعة صعبة لليوفنتوس وسهلة للسيتي في ربع نهائي كأس الاتحاد الإنجليزي',
    'أوقعت قرعة ربع نهائي كأس الاتحاد الإنجليزي يوفنتوس الإيطالي في مواجهة صعبة أمام مانشستر سيتي الإنجليزي بطل الموسم الماضي.',
    'جرت مراسم قرعة ربع نهائي كأس الاتحاد الإنجليزي اليوم وسط حضور لافت لعدد من نجوم الكرة الإنجليزية. وأسفرت القرعة عن مواجهات قوية أبرزها اللقاء بين يوفنتوس ومانشستر سيتي.',
    'https://picsum.photos/seed/news1/600/360',
    true, true, now() - interval '3 hours'
  ),
  (
    'benzema-best-award',
    'video',
    'أنت كذلك.. لمن وجه بنزيما أصابع الاتهام بسرقة جائزة الأفضل منه؟',
    'لمن يوجّه بنزيما الاتهام بسرقة جائزة الأفضل منه... شاهد التفاصيل في هذا الفيديو.',
    null,
    'https://picsum.photos/seed/news3/600/360',
    true, false, now() - interval '5 hours'
  ),
  (
    'hakimi-psg',
    'news',
    'إدارة سان جيرمان مصدومة من انسحاب حكيمي',
    'تحدث تقرير صحفي عن موقف باريس سان جيرمان من الانسحاب المثير الذي ارتكبه لاعبه المغربي أشرف حكيمي.',
    'كشف تقرير لصحيفة لو باريسيان أن إدارة باريس سان جيرمان فوجئت بقرار اللاعب المغربي أشرف حكيمي بالانسحاب من المباراة الأخيرة بعد توتر مع المدرب.',
    'https://picsum.photos/seed/news4/600/360',
    true, false, now() - interval '8 hours'
  ),
  (
    'ronaldo-saudi-league',
    'video',
    'رونالدو بين عدلاين.. هل يكسر الدون تفوق الثنائي الأسطوري في الدوري؟',
    'تعرف على التفاصيل في هذا الفيديو.',
    null,
    'https://picsum.photos/seed/news5/600/360',
    true, false, now() - interval '12 hours'
  ),
  (
    'arsenal-everton',
    'news',
    'بالصور.. أرسنال يطير بصدارة البريميرليج على أنقاض إفرتون',
    'حقق أرسنال بصدارة الدوري الإنجليزي الممتاز، بعدما هزم الضيف إفرتون (4-0)، في مباراة مؤجلة من الجولة السادسة.',
    'سجل أرسنال أربعة أهداف نظيفة في مرمى إفرتون ليعزز صدارته للدوري الإنجليزي. تألق غابرييل مارتينيلي بثنائية فيما أضاف ساكا ومارتن أوديغارد الهدفين الآخرين.',
    'https://picsum.photos/seed/news6/600/360',
    true, false, now() - interval '1 day'
  ),
  (
    'messi-best-awards-behind-scenes',
    'video',
    'لحظة تاريخية لميسي ونظرات مارتينيز.. شاهد كواليس حفل الأفضل',
    'تعرف من خلال الفيديو المرفق، على أبرز كواليس حفل جوائز الأفضل، والمقدمة من الاتحاد الدولي لكرة القدم.',
    null,
    'https://picsum.photos/seed/news7/600/360',
    true, false, now() - interval '1 day'
  ),
  (
    'xavi-christensen-clasico',
    'news',
    'تشافي يحسم موقف كريستينسن من الكلاسيكو',
    'حسم تشافي هيرنانديز، المدير الفني لبرشلونة، موقف أندرياس كريستينسن، المدافع الدنماركي من المشاركة أمام ريال مدريد.',
    'أكد تشافي خلال المؤتمر الصحفي قبل الكلاسيكو أن كريستينسن جاهز للمشاركة بعد التعافي من إصابته الأخيرة. وأشاد المدرب الإسباني بجاهزية الفريق للمواجهة المرتقبة.',
    'https://picsum.photos/seed/news8/600/360',
    true, false, now() - interval '1 day 4 hours'
  ),
  (
    'serie-a-best-goals-round-24',
    'video',
    'هدف من منتصف الملعب يتصدر أفضل أهداف الجولة 24 بالكالتشيو',
    'شاهد في هذا الفيديو أفضل 5 أهداف بالمرحلة 24 من الدوري الإيطالي.',
    null,
    'https://picsum.photos/seed/news10/600/360',
    true, false, now() - interval '2 days'
  ),
  (
    'wahda-hilal-preview',
    'news',
    'الجزائري كوبوروز: الوحدة قادر على تحقيق إيجابية أمام الهلال',
    'شدد مدير كرة القدم بنادي الوحدة الإماراتي على جاهزية فريقه أمام حامل اللقب الهلال.',
    'في مؤتمر صحفي مشحون أكد المدير الرياضي ثقته الكاملة بقدرة فريقه على المنافسة رغم صعوبة المهمة. وشدد على أن الوحدة لن يكون لقمة سائغة للهلال.',
    'https://picsum.photos/seed/news11/600/360',
    true, false, now() - interval '2 days 6 hours'
  ),
  (
    'psg-messi-summer',
    'news',
    'سان جيرمان يجهز مفاجأة سارة لميسي في الصيف',
    'يجهز مسؤولو باريس سان جيرمان، مفاجأة سارة لنجمه الأرجنتيني ليونيل ميسي، نجم الفريق.',
    'تشير المصادر القريبة من النادي الباريسي إلى أن ميسي سيحصل على عرض تجديد بشروط استثنائية، تشمل زيادة ملحوظة في الراتب وامتيازات تسويقية.',
    'https://picsum.photos/seed/news12/600/360',
    true, false, now() - interval '3 days'
  ),
  (
    'boca-super-cup',
    'news',
    'بوكا جونيورز يخطف كأس السوبر الأرجنتيني',
    'توج فريق بوكا جونيورز بكأس السوبر الأرجنتيني بعد تغلبه على راسينغ كلوب بثلاثة أهداف.',
    'في مباراة قوية على ملعب لا بومبونيرا، تمكن بوكا من حسم اللقب أمام جماهيره بهدف في كل شوط ثم هدف ثالث في الدقائق الأخيرة. اللقب الـ50 في تاريخ النادي.',
    'https://picsum.photos/seed/news13/600/360',
    true, false, now() - interval '3 days 4 hours'
  )
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  cover_url = excluded.cover_url,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured,
  published_at = excluded.published_at,
  updated_at = now();

-- Make some posts most-read by bumping view_count
update public.posts set view_count = 1500 where slug = 'fa-cup-quarter-final-draw';
update public.posts set view_count = 1320 where slug = 'real-madrid-celta-vigo-target';
update public.posts set view_count = 1180 where slug = 'arsenal-everton';
update public.posts set view_count = 980  where slug = 'xavi-christensen-clasico';
update public.posts set view_count = 720  where slug = 'hakimi-psg';
update public.posts set view_count = 640  where slug = 'ronaldo-saudi-league';

-- =====================================================================
-- polls
-- =====================================================================
insert into public.polls (id, question, is_active)
values ('00000000-0000-0000-0000-000000000001'::uuid, 'من سيذهب للنهائي العراق أم اليابان؟', true)
on conflict (id) do update set question = excluded.question, is_active = excluded.is_active;

delete from public.poll_options where poll_id = '00000000-0000-0000-0000-000000000001'::uuid;
insert into public.poll_options (poll_id, label, votes, sort_order) values
  ('00000000-0000-0000-0000-000000000001'::uuid, 'العراق',  120, 0),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'اليابان', 240, 1);

-- =====================================================================
-- site_settings
-- =====================================================================
insert into public.site_settings (key, value) values
  ('header_banner_url', '"/img/header-bg.jpg"'::jsonb),
  ('sidebar_ad_url',    '""'::jsonb),
  ('featured_video_url','"https://www.youtube.com/watch?v=BHACKCNDMW8"'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- =====================================================================
-- players
-- Photo URLs use Wikipedia commons (public domain / CC) for known stars,
-- so they render reliably without an API key. Players without a confirmed
-- photo URL get null and the UI shows a placeholder.
-- =====================================================================
insert into public.players
  (slug, name_ar, name_en, team_id, country_id, position, photo_url, birth_date)
select
  v.slug, v.name_ar, v.name_en,
  (select id from public.teams     where slug = v.team_slug),
  (select id from public.countries where code = v.country_code),
  v.position,
  nullif(v.photo_url, '')::text,
  nullif(v.birth_date, '')::date
from (values
  -- Real Madrid
  ('vinicius-jr',         'فينيسيوس جونيور',          'Vinícius Júnior',        'real-madrid',       'br',     'مهاجم',     '', '2000-07-12'),
  ('jude-bellingham',     'جود بيلينغهام',            'Jude Bellingham',        'real-madrid',       'gb-eng', 'وسط هجومي', '', '2003-06-29'),
  ('rodrygo',             'رودريغو',                  'Rodrygo',                'real-madrid',       'br',     'مهاجم',     '', '2001-01-09'),
  ('luka-modric',         'لوكا مودريتش',             'Luka Modrić',            'real-madrid',       'hr',     'وسط',       '', '1985-09-09'),
  ('thibaut-courtois',    'تيبو كورتوا',              'Thibaut Courtois',       'real-madrid',       'be',     'حارس مرمى', '', '1992-05-11'),

  -- Barcelona
  ('robert-lewandowski',  'روبرت ليفاندوفسكي',        'Robert Lewandowski',     'barcelona',         'pl',     'مهاجم',     '', '1988-08-21'),
  ('lamine-yamal',        'لامين يامال',              'Lamine Yamal',           'barcelona',         'es',     'جناح',      '', '2007-07-13'),
  ('pedri',               'بيدري',                    'Pedri',                  'barcelona',         'es',     'وسط',       '', '2002-11-25'),
  ('frenkie-de-jong',     'فرينكي دي يونغ',           'Frenkie de Jong',        'barcelona',         'nl',     'وسط',       '', '1997-05-12'),
  ('marc-andre-ter-stegen','مارك أندريه تير شتيغن',   'Marc-André ter Stegen',  'barcelona',         'de',     'حارس مرمى', '', '1992-04-30'),

  -- Atlético Madrid
  ('antoine-griezmann',   'أنطوان غريزمان',           'Antoine Griezmann',      'atletico-madrid',   'fr',     'مهاجم',     '', '1991-03-21'),
  ('joao-felix',          'جواو فيليكس',              'João Félix',             'atletico-madrid',   'pt',     'مهاجم',     '', '1999-11-10'),

  -- Manchester City
  ('erling-haaland',      'إيرلينغ هالاند',           'Erling Haaland',         'manchester-city',   'no',     'مهاجم',     '', '2000-07-21'),
  ('kevin-de-bruyne',     'كيفين دي بروين',           'Kevin De Bruyne',        'manchester-city',   'be',     'وسط هجومي', '', '1991-06-28'),
  ('rodri',               'رودري',                    'Rodri',                  'manchester-city',   'es',     'وسط',       '', '1996-06-22'),
  ('phil-foden',          'فيل فودين',                'Phil Foden',             'manchester-city',   'gb-eng', 'وسط هجومي', '', '2000-05-28'),

  -- Liverpool
  ('mohamed-salah',       'محمد صلاح',                'Mohamed Salah',          'liverpool',         'eg',     'جناح',      '', '1992-06-15'),
  ('virgil-van-dijk',     'فيرجيل فان دايك',          'Virgil van Dijk',        'liverpool',         'nl',     'مدافع',     '', '1991-07-08'),
  ('alisson',             'أليسون بيكر',              'Alisson Becker',         'liverpool',         'br',     'حارس مرمى', '', '1992-10-02'),

  -- Arsenal
  ('bukayo-saka',         'بوكايو ساكا',              'Bukayo Saka',            'arsenal',           'gb-eng', 'جناح',      '', '2001-09-05'),
  ('martin-odegaard',     'مارتن أوديغارد',           'Martin Ødegaard',        'arsenal',           'no',     'وسط هجومي', '', '1998-12-17'),
  ('declan-rice',         'ديكلان رايس',              'Declan Rice',            'arsenal',           'gb-eng', 'وسط',       '', '1999-01-14'),

  -- Chelsea
  ('cole-palmer',         'كول بالمر',                'Cole Palmer',            'chelsea',           'gb-eng', 'وسط هجومي', '', '2002-05-06'),
  ('enzo-fernandez',      'إنزو فيرنانديز',           'Enzo Fernández',         'chelsea',           'ar',     'وسط',       '', '2001-01-17'),

  -- Manchester United
  ('marcus-rashford',     'ماركوس راشفورد',           'Marcus Rashford',        'manchester-united', 'gb-eng', 'مهاجم',     '', '1997-10-31'),
  ('bruno-fernandes',     'برونو فيرنانديز',          'Bruno Fernandes',        'manchester-united', 'pt',     'وسط هجومي', '', '1994-09-08'),

  -- Tottenham
  ('son-heung-min',       'سون هيونغ-مين',            'Son Heung-min',          'tottenham',         'eu',     'مهاجم',     '', '1992-07-08'),

  -- Bayern Munich
  ('harry-kane',          'هاري كين',                 'Harry Kane',             'bayern-munich',     'gb-eng', 'مهاجم',     '', '1993-07-28'),
  ('jamal-musiala',       'جمال موسيالا',             'Jamal Musiala',          'bayern-munich',     'de',     'وسط هجومي', '', '2003-02-26'),
  ('manuel-neuer',        'مانويل نوير',              'Manuel Neuer',           'bayern-munich',     'de',     'حارس مرمى', '', '1986-03-27'),

  -- Borussia Dortmund
  ('marco-reus',          'ماركو رويس',               'Marco Reus',             'dortmund',          'de',     'وسط هجومي', '', '1989-05-31'),

  -- Inter Milan
  ('lautaro-martinez',    'لاوتارو مارتينيز',         'Lautaro Martínez',       'inter',             'ar',     'مهاجم',     '', '1997-08-22'),
  ('nicolo-barella',      'نيكولو باريلا',            'Nicolò Barella',         'inter',             'it',     'وسط',       '', '1997-02-07'),

  -- AC Milan
  ('rafael-leao',         'رافاييل لياو',             'Rafael Leão',            'milan',             'pt',     'جناح',      '', '1999-06-10'),

  -- Roma
  ('paulo-dybala',        'باولو ديبالا',             'Paulo Dybala',           'roma',              'ar',     'مهاجم',     '', '1993-11-15'),

  -- PSG
  ('ousmane-dembele',     'عثمان ديمبيلي',            'Ousmane Dembélé',        'psg',               'fr',     'جناح',      '', '1997-05-15'),
  ('marquinhos',          'ماركينيوس',                'Marquinhos',             'psg',               'br',     'مدافع',     '', '1994-05-14'),
  ('achraf-hakimi',       'أشرف حكيمي',               'Achraf Hakimi',          'psg',               'ma',     'مدافع',     '', '1998-11-04'),

  -- National-team stars without a current team in our seed
  ('cristiano-ronaldo',   'كريستيانو رونالدو',        'Cristiano Ronaldo',      null,                'pt',     'مهاجم',     '', '1985-02-05'),
  ('karim-benzema',       'كريم بنزيمة',              'Karim Benzema',          null,                'fr',     'مهاجم',     '', '1987-12-19'),
  ('neymar',              'نيمار',                    'Neymar Jr.',             null,                'br',     'جناح',      '', '1992-02-05'),
  ('lionel-messi',        'ليونيل ميسي',              'Lionel Messi',           null,                'ar',     'مهاجم',     '', '1987-06-24'),
  ('hakim-ziyech',        'حكيم زياش',                'Hakim Ziyech',           null,                'ma',     'وسط هجومي', '', '1993-03-19')
) as v(slug, name_ar, name_en, team_slug, country_code, position, photo_url, birth_date)
on conflict (slug) do update set
  name_ar     = excluded.name_ar,
  name_en     = excluded.name_en,
  team_id     = excluded.team_id,
  country_id  = excluded.country_id,
  position    = excluded.position,
  photo_url   = excluded.photo_url,
  birth_date  = excluded.birth_date;
