/**
 * ChangePasswordPage Tests
 * Unit tests for Change Password page
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../test/test-utils'
import ChangePasswordPage from '../ChangePasswordPage'

// Mock the API hook
const mockChangePassword = vi.fn()
vi.mock('@services/api/authApi', () => ({
  useChangePasswordMutation: vi.fn(() => [
    mockChangePassword,
    { isLoading: false },
  ]),
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
const mockLocation = {
  state: {
    accessToken: 'test-token',
    fullName: 'Test User',
  },
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  }
})

describe('ChangePasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocation.state = {
      accessToken: 'test-token',
      fullName: 'Test User',
    }
  })

  it('should render change password form with token', () => {
    const { container } = renderWithProviders(<ChangePasswordPage />)
    expect(container.querySelector('form')).toBeInTheDocument()
  })

  it('should redirect to login when no token provided', async () => {
    mockLocation.state = null
    renderWithProviders(<ChangePasswordPage />)

    // Component will call navigate, but form might briefly render
    // Just check that navigate was called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login', {
        replace: true,
      })
    })
  })

  it('should have semantic HTML structure', () => {
    const { container } = renderWithProviders(<ChangePasswordPage />)
    expect(container.querySelector('main')).toBeInTheDocument()
  })
})
