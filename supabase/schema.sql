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

create table if not exists releases (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  release_date date,
  created_at timestamptz default now()
);

-- === Releases: distributor-style fields ===
alter table releases
  add column if not exists display_title text,
  add column if not exists catalog_number text,
  add column if not exists grid text,
  add column if not exists primary_genre text,
  add column if not exists sub_genre text,
  add column if not exists metadata_language text,
  add column if not exists audio_language text,
  add column if not exists audio_presentation text,
  add column if not exists release_artists text,
  add column if not exists contributors text,
  add column if not exists c_line_year int,
  add column if not exists c_line_owner text,
  add column if not exists p_line_year int,
  add column if not exists p_line_owner text,
  add column if not exists marketing_notes text;

-- === Releases: richer metadata ===
alter table releases
  add column if not exists release_type text check (release_type in ('single','ep','album')) default 'single',
  add column if not exists primary_artist text,
  add column if not exists label text,
  add column if not exists upc text,
  add column if not exists explicit boolean default false,
  add column if not exists cover_url text,
  add column if not exists notes text;

-- === Tracks: minimal tracklist structure ===
create table if not exists tracks (
  id uuid primary key default uuid_generate_v4(),
  release_id uuid not null references releases(id) on delete cascade,
  track_number int not null,
  title text not null,
  isrc text,
  explicit boolean default false,
  duration_seconds int,         -- optional if you want to store it later
  created_at timestamptz default now()
);