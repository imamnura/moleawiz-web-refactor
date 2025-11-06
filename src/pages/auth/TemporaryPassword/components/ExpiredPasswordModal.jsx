import { Card, Button } from 'antd'
import PropTypes from 'prop-types'
import { useSendTempPasswordMutation } from '@services/api/authApi'

/**
 * ExpiredPasswordModal Component
 * Modal displayed when temporary password has expired
 * Allows user to request new temporary password
 * 
 * @component
 * @param {object} props
 * @param {string} props.username - User's username/email
 * @param {function} props.onSuccess - Callback when password sent successfully
 */
const ExpiredPasswordModal = ({ username, onSuccess }) => {
  // TanStack Query mutation
  const [sendTempPassword, { isLoading }] = useSendTempPasswordMutation()

  /**
   * Request new temporary password
   */
  const handleRequestPassword = () => {
    sendTempPassword({
      check_username_type: 'refreshTemporaryPassword',
      username
    })
      .unwrap()
      .then((data) => {
        if (data.status === 200) {
          // Success - show sent modal
          if (onSuccess) {
            onSuccess(data.data.user.email)
          }
        }
      })
      .catch((err) => {
        console.error('Failed to send temporary password:', err)
      })
  }

  return (
    <Card
      style={{
        width: 'fit-content',
        margin: 'auto',
        boxShadow: 'none',
        borderRadius: '24px',
        padding: '16px'
      }}
    >
      <div
        style={{
          fontWeight: '500',
          fontSize: '22px',
          marginBottom: '10px',
          textAlign: 'center'
        }}
      >
        Temporary Password Has Expired
      </div>
      
      <p
        style={{
          color: '#6c757d',
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >
        Your temporary password has expired.
        <br />
        Please request a new temporary password below.
      </p>
      
      <Button
        className="btn btn-sm btn-primary btn-block"
        style={{
          borderRadius: '6px',
          border: 'none',
          fontWeight: '500'
        }}
        name="btn-request-password"
        onClick={handleRequestPassword}
        loading={sendTempPasswordMutation.isLoading}
        disabled={sendTempPasswordMutation.isLoading}
      >
        {sendTempPasswordMutation.isLoading
          ? 'Sending...'
          : 'Request Password'}
      </Button>
    </Card>
  )
}

ExpiredPasswordModal.propTypes = {
  username: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired
}

export default ExpiredPasswordModal
