import React, { useEffect } from 'react'
import { useForgotPasswordFlow } from './auth/hooks/useForgotPasswordFlow'
import StepUsername from './auth/components/StepUsername'
import StepOTP from './auth/components/StepOTP'

/**
 * ForgotPasswordPage - Multi-step password recovery flow
 *
 * Flow:
 * 1. User enters username → receives verification code
 * 2. User enters OTP → verified → redirected to change-password
 */
const ForgotPasswordPage = () => {
  const {
    currentStep,
    username,
    expiredDate,
    sendDate,
    showOtpInput,
    showVerifyButton,
    showRequestButton,
    checkUsernameMutation,
    verifyOTPMutation,
    requestNewOTPMutation,
    handleUsernameSubmit,
    handleOTPSubmit,
    handleRequestNewOTP,
    handleOTPExpired,
    handleBackToUsername,
    handleBackToLogin,
  } = useForgotPasswordFlow()

  // Set random background on mount
  useEffect(() => {
    const backgrounds = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ]

    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)]
    document.body.style.background = randomBg

    return () => {
      document.body.style.background = ''
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {currentStep === 'username' ? (
        <StepUsername
          onSubmit={handleUsernameSubmit}
          onBack={handleBackToLogin}
          isLoading={checkUsernameMutation.isPending}
          error={checkUsernameMutation.error}
        />
      ) : (
        <StepOTP
          username={username}
          expiredDate={expiredDate}
          sendDate={sendDate}
          onVerify={handleOTPSubmit}
          onRequestNew={handleRequestNewOTP}
          onBack={handleBackToUsername}
          onExpired={handleOTPExpired}
          showInput={showOtpInput}
          showVerifyButton={showVerifyButton}
          showRequestButton={showRequestButton}
          isLoading={
            verifyOTPMutation.isPending || requestNewOTPMutation.isPending
          }
          error={verifyOTPMutation.error || requestNewOTPMutation.error}
        />
      )}
    </div>
  )
}

export default ForgotPasswordPage
