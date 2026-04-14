-- Neon/Postgres schema for S.L.A.Y.

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'editor',
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text not null,
  time text,
  description text not null,
  hero_image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  headshot_url text,
  bio text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists store_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  external_url text not null,
  category text not null check (category in ('uniform','merch')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
