# Common Test Patterns

## Wrapping with Providers

```tsx
// src/__tests__/setup/renderWithProviders.tsx
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext' // adjust path

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  )
}
```

---

## Testing Custom Hooks

```ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '../../hooks/useCounter'

it('increments counter', () => {
  const { result } = renderHook(() => useCounter())
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
})
```

---

## Testing Async Supabase Calls in Components

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import { mockSupabase } from '../setup/mockSupabase'
import PostList from '../../components/PostList'

it('renders posts fetched from Supabase', async () => {
  mockSupabase.from.mockReturnValue({
    select: vi.fn().mockResolvedValue({
      data: [{ id: 1, title: 'My Post' }],
      error: null,
    }),
  })

  render(<PostList />)
  await waitFor(() => {
    expect(screen.getByText('My Post')).toBeInTheDocument()
  })
})
```

---

## Testing Loading and Error States

```tsx
it('shows loading spinner while fetching', () => {
  mockSupabase.from.mockReturnValue({
    select: vi.fn().mockReturnValue(new Promise(() => {})), // never resolves
  })
  render(<PostList />)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

it('shows error message on fetch failure', async () => {
  mockSupabase.from.mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: null, error: { message: 'Network error' } }),
  })
  render(<PostList />)
  await waitFor(() => {
    expect(screen.getByText(/network error/i)).toBeInTheDocument()
  })
})
```

---

## Playwright: Reuse Auth Session

```ts
// tests/e2e/setup/auth.setup.ts
import { test as setup } from '@playwright/test'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[placeholder="Email"]', process.env.TEST_USER_EMAIL!)
  await page.fill('[placeholder="Password"]', process.env.TEST_USER_PASSWORD!)
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
  await page.context().storageState({ path: 'tests/e2e/.auth/user.json' })
})
```

```ts
// playwright.config.ts — use saved auth
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  {
    name: 'authenticated',
    use: { storageState: 'tests/e2e/.auth/user.json' },
    dependencies: ['setup'],
  },
]
```

---

## Testing Realtime Subscriptions

```ts
it('updates UI when Supabase fires realtime event', async () => {
  let realtimeCallback: (payload: any) => void = () => {}

  mockSupabase.channel = vi.fn().mockReturnValue({
    on: vi.fn().mockImplementation((_event, _filter, cb) => {
      realtimeCallback = cb
      return { subscribe: vi.fn() }
    }),
  })

  render(<LivePostList />)

  act(() => {
    realtimeCallback({ eventType: 'INSERT', new: { id: 99, title: 'Live Post' } })
  })

  await waitFor(() => {
    expect(screen.getByText('Live Post')).toBeInTheDocument()
  })
})
```
