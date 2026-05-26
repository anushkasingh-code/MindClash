-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.debate_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  topic text not null,
  character_id text not null,
  player_final_hp int not null,
  ai_final_hp int not null,
  avg_logic double precision not null,
  avg_evidence double precision not null,
  avg_clarity double precision not null,
  won boolean not null,
  rounds_won int not null,
  total_damage_dealt int not null
);

alter table public.debate_sessions enable row level security;

create policy "Allow anonymous insert"
  on public.debate_sessions
  for insert
  to anon
  with check (true);

create policy "Allow anonymous select"
  on public.debate_sessions
  for select
  to anon
  using (true);
