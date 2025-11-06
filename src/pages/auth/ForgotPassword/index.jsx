import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useToggle } from '@/hooks'
import { randBg } from '@/utils'
import UsernameStep from './components/UsernameStep'
import OTPStep from './components/OTPStep'

/**
 * ForgotPassword Page
 * 
 * Two-step password reset flow:
 * 1. Enter username to request OTP
 * 2. Verify OTP and redirect to change password
 * 
 * @component
 * @example
 * return <ForgotPassword />
 */
const ForgotPassword = () => {
  const navigate = useNavigate()
  
  // Multi-step state
  const [showUsernameStep, toggleUsernameStep, setShowUsernameStep] = useToggle(true)
  const [showOTPStep, toggleOTPStep, setShowOTPStep] = useToggle(false)
  
  // OTP data state
  const [username, setUsername] = useToggle('')
  const [expiredDate, setExpiredDate] = useToggle('')
  const [sendDate, setSendDate] = useToggle('')

  /**
   * Navigate to change password page with token
   */
  const handleOTPSuccess = (token, fullname) => {
    navigate('/change-password', {
      state: {
        accessToken: token,
        fullName: fullname
      }
    })
  }

  /**
   * Handle successful username check
   * Move to OTP verification step
   */
  const handleUsernameSuccess = (data) => {
    setUsername(data.username)
    setExpiredDate(data.verification_code_expired_datetime)
    setSendDate(data.verification_code_send_datetime)
    setShowUsernameStep(false)
    setShowOTPStep(true)
  }

  /**
   * Go back to username step
   */
  const handleBackToUsername = () => {
    setShowOTPStep(false)
    setShowUsernameStep(true)
  }

  // Apply page styles
  useEffect(() => {
    const body = document.querySelector('body')
    
    // Add required classes
    body.classList.add(
      'main-body',
      'light-mode',
      'ltr',
      'page-style1',
      'error-page'
    )
    
    // Remove conflicting classes
    body.classList.remove('app', 'sidebar-mini')
    
    // Random background
    randBg()

    // Cleanup
    return () => {
      body.classList.remove(
        'main-body',
        'light-mode',
        'ltr',
        'page-style1',
        'error-page'
      )
    }
  }, [])

  return (
    <div className="page">
      <div className="page-single">
        {showUsernameStep && (
          <UsernameStep 
            onSuccess={handleUsernameSuccess}
          />
        )}

        {showOTPStep && (
          <OTPStep
            username={username}
            expiredDate={expiredDate}
            sendDate={sendDate}
            onSuccess={handleOTPSuccess}
            onBack={handleBackToUsername}
            onNewOTP={(expired, send) => {
              setExpiredDate(expired)
              setSendDate(send)
            }}
          />
        )}
      </div>
    </div>
  )
}

ForgotPassword.propTypes = {}

export default ForgotPassword
