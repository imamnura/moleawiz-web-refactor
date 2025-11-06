import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRedeemFlow } from '../useRedeemFlow'
import { useSelector } from 'react-redux'
import {
  useRequestOTPMutation,
  useVerifyRewardOTPMutation,
  useRedeemRewardMutation,
} from '@/services/api/rewardsApi'

// Mock Redux
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}))

// Mock RTK Query mutations
vi.mock('@/services/api/rewardsApi', () => ({
  useRequestOTPMutation: vi.fn(),
  useVerifyRewardOTPMutation: vi.fn(),
  useRedeemRewardMutation: vi.fn(),
}))

describe('useRedeemFlow Hook', () => {
  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
  }

  const mockOTPResponse = {
    verificationCodeExpired: '2024-12-25T10:05:00',
    verificationCodeSent: '2024-12-25T10:00:00',
    outOfStock: false,
  }

  const mockRewardResponse = {
    reward: {
      id: 1,
      title: 'Test Reward',
      redeem_code: 'ABC123',
      point: 500,
    },
    outOfStock: false,
  }

  const mockRequestOTP = vi.fn()
  const mockVerifyOTP = vi.fn()
  const mockRedeemReward = vi.fn()
  const mockUnwrap = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock Redux selector
    useSelector.mockReturnValue(mockUser)

    // Setup default mock implementations
    mockUnwrap.mockResolvedValue(mockOTPResponse)
    mockRequestOTP.mockReturnValue({ unwrap: mockUnwrap })
    mockVerifyOTP.mockReturnValue({ unwrap: mockUnwrap })
    mockRedeemReward.mockReturnValue({ unwrap: mockUnwrap })

    useRequestOTPMutation.mockReturnValue([mockRequestOTP, { isLoading: false }])
    useVerifyRewardOTPMutation.mockReturnValue([mockVerifyOTP, { isLoading: false }])
    useRedeemRewardMutation.mockReturnValue([mockRedeemReward, { isLoading: false }])
  })

  describe('Initial State', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useRedeemFlow())

      expect(result.current.otpData).toBeNull()
      expect(result.current.otpError).toBeNull()
      expect(result.current.rewardId).toBeNull()
      expect(result.current.isRequestingOTP).toBe(false)
      expect(result.current.isVerifyingOTP).toBe(false)
      expect(result.current.isRedeeming).toBe(false)
    })

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useRedeemFlow())

      expect(typeof result.current.requestOTP).toBe('function')
      expect(typeof result.current.verifyOTP).toBe('function')
      expect(typeof result.current.requestNewOTP).toBe('function')
      expect(typeof result.current.resetOTPFlow).toBe('function')
    })
  })

  describe('Request OTP', () => {
    it('should request OTP successfully', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      let response
      await act(async () => {
        response = await result.current.requestOTP(1)
      })

      expect(mockRequestOTP).toHaveBeenCalledWith({
        username: 'testuser',
        check_username_type: 'general',
        xlocalization: 'EN',
        reward_id: 1,
      })
      expect(response.success).toBe(true)
      expect(result.current.rewardId).toBe(1)
    })

    it('should set OTP data on success', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
      })

      expect(result.current.otpData).toEqual({
        verificationCodeExpired: mockOTPResponse.verificationCodeExpired,
        verificationCodeSent: mockOTPResponse.verificationCodeSent,
      })
    })

    it('should handle out of stock', async () => {
      mockUnwrap.mockResolvedValue({ outOfStock: true })

      const { result } = renderHook(() => useRedeemFlow())

      let response
      await act(async () => {
        response = await result.current.requestOTP(1)
      })

      expect(response.success).toBe(false)
      expect(response.outOfStock).toBe(true)
    })

    it('should handle request error', async () => {
      const error = new Error('Network error')
      mockUnwrap.mockRejectedValue(error)
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useRedeemFlow())

      let response
      await act(async () => {
        response = await result.current.requestOTP(1)
      })

      expect(response.success).toBe(false)
      expect(result.current.otpError).toBe('Network error')
      expect(consoleError).toHaveBeenCalledWith('Error requesting OTP:', error)
      consoleError.mockRestore()
    })

    it('should clear error when requesting new OTP', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      // First request with error
      mockUnwrap.mockRejectedValueOnce(new Error('First error'))
      await act(async () => {
        await result.current.requestOTP(1)
      })
      expect(result.current.otpError).toBeTruthy()

      // Second request should clear error
      mockUnwrap.mockResolvedValue(mockOTPResponse)
      await act(async () => {
        await result.current.requestOTP(2)
      })
      expect(result.current.otpError).toBeNull()
    })

    it('should convert reward ID to integer', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP('123')
      })

      expect(mockRequestOTP).toHaveBeenCalledWith(
        expect.objectContaining({
          reward_id: 123,
        })
      )
    })
  })

  describe('Verify OTP', () => {
    it('should verify OTP and redeem reward successfully', async () => {
      mockUnwrap
        .mockResolvedValueOnce(mockOTPResponse) // Request OTP
        .mockResolvedValueOnce({}) // Verify OTP
        .mockResolvedValueOnce(mockRewardResponse) // Redeem reward

      const { result } = renderHook(() => useRedeemFlow())

      // Set reward ID first
      await act(async () => {
        await result.current.requestOTP(1)
      })

      // Verify OTP
      let response
      await act(async () => {
        response = await result.current.verifyOTP('123456')
      })

      expect(mockVerifyOTP).toHaveBeenCalledWith({
        username: 'testuser',
        otp: '123456',
        firebase_token: '1',
        brand: '1',
        model: '1',
        serial_number: '1',
        platform: '1',
        version: '1',
      })
      expect(mockRedeemReward).toHaveBeenCalledWith(1)
      expect(response.success).toBe(true)
      expect(response.reward).toEqual(mockRewardResponse.reward)
    })

    it('should handle incorrect OTP code', async () => {
      const error = {
        status: 401,
        data: { verification_code: 'Invalid code' },
      }
      mockUnwrap
        .mockResolvedValueOnce(mockOTPResponse) // Request OTP success
        .mockRejectedValue(error) // Verify OTP fails
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
      })

      let response
      await act(async () => {
        response = await result.current.verifyOTP('000000')
      })

      expect(response.success).toBe(false)
      expect(response.error).toBe('incorrect_code')
      expect(result.current.otpError).toBe('incorrect_code')
      consoleError.mockRestore()
    })

    it('should handle too many attempts', async () => {
      const error = {
        status: 401,
        data: { verification_code: 'Too Many Validation Fails!' },
      }
      mockUnwrap
        .mockResolvedValueOnce(mockOTPResponse) // Request OTP success
        .mockRejectedValue(error) // Verify OTP fails
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
      })

      let response
      await act(async () => {
        response = await result.current.verifyOTP('123456')
      })

      expect(response.success).toBe(false)
      expect(response.error).toBe('too_many_attempts')
      expect(result.current.otpError).toBe('too_many_attempts')
      consoleError.mockRestore()
    })

    it('should handle out of stock during redemption', async () => {
      mockUnwrap
        .mockResolvedValueOnce(mockOTPResponse) // Request OTP success
        .mockResolvedValueOnce({}) // Verify OTP success
        .mockResolvedValueOnce({ outOfStock: true }) // Redeem fails

      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
      })

      let response
      await act(async () => {
        response = await result.current.verifyOTP('123456')
      })

      expect(response.success).toBe(false)
      expect(response.outOfStock).toBe(true)
    })

    it('should handle redemption error', async () => {
      const error = new Error('Redemption failed')
      mockUnwrap
        .mockResolvedValueOnce(mockOTPResponse) // Request OTP success
        .mockResolvedValueOnce({}) // Verify OTP success
        .mockRejectedValueOnce(error) // Redeem fails

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
      })

      let response
      await act(async () => {
        response = await result.current.verifyOTP('123456')
      })

      expect(response.success).toBe(false)
      expect(consoleError).toHaveBeenCalledWith('Error redeeming reward:', error)
      consoleError.mockRestore()
    })

    it('should clear error before verification', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      // Set initial error
      mockUnwrap.mockResolvedValueOnce(mockOTPResponse) // Request OTP
      await act(async () => {
        await result.current.requestOTP(1)
      })

      // Mock verification success
      mockUnwrap
        .mockResolvedValueOnce({}) // Verify OTP
        .mockResolvedValueOnce(mockRewardResponse) // Redeem reward

      await act(async () => {
        await result.current.verifyOTP('123456')
      })

      expect(result.current.otpError).toBeNull()
    })
  })

  describe('Request New OTP', () => {
    it('should request new OTP for same reward', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      // Initial request
      await act(async () => {
        await result.current.requestOTP(1)
      })

      // Request new OTP
      mockUnwrap.mockResolvedValue(mockOTPResponse)
      await act(async () => {
        await result.current.requestNewOTP()
      })

      expect(mockRequestOTP).toHaveBeenCalledTimes(2)
    })

    it('should return failure if no reward ID set', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      let response
      await act(async () => {
        response = await result.current.requestNewOTP()
      })

      expect(response.success).toBe(false)
      expect(mockRequestOTP).not.toHaveBeenCalled()
    })
  })

  describe('Reset OTP Flow', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      // Set some state
      await act(async () => {
        await result.current.requestOTP(1)
      })

      expect(result.current.otpData).not.toBeNull()
      expect(result.current.rewardId).toBe(1)

      // Reset
      act(() => {
        result.current.resetOTPFlow()
      })

      expect(result.current.otpData).toBeNull()
      expect(result.current.otpError).toBeNull()
      expect(result.current.rewardId).toBeNull()
    })

    it('should allow new flow after reset', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      // First flow
      await act(async () => {
        await result.current.requestOTP(1)
      })

      // Reset
      act(() => {
        result.current.resetOTPFlow()
      })

      // New flow
      await act(async () => {
        await result.current.requestOTP(2)
      })

      expect(result.current.rewardId).toBe(2)
    })
  })

  describe('Loading States', () => {
    it('should reflect requesting OTP loading state', () => {
      useRequestOTPMutation.mockReturnValue([mockRequestOTP, { isLoading: true }])

      const { result } = renderHook(() => useRedeemFlow())

      expect(result.current.isRequestingOTP).toBe(true)
    })

    it('should reflect verifying OTP loading state', () => {
      useVerifyRewardOTPMutation.mockReturnValue([mockVerifyOTP, { isLoading: true }])

      const { result } = renderHook(() => useRedeemFlow())

      expect(result.current.isVerifyingOTP).toBe(true)
    })

    it('should reflect redeeming loading state', () => {
      useRedeemRewardMutation.mockReturnValue([mockRedeemReward, { isLoading: true }])

      const { result } = renderHook(() => useRedeemFlow())

      expect(result.current.isRedeeming).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle user without username', async () => {
      useSelector.mockReturnValue({ username: undefined })

      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
      })

      expect(mockRequestOTP).toHaveBeenCalledWith(
        expect.objectContaining({
          username: undefined,
        })
      )
    })

    it('should handle error without message', async () => {
      mockUnwrap.mockRejectedValue({})
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
      })

      expect(result.current.otpError).toBe('Failed to request OTP')
      consoleError.mockRestore()
    })

    it('should handle 6-digit OTP code', async () => {
      mockUnwrap
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce(mockRewardResponse)

      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
      })

      await act(async () => {
        await result.current.verifyOTP('123456')
      })

      expect(mockVerifyOTP).toHaveBeenCalledWith(
        expect.objectContaining({
          otp: '123456',
        })
      )
    })

    it('should handle rapid consecutive OTP requests', async () => {
      const { result } = renderHook(() => useRedeemFlow())

      await act(async () => {
        await result.current.requestOTP(1)
        await result.current.requestOTP(2)
        await result.current.requestOTP(3)
      })

      expect(mockRequestOTP).toHaveBeenCalledTimes(3)
      expect(result.current.rewardId).toBe(3)
    })
  })

  describe('Return Value Structure', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => useRedeemFlow())

      // Functions
      expect(result.current).toHaveProperty('requestOTP')
      expect(result.current).toHaveProperty('verifyOTP')
      expect(result.current).toHaveProperty('requestNewOTP')
      expect(result.current).toHaveProperty('resetOTPFlow')

      // States
      expect(result.current).toHaveProperty('isRequestingOTP')
      expect(result.current).toHaveProperty('isVerifyingOTP')
      expect(result.current).toHaveProperty('isRedeeming')
      expect(result.current).toHaveProperty('otpData')
      expect(result.current).toHaveProperty('otpError')
      expect(result.current).toHaveProperty('rewardId')
    })

    it('should return correct types', () => {
      const { result } = renderHook(() => useRedeemFlow())

      expect(typeof result.current.requestOTP).toBe('function')
      expect(typeof result.current.verifyOTP).toBe('function')
      expect(typeof result.current.requestNewOTP).toBe('function')
      expect(typeof result.current.resetOTPFlow).toBe('function')
      expect(typeof result.current.isRequestingOTP).toBe('boolean')
      expect(typeof result.current.isVerifyingOTP).toBe('boolean')
      expect(typeof result.current.isRedeeming).toBe('boolean')
    })
  })
})
