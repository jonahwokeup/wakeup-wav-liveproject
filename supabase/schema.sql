create extension if not exists "uuid-ossp";

create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text check (type in ('artist','label')) default 'artist',
  created_at timestamptz default now()
);

create table if not exists memberships (
  org_id uuid references organizations(id) on delete cascade,
  user_id uuid not null,
  role text check (role in ('admin','member')) default 'admin',
  created_at timestamptz default now(),
  primary key (org_id, user_id)
);
