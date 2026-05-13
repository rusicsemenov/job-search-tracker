create table companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null default 'job'
    check (type in ('job', 'client')),
  website text,
  telegram text,
  phone text,
  company_email text,
  instagram text,
  location text,
  notes text,
  status text not null default 'researching'
    check (status in ('researching', 'actively_applying', 'archived', 'prospecting', 'contacted', 'interested', 'closed')),
  created_at timestamptz default now() not null
);

create table contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  role text,
  email text,
  linkedin text,
  telegram text,
  instagram text,
  notes text,
  created_at timestamptz default now() not null
);

create table applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company_id uuid references companies(id) on delete cascade not null,
  job_title text not null,
  job_url text,
  date_sent date,
  status text not null default 'interested'
    check (status in ('interested', 'applied', 'phone_screen', 'interview', 'offer', 'accepted', 'rejected')),
  notes text,
  created_at timestamptz default now() not null
);

create table notices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company_id uuid references companies(id) on delete cascade not null,
  date_sent date,
  channel text not null default 'email'
    check (channel in ('email', 'telegram', 'instagram', 'phone', 'other')),
  status text not null default 'sent'
    check (status in ('sent', 'seen', 'replied', 'interested', 'not_interested')),
  notes text,
  created_at timestamptz default now() not null
);

alter table companies enable row level security;
alter table contacts enable row level security;
alter table applications enable row level security;
alter table notices enable row level security;

create policy "users_own_companies" on companies
  for all using (auth.uid() = user_id);

create policy "users_own_contacts" on contacts
  for all using (auth.uid() = user_id);

create policy "users_own_applications" on applications
  for all using (auth.uid() = user_id);

create policy "users_own_notices" on notices
  for all using (auth.uid() = user_id);
