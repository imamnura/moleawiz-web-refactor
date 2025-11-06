import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Loader } from '@/components/common'
import { useAutoLoginToken } from './hooks/useAutoLoginToken'
import { setLastLogin } from '@/redux/features/main/onboardingSlice'
import { setAccessToken, setFullname, setUsername } from '@/utils'

/**
 * AutoLogin Component
 * Handles automatic login via token from URL params
 * Supports routing to different pages after login
 * 
 * @component
 * @example
 * // URL: /auto-login?token=xxx&page=list-program
 * // URL: /auto-login?token=xxx&page=detail-program&program_id=uuid
 */
const AutoLogin = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // URL parameters
  const token = searchParams.get('token')
  const page = searchParams.get('page')
  const programId = searchParams.get('program_id')

  const [error, setError] = useState('')

  // Auto login hook
  const {
    loading,
    error: autoLoginError,
    login,
    fetchProgramId
  } = useAutoLoginToken({
    onSuccess: (data) => {
      // Save user data
      const accessToken = data.user.token
      const fullName = `${data.firstname} ${data.lastname}`

      const rememberData = {
        username: data.username,
        isChecked: false
      }
      setUsername(JSON.stringify(rememberData))
      setAccessToken(accessToken)
      setFullname(fullName)
      dispatch(setLastLogin(data.last_login_platform))

      // Navigate based on page param
      handleNavigation()
    },
    onError: (err) => {
      setError(err)
    }
  })

  /**
   * Handle navigation after successful login
   */
  const handleNavigation = async () => {
    switch (page) {
      case 'list-program':
        navigate('/my-learning-journey', {
          state: { successPassword: 0 }
        })
        break

      case 'detail-program':
        if (programId) {
          const programID = await fetchProgramId(programId)
          if (programID) {
            navigate(`/my-learning-journey/journey/${programID}`, {
              state: { successPassword: 0 }
            })
          } else {
            navigate('/home', {
              state: { successPassword: 0 }
            })
          }
        } else {
          navigate('/home', {
            state: { successPassword: 0 }
          })
        }
        break

      default:
        navigate('/home', {
          state: { successPassword: 0 }
        })
        break
    }
  }

  // Auto-trigger login on mount
  useEffect(() => {
    if (token) {
      login(token)
    } else {
      setError('No authentication token provided')
    }
  }, [token, login])

  // Show error if exists
  if (error || autoLoginError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>
          {error || autoLoginError}
        </p>
      </div>
    )
  }

  // Show loader while processing
  return <Loader fullScreen={true} />
}

AutoLogin.propTypes = {}

export default AutoLogin
