# Project Init — Job Search Tracker

## What was built

A multi-user job search CRM. Each user sees only their own data.

### Stack

| Layer           | Choice                                |
| --------------- | ------------------------------------- |
| Framework       | Next.js 16 (App Router)               |
| UI              | shadcn/ui + Tailwind CSS              |
| Database + Auth | Supabase (PostgreSQL + Supabase Auth) |
| Hosting         | Vercel                                |
| Package manager | pnpm                                  |

### File structure

```
src/
  proxy.ts                              auth protection (Next.js 16 middleware)
  lib/
    types.ts                            TypeScript types + status label maps
    utils.ts                            cn() helper
    supabase/
      client.ts                         browser Supabase client
      server.ts                         server Supabase client (cookies)
  components/
    sidebar.tsx                         nav sidebar with sign-out
    sign-out-button.tsx                 client component for logout form
  app/
    actions/
      auth.ts                           login / register / logout
      companies.ts                      create / update / delete company
      contacts.ts                       create / delete contact
      applications.ts                   create / update status / delete application
    login/page.tsx                      register + sign-in page
    (dashboard)/
      layout.tsx                        sidebar layout, auth guard
      companies/page.tsx                company list with search
      companies/new/page.tsx            add company form
      companies/[id]/page.tsx           company detail: contacts + applications
      companies/[id]/edit/page.tsx      edit company form
      companies/[id]/contacts/new/      add contact form
      companies/[id]/applications/new/  log application form

supabase/
  schema.sql                            full DB schema + RLS policies

docs/
  init.md                               this file
```

### Data model

```
companies     id, user_id, name, website, location, notes, status, created_at
contacts      id, user_id, company_id, name, role, email, linkedin, notes, created_at
applications  id, user_id, company_id, job_title, job_url, date_sent, status, notes, created_at
```

Company status values: `researching` | `actively_applying` | `archived`

Application status values: `interested` | `applied` | `phone_screen` | `interview` | `offer` | `accepted` | `rejected`

Row Level Security is enabled on all tables — users can only read/write their own rows.

---

## Next steps

### 1. Finish Supabase setup

Fill in the remaining values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase > Settings > API > Project API keys > anon/public

### 2. Run the database schema

In Supabase → **SQL Editor** → paste `supabase/schema.sql` → Run.

### 3. Disable email confirmation

Supabase > **Authentication > Settings** > uncheck **"Enable email confirmations"**.

This lets friends register without needing to verify an email address.

### 4. Run locally

```bash
pnpm dev
# open http://localhost:3000
```

Register an account, add a company, log a contact and an application.

### 5. Deploy to Vercel

```bash
pnpm install -g vercel   # if not installed
vercel
```

Or connect the GitHub repo to vercel.com and it will auto-deploy on push.

Add the two env vars in Vercel: **Settings > Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 6. Share with friends

Send them the Vercel URL. Each person registers their own account. Data is fully private per user.

---

## Phase 2 (not built yet)

- Dashboard with stats (applied this week, interviews pending, offer rate)
- Activity log / follow-up tracking per company
- Global contacts list (across all companies)
- Application pipeline board view
- Delete company / contact / application buttons
