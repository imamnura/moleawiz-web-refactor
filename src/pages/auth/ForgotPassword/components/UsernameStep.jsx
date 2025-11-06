import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, Alert, Form, Input, Row, Col, Button, ConfigProvider } from 'antd'
import PropTypes from 'prop-types'
import { useCheckUsernameMutation } from '@services/api/authApi'
import {
  borderInputForgotPassword,
  borderErrorInputForgotPassword,
  textInputForgotPassword,
  textDescriptionForgotPassword,
  textTitleForgotPassword
} from '@/config/constant/color'

/**
 * UsernameStep Component
 * First step of forgot password flow - enter username to request OTP
 * 
 * @component
 * @param {object} props
 * @param {function} props.onSuccess - Callback when username is verified
 * 
 * @example
 * <UsernameStep onSuccess={(data) => moveToOTPStep(data)} />
 */
const UsernameStep = ({ onSuccess }) => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [hasError, setHasError] = useState(false)

  // TanStack Query mutation
  const [checkUsername, { isLoading }] = useCheckUsernameMutation()

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    setUsername(e.target.value)
    setError('')
    setHasError(false)
  }, [])

  /**
   * Handle form submit - check username and request OTP
   */
  const handleSubmit = useCallback(async () => {
    // Validation
    if (!username || username.trim() === '') {
      setError('Please enter your username.')
      setHasError(true)
      return
    }

    setError('')

    checkUsername({
      username: username.trim(),
      check_username_type: 'otp'
    })
      .unwrap()
      .then((data) => {
        if (data.status === 200) {
          // Success - move to OTP step
          if (onSuccess) {
            onSuccess(data.data)
          }
        } else {
          setError('Username not found. Please try again.')
          setHasError(true)
        }
      })
      .catch((err) => {
        setError(err?.message || 'Network error. Please try again.')
        setHasError(true)
      })
  }, [username, checkUsername, onSuccess])

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadiusLG: 28,
          fontFamily: 'Roboto'
        }
      }}
    >
      <Card
        style={{
          width: 'fit-content',
          margin: 'auto',
          boxShadow: 'none',
          borderRadius: '24px'
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          <h4
            style={{
              fontWeight: '500',
              fontSize: '22px',
              marginBottom: '10px',
              color: textTitleForgotPassword
            }}
          >
            Forgot Password
          </h4>
          <p style={{ color: textDescriptionForgotPassword }}>
            Please enter your username. We will send a verification
            <br />
            code to your email to reset your password.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={error}
            type="error"
            className="alert-custom text-center"
            style={{ marginBottom: '20px' }}
          />
        )}

        {/* Form */}
        <Form onFinish={handleSubmit}>
          <Form.Item style={{ marginBottom: '40px' }}>
            <Input
              type="text"
              className="form-control"
              style={{
                borderRadius: '8px',
                color: textInputForgotPassword,
                borderColor: hasError
                  ? borderErrorInputForgotPassword
                  : borderInputForgotPassword,
                height: '40px'
              }}
              id="id-username-forgot-password"
              placeholder="Username"
              name="email_account"
              autoComplete="off"
              value={username}
              onChange={handleChange}
              disabled={checkUsernameMutation.isLoading}
            />
          </Form.Item>

          <Row>
            <Col span={24} style={{ marginBottom: '20px' }}>
              <Button
                role="button"
                name="btn-request-verification-code-forgot-password"
                className="btn btn-sm btn-primary btn-block"
                style={{
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '500'
                }}
                htmlType="submit"
                loading={checkUsernameMutation.isLoading}
                disabled={checkUsernameMutation.isLoading}
              >
                {checkUsernameMutation.isLoading ? 'Sending...' : 'Request Verification Code'}
              </Button>
            </Col>
            
            <Col span={24} className="text-center">
              <Link
                to="/login"
                className="btn-link box-shadow-0"
                name="btn-back-forgot-password"
                style={{ fontWeight: '500' }}
              >
                Back
              </Link>
            </Col>
          </Row>
        </Form>
      </Card>
    </ConfigProvider>
  )
}

UsernameStep.propTypes = {
  onSuccess: PropTypes.func.isRequired
}

export default UsernameStep
