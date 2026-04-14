-- Enable extensions if desired
-- create extension if not exists "uuid-ossp";

-- EVENTS
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date date not null,
  start_time text,
  end_time text,
  hero_image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- TEAM
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  headshot_url text,
  bio text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- STORE
create table if not exists public.store_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  external_url text not null,
  category text not null check (category in ('uniform','merch')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- APPLICATIONS
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  kind text not null check (kind in ('employment','volunteer')),
  status text not null default 'new' check (status in ('new','reviewed','archived')),
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.events enable row level security;
alter table public.team_members enable row level security;
alter table public.store_items enable row level security;
alter table public.applications enable row level security;

-- Public read policies for published/active content
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'events' and policyname = 'Public can read published events') then
    create policy "Public can read published events"
    on public.events for select
    using (is_published = true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'team_members' and policyname = 'Public can read active team') then
    create policy "Public can read active team"
    on public.team_members for select
    using (is_active = true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'store_items' and policyname = 'Public can read active store') then
    create policy "Public can read active store"
    on public.store_items for select
    using (is_active = true);
  end if;

  -- Allow anonymous inserts for public applications (optional)
  if not exists (select 1 from pg_policies where tablename = 'applications' and policyname = 'Anon can insert applications') then
    create policy "Anon can insert applications"
    on public.applications for insert
    with check (true);
  end if;
end $$;

-- Triggers to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'events_touch_updated_at') then
    create trigger events_touch_updated_at
    before update on public.events
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'team_members_touch_updated_at') then
    create trigger team_members_touch_updated_at
    before update on public.team_members
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'store_items_touch_updated_at') then
    create trigger store_items_touch_updated_at
    before update on public.store_items
    for each row execute function public.set_updated_at();
  end if;
end $$;
