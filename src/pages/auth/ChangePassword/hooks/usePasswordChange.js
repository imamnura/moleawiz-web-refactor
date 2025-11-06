import { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useChangePasswordMutation } from '@services/api/authApi'

/**
 * Custom hook for password change logic
 * Handles validation, API call, and state management
 * 
 * @param {object} params - Hook parameters
 * @param {string} params.token - Access token
 * @param {string} params.fullName - User's full name
 * @param {function} params.onSuccess - Success callback
 * @returns {object} Password change state and handlers
 * 
 * @example
 * const passwordChange = usePasswordChange({
 *   token: 'access-token',
 *   fullName: 'John Doe',
 *   onSuccess: () => navigate('/login')
 * })
 */
const usePasswordChange = ({ token, fullName, onSuccess }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [hasError, setHasError] = useState(false)

  // TanStack Query mutation
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  // Clear error when inputs change
  useEffect(() => {
    if (password || confirmPassword) {
      setError('')
      setHasError(false)
    }
  }, [password, confirmPassword])

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  /**
   * Validate passwords
   */
  const validate = useCallback(() => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.')
      setHasError(true)
      return false
    }

    if (password !== confirmPassword) {
      setError(
        <>
          The password doesn't match.
          <br />
          Please review your input.
        </>
      )
      setHasError(true)
      return false
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      setHasError(true)
      return false
    }

    return true
  }, [password, confirmPassword])

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(() => {
    // Validate
    if (!validate()) {
      return
    }

    setError('')
    setHasError(false)

    // Submit
    changePassword(
      {
        data: {
          password: password,
          password_confirmation: confirmPassword,
          change_password_type: 'temporary'
        },
        token: token
      }
    )
      .unwrap()
      .then((data) => {
        if (data.status === 200) {
          // Success
          if (onSuccess) {
            onSuccess()
          }
        } else {
          setError(
            <>
              The password doesn't match.
              <br />
              Please review your input.
            </>
          )
          setHasError(true)
        }
      })
      .catch((err) => {
        setError(err?.message || 'Failed to change password. Please try again.')
        setHasError(true)
      })
  }, [password, confirmPassword, token, validate, changePassword, onSuccess])

  return {
    password,
    confirmPassword,
    showPassword,
    error,
    hasError,
    loading: isLoading,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleSubmit
  }
}

usePasswordChange.propTypes = {
  token: PropTypes.string.isRequired,
  fullName: PropTypes.string,
  onSuccess: PropTypes.func
}

export default usePasswordChange
