# Parmar Properties — Project Brain & Team Memory System 🧠

Welcome to the centralized project memory for **Parmar Properties**.

> 🛑 **Start with [`READ_FIRST.md`](./READ_FIRST.md)**: migrations your database needs, and what changed recently.

This folder serves as the single source of truth for the **3-person engineering team** and AI coding assistants. It ensures that whenever any team member starts work, pulls code, or switches branches, they know **exactly what has been done, what is in progress, and what remains to be completed**.

---

## 📂 Brain Folder Structure

| Document | Purpose | When to Read / Update |
| :--- | :--- | :--- |
| **[`READ_FIRST.md`](./READ_FIRST.md)** | **Heads-up for everyone starting work**: required migrations, environment warnings, recent changes. | Read before you code. Remove items once everyone has done them. |
| **[`PROJECT_STATE.md`](./PROJECT_STATE.md)** | **Current Project Reality**: Live status of all modules, databases, environment setups, and architecture. | Read before starting any new feature. Update when major architecture shifts occur. |
| **[`TEAM_LOG.md`](./TEAM_LOG.md)** | **Handover & Activity Stream**: Chronological record of who did what, commits, modified files, and handover notes. | **MANDATORY**: Append a note whenever you finish a task, create a PR, or push code. |
| **[`TASK_BOARD.md`](./TASK_BOARD.md)** | **Task & Ownership Board**: Live kanban (To Do, In Progress, In Review, Done) with assigned developers. | Check before picking a task. Move your task to "In Progress" so no one duplicates your work. |
| **[`ARCHITECTURE_MAP.md`](./ARCHITECTURE_MAP.md)** | **Data & Schema Dictionary**: Detailed mapping between Frontend components, Backend Admin CMS, and Supabase SQL tables. | Consult when building components, creating API calls, or modifying database schemas. |

---

## 🤝 Team Working Agreement (3-Person Protocol)

To avoid merge conflicts, code duplication, or guessing what someone else built, follow this **3-Step Routine**:

### 1. Before You Start Coding (Check-In)
1. Run `git pull origin main` to get the latest code.
2. Open **[`brain/TEAM_LOG.md`](./TEAM_LOG.md)** and read the latest entries to see what the other 2 developers just completed.
3. Open **[`brain/TASK_BOARD.md`](./TASK_BOARD.md)**, find the item you are working on, and mark it:
   ```markdown
   - [ ] [Feature Name] — 🔄 **In Progress** (Assigned: [Your Name])
   ```

### 2. While Coding
- Keep your commit messages clear and descriptive.
- If you change a database schema, update both the migration in `backend/supabase/migrations` and [`ARCHITECTURE_MAP.md`](./ARCHITECTURE_MAP.md).

### 3. When You Finish or Hand Off Work (Check-Out)
Before closing your IDE or pushing to GitHub:
1. Update **[`brain/TASK_BOARD.md`](./TASK_BOARD.md)**: Move your item to **Done** or note blockers.
2. Add a new entry at the top of **[`brain/TEAM_LOG.md`](./TEAM_LOG.md)** using the standard handover template:
   ```markdown
   ### [YYYY-MM-DD] — [Your Name] — [Task / Feature Summary]
   - **Branch:** `main` (or feature branch)
   - **What I Did:** Bullet points of work completed
   - **Files Touched:** List of important files created/modified
   - **Current State:** Working / In Progress / Blocked
   - **Next Steps for Next Developer:** Exactly what the next person should do
   ```
3. Commit your changes along with the `brain/` updates:
   ```bash
   git add .
   git commit -m "feat(module): describe changes & update team brain"
   git push origin <branch>
   ```

---

## 🛠️ Quick Repository Orientation

```
Parmar-properties-listing/
├── brain/                 <-- You are here (Team memory, logs, architecture & state)
├── Frontend/              <-- Public Client Portal (Next.js 14 App Router, React 18, Tailwind)
├── backend/               <-- Staff Admin CMS (Next.js 16 App Router, React 19, Supabase SSR)
│   └── supabase/          <-- Database SQL migrations (001 to 008) and seed scripts
├── MASTER_BACKEND_SPEC.md <-- Specification defining every database column & UI control
└── README.md              <-- Project overview
```
