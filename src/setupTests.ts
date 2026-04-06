import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import { afterEach } from 'vitest'

if (!('matchMedia' in window)) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn<(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) => void>(),
      removeEventListener: vi.fn<(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions) => void>(),
      addListener: vi.fn<(listener: ((this: MediaQueryList, event: MediaQueryListEvent) => void) | null) => void>(),
      removeListener: vi.fn<(listener: ((this: MediaQueryList, event: MediaQueryListEvent) => void) | null) => void>(),
      dispatchEvent: vi.fn<(event: Event) => boolean>(),
    }),
  })
}

if (!('ResizeObserver' in window)) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error ResizeObserver not implemented in jsdom
  window.ResizeObserver = ResizeObserver
}

afterEach(() => {
  vi.clearAllTimers();
});
