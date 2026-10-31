import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(_callback: IntersectionObserverCallback) {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

(globalThis as typeof globalThis & { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver =
  MockIntersectionObserver;

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
