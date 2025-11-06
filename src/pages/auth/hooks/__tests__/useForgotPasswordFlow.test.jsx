import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { useForgotPasswordFlow } from '../useForgotPasswordFlow'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock API hooks and mutations
const mockCheckUsername = vi.fn()
const mockVerifyOTP = vi.fn()
const mockResetCheckUsername = vi.fn()
const mockResetVerifyOTP = vi.fn()
const mockResetRequestNewOTP = vi.fn()

// Track call count for useCheckUsernameMutation (called twice in hook)
let checkUsernameCallCount = 0

vi.mock('@services/api', async () => {
  const actual = await vi.importActual('@services/api')
  return {
    ...actual,
    useCheckUsernameMutation: () => {
      checkUsernameCallCount++
      // First call is for checkUsername, second is for requestNewOTP
      if (checkUsernameCallCount === 1) {
        return [
          mockCheckUsername,
          { isLoading: false, error: null, reset: mockResetCheckUsername },
        ]
      } else {
        return [
          mockCheckUsername,
          { isLoading: false, error: null, reset: mockResetRequestNewOTP },
        ]
      }
    },
    useVerifyOTPMutation: () => [
      mockVerifyOTP,
      { isLoading: false, error: null, reset: mockResetVerifyOTP },
    ],
  }
})

describe('useForgotPasswordFlow', () => {
  const createWrapper = () => {
    const store = configureStore({
      reducer: {
        api: () => ({}), // Dummy reducer for mocked API
      },
    })

    return ({ children }) => (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCheckUsername.mockClear()
    mockVerifyOTP.mockClear()
    mockResetCheckUsername.mockClear()
    mockResetVerifyOTP.mockClear()
    mockResetRequestNewOTP.mockClear()
    mockNavigate.mockClear()
    checkUsernameCallCount = 0 // Reset call count
  })

  it('should initialize with username step and default state', () => {
    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    expect(result.current.currentStep).toBe('username')
    expect(result.current.username).toBe('')
    expect(result.current.expiredDate).toBe('')
    expect(result.current.sendDate).toBe('')
    expect(result.current.showOtpInput).toBe(true)
    expect(result.current.showVerifyButton).toBe(true)
    expect(result.current.showRequestButton).toBe(false)
  })

  it('should transition to OTP step after successful username submission', async () => {
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        username: 'test@example.com',
        verification_code_expired_datetime: '2024-01-01T12:30:00Z',
        verification_code_send_datetime: '2024-01-01T12:00:00Z',
      }),
    })

    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    await result.current.handleUsernameSubmit('test@example.com')

    await waitFor(() => {
      expect(result.current.currentStep).toBe('otp')
    })
    
    expect(result.current.username).toBe('test@example.com')
    expect(result.current.expiredDate).toBe('2024-01-01T12:30:00Z')
    expect(result.current.sendDate).toBe('2024-01-01T12:00:00Z')
  })

  it('should navigate to change-password after successful OTP verification', async () => {
    const mockVerifyResult = {
      user: {
        token: 'mock-access-token',
      },
      firstname: 'John',
      lastname: 'Doe',
    }

    // Setup username step first
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        username: 'test@example.com',
        verification_code_expired_datetime: '2024-01-01T12:30:00Z',
        verification_code_send_datetime: '2024-01-01T12:00:00Z',
      }),
    })

    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    // Submit username first
    await result.current.handleUsernameSubmit('test@example.com')

    await waitFor(() => {
      expect(result.current.currentStep).toBe('otp')
    })

    // Now setup OTP verification
    mockVerifyOTP.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(mockVerifyResult),
    })

    await result.current.handleOTPSubmit('123456')

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/change-password', {
        state: {
          token: 'mock-access-token',
          fullname: 'John Doe',
        },
      })
    })
  })

  it('should not submit OTP if value is empty or whitespace', async () => {
    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    const mockUnwrap = vi.fn()
    mockVerifyOTP.mockReturnValue({ unwrap: mockUnwrap })

    await result.current.handleOTPSubmit('')
    expect(mockVerifyOTP).not.toHaveBeenCalled()

    await result.current.handleOTPSubmit('   ')
    expect(mockVerifyOTP).not.toHaveBeenCalled()
  })

  it('should handle too many OTP validation attempts error', async () => {
    const mockError = {
      status: 401,
      data: {
        verification_code: 'Too Many Validation Fails!',
      },
    }

    // Setup username step first
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        username: 'test@example.com',
        verification_code_expired_datetime: '2024-01-01T12:30:00Z',
        verification_code_send_datetime: '2024-01-01T12:00:00Z',
      }),
    })

    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    await result.current.handleUsernameSubmit('test@example.com')

    await waitFor(() => {
      expect(result.current.currentStep).toBe('otp')
    })

    // Mock OTP verification failure
    mockVerifyOTP.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(mockError),
    })

    await result.current.handleOTPSubmit('123456')

    await waitFor(() => {
      expect(result.current.showOtpInput).toBe(false)
    })
    
    expect(result.current.showVerifyButton).toBe(false)
    expect(result.current.showRequestButton).toBe(true)
  })

  it('should request new OTP and update state', async () => {
    const mockRequestNewResult = {
      username: 'test@example.com',
      verification_code_expired_datetime: '2024-01-01T13:00:00Z',
      verification_code_send_datetime: '2024-01-01T12:30:00Z',
    }

    // Setup username step first
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        username: 'test@example.com',
        verification_code_expired_datetime: '2024-01-01T12:30:00Z',
        verification_code_send_datetime: '2024-01-01T12:00:00Z',
      }),
    })

    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    await result.current.handleUsernameSubmit('test@example.com')

    await waitFor(() => {
      expect(result.current.currentStep).toBe('otp')
    })

    // Simulate expired OTP
    result.current.handleOTPExpired()

    await waitFor(() => {
      expect(result.current.showRequestButton).toBe(true)
    })

    // Mock request new OTP (reuses checkUsername mutation)
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(mockRequestNewResult),
    })

    await result.current.handleRequestNewOTP()

    await waitFor(() => {
      expect(result.current.showOtpInput).toBe(true)
    })
    
    expect(result.current.expiredDate).toBe('2024-01-01T13:00:00Z')
    expect(result.current.sendDate).toBe('2024-01-01T12:30:00Z')
    expect(result.current.showVerifyButton).toBe(true)
    expect(result.current.showRequestButton).toBe(false)
  })

  it('should handle OTP expiration correctly', async () => {
    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    result.current.handleOTPExpired()

    await waitFor(() => {
      expect(result.current.showOtpInput).toBe(false)
    })
    
    expect(result.current.showVerifyButton).toBe(false)
    expect(result.current.showRequestButton).toBe(true)
  })

  it('should reset state when going back to username step', async () => {
    // Setup username step first
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        username: 'test@example.com',
        verification_code_expired_datetime: '2024-01-01T12:30:00Z',
        verification_code_send_datetime: '2024-01-01T12:00:00Z',
      }),
    })

    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    await result.current.handleUsernameSubmit('test@example.com')

    await waitFor(() => {
      expect(result.current.currentStep).toBe('otp')
    })

    // Verify we're on OTP step with data
    expect(result.current.username).toBe('test@example.com')
    expect(result.current.expiredDate).toBe('2024-01-01T12:30:00Z')
    expect(result.current.sendDate).toBe('2024-01-01T12:00:00Z')

    // Go back to username step
    result.current.handleBackToUsername()

    await waitFor(() => {
      expect(result.current.currentStep).toBe('username')
    })
    
    // Verify all state is reset
    expect(result.current.username).toBe('')
    expect(result.current.expiredDate).toBe('')
    expect(result.current.sendDate).toBe('')
    expect(result.current.showOtpInput).toBe(true)
    expect(result.current.showVerifyButton).toBe(true)
    expect(result.current.showRequestButton).toBe(false)
    
    // Verify mutations are exposed (implementation detail, but required by component)
    expect(result.current.checkUsernameMutation).toBeDefined()
    expect(result.current.verifyOTPMutation).toBeDefined()
    expect(result.current.requestNewOTPMutation).toBeDefined()
  })

  it('should navigate to login when back to login is called', () => {
    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    result.current.handleBackToLogin()

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should handle username submission error gracefully', async () => {
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error('Network error')),
    })

    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    await result.current.handleUsernameSubmit('test@example.com')

    // Should remain on username step
    await waitFor(() => {
      expect(result.current.currentStep).toBe('username')
    })
  })

  it('should handle OTP verification error gracefully for non-401 errors', async () => {
    const mockError = {
      status: 500,
      data: { message: 'Server error' },
    }

    // Setup username step first
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        username: 'test@example.com',
        verification_code_expired_datetime: '2024-01-01T12:30:00Z',
        verification_code_send_datetime: '2024-01-01T12:00:00Z',
      }),
    })

    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    await result.current.handleUsernameSubmit('test@example.com')

    await waitFor(() => {
      expect(result.current.currentStep).toBe('otp')
    })

    mockVerifyOTP.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(mockError),
    })

    await result.current.handleOTPSubmit('123456')

    // UI state should not change for non-401 errors
    await waitFor(() => {
      expect(result.current.showOtpInput).toBe(true)
    })
    
    expect(result.current.showVerifyButton).toBe(true)
    expect(result.current.showRequestButton).toBe(false)
  })

  it('should handle request new OTP error gracefully', async () => {
    // Setup to OTP step first
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        username: 'test@example.com',
        verification_code_expired_datetime: '2024-01-01T12:30:00Z',
        verification_code_send_datetime: '2024-01-01T12:00:00Z',
      }),
    })

    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    await result.current.handleUsernameSubmit('test@example.com')

    await waitFor(() => {
      expect(result.current.currentStep).toBe('otp')
    })

    const prevExpiredDate = result.current.expiredDate
    const prevSendDate = result.current.sendDate

    // Mock request new OTP error
    mockCheckUsername.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error('Network error')),
    })

    await result.current.handleRequestNewOTP()

    // State should not change on error
    await waitFor(() => {
      expect(result.current.expiredDate).toBe(prevExpiredDate)
    })
    
    expect(result.current.sendDate).toBe(prevSendDate)
  })

  it('should provide all required mutations', () => {
    const { result } = renderHook(() => useForgotPasswordFlow(), {
      wrapper: createWrapper(),
    })

    expect(result.current.checkUsernameMutation).toBeDefined()
    expect(result.current.verifyOTPMutation).toBeDefined()
    expect(result.current.requestNewOTPMutation).toBeDefined()
  })
})
