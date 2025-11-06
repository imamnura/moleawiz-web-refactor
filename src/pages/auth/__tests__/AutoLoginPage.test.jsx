/**
 * AutoLoginPage Tests
 * Unit tests for Auto Login (SSO callback) page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/test-utils'
import AutoLoginPage from '../AutoLoginPage'

// Mock the API hook
const mockAutoLogin = vi.fn()
vi.mock('@services/api/authApi', () => ({
  useAutoLoginMutation: vi.fn(() => [mockAutoLogin, { isLoading: false }]),
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
const mockSearchParams = new URLSearchParams()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams],
  }
})

describe('AutoLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams.delete('token')
  })

  it('should render loading spinner', () => {
    renderWithProviders(<AutoLoginPage />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText(/authenticating/i)).toBeInTheDocument()
  })

  it('should have semantic HTML structure', () => {
    const { container } = renderWithProviders(<AutoLoginPage />)

    expect(container.querySelector('main')).toBeInTheDocument()
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('should have ARIA attributes for accessibility', () => {
    const { container } = renderWithProviders(<AutoLoginPage />)

    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-live', 'polite')
    expect(section).toHaveAttribute('aria-busy', 'true')
  })

  it('should redirect to login when no token provided', () => {
    renderWithProviders(<AutoLoginPage />)

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true })
  })

  it('should call autoLogin when token is provided', () => {
    mockSearchParams.set('token', 'test-token')
    mockAutoLogin.mockReturnValue({
      unwrap: () => Promise.resolve({ user: {}, token: 'test-token' }),
    })

    renderWithProviders(<AutoLoginPage />)

    expect(mockAutoLogin).toHaveBeenCalledWith('test-token')
  })

  it('should navigate to home on successful login', async () => {
    mockSearchParams.set('token', 'test-token')
    mockAutoLogin.mockReturnValue({
      unwrap: () => Promise.resolve({ user: { id: 1 }, token: 'test-token' }),
    })

    renderWithProviders(<AutoLoginPage />)

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true })
    })
  })

  it('should navigate to login on failed authentication', async () => {
    mockSearchParams.set('token', 'invalid-token')
    mockAutoLogin.mockReturnValue({
      unwrap: () => Promise.reject(new Error('Invalid token')),
    })

    renderWithProviders(<AutoLoginPage />)

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login', {
        replace: true,
      })
    })
  })
})
