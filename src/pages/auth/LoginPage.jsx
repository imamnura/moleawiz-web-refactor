import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { useLoginMutation } from '@services/api/authApi'
import { setCredentials } from '@store/slices/authSlice'

/**
 * Login Page Component
 * Handles user authentication with username and password
 */
const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  const from = location.state?.from?.pathname || '/home'

  const onFinish = async (values) => {
    try {
      const result = await login(values).unwrap()
      dispatch(setCredentials(result))
      message.success(t('auth.login_success'))
      navigate(from, { replace: true })
    } catch (error) {
      message.error(error?.data?.message || t('auth.login_failed'))
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background-main">
      <article className="w-full max-w-md">
        <section className="card p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-title mb-2">
              {t('auth.welcome')}
            </h1>
            <p className="text-text-desc">{t('auth.login_subtitle')}</p>
          </header>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            aria-label="Login form"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: t('auth.username_required'),
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('auth.username')}
                className="input-field"
                aria-label="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: t('auth.password_required'),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('auth.password')}
                className="input-field"
                aria-label="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="btn-primary h-12"
                aria-label="Submit login"
              >
                {t('auth.login')}
              </Button>
            </Form.Item>
          </Form>

          <footer className="text-center mt-4">
            <a
              href="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary-hover"
              aria-label="Forgot password link"
            >
              {t('auth.forgot_password')}
            </a>
          </footer>
        </section>
      </article>
    </main>
  )
}

LoginPage.propTypes = {}

export default LoginPage
