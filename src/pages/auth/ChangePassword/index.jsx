import { useEffect } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Card } from 'antd'
import PropTypes from 'prop-types'
import { randBg } from '@/utils'
import { usePasswordChange } from './hooks/usePasswordChange'
import PasswordForm from './components/PasswordForm'
import {
  textDescriptionChangePassword,
  textTitleChangePassword
} from '@/config/constant/color'

/**
 * ChangePassword Page
 * 
 * Allows users to change their password after OTP verification
 * Requires accessToken and fullName from location state
 * 
 * @component
 * @example
 * // Navigate with state
 * navigate('/change-password', {
 *   state: { accessToken: '...', fullName: '...' }
 * })
 */
const ChangePassword = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Redirect if no token in state
  if (!location.state?.accessToken) {
    return <Navigate to="/login" replace />
  }

  const { accessToken, fullName } = location.state

  // Password change logic
  const {
    password,
    confirmPassword,
    showPassword,
    error,
    hasError,
    loading,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleSubmit
  } = usePasswordChange({
    token: accessToken,
    fullName,
    onSuccess: () => {
      navigate('/login', {
        state: {
          successPassword: 0
        }
      })
    }
  })

  // Apply page styles
  useEffect(() => {
    const body = document.querySelector('body')
    
    body.classList.add(
      'main-body',
      'light-mode',
      'ltr',
      'page-style1',
      'error-page'
    )
    
    body.classList.remove('app', 'sidebar-mini')
    
    randBg()

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
        <Card
          style={{
            width: '31%',
            maxWidth: '424px',
            margin: 'auto',
            boxShadow: 'none',
            borderRadius: '24px',
            padding: '8px'
          }}
        >
          {/* Header */}
          <div className="text-center">
            <h4
              style={{
                fontWeight: '500',
                fontSize: '22px',
                marginBottom: '10px',
                color: textTitleChangePassword
              }}
            >
              Change Password
            </h4>
            <p
              style={{
                color: textDescriptionChangePassword,
                marginBottom: '20px'
              }}
            >
              Please create new password for your account.
            </p>
          </div>

          {/* Password Form */}
          <PasswordForm
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            error={error}
            hasError={hasError}
            loading={loading}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onToggleVisibility={togglePasswordVisibility}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  )
}

ChangePassword.propTypes = {}

export default ChangePassword
