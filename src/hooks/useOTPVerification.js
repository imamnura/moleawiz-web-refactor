import { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useCheckUsernameMutation, useVerifyOTPMutation } from '@services/api/authApi'

/**
 * Custom hook for OTP (One-Time Password) verification logic
 * Handles OTP request, verification, and state management
 * 
 * @param {object} params - Hook parameters
 * @param {string} params.username - Username/email for OTP
 * @param {function} params.onSuccess - Success callback with (token, fullname)
 * @param {function} params.onExpire - Expire callback
 * @param {function} params.onNewOTP - Callback when new OTP is generated (expiredDate, sendDate)
 * @returns {object} OTP state and handlers
 * 
 * @example
 * const otp = useOTPVerification({
 *   username: 'user@example.com',
 *   onSuccess: (token, fullname) => navigate('/dashboard'),
 *   onExpire: () => setShowExpired(true),
 *   onNewOTP: (expired, send) => resetCountdown(expired, send)
 * })
 */
const useOTPVerification = ({ username, onSuccess, onExpire, onNewOTP }) => {
  const [otp, setOTP] = useState('')
  const [error, setError] = useState('')
  const [hasError, setHasError] = useState(false)
  
  // UI state
  const [showInput, setShowInput] = useState(true)
  const [showVerifyButton, setShowVerifyButton] = useState(true)
  const [showRequestButton, setShowRequestButton] = useState(false)

  // TanStack Query mutations
  const [checkUsername, { isLoading: isCheckingUsername }] = useCheckUsernameMutation()
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation()

  // Combined loading state
  const loading = isCheckingUsername || isVerifyingOTP

  // Clear error when OTP changes
  useEffect(() => {
    if (otp) {
      setError('')
      setHasError(false)
    }
  }, [otp])

  /**
   * Request new OTP code
   */
  const requestOTP = useCallback(async () => {
    if (!username) {
      setError('Username is required')
      return
    }

    setError('')

    checkUsername({
      username,
      check_username_type: 'otp'
    })
      .unwrap()
      .then((data) => {
        if (data.status === 200) {
          // Reset UI state
          setShowInput(true)
          setShowRequestButton(false)
          setShowVerifyButton(true)
          setHasError(false)
          setError('')
          setOTP('')

          // Notify parent of new OTP
          if (onNewOTP) {
            onNewOTP(
              data.data.verification_code_expired_datetime,
              data.data.verification_code_send_datetime
            )
          }
        } else {
          setError('Failed to send verification code. Please try again.')
        }
      })
      .catch((err) => {
        setError(err?.message || 'Network error. Please try again.')
      })
  }, [username, onNewOTP, checkUsername])

  /**
   * Verify OTP code
   */
  const verifyOTPCode = useCallback(async () => {
    // Validation
    if (!otp || otp.trim() === '') {
      setError('Please enter the verification code.')
      setHasError(true)
      return
    }

    setError('')

    verifyOTP({
      username,
      otp: otp.trim(),
      firebase_token: '1',
      brand: '1',
      model: '1',
      serial_number: '1',
      platform: '1',
      version: '1'
    })
      .unwrap()
      .then((data) => {
        if (data.status === 200) {
          const accessToken = data.data.user.token
          const fullname = `${data.data.firstname} ${data.data.lastname}`
          
          if (onSuccess) {
            onSuccess(accessToken, fullname)
          }
        } else if (data.status === 401) {
          // Check if too many attempts
          if (data.data.verification_code === 'Too Many Validation Fails!') {
            setError('Too many failed attempts. Please request a new code.')
            setShowInput(false)
            setShowVerifyButton(false)
            setShowRequestButton(true)
          } else {
            setError('The verification code you entered is incorrect.')
            setHasError(true)
          }
        } else {
          setError('Verification failed. Please try again.')
          setHasError(true)
        }
      })
      .catch((err) => {
        setError(err?.message || 'Network error. Please try again.')
        setHasError(true)
      })
  }, [otp, username, onSuccess, verifyOTP])

  /**
   * Handle OTP expiration
   */
  const handleExpire = useCallback(() => {
    setShowInput(false)
    setShowVerifyButton(false)
    setShowRequestButton(true)
    setError('Verification code has expired.')
    
    if (onExpire) {
      onExpire()
    }
  }, [onExpire])

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setOTP('')
    setError('')
    setHasError(false)
    setShowInput(true)
    setShowVerifyButton(true)
    setShowRequestButton(false)
  }, [])

  return {
    // State
    otp,
    loading,
    error,
    hasError,
    
    // UI state
    showInput,
    showVerifyButton,
    showRequestButton,
    
    // Handlers
    setOTP,
    requestOTP,
    verifyOTP: verifyOTPCode,
    handleExpire,
    reset,
  }
}

useOTPVerification.propTypes = {
  username: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onExpire: PropTypes.func,
  onNewOTP: PropTypes.func,
}

export default useOTPVerification
