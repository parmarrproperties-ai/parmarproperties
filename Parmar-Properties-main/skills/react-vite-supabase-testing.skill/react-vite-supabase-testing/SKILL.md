---
name: react-vite-supabase-testing
description: >
  Full-stack testing skill for React + Vite + Supabase projects. Use this skill whenever the user asks to
  test, check, audit, or verify any part of their React/Vite/Supabase app — including components,
  hooks, API calls, Supabase queries, RLS policies, auth flows, or end-to-end user journeys.
  Trigger this skill for phrases like "test my app", "write tests for", "check if this works",
  "audit my Supabase setup", "test my auth", "test my components", "run tests", or any request
  involving QA, coverage, or correctness of a React+Vite+Supabase codebase. Always use this skill
  even if the user only mentions one layer (e.g. "just test the frontend") — you should still check
  for cross-layer issues.
---

# React + Vite + Supabase Testing Skill

This skill guides Claude through manually generating and organizing tests for a full-stack app built with **React**, **Vite**, and **Supabase**. Claude will inspect the project, choose the right tools, write the test files, and explain how to run them.

---

## Step 1 — Understand the Project

Before writing any tests, always do this first:

1. **Scan the project structure** — list files/folders to understand the layout
2. **Read `package.json`** — check existing test libraries, scripts, and dependencies
3. **Look at `vite.config.ts/js`** — identify aliases, plugins, env vars
4. **Check `.env` or `.env.example`** — spot Supabase URL/anon key usage
5. **Read key source files** — components, hooks, Supabase client setup, route definitions

```bash
# Example exploration commands
ls -R src/
cat package.json
cat vite.config.ts
cat src/lib/supabaseClient.ts   # or wherever Supabase is initialized
```

Ask the user if anything is unclear (e.g. "Where is your Supabase client initialized?").

---

## Step 2 — Choose the Right Tools

Based on what you find in `package.json`, pick tools. If none are installed, recommend and scaffold setup.

| Layer | Recommended Tool | Install Command |
|---|---|---|
| Unit (components/hooks) | **Vitest** + **React Testing Library** | `npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom` |
| Integration (Supabase queries) | **Vitest** + **msw** (mock service worker) | `npm i -D msw` |
| E2E (full user flows) | **Playwright** | `npm init playwright@latest` |
| Supabase RLS/Auth | Supabase local dev + **Vitest** | `npx supabase start` |

> If the user already has a tool installed, always use that. Never add conflicting test runners.

After choosing tools, add the necessary config — see `references/tool-setup.md`.

---

## Step 3 — Identify What to Test

Go through these layers and identify concrete test targets from the actual code:

### 🔵 Frontend (React Components & Hooks)
- Render tests: does the component mount without crashing?
- Interaction tests: button clicks, form submissions, input changes
- Conditional rendering: loading states, error states, empty states
- Custom hooks: state transitions, side effects
- Context providers: does data flow correctly?

### 🟡 Integration (Frontend ↔ Supabase)
- Supabase queries: `select`, `insert`, `update`, `delete` calls
- Auth flows: sign up, sign in, sign out, session persistence
- Realtime subscriptions: does the UI update on DB changes?
- Storage: file upload/download flows

### 🔴 Backend / Supabase
- **RLS policies**: can the right users access the right rows?
- **Edge Functions**: input validation, response shape, error handling
- **Database constraints**: required fields, unique keys, foreign keys
- **Auth hooks**: trigger behavior on user creation/deletion

### 🟢 End-to-End (Full User Journeys)
- Happy path: user signs up → does task → sees result
- Auth guard: unauthenticated user redirected to login
- Form validation: bad input shows correct errors
- Data persistence: create record → refresh → record still there

---

## Step 4 — Write the Tests

### File Organization

```
src/
  __tests__/
    components/       ← React component tests
    hooks/            ← Custom hook tests
    pages/            ← Page-level integration tests
  lib/
    __tests__/
      supabase.test.ts  ← Supabase query/auth tests
tests/
  e2e/                ← Playwright E2E tests
```

### Writing Unit Tests (Vitest + RTL)

```tsx
// src/__tests__/components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import LoginForm from '../../components/LoginForm'

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('calls onSubmit with credentials when form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

### Mocking Supabase in Unit/Integration Tests

```ts
// src/__tests__/setup/mockSupabase.ts
import { vi } from 'vitest'

export const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
}

vi.mock('../../lib/supabaseClient', () => ({
  supabase: mockSupabase,
}))
```

### Writing Supabase Auth Tests

```ts
// src/__tests__/lib/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockSupabase } from '../setup/mockSupabase'
import { signIn, signOut } from '../../lib/auth'

describe('Auth', () => {
  beforeEach(() => vi.clearAllMocks())

  it('signs in with email and password', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123' }, session: {} },
      error: null,
    })
    const result = await signIn('test@example.com', 'pass')
    expect(result.error).toBeNull()
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'pass',
    })
  })

  it('returns error on failed sign in', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    })
    const result = await signIn('bad@email.com', 'wrong')
    expect(result.error.message).toBe('Invalid credentials')
  })
})
```

### Writing RLS Policy Tests (Supabase Local)

```ts
// tests/rls/posts.test.ts — requires `npx supabase start`
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://localhost:54321'
const ANON_KEY = process.env.SUPABASE_ANON_KEY!

describe('RLS: posts table', () => {
  it('user cannot read another user\'s private posts', async () => {
    const client = createClient(SUPABASE_URL, ANON_KEY)
    // Sign in as user A
    await client.auth.signInWithPassword({ email: 'userA@test.com', password: 'pass' })
    const { data, error } = await client.from('posts').select('*').eq('user_id', 'USER_B_ID')
    expect(data).toHaveLength(0) // RLS blocks access
  })
})
```

### Writing E2E Tests (Playwright)

```ts
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign up and reach dashboard', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign Up')
    await page.fill('[placeholder="Email"]', 'newuser@test.com')
    await page.fill('[placeholder="Password"]', 'StrongPass123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Welcome')
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
```

---

## Step 5 — Configure Vitest (if needed)

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup/index.ts',
  },
})
```

```ts
// src/__tests__/setup/index.ts
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Step 6 — Present Results to User

After writing all test files, give the user:

1. **Summary table** of what was generated and what layer it covers
2. **How to run** each type of test
3. **What to check** — expected pass/fail behavior
4. **Known gaps** — any areas you couldn't test without more context (e.g., DB schema, real Supabase keys)

### Example Summary

| Test File | Layer | Tool | Run With |
|---|---|---|---|
| `LoginForm.test.tsx` | Frontend | Vitest + RTL | `npm test` |
| `auth.test.ts` | Integration | Vitest + mock | `npm test` |
| `posts.rls.test.ts` | Supabase RLS | Vitest + local | `npx supabase start && npm test` |
| `auth.spec.ts` | E2E | Playwright | `npm run test:e2e` |

---

## Edge Cases & Reminders

- **Never hardcode real Supabase keys** in test files — use `process.env` or `.env.test`
- **Mock `supabaseClient` at the module level** so it applies across all imports
- **Supabase RLS tests need local Supabase running** — remind the user to run `npx supabase start`
- **Vite aliases** (like `@/`) must be reflected in `vitest.config.ts` under `resolve.alias`
- **React Context** — wrap components under test with necessary providers
- **Auth state** in E2E — use `storageState` in Playwright to persist login sessions across tests

---

## Reference Files

- `references/tool-setup.md` — Step-by-step setup for Vitest, Playwright, MSW, and Supabase local
- `references/common-patterns.md` — Reusable test patterns for hooks, context, async Supabase calls
