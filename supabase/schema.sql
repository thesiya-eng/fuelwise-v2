-- Fuel Wise v2 schema + RLS
-- Run this in Supabase SQL editor (connected to your project)

create extension if not exists "uuid-ossp";

create table if not exists public.fuel_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  odometer_km numeric(12,1) not null check (odometer_km >= 0),
  liters numeric(12,2) not null check (liters > 0),
  total_cost numeric(12,2) not null check (total_cost >= 0),
  station text null,
  notes text null,
  created_at timestamptz not null default now()
);

create index if not exists fuel_entries_user_date_idx
  on public.fuel_entries(user_id, entry_date desc);

alter table public.fuel_entries enable row level security;

-- Policies: user can only access their own rows
drop policy if exists "fuel_entries_select_own" on public.fuel_entries;
create policy "fuel_entries_select_own"
on public.fuel_entries for select
using (auth.uid() = user_id);

drop policy if exists "fuel_entries_insert_own" on public.fuel_entries;
create policy "fuel_entries_insert_own"
on public.fuel_entries for insert
with check (auth.uid() = user_id);

drop policy if exists "fuel_entries_update_own" on public.fuel_entries;
create policy "fuel_entries_update_own"
on public.fuel_entries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "fuel_entries_delete_own" on public.fuel_entries;
create policy "fuel_entries_delete_own"
on public.fuel_entries for delete
using (auth.uid() = user_id);
