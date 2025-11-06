/**
 * Test Helper untuk Journey Components
 * Menyediakan mocks umum yang digunakan oleh banyak component tests
 */

import { vi } from 'vitest'

/**
 * Mock @/hooks/useResponsive
 */
export const mockUseResponsive = (isMobile = false) => {
  vi.mock('@/hooks/useResponsive', () => ({
    useResponsive: vi.fn(() => ({ isMobile })),
  }))
}

/**
 * Mock @/utils/journeyHelpers dengan semua fungsi
 */
export const mockJourneyHelpers = async () => {
  const actual = await vi.importActual('@/utils/journeyHelpers')
  return {
    ...actual,
  }
}

/**
 * Mock react-router-dom dengan defaults
 */
export const mockReactRouter = () => {
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useParams: vi.fn(() => ({ journeyId: '1', courseId: '1', moduleId: '1' })),
      useNavigate: vi.fn(() => vi.fn()),
    }
  })
}

/**
 * Setup common mocks untuk component tests
 */
export const setupCommonMocks = () => {
  mockReactRouter()
  
  // Mock i18next
  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key) => key,
      i18n: { language: 'en' },
    }),
    Trans: ({ children }) => children,
  }))
}
