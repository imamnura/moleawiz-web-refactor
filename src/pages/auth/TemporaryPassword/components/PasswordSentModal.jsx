import { Card, Button, Row } from 'antd'
import PropTypes from 'prop-types'
import EmailIcon from '@/assets/images/svgs/ic_email_forgotpassword.svg'
import { emailTextForgotPassword } from '@/config/constant/color'

/**
 * PasswordSentModal Component
 * Success modal after temporary password has been sent
 * 
 * @component
 * @param {object} props
 * @param {string} props.email - User's email where password was sent
 * @param {function} props.onBackToLogin - Callback to navigate to login
 */
const PasswordSentModal = ({ email, onBackToLogin }) => {
  return (
    <Card
      style={{
        width: '30%',
        maxWidth: '430px',
        margin: 'auto',
        boxShadow: 'none',
        borderRadius: '24px'
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '20px'
        }}
      >
        Your new temporary password
        <br />
        has been sent to
      </div>

      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px'
        }}
      >
        <img
          src={EmailIcon}
          style={{ marginBottom: '5px' }}
          alt="Email Icon"
        />
        <p
          style={{
            margin: '0 6px',
            textAlign: 'left',
            fontWeight: '500',
            color: emailTextForgotPassword
          }}
        >
          {email}
        </p>
      </Row>

      <Button
        className="btn btn-sm btn-primary btn-block"
        style={{
          borderRadius: '6px',
          border: 'none',
          fontWeight: '500'
        }}
        name="btn-back-to-login"
        onClick={onBackToLogin}
      >
        Back to Login
      </Button>
    </Card>
  )
}

PasswordSentModal.propTypes = {
  email: PropTypes.string.isRequired,
  onBackToLogin: PropTypes.func.isRequired
}

export default PasswordSentModal
