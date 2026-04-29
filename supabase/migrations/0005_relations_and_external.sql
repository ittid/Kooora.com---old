-- Phase 5: tag relations, standings cache, external IDs for syncs

-- =====================================================================
-- 1. tags: classify tags into kinds so we can auto-create team/player tags
--    without colliding with editorial ones.
-- =====================================================================
alter table public.tags
  add column if not exists kind text not null default 'topic';
-- valid kinds: 'topic' (manual), 'team', 'player', 'league'

create index if not exists tags_kind_idx on public.tags (kind);

-- Helper: ensure a tag exists for a given (kind, slug, label) and return its id.
create or replace function public.ensure_tag(p_kind text, p_slug text, p_label text)
returns int
language plpgsql security definer set search_path = public
as $$
declare
  r_id int;
begin
  select id into r_id from public.tags where slug = p_slug;
  if r_id is null then
    insert into public.tags (slug, label, kind) values (p_slug, p_label, p_kind)
    returning id into r_id;
  end if;
  return r_id;
end;
$$;

grant execute on function public.ensure_tag(text, text, text) to authenticated;

-- Auto-attach a tag to posts based on their team_id / league_id.
create or replace function public.sync_post_relation_tags()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_tag int;
  v_team record;
  v_league record;
begin
  if new.team_id is not null then
    select slug, name_ar into v_team from public.teams where id = new.team_id;
    if found then
      v_tag := public.ensure_tag('team', 'team-' || v_team.slug, v_team.name_ar);
      insert into public.post_tags (post_id, tag_id)
      values (new.id, v_tag)
      on conflict do nothing;
    end if;
  end if;
  if new.league_id is not null then
    select slug, name_ar into v_league from public.leagues where id = new.league_id;
    if found then
      v_tag := public.ensure_tag('league', 'league-' || v_league.slug, v_league.name_ar);
      insert into public.post_tags (post_id, tag_id)
      values (new.id, v_tag)
      on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists posts_sync_relation_tags_ins on public.posts;
create trigger posts_sync_relation_tags_ins
  after insert on public.posts
  for each row execute function public.sync_post_relation_tags();

drop trigger if exists posts_sync_relation_tags_upd on public.posts;
create trigger posts_sync_relation_tags_upd
  after update of team_id, league_id on public.posts
  for each row execute function public.sync_post_relation_tags();

-- =====================================================================
-- 2. external IDs (TheSportsDB) so we can sync from the API
-- =====================================================================
alter table public.leagues add column if not exists external_id_sdb int;
alter table public.teams   add column if not exists external_id_sdb int;
alter table public.matches add column if not exists external_id text;

create unique index if not exists matches_external_idx
  on public.matches (external_id) where external_id is not null;

-- =====================================================================
-- 3. standings cache
-- =====================================================================
create table if not exists public.standings (
  league_id    int     not null references public.leagues(id) on delete cascade,
  position     int     not null,
  team_name    text    not null,
  team_slug    text,                       -- resolved to local team if matched
  team_logo    text,
  played       int     not null default 0,
  won          int     not null default 0,
  drawn        int     not null default 0,
  lost         int     not null default 0,
  goals_for    int     not null default 0,
  goals_against int    not null default 0,
  goal_diff    int     not null default 0,
  points       int     not null default 0,
  fetched_at   timestamptz not null default now(),
  primary key (league_id, position)
);

create index if not exists standings_fetched_idx on public.standings (league_id, fetched_at desc);

alter table public.standings enable row level security;

drop policy if exists "public read standings" on public.standings;
create policy "public read standings" on public.standings for select using (true);

drop policy if exists "admin write standings" on public.standings;
create policy "admin write standings" on public.standings
  for all using (public.is_admin()) with check (public.is_admin());
