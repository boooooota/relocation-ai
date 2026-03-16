-- Users profile (extends Supabase auth.users)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  onboarded   boolean default false,
  created_at  timestamptz default now()
);

-- Onboarding data
create table public.user_settings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles(id) on delete cascade unique,
  origin_city         text,
  destination_city    text,
  family_size         int default 1,
  target_move_date    date,
  housing_preference  text default 'mid',
  has_pets            boolean default false,
  shipping_volume     text default 'partial',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Conversations
create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  title       text default 'New conversation',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Messages
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  role            text check (role in ('user', 'assistant', 'tool')) not null,
  content         text not null,
  tool_name       text,
  tool_result     jsonb,
  created_at      timestamptz default now()
);

-- Indexes
create index messages_conversation_id_idx on public.messages(conversation_id);
create index conversations_user_id_idx on public.conversations(user_id);

-- RLS
alter table public.profiles       enable row level security;
alter table public.user_settings   enable row level security;
alter table public.conversations   enable row level security;
alter table public.messages        enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can manage own settings"
  on public.user_settings for all using (auth.uid() = user_id);

create policy "Users can manage own conversations"
  on public.conversations for all using (auth.uid() = user_id);

create policy "Users can manage own messages"
  on public.messages for all
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and c.user_id = auth.uid()
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();