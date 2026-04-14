-- Applications (Join Us) table
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  kind text not null check (kind in ('employment','volunteer')),
  ip text,
  user_agent text,
  status text not null default 'new' check (status in ('new','reviewed','archived')),
  created_at timestamptz not null default now()
);
