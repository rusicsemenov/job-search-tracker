-- Run this migration in your Supabase SQL editor

-- Add new columns to companies
ALTER TABLE companies ADD COLUMN type text not null default 'job'
  check (type in ('job', 'client'));
ALTER TABLE companies ADD COLUMN telegram text;
ALTER TABLE companies ADD COLUMN phone text;
ALTER TABLE companies ADD COLUMN company_email text;
ALTER TABLE companies ADD COLUMN instagram text;

-- Expand the status check constraint to include client statuses
ALTER TABLE companies DROP CONSTRAINT companies_status_check;
ALTER TABLE companies ADD CONSTRAINT companies_status_check
  CHECK (status in ('researching', 'actively_applying', 'archived', 'prospecting', 'contacted', 'interested', 'closed'));

-- Add new columns to contacts
ALTER TABLE contacts ADD COLUMN telegram text;
ALTER TABLE contacts ADD COLUMN instagram text;

-- Create notices table
CREATE TABLE notices (
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

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_notices" ON notices
  FOR ALL USING (auth.uid() = user_id);
