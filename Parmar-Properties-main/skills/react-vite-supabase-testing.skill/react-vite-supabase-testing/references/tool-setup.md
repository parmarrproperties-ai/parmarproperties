# Tool Setup Reference

## Vitest + React Testing Library

```bash
npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @vitejs/plugin-react
```

### vitest.config.ts
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup/index.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/__tests__/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // match your vite.config aliases
    },
  },
})
```

### Setup file
```ts
// src/__tests__/setup/index.ts
import '@testing-library/jest-dom'
```

---

## Playwright (E2E)

```bash
npm init playwright@latest
# Choose: TypeScript, tests/ folder, add GitHub Actions: optional
```

### playwright.config.ts (recommended settings)
```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173', // Vite dev server default
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## MSW (Mock Service Worker) — for mocking fetch/REST calls

```bash
npm i -D msw
npx msw init public/ --save
```

### handlers.ts
```ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/posts', () => {
    return HttpResponse.json([{ id: 1, title: 'Hello World' }])
  }),
]
```

### browser.ts / server.ts
```ts
// src/__tests__/setup/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
export const server = setupServer(...handlers)
```

Add to setup file:
```ts
import { server } from './server'
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Supabase Local Development

```bash
# Install Supabase CLI
npm i -D supabase

# Initialize (first time only)
npx supabase init

# Start local Supabase (Postgres + Auth + Storage + Studio)
npx supabase start

# Check status and get local keys
npx supabase status
```

Use `.env.test`:
```
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<from supabase status output>
```

Stop local Supabase:
```bash
npx supabase stop
```
