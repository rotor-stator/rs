-- RotorStator catalog schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).
--
-- Structure, top to bottom:
--   manufacturers  (e.g. "Netzsch Nemo")
--     └─ series    (e.g. "BY Series")
--          └─ models    (e.g. "NM 015 BY")
--               └─ products  (an actual rotor or stator you sell for that model)
--
-- Every column is plain text/number/uuid so the table editor is usable without
-- any SQL knowledge — add a manufacturer, then a series under it, then a model
-- under that, then products under the model.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- manufacturers
-- ---------------------------------------------------------------------------
create table if not exists manufacturers (
  id   uuid primary key default gen_random_uuid(),
  name text not null,          -- e.g. "Netzsch Nemo"
  slug text not null unique    -- e.g. "netzsch-nemo" — used in page URLs
);

-- ---------------------------------------------------------------------------
-- series (belongs to a manufacturer)
-- ---------------------------------------------------------------------------
create table if not exists series (
  id               uuid primary key default gen_random_uuid(),
  manufacturer_id  uuid not null references manufacturers(id) on delete cascade,
  name             text not null,   -- e.g. "NM Series"
  slug             text not null    -- e.g. "by" — used in page URLs
);

create index if not exists series_manufacturer_id_idx on series(manufacturer_id);
create unique index if not exists series_manufacturer_slug_key on series(manufacturer_id, slug);

-- ---------------------------------------------------------------------------
-- models (belongs to a series)
-- ---------------------------------------------------------------------------
create table if not exists models (
  id        uuid primary key default gen_random_uuid(),
  series_id uuid not null references series(id) on delete cascade,
  name      text not null   -- e.g. "NM 031"
);

create index if not exists models_series_id_idx on models(series_id);

-- ---------------------------------------------------------------------------
-- products (a rotor or stator you actually sell for a model)
-- ---------------------------------------------------------------------------
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  model_id     uuid not null references models(id) on delete cascade,
  part_type    text not null check (part_type in ('rotor', 'stator')),
  material     text not null,   -- e.g. "EPDM", "FKM", "NBR", "Chrome", "Stainless"
  part_number  text not null,
  price        numeric,         -- leave empty for "price on request"
  created_at   timestamptz not null default now()
);

create index if not exists products_model_id_idx on products(model_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--   - Anyone (including logged-out site visitors) can read.
--   - Only authenticated users can add/edit/delete. Logging into the Supabase
--     dashboard already counts as authenticated, so no extra setup is needed
--     there — the table editor uses its own elevated access and is unaffected
--     by these policies either way.
-- ---------------------------------------------------------------------------
alter table manufacturers enable row level security;
alter table series        enable row level security;
alter table models        enable row level security;
alter table products      enable row level security;

create policy "Public read access" on manufacturers for select using (true);
create policy "Public read access" on series        for select using (true);
create policy "Public read access" on models         for select using (true);
create policy "Public read access" on products       for select using (true);

create policy "Authenticated write access" on manufacturers for all to authenticated using (true) with check (true);
create policy "Authenticated write access" on series        for all to authenticated using (true) with check (true);
create policy "Authenticated write access" on models        for all to authenticated using (true) with check (true);
create policy "Authenticated write access" on products       for all to authenticated using (true) with check (true);
