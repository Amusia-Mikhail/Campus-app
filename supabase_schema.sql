-- Create users table (tied to Supabase Auth users)
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  hero_name text,
  major text,
  dorm text,
  created_at timestamptz default now()
);

-- Create story_state table
create table if not exists public.story_state (
  user_id uuid references public.users(id) on delete cascade primary key,
  current_chapter_id text,
  npc_relationships jsonb default '{}'::jsonb,
  story_flags jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Create attempts table for logging submissions
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  chapter_id text,
  attempt_type text,
  raw_input text,
  ai_feedback jsonb,
  score numeric,
  created_at timestamptz default now()
);

-- Create skill_scores table
create table if not exists public.skill_scores (
  user_id uuid references public.users(id) on delete cascade primary key,
  listening_score numeric default 0,
  speaking_score numeric default 0,
  writing_score numeric default 0,
  reading_score numeric default 0,
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on all tables
alter table public.users enable row level security;
alter table public.story_state enable row level security;
alter table public.attempts enable row level security;
alter table public.skill_scores enable row level security;

-- Policies for users table
create policy "Users can read own record" on public.users
  for select using (auth.uid() = id);

create policy "Users can insert own record" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own record" on public.users
  for update using (auth.uid() = id);

-- Policies for story_state table
create policy "Users can read own story_state" on public.story_state
  for select using (auth.uid() = user_id);

create policy "Users can insert own story_state" on public.story_state
  for insert with check (auth.uid() = user_id);

create policy "Users can update own story_state" on public.story_state
  for update using (auth.uid() = user_id);

-- Policies for attempts table
create policy "Users can read own attempts" on public.attempts
  for select using (auth.uid() = user_id);

create policy "Users can insert own attempts" on public.attempts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own attempts" on public.attempts
  for update using (auth.uid() = user_id);

-- Policies for skill_scores table
create policy "Users can read own skill_scores" on public.skill_scores
  for select using (auth.uid() = user_id);

create policy "Users can insert own skill_scores" on public.skill_scores
  for insert with check (auth.uid() = user_id);

create policy "Users can update own skill_scores" on public.skill_scores
  for update using (auth.uid() = user_id);
