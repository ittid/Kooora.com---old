-- Adds a free-text category to posts so they can be grouped under
-- /news/<category> routes (world / arab / other-sports / analysis / etc.)

alter table public.posts
  add column if not exists category text;

create index if not exists posts_category_idx on public.posts (category, published_at desc);
