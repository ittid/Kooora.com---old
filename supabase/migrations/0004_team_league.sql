-- Phase 5 prep: link teams to a primary league so /competitions/[slug]
-- can list its clubs.

alter table public.teams
  add column if not exists league_id int references public.leagues(id) on delete set null;

create index if not exists teams_league_idx on public.teams (league_id);
