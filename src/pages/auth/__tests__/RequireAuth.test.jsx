/**
 * RequireAuth Tests
 * Unit tests for authentication guard component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../test/test-utils'
import RequireAuth from '../RequireAuth'

// Mock TabToTap component (note: it's TabToTap not TabToTop)
vi.mock('@/components/TabToTap', () => ({
  default: () => <div data-testid="tab-to-top">Tab To Top</div>,
}))

// Mock utils
vi.mock('@utils', () => ({
  getAccessToken: vi.fn(),
}))

// Mock TabToTop component
vi.mock('@components/TabToTap', () => ({
  default: () => <div data-testid="tab-to-top">Tab To Top</div>,
}))

// Mock Outlet from react-router-dom
const mockUseLocation = vi.fn(() => ({
  pathname: '/',
  state: null,
  search: '',
  hash: '',
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Protected Content</div>,
    useLocation: () => mockUseLocation(),
  }
})

describe('RequireAuth', () => {
  let originalClassList

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset useLocation mock to default
    mockUseLocation.mockReturnValue({
      pathname: '/',
      state: null,
      search: '',
      hash: '',
    })
    // Mock document.body.classList
    originalClassList = document.body.className
    document.body.className = ''
  })

  afterEach(() => {
    document.body.className = originalClassList
  })

  it('should redirect to login when not authenticated', async () => {
    const { getAccessToken } = await import('@utils')
    getAccessToken.mockReturnValue(null)

    renderWithRouter(<RequireAuth />)

    // Should not render protected content
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument()
  })

  it('should render protected content when authenticated', async () => {
    const { getAccessToken } = await import('@utils')
    getAccessToken.mockReturnValue('valid-token')

    renderWithRouter(<RequireAuth />, { route: '/home' })

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('should apply correct body classes on mount', async () => {
    const { getAccessToken } = await import('@utils')
    getAccessToken.mockReturnValue('valid-token')

    renderWithRouter(<RequireAuth />)

    expect(document.body.classList.contains('main-body')).toBe(true)
    expect(document.body.classList.contains('app')).toBe(true)
    expect(document.body.classList.contains('sidebar-mini')).toBe(true)
    expect(document.body.classList.contains('light-mode')).toBe(true)
    expect(document.body.classList.contains('ltr')).toBe(true)
  })

  it('should remove unwanted body classes', async () => {
    const { getAccessToken } = await import('@utils')
    getAccessToken.mockReturnValue('valid-token')

    document.body.classList.add('page-style1', 'bg-style', 'error-page')

    renderWithRouter(<RequireAuth />)

    expect(document.body.classList.contains('page-style1')).toBe(false)
    expect(document.body.classList.contains('bg-style')).toBe(false)
    expect(document.body.classList.contains('error-page')).toBe(false)
  })

  it('should cleanup body classes on unmount', async () => {
    const { getAccessToken } = await import('@utils')
    getAccessToken.mockReturnValue('valid-token')

    const { unmount } = renderWithRouter(<RequireAuth />)

    expect(document.body.classList.contains('main-body')).toBe(true)

    unmount()

    expect(document.body.classList.contains('main-body')).toBe(false)
    expect(document.body.classList.contains('app')).toBe(false)
    expect(document.body.classList.contains('sidebar-mini')).toBe(false)
  })

  it('should show TabToTop on profile detail page', async () => {
    const { getAccessToken } = await import('@utils')
    getAccessToken.mockReturnValue('valid-token')

    // Mock useLocation to return /profile/detail
    mockUseLocation.mockReturnValue({
      pathname: '/profile/detail',
      state: null,
      search: '',
      hash: '',
    })

    renderWithRouter(<RequireAuth />, { route: '/profile/detail' })

    expect(screen.getByTestId('tab-to-top')).toBeInTheDocument()
  })

  it('should not show TabToTop on other pages', async () => {
    const { getAccessToken } = await import('@utils')
    getAccessToken.mockReturnValue('valid-token')

    renderWithRouter(<RequireAuth />, { route: '/home' })

    expect(screen.queryByTestId('tab-to-top')).not.toBeInTheDocument()
  })

  it('should render Outlet for nested routes', async () => {
    const { getAccessToken } = await import('@utils')
    getAccessToken.mockReturnValue('valid-token')

    renderWithRouter(<RequireAuth />)

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
