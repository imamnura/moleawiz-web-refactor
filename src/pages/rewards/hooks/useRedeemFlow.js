import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
  useRequestOTPMutation,
  useVerifyRewardOTPMutation,
  useRedeemRewardMutation,
} from '@/services/api/rewardsApi'

/**
 * Custom hook for managing reward redeem flow
 * Handles OTP request, verification, and reward redemption
 *
 * @returns {Object} Redeem flow data and functions
 *
 * Example:
 * const {
 *   requestOTP,
 *   verifyOTP,
 *   isRequestingOTP,
 *   isVerifyingOTP,
 *   otpData,
 *   otpError,
 *   resetOTPFlow
 * } = useRedeemFlow();
 */
export const useRedeemFlow = () => {
  const user = useSelector((state) => state.auth.user)

  const [requestOTP, { isLoading: isRequestingOTP }] = useRequestOTPMutation()
  const [verifyOTP, { isLoading: isVerifyingOTP }] =
    useVerifyRewardOTPMutation()
  const [redeemReward, { isLoading: isRedeeming }] = useRedeemRewardMutation()

  const [otpData, setOtpData] = useState(null)
  const [otpError, setOtpError] = useState(null)
  const [rewardId, setRewardId] = useState(null)

  /**
   * Request OTP for reward redemption
   * @param {number} selectedRewardId - Reward ID to redeem
   */
  const handleRequestOTP = useCallback(
    async (selectedRewardId) => {
      setRewardId(selectedRewardId)
      setOtpError(null)

      try {
        const payload = {
          username: user?.username,
          check_username_type: 'general',
          xlocalization: 'EN',
          reward_id: parseInt(selectedRewardId),
        }

        const result = await requestOTP(payload).unwrap()

        if (result.outOfStock) {
          return { success: false, outOfStock: true }
        }

        setOtpData({
          verificationCodeExpired: result.verificationCodeExpired,
          verificationCodeSent: result.verificationCodeSent,
        })

        return { success: true, data: result }
      } catch (error) {
        console.error('Error requesting OTP:', error)
        setOtpError(error.message || 'Failed to request OTP')
        return { success: false, error: error.message }
      }
    },
    [requestOTP, user]
  )

  /**
   * Redeem reward after OTP verification
   */
  const handleRedeemReward = useCallback(async () => {
    try {
      const result = await redeemReward(rewardId).unwrap()

      if (result.outOfStock) {
        return { success: false, outOfStock: true }
      }

      return {
        success: true,
        reward: result.reward,
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      return { success: false, error: error.message }
    }
  }, [redeemReward, rewardId])

  /**
   * Verify OTP code
   * @param {string} otpCode - 6-digit OTP code
   */
  const handleVerifyOTP = useCallback(
    async (otpCode) => {
      setOtpError(null)

      try {
        const payload = {
          username: user?.username,
          otp: otpCode,
          firebase_token: '1',
          brand: '1',
          model: '1',
          serial_number: '1',
          platform: '1',
          version: '1',
        }

        await verifyOTP(payload).unwrap()

        // After successful OTP verification, redeem the reward
        return await handleRedeemReward()
      } catch (error) {
        console.error('Error verifying OTP:', error)

        // Handle specific error cases
        if (error.status === 401) {
          const errorData = error.data
          if (errorData?.verification_code === 'Too Many Validation Fails!') {
            setOtpError('too_many_attempts')
            return { success: false, error: 'too_many_attempts' }
          } else {
            setOtpError('incorrect_code')
            return { success: false, error: 'incorrect_code' }
          }
        }

        setOtpError(error.message || 'Verification failed')
        return { success: false, error: error.message }
      }
    },
    [verifyOTP, user, handleRedeemReward]
  )

  /**
   * Request new OTP code (for expired/failed attempts)
   */
  const handleRequestNewOTP = useCallback(async () => {
    if (!rewardId) return { success: false }
    return await handleRequestOTP(rewardId)
  }, [handleRequestOTP, rewardId])

  /**
   * Reset OTP flow state
   */
  const resetOTPFlow = useCallback(() => {
    setOtpData(null)
    setOtpError(null)
    setRewardId(null)
  }, [])

  return {
    // Functions
    requestOTP: handleRequestOTP,
    verifyOTP: handleVerifyOTP,
    requestNewOTP: handleRequestNewOTP,
    resetOTPFlow,

    // States
    isRequestingOTP,
    isVerifyingOTP,
    isRedeeming,
    otpData,
    otpError,
    rewardId,
  }
}

export default useRedeemFlow
