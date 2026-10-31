# Agent Instructions & Operating Rules — Parmar Properties 🧠

You are an AI coding assistant working on the **Parmar Properties** repository with a 3-person engineering team.

## 🛑 READ FIRST

Before writing any code, read [`brain/READ_FIRST.md`](./brain/READ_FIRST.md). It lists database migrations the code now depends on, the two-Supabase-project warning, and what changed.

---

## 🚨 MANDATORY DIRECTIVE: AUTOMATIC BRAIN UPDATES

Whenever you perform ANY work in this repository (writing code, fixing bugs, creating features, modifying configurations, or adding migrations), **YOU MUST DIRECTLY UPDATE THE `brain/` FOLDER AS PART OF YOUR TASK.**

Do not wait for the user to ask you to update documentation. This is an automatic, mandatory step on every task.

---

## 📋 The Automatic Handover Routine

Whenever you complete code changes:

### 1. Update `brain/TEAM_LOG.md` (Always Required)
Prepend a new entry at the **very top** of the `## 📜 Activity Stream` section in [`brain/TEAM_LOG.md`](./brain/TEAM_LOG.md) containing:
- **Timestamp & Author:** `### [YYYY-MM-DD HH:MM] — Antigravity (AI) & [User/Developer Name] — [Task Summary]`
- **Branch:** Current git branch
- **What Was Done:** Detailed bullet points of exact changes, logic, and implementations
- **Files Touched / Created:** Markdown links to all modified files
- **Current State:** Test status and build verification
- **Next Steps for Next Developer:** Concrete next steps for the next person or agent stepping in

### 2. Update `brain/TASK_BOARD.md` (Always Required)
- Mark completed tasks as `[x]` under **Completed Tasks**.
- If a task is partially done or in progress, update its status under **In Progress** with the developer or agent name.
- If new subtasks or dependencies are discovered, add them to **To Do**.

### 3. Update `brain/PROJECT_STATE.md` (When System State Shifts)
- Update [`brain/PROJECT_STATE.md`](./brain/PROJECT_STATE.md) if:
  - A new package or client was installed (e.g. Supabase client).
  - A new database migration was run.
  - A feature was wired from mock data to live data.
  - Environment variables or configurations were modified.

### 4. Update `brain/ARCHITECTURE_MAP.md` (When Schemas Change)
- Update [`brain/ARCHITECTURE_MAP.md`](./brain/ARCHITECTURE_MAP.md) whenever a database table, column, TypeScript interface, or lead source is added or modified.

---

## 🏗️ Repository Architecture Summary
- One Next.js 16 app (React 19, Tailwind CSS v4) at the repo root. There is no separate Frontend or backend app any more.
- `src/app/(site)/` + `src/site/`: Public Luxury Portal (Zustand, Supabase anon reads, lead inserts).
- `src/app/(admin)/` + `src/components`, `src/lib`, `src/types`: Staff Admin CMS at `/admin` (Supabase SSR, Zod, react-hook-form).
- `supabase/migrations/`: Canonical PostgreSQL database migrations and seed scripts.
- `brain/`: Shared memory and team state system.
- `MASTER_BACKEND_SPEC.md`: Master specification for database columns and admin UI controls.
- Path note: older brain entries mention `Frontend/...` and `backend/...`. Map: `Frontend/app` -> `src/app/(site)`, `Frontend/{components,lib,data,store,types}` -> `src/site/...`, `backend/src/app/admin` -> `src/app/(admin)/admin`, `backend/src/{components,lib,types}` -> `src/...`, `backend/supabase` -> `supabase`.
