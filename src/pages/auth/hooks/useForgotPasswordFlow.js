import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckUsernameMutation, useVerifyOTPMutation } from '@services/api'

/**
 * Custom hook untuk mengelola complete forgot password flow
 *
 * Flow:
 * 1. Step Username: Input username → checkUsername API
 * 2. Step OTP: Input verification code → verifyOTP API → navigate to change-password
 *
 * @returns {Object} State dan functions untuk forgot password flow
 */
export const useForgotPasswordFlow = () => {
  const navigate = useNavigate()

  // Step management: 'username' | 'otp'
  const [currentStep, setCurrentStep] = useState('username')

  // Username data
  const [username, setUsername] = useState('')
  const [expiredDate, setExpiredDate] = useState('')
  const [sendDate, setSendDate] = useState('')

  // OTP UI state
  const [showOtpInput, setShowOtpInput] = useState(true)
  const [showVerifyButton, setShowVerifyButton] = useState(true)
  const [showRequestButton, setShowRequestButton] = useState(false)

  // RTK Query Mutations
  const [checkUsername, checkUsernameMutation] = useCheckUsernameMutation()
  const [verifyOTP, verifyOTPMutation] = useVerifyOTPMutation()
  const [requestNewOTP, requestNewOTPMutation] = useCheckUsernameMutation()

  // Handler: Submit username
  const handleUsernameSubmit = async (usernameInput) => {
    try {
      const result = await checkUsername({
        username: usernameInput,
        check_username_type: 'otp',
      }).unwrap()

      setUsername(result.username)
      setExpiredDate(result.verification_code_expired_datetime)
      setSendDate(result.verification_code_send_datetime)
      setCurrentStep('otp')
    } catch {
      // Error handled by mutation state
    }
  }

  // Handler: Submit OTP
  const handleOTPSubmit = async (otp) => {
    if (!otp || otp.trim() === '') {
      return
    }

    try {
      const result = await verifyOTP({
        username,
        otp,
        firebase_token: '1',
        brand: '1',
        model: '1',
        serial_number: '1',
        platform: '1',
        version: '1',
      }).unwrap()

      const accessToken = result.user.token
      const fullname = `${result.firstname} ${result.lastname}`

      // Navigate to change-password dengan token dan fullname
      navigate('/change-password', {
        state: { token: accessToken, fullname },
      })
    } catch (error) {
      // Check for too many attempts
      if (error?.status === 401) {
        const errorData = error?.data

        if (errorData?.verification_code === 'Too Many Validation Fails!') {
          // Too many attempts - hide input, show request button
          setShowOtpInput(false)
          setShowVerifyButton(false)
          setShowRequestButton(true)
        }
      }
    }
  }

  // Handler: Request new OTP
  const handleRequestNewOTP = async () => {
    try {
      const result = await requestNewOTP({
        username,
        check_username_type: 'otp',
      }).unwrap()

      setExpiredDate(result.verification_code_expired_datetime)
      setSendDate(result.verification_code_send_datetime)
      setShowOtpInput(true)
      setShowVerifyButton(true)
      setShowRequestButton(false)
    } catch {
      // Error handled by mutation state
    }
  }

  // Handler: OTP expired
  const handleOTPExpired = () => {
    setShowOtpInput(false)
    setShowVerifyButton(false)
    setShowRequestButton(true)
  }

  // Handler: Back to username step
  const handleBackToUsername = () => {
    setCurrentStep('username')
    setUsername('')
    setExpiredDate('')
    setSendDate('')
    setShowOtpInput(true)
    setShowVerifyButton(true)
    setShowRequestButton(false)
    checkUsernameMutation.reset()
    verifyOTPMutation.reset()
    requestNewOTPMutation.reset()
  }

  // Handler: Back to login
  const handleBackToLogin = () => {
    navigate('/login')
  }

  return {
    // Current state
    currentStep,
    username,
    expiredDate,
    sendDate,
    showOtpInput,
    showVerifyButton,
    showRequestButton,

    // Mutations
    checkUsernameMutation,
    verifyOTPMutation,
    requestNewOTPMutation,

    // Handlers
    handleUsernameSubmit,
    handleOTPSubmit,
    handleRequestNewOTP,
    handleOTPExpired,
    handleBackToUsername,
    handleBackToLogin,
  }
}
