create table companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  website text,
  location text,
  notes text,
  status text not null default 'researching'
    check (status in ('researching', 'actively_applying', 'archived')),
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

alter table companies enable row level security;
alter table contacts enable row level security;
alter table applications enable row level security;

create policy "users_own_companies" on companies
  for all using (auth.uid() = user_id);

create policy "users_own_contacts" on contacts
  for all using (auth.uid() = user_id);

create policy "users_own_applications" on applications
  for all using (auth.uid() = user_id);
