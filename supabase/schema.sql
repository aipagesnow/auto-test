-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users indirectly or standalone)
-- For this simple app, we might just rely on matching emails or link to auth.users if using Supabase Auth
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  refresh_token text, -- Encrypted or raw (warning: secure usage implied)
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Rules table
create table if not exists public.rules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  conditions jsonb not null default '{}'::jsonb, -- Store complex structure: { from: [], subject: '...', operator: 'AND' }
  reply_template text,
  is_active boolean default false,
  delay_minutes integer default 0,
  last_triggered timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Logs table
create table if not exists public.logs (
  id uuid primary key default uuid_generate_v4(),
  rule_id uuid references public.rules(id) on delete set null,
  recipient text not null,
  subject text,
  status text default 'sent', -- 'sent', 'failed', 'skipped'
  triggered_at timestamp with time zone default now()
);

-- RLS Policies (Row Level Security) - Optional but good practice
alter table public.users enable row level security;
alter table public.rules enable row level security;
alter table public.logs enable row level security;

-- Simple policy: Users can see only their own data
-- Note: You'll need to auth.uid() matching logic if using Supabase Auth fully.
-- For this custom NextAuth implementation, we will use the Service Role key in the backend
-- so RLS won't block the server, but good to have if we expose client-side fetch.
