-- Phase 4: tournaments, forum threads/comments, post tags, match comments

-- =====================================================================
-- tournaments
-- =====================================================================
create table if not exists public.tournaments (
  id serial primary key,
  slug text not null unique,
  name_ar text not null,
  name_en text,
  logo_url text,
  description text,
  is_active boolean not null default true,
  starts_at date,
  ends_at date,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists tournaments_active_idx on public.tournaments (is_active, sort_order);

alter table public.tournaments enable row level security;

drop policy if exists "public read tournaments" on public.tournaments;
create policy "public read tournaments" on public.tournaments
  for select using (true);

drop policy if exists "admin write tournaments" on public.tournaments;
create policy "admin write tournaments" on public.tournaments
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- post tags
-- =====================================================================
create table if not exists public.tags (
  id serial primary key,
  slug text not null unique,
  label text not null
);

create table if not exists public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id  int  not null references public.tags(id)  on delete cascade,
  primary key (post_id, tag_id)
);

create index if not exists post_tags_tag_idx  on public.post_tags (tag_id);
create index if not exists post_tags_post_idx on public.post_tags (post_id);

alter table public.tags      enable row level security;
alter table public.post_tags enable row level security;

drop policy if exists "public read tags" on public.tags;
create policy "public read tags" on public.tags for select using (true);

drop policy if exists "admin write tags" on public.tags;
create policy "admin write tags" on public.tags for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read post_tags" on public.post_tags;
create policy "public read post_tags" on public.post_tags for select using (true);

drop policy if exists "admin write post_tags" on public.post_tags;
create policy "admin write post_tags" on public.post_tags for all
  using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- forum threads + replies (used by /forums)
-- =====================================================================
create table if not exists public.threads (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body  text not null,
  author_id uuid references public.profiles(id) on delete set null,
  league_id int references public.leagues(id) on delete set null,
  team_id   int references public.teams(id)   on delete set null,
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  reply_count int not null default 0,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists threads_activity_idx on public.threads (is_pinned desc, last_activity_at desc);

create table if not exists public.thread_replies (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists thread_replies_thread_idx on public.thread_replies (thread_id, created_at);

-- Bump thread reply_count + last_activity_at on new reply
create or replace function public.bump_thread_on_reply()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  update public.threads
     set reply_count = reply_count + 1,
         last_activity_at = now()
   where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists thread_replies_bump on public.thread_replies;
create trigger thread_replies_bump
  after insert on public.thread_replies
  for each row execute function public.bump_thread_on_reply();

alter table public.threads        enable row level security;
alter table public.thread_replies enable row level security;

drop policy if exists "public read threads" on public.threads;
create policy "public read threads" on public.threads for select using (true);

drop policy if exists "auth create threads" on public.threads;
create policy "auth create threads" on public.threads
  for insert with check (auth.uid() is not null);

drop policy if exists "author or admin update threads" on public.threads;
create policy "author or admin update threads" on public.threads
  for update using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

drop policy if exists "author or admin delete threads" on public.threads;
create policy "author or admin delete threads" on public.threads
  for delete using (author_id = auth.uid() or public.is_admin());

drop policy if exists "public read replies" on public.thread_replies;
create policy "public read replies" on public.thread_replies for select using (true);

drop policy if exists "auth reply" on public.thread_replies;
create policy "auth reply" on public.thread_replies
  for insert with check (auth.uid() is not null);

drop policy if exists "author or admin manage replies" on public.thread_replies;
create policy "author or admin manage replies" on public.thread_replies
  for all using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

-- =====================================================================
-- match comments (used by match detail realtime)
-- =====================================================================
create table if not exists public.match_comments (
  id uuid primary key default uuid_generate_v4(),
  match_id int not null references public.matches(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists match_comments_match_idx on public.match_comments (match_id, created_at);

alter table public.match_comments enable row level security;

drop policy if exists "public read match comments" on public.match_comments;
create policy "public read match comments" on public.match_comments for select using (true);

drop policy if exists "auth post match comment" on public.match_comments;
create policy "auth post match comment" on public.match_comments
  for insert with check (auth.uid() is not null);

drop policy if exists "author or admin manage match comment" on public.match_comments;
create policy "author or admin manage match comment" on public.match_comments
  for all using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

-- Make matches + match_comments Realtime-able.
-- (Supabase will pick these up if Realtime is enabled in the dashboard;
-- the publication add is idempotent.)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'matches'
  ) then
    alter publication supabase_realtime add table public.matches;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'match_comments'
  ) then
    alter publication supabase_realtime add table public.match_comments;
  end if;
exception when others then
  -- publication may not exist on local instances; ignore.
  null;
end $$;
