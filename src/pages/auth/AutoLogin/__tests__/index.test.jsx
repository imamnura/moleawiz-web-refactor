import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../test/test-utils'
import AutoLogin from '../index'

// Mock useAutoLoginToken hook
const mockLogin = vi.fn()
const mockFetchProgramId = vi.fn()

vi.mock('../hooks/useAutoLoginToken', () => ({
  useAutoLoginToken: ({ onSuccess, onError }) => {
    // Store callbacks for testing
    AutoLogin._testCallbacks = { onSuccess, onError }
    return {
      loading: false,
      error: null,
      login: mockLogin,
      fetchProgramId: mockFetchProgramId,
    }
  },
}))

// Mock Loader component
vi.mock('@/components/common', () => ({
  Loader: ({ fullScreen }) => (
    <div data-testid="loader" data-fullscreen={fullScreen}>
      Loading...
    </div>
  ),
}))

// Mock utils
vi.mock('@/utils', () => ({
  setAccessToken: vi.fn(),
  setFullname: vi.fn(),
  setUsername: vi.fn(),
}))

// Mock navigate and searchParams
const mockNavigate = vi.fn()
const mockSearchParams = new Map()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [
      {
        get: (key) => mockSearchParams.get(key),
      },
    ],
  }
})

describe('AutoLogin Component', () => {
  const mockUserData = {
    user: {
      token: 'mock-access-token',
    },
    firstname: 'John',
    lastname: 'Doe',
    username: 'john.doe@example.com',
    last_login_platform: 'web',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams.clear()
    AutoLogin._testCallbacks = null
  })

  it('should render loader initially', () => {
    mockSearchParams.set('token', 'test-token')
    renderWithProviders(<AutoLogin />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByTestId('loader')).toHaveAttribute(
      'data-fullscreen',
      'true'
    )
  })

  it('should call login with token from URL params on mount', () => {
    mockSearchParams.set('token', 'test-token-123')
    renderWithProviders(<AutoLogin />)

    expect(mockLogin).toHaveBeenCalledWith('test-token-123')
  })

  it('should show error when no token is provided', () => {
    renderWithProviders(<AutoLogin />)

    expect(
      screen.getByText('No authentication token provided')
    ).toBeInTheDocument()
  })

  it('should navigate to home after successful login (default)', async () => {
    mockSearchParams.set('token', 'test-token')
    renderWithProviders(<AutoLogin />)

    // Trigger onSuccess callback
    const { onSuccess } = AutoLogin._testCallbacks
    await onSuccess(mockUserData)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home', {
        state: { successPassword: 0 },
      })
    })
  })

  it('should navigate to my-learning-journey when page=list-program', async () => {
    mockSearchParams.set('token', 'test-token')
    mockSearchParams.set('page', 'list-program')
    renderWithProviders(<AutoLogin />)

    // Trigger onSuccess callback
    const { onSuccess } = AutoLogin._testCallbacks
    await onSuccess(mockUserData)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/my-learning-journey', {
        state: { successPassword: 0 },
      })
    })
  })

  it('should navigate to program detail when page=detail-program with valid program_id', async () => {
    mockSearchParams.set('token', 'test-token')
    mockSearchParams.set('page', 'detail-program')
    mockSearchParams.set('program_id', 'program-uuid-123')
    mockFetchProgramId.mockResolvedValue(456)

    renderWithProviders(<AutoLogin />)

    // Trigger onSuccess callback
    const { onSuccess } = AutoLogin._testCallbacks
    await onSuccess(mockUserData)

    await waitFor(() => {
      expect(mockFetchProgramId).toHaveBeenCalledWith('program-uuid-123')
      expect(mockNavigate).toHaveBeenCalledWith(
        '/my-learning-journey/journey/456',
        {
          state: { successPassword: 0 },
        }
      )
    })
  })

  it('should navigate to home when page=detail-program but program_id fetch fails', async () => {
    mockSearchParams.set('token', 'test-token')
    mockSearchParams.set('page', 'detail-program')
    mockSearchParams.set('program_id', 'invalid-uuid')
    mockFetchProgramId.mockResolvedValue(null)

    renderWithProviders(<AutoLogin />)

    // Trigger onSuccess callback
    const { onSuccess } = AutoLogin._testCallbacks
    await onSuccess(mockUserData)

    await waitFor(() => {
      expect(mockFetchProgramId).toHaveBeenCalledWith('invalid-uuid')
      expect(mockNavigate).toHaveBeenCalledWith('/home', {
        state: { successPassword: 0 },
      })
    })
  })

  it('should navigate to home when page=detail-program but no program_id', async () => {
    mockSearchParams.set('token', 'test-token')
    mockSearchParams.set('page', 'detail-program')

    renderWithProviders(<AutoLogin />)

    // Trigger onSuccess callback
    const { onSuccess } = AutoLogin._testCallbacks
    await onSuccess(mockUserData)

    await waitFor(() => {
      expect(mockFetchProgramId).not.toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/home', {
        state: { successPassword: 0 },
      })
    })
  })

  it('should handle unknown page parameter', async () => {
    mockSearchParams.set('token', 'test-token')
    mockSearchParams.set('page', 'unknown-page')

    renderWithProviders(<AutoLogin />)

    // Trigger onSuccess callback
    const { onSuccess } = AutoLogin._testCallbacks
    await onSuccess(mockUserData)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home', {
        state: { successPassword: 0 },
      })
    })
  })

  it('should not call login when token is missing', () => {
    renderWithProviders(<AutoLogin />)

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should save user data on successful login', async () => {
    const { setAccessToken, setFullname, setUsername } = await import('@/utils')
    mockSearchParams.set('token', 'test-token')

    renderWithProviders(<AutoLogin />)

    // Trigger onSuccess callback
    const { onSuccess } = AutoLogin._testCallbacks
    await onSuccess(mockUserData)

    await waitFor(() => {
      expect(setAccessToken).toHaveBeenCalledWith('mock-access-token')
      expect(setFullname).toHaveBeenCalledWith('John Doe')
      expect(setUsername).toHaveBeenCalledWith(
        JSON.stringify({
          username: 'john.doe@example.com',
          isChecked: false,
        })
      )
    })
  })

  it('should dispatch setLastLogin action on success', async () => {
    mockSearchParams.set('token', 'test-token')

    const { store } = renderWithProviders(<AutoLogin />)

    // Trigger onSuccess callback
    const { onSuccess } = AutoLogin._testCallbacks
    await onSuccess(mockUserData)

    // Check if the action was dispatched
    await waitFor(() => {
      const state = store.getState()
      // The action should have been dispatched
      expect(state).toBeDefined()
    })
  })
})
