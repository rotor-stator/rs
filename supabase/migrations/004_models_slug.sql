-- Models are now looked up by slug (see /model/[modelSlug]) instead of only
-- being reachable through the client-side manufacturer/series/model picker.
alter table models add column if not exists slug text;

update models
set slug = lower(regexp_replace(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g'))
where slug is null;

alter table models alter column slug set not null;
alter table models add constraint models_slug_key unique (slug);

create index if not exists models_slug_idx on models(slug);
