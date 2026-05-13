# Job Search Tracker

A personal CRM for job seekers. Track companies, contacts, job applications, and clients — all private per user.

## Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Database & Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Hosting:** Vercel
- **Package manager:** pnpm

## Features

- **Companies** — add companies, view contacts and applications per company
- **Contacts** — track people at each company (name, role, email, LinkedIn)
- **Applications** — log job applications (title, URL, date sent, status, notes)
- **Clients** — track clients and notices (separate from job search companies)
- **Auth** — username + password via Supabase Auth; each user sees only their own data

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- A Supabase project

### Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run the database migrations in Supabase SQL editor (`supabase/schema.sql`, then `supabase/migration_clients.sql`).

4. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    (dashboard)/        # Authenticated routes (sidebar layout)
      companies/        # Company list, detail, edit
      clients/          # Client list, detail, edit, notices
      profile/          # User profile
    login/              # Auth page
    actions/            # Server actions (companies, contacts, applications, notices)
  components/
    sidebar.tsx         # Nav sidebar
  lib/
    types.ts            # Shared TypeScript types
supabase/
  schema.sql            # Initial DB schema
  migration_clients.sql # Clients + notices tables
```

## Data Model

| Table          | Key fields                                                        |
| -------------- | ----------------------------------------------------------------- |
| `companies`    | name, website, location, notes, status, user_id                   |
| `contacts`     | name, role, email, linkedin, notes, company_id, user_id           |
| `applications` | job_title, job_url, date_sent, status, notes, company_id, user_id |
| `clients`      | name, website, location, notes, status, user_id                   |
| `notices`      | title, date, notes, client_id, user_id                            |

All tables are scoped to `user_id` via Supabase Row Level Security.

## Deploy

Deploy to [Vercel](https://vercel.com). Set the same environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
