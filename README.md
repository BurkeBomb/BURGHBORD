
# MediBurgh • Task Management (PracticeOps Core)

A fast, tag-driven task manager built with **Next.js 15 + TypeScript + Tailwind + Supabase**.
Focuses on immediate launch of the **Task Management** module.

## Quick Start

### 1) Create Supabase project
- Get your `SUPABASE_URL` and `anon` key.
- In SQL editor, run the files in `/db` in order:
  - `01_schema.sql`
  - `02_views.sql`
  - `03_rpcs.sql`

### 2) Configure Auth
- Under Authentication → Providers → Email, enable **Email (Magic Link)**.
- Optionally add your staff emails now.

### 3) Configure Environment
Copy `.env.example` → `.env.local` and set:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
# (Service role only needed later for server-side jobs)
SUPABASE_SERVICE_ROLE=
```

### 4) Install & Run
```bash
npm install
npm run dev
# open http://localhost:3000
```

### 5) Deploy (Vercel)
- Push to GitHub
- Import in Vercel, set the two NEXT_PUBLIC_* env vars in Vercel Project Settings
- After deploy, visit `/auth` to send a magic link and sign in.

## Features
- Create/edit tasks with **status** and **due date**
- **Tag** tasks (Discovery, Dr Fernandes, Bank Recon, etc.)
- Filter by status
- Dashboard cards for counts by status and tag
- RLS ensures users only see their own/assigned tasks

## Notes
- Deletes are disabled in Phase 1 (safety). Close tasks instead.
- Extend with notifications and AI suggestions later.
- Styling follows MediBurgh palette (Graphite, Metallic Purple, Gold).

## Folder Structure
- `/app` – Next.js routes (`/tasks`, `/dashboard`, `/auth`)
- `/components` – UI components
- `/lib` – Supabase client
- `/db` – SQL migrations (schema, views, RPCs)

---

© MediBurgh PracticeOps
