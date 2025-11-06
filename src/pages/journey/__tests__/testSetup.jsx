/**
 * Common Test Setup untuk Journey Tests
 * Provides common mocks and utilities
 */

import { vi } from 'vitest'

/**
 * Setup common mocks yang dipakai di banyak tests
 */
export const setupCommonMocks = () => {
  // Mock react-i18next
  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key) => key,
      i18n: { language: 'en' },
    }),
    Trans: ({ children }) => children,
  }))

  // Mock date-fns if needed
  vi.mock('date-fns', () => ({
    differenceInDays: vi.fn((deadline, today) => 5),
    parseISO: vi.fn((date) => new Date(date)),
    isAfter: vi.fn(() => false),
    isBefore: vi.fn(() => false),
    addDays: vi.fn((date, days) => new Date()),
    format: vi.fn((date, format) => '2025-12-31'),
  }))
}

/**
 * Create mock for useResponsive hook
 */
export const createUseResponsiveMock = (isMobile = false) => {
  return vi.fn(() => ({ 
    isMobile,
    isTablet: false,
    isDesktop: !isMobile 
  }))
}

/**
 * Create mock for react-router-dom
 */
export const createRouterMocks = () => ({
  useParams: vi.fn(() => ({ 
    journeyId: '1', 
    courseId: '1', 
    moduleId: '1' 
  })),
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({
    pathname: '/my-learning-journey',
    search: '',
  })),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  NavLink: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
})

/**
 * Mock QueryClient wrapper for hook tests
 */
export const createQueryClientWrapper = () => {
  const { QueryClient, QueryClientProvider } = require('@tanstack/react-query')
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
