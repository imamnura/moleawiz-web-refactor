import PropTypes from 'prop-types'

/**
 * CallbackLogin Component
 * OAuth callback page after successful Microsoft authentication
 * 
 * @component
 */
const CallbackLogin = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'Roboto'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2>Login Successful</h2>
        <p>Redirecting...</p>
      </div>
    </div>
  )
}

CallbackLogin.propTypes = {}

export default CallbackLogin
