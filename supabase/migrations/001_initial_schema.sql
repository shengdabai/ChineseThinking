-- ChineseThinking Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Users profile (extends Supabase Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  persona text check (persona in ('professional', 'heritage', 'student', 'traveler')),
  level text default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  native_lang text default 'en',
  streak_days integer default 0,
  streak_last_date date,
  push_time text default 'morning' check (push_time in ('morning', 'noon', 'evening')),
  onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Conversations
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  scenario text not null default 'free',
  messages jsonb not null default '[]'::jsonb,
  summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Challenge completions
create table if not exists challenge_completions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id text not null,
  user_response text not null,
  ai_feedback text,
  completed_at timestamptz default now(),
  unique(user_id, challenge_id, completed_at::date)
);

-- Mistake log (error notebook)
create table if not exists mistakes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  wrong_text text not null,
  correct_text text not null,
  context text,
  review_count integer default 0,
  last_reviewed timestamptz,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_conversations_user on conversations(user_id, created_at desc);
create index if not exists idx_challenge_completions_user on challenge_completions(user_id, completed_at desc);
create index if not exists idx_mistakes_user on mistakes(user_id, created_at desc);

-- Row Level Security (RLS) - users can only access their own data
alter table profiles enable row level security;
alter table conversations enable row level security;
alter table challenge_completions enable row level security;
alter table mistakes enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users can view own conversations" on conversations for select using (auth.uid() = user_id);
create policy "Users can insert own conversations" on conversations for insert with check (auth.uid() = user_id);
create policy "Users can update own conversations" on conversations for update using (auth.uid() = user_id);

create policy "Users can view own completions" on challenge_completions for select using (auth.uid() = user_id);
create policy "Users can insert own completions" on challenge_completions for insert with check (auth.uid() = user_id);

create policy "Users can view own mistakes" on mistakes for select using (auth.uid() = user_id);
create policy "Users can insert own mistakes" on mistakes for insert with check (auth.uid() = user_id);
create policy "Users can update own mistakes" on mistakes for update using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at auto-trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at();
create trigger conversations_updated_at before update on conversations
  for each row execute procedure update_updated_at();
