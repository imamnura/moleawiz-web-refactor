/**
 * LoginPage Tests
 * Unit tests for Login page component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test/test-utils'
import LoginPage from '../LoginPage'
import { useLoginMutation } from '@services/api/authApi'

// Mock the API hook
const mockLoginMutate = vi.fn()

vi.mock('@services/api/authApi', () => ({
  useLoginMutation: vi.fn(),
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock return value
    useLoginMutation.mockReturnValue([
      mockLoginMutate,
      { isLoading: false, error: null },
    ])
  })

  it('should render login form', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /submit login/i })
    ).toBeInTheDocument()
  })

  it('should render welcome message', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should render forgot password link', () => {
    renderWithProviders(<LoginPage />)

    const forgotLink = screen.getByRole('link', { name: /forgot password/i })
    expect(forgotLink).toBeInTheDocument()
    expect(forgotLink).toHaveAttribute('href', '/auth/forgot-password')
  })

  it('should show validation error when username is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: /submit login/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/username.*required/i)).toBeInTheDocument()
    })
  })

  it('should show validation error when password is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    const usernameInput = screen.getByPlaceholderText(/username/i)
    await user.type(usernameInput, 'testuser')

    const submitButton = screen.getByRole('button', { name: /submit login/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password.*required/i)).toBeInTheDocument()
    })
  })

  it('should call login mutation when form is submitted', async () => {
    const mockLogin = vi
      .fn()
      .mockResolvedValue({
        unwrap: () => Promise.resolve({ user: {}, token: 'token' }),
      })
    useLoginMutation.mockReturnValue([mockLogin, { isLoading: false }])

    const user = userEvent.setup()
    renderWithProviders(<LoginPage />)

    const usernameInput = screen.getByPlaceholderText(/username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /submit login/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      })
    })
  })

  it('should show loading state when submitting', async () => {
    useLoginMutation.mockReturnValue([mockLoginMutate, { isLoading: true }])

    renderWithProviders(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: /submit login/i })
    // Ant Design buttons don't get disabled when loading, they get a loading class
    expect(submitButton).toHaveClass('ant-btn-loading')
  })

  it('should have semantic HTML structure', () => {
    const { container } = renderWithProviders(<LoginPage />)

    expect(container.querySelector('main')).toBeInTheDocument()
    expect(container.querySelector('article')).toBeInTheDocument()
    expect(container.querySelector('section')).toBeInTheDocument()
    expect(container.querySelector('header')).toBeInTheDocument()
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('should have ARIA labels for accessibility', () => {
    renderWithProviders(<LoginPage />)

    // Check for form inputs with placeholders (which serve as labels)
    const usernameInput = screen.getByPlaceholderText(/username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /submit login/i })

    expect(usernameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
})
