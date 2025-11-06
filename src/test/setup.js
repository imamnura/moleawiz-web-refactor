/**
 * Vitest Test Setup
 * Global configuration for testing environment
 */

import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { server } from '@/pages/review/__tests__/mocks/server'

// MSW Server Setup
beforeAll(() => {
  // Start MSW server before all tests
  server.listen({ onUnhandledRequest: 'bypass' })
})

afterAll(() => {
  // Close MSW server after all tests
  server.close()
})

afterEach(() => {
  // Reset MSW handlers after each test
  server.resetHandlers()
  
  // Cleanup React Testing Library
  cleanup()
})

// Mock environment variables
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api')
vi.stubEnv('VITE_CRYPTO_KEY', 'd3v3l0pm3nt-s3cr3t-k3y-12345678')
vi.stubEnv('VITE_CRYPTO_IV', 'd3v3l0pm3nt-iv!!')
vi.stubEnv('VITE_COMPANY_NAME', 'digima Asia')
vi.stubEnv('VITE_PROJECT_TITLE', 'MoLeaWiz')
vi.stubEnv('VITE_DOMAIN_AUTH0', 'dev-auth.auth0.com')
vi.stubEnv('VITE_CLIENT_ID_AUTH0', 'test-client-id')
vi.stubEnv('VITE_REDIRECT_URI_AUTH0', 'http://localhost:3000/auth/callback')

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
globalThis.localStorage = localStorageMock

// Mock window.location
delete window.location
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
}

// Suppress console errors during tests (optional)
globalThis.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}
