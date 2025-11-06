import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Spin } from 'antd'
import PropTypes from 'prop-types'
import { useAutoLoginMutation } from '@services/api/authApi'
import { setCredentials } from '@store/slices/authSlice'

/**
 * Auto Login Page Component
 * Handles SSO/Auth0 callback and automatic authentication
 */
const AutoLoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [autoLogin] = useAutoLoginMutation()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      autoLogin(token)
        .unwrap()
        .then((result) => {
          dispatch(setCredentials(result))
          navigate('/home', { replace: true })
        })
        .catch(() => {
          navigate('/auth/login', { replace: true })
        })
    } else {
      navigate('/auth/login', { replace: true })
    }
  }, [searchParams, autoLogin, dispatch, navigate])

  return (
    <main className="flex items-center justify-center min-h-screen">
      <section className="text-center" aria-live="polite" aria-busy="true">
        <Spin size="large" />
        <p className="mt-4 text-text-desc">Authenticating...</p>
      </section>
    </main>
  )
}

AutoLoginPage.propTypes = {}

export default AutoLoginPage
