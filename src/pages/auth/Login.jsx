import React, { useState, useEffect, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Image,
  Input,
  Form,
  Card,
  Button,
  Alert,
  ConfigProvider,
} from 'antd'
import { useDispatch } from 'react-redux'

// API - TanStack Query hooks
import { useLoginMutation, useAutoLoginMutation } from '@services/api/authApi'

// Utils
import {
  setAccessToken,
  setFullname,
  getAccessToken,
  setUsername,
  getUsername,
  randBg,
} from '@/utils'

// Redux
import { setLastLogin } from '@/redux/features/main/onboardingSlice'
import {
  setIsShowChat,
  setVATitle,
} from '@/redux/features/main/virtualAssistSlice'

// Assets
import MoleawizLogo from '@/assets/images/svgs/ic_logo_login.svg'
import MicrosoftLogo from '@/assets/images/svgs/ic_microsoft_login.svg'

// Config
import {
  ColorPrimary,
  borderInputLogin,
  borderInputLoginFocus,
  switchOnLogin,
} from '@/config/constant/color'
import { auth0Handler, setAccessTokenAuth0, setVirtualAssistant } from '@/utils'

/**
 * Login Page Component
 * Handles user authentication via Microsoft SSO
 */
const LoginPage = () => {
  // Setup document classes
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

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // State management
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // TanStack Query mutations
  const loginMutation = useLoginMutation()
  const autoLoginMutation = useAutoLoginMutation()

  // Combined loading state
  const loading = loginMutation.isLoading || autoLoginMutation.isLoading

  // Initialize
  useEffect(() => {
    loadRememberedUser()
    randBg()
  }, [])

  // Clear error on form change
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage('')
    }
  }, [errorMessage, formData])

  /**
   * Load remembered username from localStorage
   */
  const loadRememberedUser = () => {
    const rememberData = getUsername()
    if (rememberData) {
      try {
        const parsed = JSON.parse(rememberData)
        if (parsed?.isChecked && parsed?.username) {
          setFormData((prev) => ({ ...prev, username: parsed.username }))
          setRememberMe(true)
        }
      } catch (error) {
        console.error('Error parsing remember data:', error)
      }
    }
  }

  /**
   * Navigate to home page
   */
  const navigateToHome = useCallback(() => {
    navigate('/home', {
      state: { successPassword: 0 },
    })
  }, [navigate])

  /**
   * Navigate to change password page
   */
  const navigateToChangePassword = useCallback(
    (token, fullname) => {
      navigate('/change-password', {
        state: {
          accessToken: token,
          fullName: fullname,
        },
      })
    },
    [navigate]
  )

  /**
   * Navigate to temporary password page
   */
  const navigateToTemporaryPassword = useCallback(
    (username) => {
      navigate('/temporary-password', {
        state: { username },
      })
    },
    [navigate]
  )

  /**
   * Save remember me preference
   */
  const saveRememberMe = useCallback(
    (username) => {
      const rememberData = {
        username,
        isChecked: rememberMe,
      }
      setUsername(JSON.stringify(rememberData))
    },
    [rememberMe]
  )

  /**
   * Handle successful login
   */
  const handleLoginSuccess = useCallback(
    (data, username) => {
      const accessToken = data.user.token
      const fullName = `${data.firstname} ${data.lastname}`

      saveRememberMe(username)
      dispatch(setLastLogin(data.last_login_platform))

      if (data.is_show_chat) {
        dispatch(setIsShowChat(data.is_show_chat))
        setVirtualAssistant(data.is_show_chat)
        dispatch(setVATitle(data.va_name))
      }

      if (data.is_recover_pass === 1) {
        navigateToChangePassword(accessToken, fullName)
      } else {
        setAccessToken(accessToken)
        setFullname(fullName)
        navigateToHome()
      }
    },
    [saveRememberMe, dispatch, navigateToChangePassword, navigateToHome]
  )

  /**
   * Handle login errors
   */
  const handleLoginError = useCallback(
    (status, message, username) => {
      if (status === 419) {
        navigateToTemporaryPassword(username)
      } else {
        // Format message if it contains "attempts."
        if (message?.indexOf('attempts.') > -1) {
          const [part1, part2] = message.split('.')
          setErrorMessage(
            <>
              {part1}.<br />
              {part2}.
            </>
          )
        } else {
          setErrorMessage(message || 'Login failed. Please try again.')
        }
      }
    },
    [navigateToTemporaryPassword]
  )

  /**
   * Handle auto login with Auth0 token
   */
  const handleAutoLogin = useCallback(
    (tokenAuth0) => {
      const payload = {
        firebase_token: '',
        brand: '',
        model: '',
        serial_number: '',
        platform: 'Web',
        version: '',
      }

      autoLoginMutation.mutate(
        { data: payload, token: tokenAuth0 },
        {
          onSuccess: (data) => {
            if (data && data.status === 200) {
              handleLoginSuccess(data.data, formData.username)
            } else {
              handleLoginError(data.status, data.message, formData.username)
            }
          },
          onError: (error) => {
            console.error('Auto login error:', error)
            setErrorMessage(
              "There's a data communication problem with the system.\nPlease contact Customer Support"
            )
          },
        }
      )
    },
    [autoLoginMutation, formData.username, handleLoginSuccess, handleLoginError]
  )

  // Redirect if already logged in
  if (getAccessToken()) {
    return <Navigate to="/home" replace={true} />
  }

  /**
   * Handle Microsoft SSO login
   */
  const handleMicrosoftLogin = async () => {
    try {
      await auth0Handler.loginWithPopup()
      navigate('/login/callback')

      const accessToken = await auth0Handler.getTokenSilently()
      setAccessTokenAuth0(accessToken)
      await handleAutoLogin(accessToken)
    } catch (error) {
      console.error('Microsoft login error:', error)
      setErrorMessage('Failed to login with Microsoft. Please try again.')
    }
  }

  /**
   * Handle manual form submit (currently disabled, using only Microsoft SSO)
   */
  // const handleFormSubmit = useCallback(
  //   (values) => {
  //     const payload = {
  //       username: values.username,
  //       password: values.password,
  //       firebase_token: '',
  //       brand: '',
  //       model: '',
  //       serial_number: '',
  //       platform: 'Web',
  //       version: '',
  //     }

  //     loginMutation.mutate(payload, {
  //       onSuccess: (data) => {
  //         if (data && data.status === 200) {
  //           handleLoginSuccess(data.data, values.username)
  //         } else {
  //           handleLoginError(data.status, data.message, values.username)
  //         }
  //       },
  //       onError: (error) => {
  //         console.error('Login error:', error)
  //         setErrorMessage(
  //           "There's a data communication problem with the system.\nPlease contact Customer Support"
  //         )
  //       },
  //     })
  //   },
  //   [loginMutation, handleLoginSuccess, handleLoginError]
  // )

  // Theme configuration
  const themeConfig = {
    components: {
      Switch: {
        colorPrimary: switchOnLogin,
        colorPrimaryHover: switchOnLogin,
      },
      Input: {
        colorBorder: borderInputLogin,
        activeBorderColor: borderInputLoginFocus,
        activeShadow: false,
        hoverBorderColor: false,
      },
    },
    token: {
      colorPrimary: ColorPrimary,
    },
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <div className="page login-page" style={{ fontFamily: 'Roboto' }}>
        <div className="page-single">
          <Card
            style={{
              width: '31%',
              maxWidth: '430px',
              margin: 'auto',
              boxShadow: 'none',
              borderRadius: '24px',
            }}
          >
            {/* Logo */}
            <div className="text-center mb-6">
              <Image src={MoleawizLogo} preview={false} alt="MoleaWiz Logo" />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <Alert
                message={errorMessage}
                type="error"
                className="mb-4 alert-custom text-center"
              />
            )}

            {/* Microsoft Login Button */}
            <Button
              role="button"
              className="btn btn-sm btn-primary btn-block mb-4 btn-login-microsoft"
              style={{
                borderRadius: '6px',
                fontWeight: '500',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                background: 'transparent',
                color: '#292929',
                border: '1px solid #292929',
              }}
              onClick={handleMicrosoftLogin}
              loading={loading}
            >
              <Image
                src={MicrosoftLogo}
                preview={false}
                width={20}
                alt="Microsoft Logo"
              />
              <span style={{ marginLeft: 25, color: '#292929' }}>
                Login with your Intikom credential
              </span>
            </Button>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default LoginPage
