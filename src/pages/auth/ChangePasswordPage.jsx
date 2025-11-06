import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Form, Input, Button, message, Alert } from 'antd'
import {
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { useChangePasswordMutation } from '@services/api/authApi'
import { logout } from '@store/slices/authSlice'
import { validatePassword } from '@utils/authUtils'

/**
 * Password Strength Indicator Component
 */
const PasswordStrengthIndicator = ({ password }) => {
  const validation = validatePassword(password)

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="text-xs">
        <div
          className={
            validation.requirements.minLength
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {validation.requirements.minLength ? '✓' : '✗'} At least 8 characters
        </div>
        <div
          className={
            validation.requirements.hasUpperCase
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {validation.requirements.hasUpperCase ? '✓' : '✗'} One uppercase
          letter
        </div>
        <div
          className={
            validation.requirements.hasLowerCase
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {validation.requirements.hasLowerCase ? '✓' : '✗'} One lowercase
          letter
        </div>
        <div
          className={
            validation.requirements.hasNumbers
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {validation.requirements.hasNumbers ? '✓' : '✗'} One number
        </div>
        <div
          className={
            validation.requirements.hasSpecialChar
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {validation.requirements.hasSpecialChar ? '✓' : '✗'} One special
          character
        </div>
      </div>
    </div>
  )
}

PasswordStrengthIndicator.propTypes = {
  password: PropTypes.string,
}

/**
 * Change Password Page
 * Allows users with temporary passwords to set a new password
 */
const ChangePasswordPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [form] = Form.useForm()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const token = location.state?.accessToken
  const fullName = location.state?.fullName

  useEffect(() => {
    // Redirect if no token
    if (!token) {
      navigate('/auth/login', { replace: true })
      return
    }

    // Apply auth page styling
    document.body.classList.add('auth-page')
    return () => {
      document.body.classList.remove('auth-page')
    }
  }, [token, navigate])

  const onFinish = async (values) => {
    const { password, confirmPassword } = values

    // Validate password strength
    const validation = validatePassword(password)
    if (!validation.isValid) {
      message.error(t('auth.password_weak'))
      return
    }

    // Check password match
    if (password !== confirmPassword) {
      message.error(t('auth.password_mismatch'))
      return
    }

    try {
      const payload = {
        password,
        password_confirmation: confirmPassword,
        change_password_type: 'temporary',
      }

      await changePassword({ data: payload, token }).unwrap()

      message.success(t('auth.password_changed_success'))

      // Logout and redirect to login
      setTimeout(() => {
        dispatch(logout())
        navigate('/auth/login', {
          state: { successPassword: true },
          replace: true,
        })
      }, 1500)
    } catch (error) {
      message.error(error?.data?.message || t('auth.password_change_failed'))
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background-main">
      <article className="w-full max-w-md">
        <section className="card p-8">
          <header className="text-center mb-6">
            <h1 className="text-2xl font-bold text-text-title mb-2">
              {t('auth.change_password')}
            </h1>
            <p className="text-text-desc text-sm">
              {t('auth.change_password_subtitle')}
            </p>
            {fullName && (
              <p className="text-text-desc text-sm mt-2">
                Welcome, <strong>{fullName}</strong>
              </p>
            )}
          </header>

          <Alert
            message={t('auth.temporary_password_notice')}
            description={t('auth.temporary_password_description')}
            type="warning"
            showIcon
            className="mb-4"
          />

          <Form
            form={form}
            name="changePassword"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="password"
              label={t('auth.new_password')}
              rules={[
                {
                  required: true,
                  message: t('auth.password_required'),
                },
                {
                  min: 8,
                  message: t('auth.password_min_length'),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('auth.enter_new_password')}
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: setShowPassword,
                }}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </Form.Item>

            <PasswordStrengthIndicator password={password} />

            <Form.Item
              name="confirmPassword"
              label={t('auth.confirm_password')}
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: t('auth.confirm_password_required'),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error(t('auth.password_mismatch'))
                    )
                  },
                }),
              ]}
              className="mt-4"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('auth.confirm_new_password')}
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                visibilityToggle={{
                  visible: showConfirmPassword,
                  onVisibleChange: setShowConfirmPassword,
                }}
                className="input-field"
              />
            </Form.Item>

            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="btn-primary h-12"
              >
                {t('auth.change_password_submit')}
              </Button>
            </Form.Item>
          </Form>
        </section>
      </article>
    </main>
  )
}

export default ChangePasswordPage
