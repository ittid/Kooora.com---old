-- Kooora.com initial schema
-- Run this in your Supabase project: SQL editor > paste > run.

create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;

-- =====================================================================
-- profiles: extends auth.users with admin flag and display name
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- countries
-- =====================================================================
create table if not exists public.countries (
  id serial primary key,
  code text not null unique,        -- e.g. "es", "gb-eng"
  name_ar text not null,
  name_en text
);

-- =====================================================================
-- leagues / competitions
-- =====================================================================
create table if not exists public.leagues (
  id serial primary key,
  slug text not null unique,
  name_ar text not null,
  name_en text,
  country_id int references public.countries(id) on delete set null,
  logo_url text,
  is_top boolean not null default false,
  sort_order int not null default 0
);

-- =====================================================================
-- teams / clubs
-- =====================================================================
create table if not exists public.teams (
  id serial primary key,
  slug text not null unique,
  name_ar text not null,
  name_en text,
  country_id int references public.countries(id) on delete set null,
  logo_url text,
  external_id int,                  -- e.g. api-sports id
  is_top boolean not null default false,
  sort_order int not null default 0
);

-- =====================================================================
-- players
-- =====================================================================
create table if not exists public.players (
  id serial primary key,
  slug text not null unique,
  name_ar text not null,
  name_en text,
  team_id int references public.teams(id) on delete set null,
  country_id int references public.countries(id) on delete set null,
  photo_url text,
  position text,
  birth_date date
);

-- =====================================================================
-- matches
-- =====================================================================
create type match_status as enum ('scheduled', 'live', 'finished', 'postponed', 'cancelled');

create table if not exists public.matches (
  id serial primary key,
  league_id int references public.leagues(id) on delete set null,
  home_team_id int references public.teams(id) on delete set null,
  away_team_id int references public.teams(id) on delete set null,
  kickoff_at timestamptz not null,
  status match_status not null default 'scheduled',
  home_score int,
  away_score int,
  round_label text,
  venue text,
  created_at timestamptz not null default now()
);

create index if not exists matches_kickoff_idx on public.matches (kickoff_at desc);
create index if not exists matches_status_idx on public.matches (status);

-- =====================================================================
-- news / posts
-- =====================================================================
create type post_kind as enum ('news', 'article', 'video', 'interview');

create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  kind post_kind not null default 'news',
  title text not null,
  excerpt text,
  body text,
  cover_url text,
  video_url text,                   -- YouTube/Vimeo/mp4
  author_id uuid references public.profiles(id) on delete set null,
  league_id int references public.leagues(id) on delete set null,
  team_id int references public.teams(id) on delete set null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  view_count int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx on public.posts (is_published, published_at desc);
create index if not exists posts_kind_idx on public.posts (kind, published_at desc);

-- Full-text search (Arabic + simple)
alter table public.posts add column if not exists search_tsv tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(body, '')), 'C')
  ) stored;

create index if not exists posts_search_idx on public.posts using gin(search_tsv);
create index if not exists posts_title_trgm_idx on public.posts using gin (title gin_trgm_ops);

-- =====================================================================
-- polls (sondage) — sidebar widget
-- =====================================================================
create table if not exists public.polls (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id uuid primary key default uuid_generate_v4(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  label text not null,
  votes int not null default 0,
  sort_order int not null default 0
);

create table if not exists public.poll_votes (
  id uuid primary key default uuid_generate_v4(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  voter_fingerprint text not null,  -- hashed IP / cookie id
  created_at timestamptz not null default now(),
  unique (poll_id, voter_fingerprint)
);

-- =====================================================================
-- site_settings: editable key/value used by widgets and homepage
-- =====================================================================
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.profiles       enable row level security;
alter table public.countries      enable row level security;
alter table public.leagues        enable row level security;
alter table public.teams          enable row level security;
alter table public.players        enable row level security;
alter table public.matches        enable row level security;
alter table public.posts          enable row level security;
alter table public.polls          enable row level security;
alter table public.poll_options   enable row level security;
alter table public.poll_votes     enable row level security;
alter table public.site_settings  enable row level security;

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Public read for content tables
create policy "public read countries" on public.countries for select using (true);
create policy "public read leagues"   on public.leagues   for select using (true);
create policy "public read teams"     on public.teams     for select using (true);
create policy "public read players"   on public.players   for select using (true);
create policy "public read matches"   on public.matches   for select using (true);
create policy "public read polls"         on public.polls         for select using (true);
create policy "public read poll_options"  on public.poll_options  for select using (true);
create policy "public read site_settings" on public.site_settings for select using (true);

-- Posts: only published rows are public
create policy "public read published posts" on public.posts
  for select using (is_published = true or public.is_admin());

-- Profiles: each user reads their own row, admins read all
create policy "self or admin read profile" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "self update profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Poll votes: anyone can insert (one per fingerprint)
create policy "anyone vote" on public.poll_votes for insert with check (true);

-- Admin write on everything
create policy "admin write countries"     on public.countries     for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write leagues"       on public.leagues       for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write teams"         on public.teams         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write players"       on public.players       for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write matches"       on public.matches       for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write posts"         on public.posts         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write polls"         on public.polls         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write poll_options"  on public.poll_options  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write site_settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Auto-create a profile row when a user signs up
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Storage: public bucket for post covers
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('post-covers', 'post-covers', true)
on conflict (id) do nothing;

-- Anyone can read; only admins can write.
drop policy if exists "post covers public read" on storage.objects;
create policy "post covers public read" on storage.objects
  for select using (bucket_id = 'post-covers');

drop policy if exists "post covers admin write" on storage.objects;
create policy "post covers admin write" on storage.objects
  for insert with check (bucket_id = 'post-covers' and public.is_admin());

drop policy if exists "post covers admin update" on storage.objects;
create policy "post covers admin update" on storage.objects
  for update using (bucket_id = 'post-covers' and public.is_admin());

drop policy if exists "post covers admin delete" on storage.objects;
create policy "post covers admin delete" on storage.objects
  for delete using (bucket_id = 'post-covers' and public.is_admin());

-- =====================================================================
-- Poll vote increment RPC
-- =====================================================================
create or replace function public.increment_poll_option(opt_id uuid)
returns void
language sql security definer set search_path = public
as $$
  update public.poll_options set votes = votes + 1 where id = opt_id;
$$;

grant execute on function public.increment_poll_option(uuid) to anon, authenticated;

-- =====================================================================
-- Search RPC (used by /search page)
-- =====================================================================
create or replace function public.search_posts(q text, max_results int default 20)
returns setof public.posts
language sql stable
as $$
  select * from public.posts
  where is_published = true
    and (search_tsv @@ plainto_tsquery('simple', q) or title ilike '%' || q || '%')
  order by ts_rank(search_tsv, plainto_tsquery('simple', q)) desc, published_at desc
  limit max_results;
$$;
