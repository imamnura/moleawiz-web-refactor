import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Modal,
  Card,
  Button,
  Row,
  Col,
  Form,
  Input,
  Alert,
  Image,
  ConfigProvider,
} from 'antd'
import { useTranslation } from 'react-i18next'
import Countdown from 'react-countdown'
import { filterOTPInput } from '../utils/otpHelpers'
import EmailIcon from '@/assets/images/svgs/ic_email_forgotpassword.svg'

/**
 * OTPVerificationModal - OTP input modal with countdown timer
 *
 * @param {boolean} open - Modal open state
 * @param {string} email - User email
 * @param {string} expiredDate - OTP expiration datetime
 * @param {string} sendDate - OTP send datetime
 * @param {Function} onVerify - Verify OTP handler
 * @param {Function} onRequestNew - Request new OTP handler
 * @param {Function} onBack - Back button handler
 * @param {string} error - Error message
 * @param {boolean} isLoading - Loading state
 * @param {boolean} isMobile - Mobile version flag
 *
 * Features:
 * - Countdown timer (MM:SS format)
 * - Auto-disable on expire
 * - Request new code button
 * - Number-only input
 * - Error handling
 */
const OTPVerificationModal = ({
  open,
  email,
  expiredDate,
  sendDate,
  onVerify,
  onRequestNew,
  onBack,
  error,
  isLoading = false,
  isMobile = false,
}) => {
  const { t } = useTranslation()
  const [otpCode, setOtpCode] = useState('')
  const [showInput, setShowInput] = useState(true)
  const [showVerifyButton, setShowVerifyButton] = useState(true)
  const [showRequestButton, setShowRequestButton] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  // Reset states when modal opens or OTP data changes
  useEffect(() => {
    if (open && expiredDate) {
      setShowInput(true)
      setShowVerifyButton(true)
      setShowRequestButton(false)
      setOtpCode('')
      setTimerKey((prev) => prev + 1)
    }
  }, [open, expiredDate])

  const handleOTPChange = (e) => {
    const filtered = filterOTPInput(e.target.value)
    setOtpCode(filtered)
  }

  const handleSubmit = () => {
    if (otpCode && onVerify) {
      onVerify(otpCode)
    }
  }

  const handleRequestNew = () => {
    if (onRequestNew) {
      onRequestNew()
    }
  }

  // Countdown renderer
  const countdownRenderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Timer expired
      setShowInput(false)
      setShowVerifyButton(false)
      setShowRequestButton(true)
      return <span>00:00</span>
    }
    return (
      <span>
        {minutes < 10 ? `0${minutes}` : `${minutes}`}:
        {seconds < 10 ? `0${seconds}` : `${seconds}`}
      </span>
    )
  }

  // Calculate countdown date
  const getCountdownDate = () => {
    if (!expiredDate || !sendDate) return Date.now()
    const expiredTime = new Date(expiredDate).getTime()
    const sendTime = new Date(sendDate).getTime()
    const duration = expiredTime - sendTime
    return Date.now() + duration
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadiusLG: 28,
          fontFamily: 'Roboto',
        },
      }}
    >
      <Modal
        className="modal-otp-verification"
        open={open}
        maskClosable={false}
        closeIcon={null}
        transitionName="ant-fade"
        width={432}
        centered
        footer={null}
      >
        <Card className="p-0">
          <div className="text-center">
            {/* Title */}
            <h4
              className={`${
                isMobile ? 'text-lg' : 'text-[22px]'
              } font-medium mb-2`}
            >
              {t('feature.feature_rewards.popup_otp.verify_your')}
            </h4>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-0">
              {t('feature.feature_rewards.popup_otp.please_enter_the')}
            </p>

            {/* Email Display */}
            <Row className="flex items-center justify-center my-4">
              <Image src={EmailIcon} preview={false} className="w-6 h-6 mr-2" />
              <p className="text-sm font-medium mb-0">{email}</p>
            </Row>

            {/* Timer */}
            <div>
              <p className="text-sm text-gray-600 mb-0">
                {t('feature.feature_rewards.popup_otp.expire_in')}
              </p>
              <span className="text-xl font-bold text-[#0066CC]">
                {expiredDate && (
                  <Countdown
                    key={timerKey}
                    date={getCountdownDate()}
                    renderer={countdownRenderer}
                  />
                )}
              </span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              message={
                error === 'too_many_attempts'
                  ? t('feature.feature_rewards.popup_otp.too_many_attempts')
                  : error === 'incorrect_code'
                    ? t('feature.feature_rewards.popup_otp.incorrect_code')
                    : error
              }
              type="error"
              className={`text-center mt-4 ${isMobile ? 'text-xs' : 'text-sm'}`}
            />
          )}

          {/* OTP Input Form */}
          <Form onFinish={handleSubmit}>
            {showInput && (
              <Form.Item
                className={isMobile ? 'mb-6' : 'mb-10'}
                style={{ marginTop: '20px' }}
              >
                <Input
                  type="number"
                  className="form-control"
                  style={{
                    borderRadius: '8px',
                    color: '#212121',
                    borderColor: error ? '#D32F2F' : '#D1D5DB',
                    height: isMobile ? 44 : '60px',
                    fontSize: isMobile ? 16 : '24px',
                    letterSpacing: '5px',
                    textAlign: 'center',
                  }}
                  id="id-verification-code-reward"
                  placeholder={t(
                    'feature.feature_rewards.popup_otp.verification_code'
                  )}
                  name="verification_code"
                  autoComplete="off"
                  value={otpCode}
                  onChange={handleOTPChange}
                  onKeyDown={(e) =>
                    ['e', 'E', '+', '-', '.', '`', ','].includes(e.key) &&
                    e.preventDefault()
                  }
                  maxLength={6}
                />
              </Form.Item>
            )}

            {/* Action Buttons */}
            <Row
              className={isMobile ? 'mt-6' : 'mt-8'}
              wrap={!isMobile}
              gutter={isMobile ? 12 : 0}
            >
              {/* Mobile: Back Button */}
              {isMobile && (
                <Col span={12}>
                  <Button
                    onClick={onBack}
                    className="btn-cancel-detail-rewards"
                    name="btn-back-otp-reward"
                    block
                    style={{
                      background: '#E6F2FF',
                      color: '#0066CC',
                      borderColor: '#0066CC',
                      borderRadius: '6px',
                      height: '48px',
                      fontWeight: 500,
                    }}
                  >
                    {t('feature.feature_rewards.popup_otp.back')}
                  </Button>
                </Col>
              )}

              {/* Verify / Request Button */}
              <Col span={isMobile ? 12 : 24}>
                {showVerifyButton && (
                  <Button
                    role="button"
                    name="btn-verify-reward"
                    className="btn btn-sm btn-primary btn-block"
                    style={{
                      background: '#0066CC',
                      color: '#FFFFFF',
                      borderColor: '#0066CC',
                      borderRadius: '6px',
                      height: '48px',
                      fontWeight: 500,
                    }}
                    htmlType="submit"
                    block
                    disabled={isLoading || otpCode.length !== 6}
                  >
                    {isLoading ? (
                      <span
                        role="status"
                        aria-hidden="true"
                        className="spinner-border spinner-border-sm ms-2"
                      />
                    ) : (
                      t('feature.feature_rewards.popup_otp.verify')
                    )}
                  </Button>
                )}

                {showRequestButton && (
                  <Button
                    role="button"
                    name="btn-request-otp-reward"
                    className="btn btn-sm btn-primary btn-block"
                    style={{
                      background: '#0066CC',
                      color: '#FFFFFF',
                      borderColor: '#0066CC',
                      borderRadius: '6px',
                      height: '48px',
                      fontWeight: 500,
                    }}
                    onClick={handleRequestNew}
                    block
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span
                        role="status"
                        aria-hidden="true"
                        className="spinner-border spinner-border-sm ms-2"
                      />
                    ) : (
                      t(
                        isMobile
                          ? 'feature.feature_rewards.popup_otp.request_verification_code_mobile'
                          : 'feature.feature_rewards.popup_otp.request_verification_code'
                      )
                    )}
                  </Button>
                )}
              </Col>

              {/* Desktop: Back Link */}
              {!isMobile && (
                <Col span={24} className="mt-4">
                  <div
                    name="btn-back-otp-reward"
                    className="text-center text-[#0066CC] cursor-pointer font-medium"
                    onClick={onBack}
                  >
                    {t('feature.feature_rewards.popup_otp.back')}
                  </div>
                </Col>
              )}
            </Row>
          </Form>
        </Card>
      </Modal>
    </ConfigProvider>
  )
}

OTPVerificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  email: PropTypes.string,
  expiredDate: PropTypes.string,
  sendDate: PropTypes.string,
  onVerify: PropTypes.func.isRequired,
  onRequestNew: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
}

OTPVerificationModal.defaultProps = {
  email: '',
  expiredDate: null,
  sendDate: null,
  error: null,
  isLoading: false,
  isMobile: false,
}

export default OTPVerificationModal
