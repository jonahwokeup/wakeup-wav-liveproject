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

-- =========
-- Helper: membership check
-- =========
create or replace function is_member(p_org_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from memberships m
    where m.org_id = p_org_id
      and m.user_id = auth.uid()
  );
end;
$$;

revoke all on function is_member(uuid) from public;
grant execute on function is_member(uuid) to authenticated;

-- =========
-- Enable RLS
-- =========
alter table organizations enable row level security;
alter table memberships enable row level security;
alter table releases enable row level security;
alter table tracks enable row level security;

-- =========
-- Policies: organizations
-- =========
-- Anyone signed-in can create an org (client will then insert their membership)
drop policy if exists org_insert on organizations;
create policy org_insert on organizations
for insert
to authenticated
with check (true);

-- Members can read orgs they belong to
drop policy if exists org_select_member on organizations;
create policy org_select_member on organizations
for select
to authenticated
using (is_member(id));

-- Admin-only update (optional: keep simple = member can update)
drop policy if exists org_update_member on organizations;
create policy org_update_member on organizations
for update
to authenticated
using (is_member(id))
with check (is_member(id));

-- =========
-- Policies: memberships
-- =========
-- A user can read only their own membership rows (avoid recursion)
drop policy if exists mem_select_member on memberships;
drop policy if exists mem_select_self on memberships;
create policy mem_select_self on memberships
for select
to authenticated
using (user_id = auth.uid());

-- A user can insert their own membership row (used when creating org)
drop policy if exists mem_insert_self on memberships;
create policy mem_insert_self on memberships
for insert
to authenticated
with check (user_id = auth.uid());

-- A user can delete their own membership (leaving an org)
drop policy if exists mem_delete_self on memberships;
create policy mem_delete_self on memberships
for delete
to authenticated
using (user_id = auth.uid());

-- =========
-- Policies: releases (org-scoped)
-- =========
drop policy if exists rel_select_member on releases;
create policy rel_select_member on releases
for select
to authenticated
using (is_member(org_id));

drop policy if exists rel_insert_member on releases;
create policy rel_insert_member on releases
for insert
to authenticated
with check (is_member(org_id));

drop policy if exists rel_update_member on releases;
create policy rel_update_member on releases
for update
to authenticated
using (is_member(org_id))
with check (is_member(org_id));

drop policy if exists rel_delete_member on releases;
create policy rel_delete_member on releases
for delete
to authenticated
using (is_member(org_id));

-- =========
-- Policies: tracks (join via releases)
-- =========
drop policy if exists tr_select_member on tracks;
create policy tr_select_member on tracks
for select
to authenticated
using (
  exists (
    select 1 from releases r
    where r.id = tracks.release_id and is_member(r.org_id)
  )
);

drop policy if exists tr_cud_member on tracks;
create policy tr_cud_member on tracks
for all
to authenticated
using (
  exists (
    select 1 from releases r
    where r.id = tracks.release_id and is_member(r.org_id)
  )
)
with check (
  exists (
    select 1 from releases r
    where r.id = tracks.release_id and is_member(r.org_id)
  )
);

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