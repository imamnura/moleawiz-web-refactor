import { useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useToggle } from '@/hooks'
import { randBg } from '@/utils'
import ExpiredPasswordModal from './components/ExpiredPasswordModal'
import PasswordSentModal from './components/PasswordSentModal'

/**
 * TemporaryPassword Page
 * Handles expired temporary password flow
 * Shows modal to request new temporary password
 * 
 * @component
 * @example
 * // Navigate with username
 * navigate('/temporary-password', { state: { username: 'user@example.com' } })
 */
const TemporaryPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Multi-step state
  const [showExpiredModal, , setShowExpiredModal] = useToggle(true)
  const [showSentModal, , setShowSentModal] = useToggle(false)
  const [email, setEmail] = useToggle('')

  // Redirect if no username in state
  if (!location.state?.username) {
    return <Navigate to="/login" replace />
  }

  const { username } = location.state

  /**
   * Handle successful password request
   */
  const handlePasswordSent = (userEmail) => {
    setEmail(userEmail)
    setShowExpiredModal(false)
    setShowSentModal(true)
  }

  /**
   * Navigate back to login
   */
  const handleBackToLogin = () => {
    navigate('/login')
  }

  // Apply page styles
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
    
    randBg()

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

  return (
    <div className="page login-page" style={{ fontFamily: 'Roboto' }}>
      <div className="page-single text-center">
        {showExpiredModal && (
          <ExpiredPasswordModal
            username={username}
            onSuccess={handlePasswordSent}
          />
        )}

        {showSentModal && (
          <PasswordSentModal
            email={email}
            onBackToLogin={handleBackToLogin}
          />
        )}
      </div>
    </div>
  )
}

TemporaryPassword.propTypes = {}

export default TemporaryPassword
