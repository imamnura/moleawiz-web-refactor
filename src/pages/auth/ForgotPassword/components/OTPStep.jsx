import { useEffect, useCallback } from 'react'
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Input,
  Alert,
  ConfigProvider,
  Image
} from 'antd'
import PropTypes from 'prop-types'
import EmailIcon from '@/assets/images/svgs/ic_email_forgotpassword.svg'
import { useCountdown, useOTPVerification } from '@/hooks'
import {
  borderInputForgotPassword,
  borderErrorInputForgotPassword,
  textInputForgotPassword,
  textDescriptionForgotPassword,
  textTitleForgotPassword,
  emailTextForgotPassword,
  countDownForgotPassword
} from '@/config/constant/color'

/**
 * OTPStep Component
 * Second step of forgot password flow - verify OTP code
 * 
 * @component
 * @param {object} props
 * @param {string} props.username - User's username/email
 * @param {string} props.expiredDate - OTP expiration date (ISO string)
 * @param {string} props.sendDate - OTP send date (ISO string)
 * @param {function} props.onSuccess - Callback when OTP is verified (token, fullname)
 * @param {function} props.onBack - Callback to go back to username step
 * @param {function} props.onNewOTP - Callback when new OTP is requested (expiredDate, sendDate)
 * 
 * @example
 * <OTPStep
 *   username="user@example.com"
 *   expiredDate="2024-10-30T12:00:00"
 *   sendDate="2024-10-30T11:55:00"
 *   onSuccess={(token, name) => navigate('/change-password')}
 *   onBack={() => setStep('username')}
 *   onNewOTP={(expired, send) => updateDates(expired, send)}
 * />
 */
const OTPStep = ({
  username,
  expiredDate,
  sendDate,
  onSuccess,
  onBack,
  onNewOTP
}) => {
  // OTP verification logic
  const otp = useOTPVerification({
    username,
    onSuccess,
    onExpire: () => {}, // Handled by countdown
    onNewOTP
  })

  // Countdown timer
  const countdown = useCountdown(
    expiredDate,
    sendDate,
    otp.handleExpire
  )

  // Reset countdown when dates change
  useEffect(() => {
    if (expiredDate && sendDate) {
      countdown.reset(expiredDate, sendDate)
    }
  }, [expiredDate, sendDate])

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(() => {
    otp.verifyOTP()
  }, [otp])

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
          width: '30%',
          maxWidth: '430px',
          margin: 'auto',
          boxShadow: 'none',
          borderRadius: '24px'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h4
            style={{
              fontWeight: '500',
              fontSize: '22px',
              marginBottom: '10px',
              color: textTitleForgotPassword
            }}
          >
            Verify Your Account
          </h4>
          
          <p
            style={{
              color: textDescriptionForgotPassword,
              marginBottom: 0
            }}
          >
            Please enter the verification code sent to
          </p>

          {/* Username Display */}
          <Row
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >
            <Image
              src={EmailIcon}
              preview={false}
              style={{ marginBottom: '5px' }}
            />
            <p
              style={{
                margin: '0 6px',
                textAlign: 'left',
                fontWeight: '500',
                color: emailTextForgotPassword
              }}
            >
              {username}
            </p>
          </Row>

          {/* Countdown Timer */}
          <div>
            <p
              style={{
                color: textDescriptionForgotPassword,
                marginBottom: 0
              }}
            >
              Expire in
            </p>
            <span
              style={{
                color: countdown.isExpired ? '#ff4d4f' : countDownForgotPassword,
                fontWeight: '500',
                fontSize: '22px'
              }}
            >
              {countdown.formatted}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {otp.error && (
          <Alert
            message={otp.error}
            type="error"
            className="alert-custom text-center"
            style={{ marginTop: '20px', textAlign: 'center' }}
          />
        )}

        {/* Form */}
        <Form onFinish={handleSubmit}>
          {/* OTP Input */}
          {otp.showInput && (
            <Form.Item style={{ marginBottom: '40px' }}>
              <Input
                type="number"
                className="form-control"
                style={{
                  borderRadius: '8px',
                  color: textInputForgotPassword,
                  borderColor: otp.hasError
                    ? borderErrorInputForgotPassword
                    : borderInputForgotPassword,
                  height: '60px',
                  fontSize: '24px',
                  letterSpacing: '5px',
                  textAlign: 'center',
                  marginTop: '20px'
                }}
                id="id-verification-code-forgot-password"
                placeholder="000000"
                name="verification_code"
                autoComplete="off"
                maxLength={6}
                value={otp.otp}
                onChange={(e) => otp.setOTP(e.target.value)}
                disabled={otp.loading}
              />
            </Form.Item>
          )}

          {/* Buttons */}
          <Row style={{ marginTop: '32px' }}>
            <Col span={24}>
              {/* Verify Button */}
              {otp.showVerifyButton && (
                <Button
                  role="button"
                  name="btn-verify-forgot-password"
                  className="btn btn-sm btn-primary btn-block"
                  style={{
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: '500'
                  }}
                  htmlType="submit"
                  loading={otp.loading}
                  disabled={otp.loading || countdown.isExpired}
                >
                  {otp.loading ? 'Verifying...' : 'Verify'}
                </Button>
              )}

              {/* Request New Code Button */}
              {otp.showRequestButton && (
                <Button
                  role="button"
                  name="btn-request-otp-forgot-password"
                  className="btn btn-sm btn-primary btn-block"
                  style={{
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: '500'
                  }}
                  onClick={otp.requestOTP}
                  loading={otp.loading}
                  disabled={otp.loading}
                >
                  {otp.loading ? 'Sending...' : 'Request Verification Code'}
                </Button>
              )}
            </Col>

            {/* Back Button */}
            <Col span={24} style={{ marginTop: '20px', textAlign: 'center' }}>
              <div
                name="btn-back-forgot-password"
                className="btn-link box-shadow-0"
                style={{
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onClick={onBack}
              >
                Back
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </ConfigProvider>
  )
}

OTPStep.propTypes = {
  username: PropTypes.string.isRequired,
  expiredDate: PropTypes.string.isRequired,
  sendDate: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onNewOTP: PropTypes.func
}

OTPStep.defaultProps = {
  onNewOTP: null
}

export default OTPStep
