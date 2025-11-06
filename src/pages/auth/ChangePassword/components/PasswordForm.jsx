import { Form, Alert, Button, Row, Col, Input, Image } from 'antd'
import PropTypes from 'prop-types'
import PasswordHide from '@/assets/images/svgs/ic_passwordhide_changepassword.svg'
import PasswordShow from '@/assets/images/svgs/ic_passwordshow_changepassword.svg'
import {
  borderInputChangePassword,
  borderErrorInputChangePassword,
  textInputChangePassword
} from '@/config/constant/color'

/**
 * PasswordForm Component
 * Form for password change with validation and visibility toggle
 * 
 * @component
 * @param {object} props
 * @param {string} props.password - New password value
 * @param {string} props.confirmPassword - Confirm password value
 * @param {boolean} props.showPassword - Show/hide password toggle
 * @param {string} props.error - Error message
 * @param {boolean} props.hasError - Has validation error flag
 * @param {boolean} props.loading - Loading state
 * @param {function} props.onPasswordChange - Password change handler
 * @param {function} props.onConfirmPasswordChange - Confirm password change handler
 * @param {function} props.onToggleVisibility - Toggle password visibility handler
 * @param {function} props.onSubmit - Form submit handler
 */
const PasswordForm = ({
  password,
  confirmPassword,
  showPassword,
  error,
  hasError,
  loading,
  onPasswordChange,
  onConfirmPasswordChange,
  onToggleVisibility,
  onSubmit
}) => {
  return (
    <>
      {/* Error Alert */}
      {error && (
        <Alert
          message={error}
          type="error"
          className="alert-custom text-center"
          style={{ marginBottom: '17px' }}
        />
      )}

      {/* Form */}
      <Form onFinish={onSubmit}>
        {/* New Password */}
        <Form.Item style={{ marginBottom: '20px' }}>
          <div className="d-flex" style={{ position: 'relative' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              className="form-control d-flex"
              style={{
                borderRadius: '8px',
                color: textInputChangePassword,
                border: '1px solid',
                borderColor: hasError
                  ? borderErrorInputChangePassword
                  : borderInputChangePassword,
                height: '40px'
              }}
              id="id-new-password-change-password"
              placeholder="New Password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={loading}
            />
            <div
              name="btn-hide-password-login"
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: '5%'
              }}
              onClick={onToggleVisibility}
            >
              {showPassword ? (
                <Image
                  src={PasswordHide}
                  preview={false}
                  width={22}
                  height="100%"
                />
              ) : (
                <Image
                  src={PasswordShow}
                  preview={false}
                  width={22}
                  height="100%"
                />
              )}
            </div>
          </div>
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item style={{ marginBottom: '32px' }}>
          <div className="d-flex" style={{ position: 'relative' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              className="form-control d-flex"
              style={{
                borderRadius: '8px',
                color: textInputChangePassword,
                border: '1px solid',
                borderColor: hasError
                  ? borderErrorInputChangePassword
                  : borderInputChangePassword,
                height: '40px'
              }}
              id="id-confirm-new-password-change-password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              disabled={loading}
            />
            <div
              name="btn-hide-change-password"
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: '5%'
              }}
              onClick={onToggleVisibility}
            >
              {showPassword ? (
                <Image
                  src={PasswordHide}
                  preview={false}
                  width={22}
                  height="100%"
                />
              ) : (
                <Image
                  src={PasswordShow}
                  preview={false}
                  width={22}
                  height="100%"
                />
              )}
            </div>
          </div>
        </Form.Item>

        {/* Submit Button */}
        <Row>
          <Col span={24}>
            <Button
              role="button"
              name="btn-change-password"
              className="btn btn-sm btn-primary btn-block"
              style={{
                borderRadius: '6px',
                border: 'none',
                fontWeight: '500'
              }}
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

PasswordForm.propTypes = {
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  showPassword: PropTypes.bool.isRequired,
  error: PropTypes.node,
  hasError: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onConfirmPasswordChange: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

PasswordForm.defaultProps = {
  error: ''
}

export default PasswordForm
