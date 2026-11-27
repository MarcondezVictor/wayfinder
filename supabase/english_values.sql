-- ====================================================
-- Migrate stored values from Portuguese to English
-- ----------------------------------------------------
-- Only needed for databases created before this change.
-- Fresh installs from setup.sql already use English values.
-- Safe to run more than once.
-- ====================================================

-- 1. Continents
update public.countries
set continent = case continent
  when 'Europa'           then 'Europe'
  when 'Ásia'             then 'Asia'
  when 'África'           then 'Africa'
  when 'América do Norte' then 'North America'
  when 'América do Sul'   then 'South America'
  when 'Oceânia'          then 'Oceania'
  else continent
end;

-- 2. Travel styles (drop the old check, convert rows, add the new check)
alter table public.user_preferences
  drop constraint if exists user_preferences_preferred_travel_style_check;

update public.user_preferences
set preferred_travel_style = case preferred_travel_style
  when 'Turismo'        then 'Tourism'
  when 'Estudos'        then 'Study'
  when 'Trabalho'       then 'Work'
  when 'Emigração'      then 'Emigration'
  when 'Nómada Digital' then 'Digital Nomad'
  else preferred_travel_style
end;

alter table public.user_preferences
  add constraint user_preferences_preferred_travel_style_check
  check (preferred_travel_style in ('Tourism', 'Study', 'Work', 'Emigration', 'Digital Nomad'));

-- 3. New users get the English default
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80')
  );

  insert into public.user_preferences (id, preferred_travel_style, preferred_destinations)
  values (new.id, 'Tourism', '{}');

  return new;
end;
$$ language plpgsql security definer;
