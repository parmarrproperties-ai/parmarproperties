import { vi } from 'vitest';

export function makeQueryMock(resolvedValue: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'in', 'not',
                   'order', 'limit', 'match'];
  methods.forEach((m) => {
    chain[m] = vi.fn().mockReturnThis();
  });
  chain['single'] = vi.fn().mockImplementation(() => {
    const data = Array.isArray(resolvedValue.data)
      ? resolvedValue.data[0] ?? null
      : resolvedValue.data;
    return {
      then: (resolve: (v: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
        Promise.resolve({ data, error: resolvedValue.error }).then(resolve, reject),
    };
  });
  chain['then'] = (resolve: (v: unknown) => unknown) => Promise.resolve(resolvedValue).then(resolve);
  return chain;
}

export const mockQueryChain = makeQueryMock({ data: [], error: null });

export const mockSupabase = {
  from: vi.fn().mockReturnValue(mockQueryChain),
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
  },
};

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));
