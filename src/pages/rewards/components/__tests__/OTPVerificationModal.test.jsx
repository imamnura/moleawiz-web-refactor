import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OTPVerificationModal from '../OTPVerificationModal'

// Mock Ant Design
vi.mock('antd', () => ({
  Modal: ({ children, open }) =>
    open ? (
      <div data-testid="modal" role="dialog">
        {children}
      </div>
    ) : null,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Button: ({ children, onClick, disabled, htmlType, name }) => (
    <button onClick={onClick} disabled={disabled} type={htmlType} name={name}>
      {children}
    </button>
  ),
  Form: Object.assign(
    ({ children, onFinish }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onFinish?.()
        }}
      >
        {children}
      </form>
    ),
    {
      Item: ({ children }) => <div>{children}</div>,
    }
  ),
  Input: ({ children, value, onChange, maxLength, placeholder, name }) => (
    <input
      value={value}
      onChange={(e) => onChange?.(e)}
      maxLength={maxLength}
      placeholder={placeholder}
      name={name}
    >
      {children}
    </input>
  ),
  Alert: ({ message, type }) => (
    <div role="alert" data-type={type}>
      {message}
    </div>
  ),
  Image: ({ src, alt }) => <img src={src} alt={alt} />,
  ConfigProvider: ({ children }) => <div>{children}</div>,
  Row: ({ children }) => <div>{children}</div>,
  Col: ({ children }) => <div>{children}</div>,
}))

// Mock Countdown
vi.mock('react-countdown', () => ({
  default: ({ date, renderer }) => {
    const Countdown = () => {
      const now = Date.now()
      const targetDate = new Date(date).getTime()
      const completed = targetDate <= now
      const minutes = completed ? 0 : 5
      const seconds = completed ? 0 : 0
      return renderer({ minutes, seconds, completed })
    }
    Countdown.displayName = 'Countdown'
    return <Countdown />
  },
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_rewards.popup_otp.verify_your': 'Verify Your Email',
        'feature.feature_rewards.popup_otp.please_enter_the':
          'Please enter the OTP code sent to',
        'feature.feature_rewards.popup_otp.expire_in': 'OTP will expire in',
        'feature.feature_rewards.popup_otp.verification_code':
          'Enter 6-digit OTP',
        'feature.feature_rewards.popup_otp.verify': 'Verify',
        'feature.feature_rewards.popup_otp.request_verification_code':
          'Request New Code',
        'feature.feature_rewards.popup_otp.request_verification_code_mobile':
          'Request New Code',
        'feature.feature_rewards.popup_otp.back': 'Back',
        'feature.feature_rewards.popup_otp.too_many_attempts':
          'Too many attempts. Please try again later.',
        'feature.feature_rewards.popup_otp.incorrect_code':
          'Incorrect OTP code. Please try again.',
      }
      return translations[key] || 'An error occurred. Please try again.'
    },
  }),
}))

// Mock filterOTPInput
vi.mock('../../utils/otpHelpers', () => ({
  filterOTPInput: (value) => value.replace(/\D/g, '').slice(0, 6),
}))

describe('OTPVerificationModal Component', () => {
  const mockEmail = 'test@example.com'
  const mockExpiredDate = new Date(Date.now() + 300000).toISOString() // 5 minutes from now
  const mockSendDate = new Date().toISOString()
  const mockOnVerify = vi.fn()
  const mockOnRequestNew = vi.fn()
  const mockOnBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(
        <OTPVerificationModal
          open={false}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display title', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.getByText('Verify Your Email')).toBeInTheDocument()
    })

    it('should display email', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument()
    })

    it('should display countdown timer', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.getByText('OTP will expire in')).toBeInTheDocument()
      expect(screen.getByText(/05:00/)).toBeInTheDocument()
    })
  })

  describe('OTP Input', () => {
    it('should render OTP input field', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      const input = screen.getByPlaceholderText('Enter 6-digit OTP')
      expect(input).toBeInTheDocument()
    })

    it('should update OTP code on input', async () => {
      const user = userEvent.setup()
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      const input = screen.getByPlaceholderText('Enter 6-digit OTP')
      await user.type(input, '123456')
      expect(input.value).toBe('123456')
    })

    it('should filter non-numeric characters', async () => {
      const user = userEvent.setup()
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      const input = screen.getByPlaceholderText('Enter 6-digit OTP')
      await user.type(input, 'abc123')
      expect(input.value).toBe('123')
    })

    it('should limit input to 6 characters', async () => {
      const user = userEvent.setup()
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      const input = screen.getByPlaceholderText('Enter 6-digit OTP')
      await user.type(input, '12345678')
      expect(input.value).toBe('123456')
    })
  })

  describe('Verify Button State', () => {
    it('should disable verify button when OTP is less than 6 digits', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      const verifyButton = screen.getByRole('button', { name: /verify/i })
      expect(verifyButton).toBeDisabled()
    })

    it('should enable verify button when OTP is 6 digits', async () => {
      const user = userEvent.setup()
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      const input = screen.getByPlaceholderText('Enter 6-digit OTP')
      await user.type(input, '123456')
      const verifyButton = screen.getByRole('button', { name: /verify/i })
      expect(verifyButton).not.toBeDisabled()
    })

    it('should disable verify button when loading', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
          isLoading={true}
        />
      )
      const verifyButton = screen.getByRole('button', {
        name: '',
      })
      expect(verifyButton).toBeDisabled()
    })
  })

  describe('User Interactions', () => {
    it('should call onVerify when form submitted with valid OTP', async () => {
      const user = userEvent.setup()
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      const input = screen.getByPlaceholderText('Enter 6-digit OTP')
      await user.type(input, '123456')
      const verifyButton = screen.getByRole('button', { name: /verify/i })
      await user.click(verifyButton)
      expect(mockOnVerify).toHaveBeenCalledWith('123456')
    })

    it('should call onRequestNew when request button clicked', async () => {
      const user = userEvent.setup()
      const expiredDate = new Date(Date.now() - 1000).toISOString() // Expired 1 second ago
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={expiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      const requestButton = screen.getByRole('button', {
        name: /request.*code/i,
      })
      await user.click(requestButton)
      expect(mockOnRequestNew).toHaveBeenCalledTimes(1)
    })

    it('should call onBack when back button clicked (mobile)', async () => {
      const user = userEvent.setup()
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
          isMobile={true}
        />
      )
      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)
      expect(mockOnBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Display', () => {
    it('should display too many attempts error', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
          error="too_many_attempts"
        />
      )
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Too many attempts. Please try again later.'
      )
    })

    it('should display incorrect code error', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
          error="incorrect_code"
        />
      )
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Incorrect OTP code. Please try again.'
      )
    })

    it('should display generic error for unknown error types', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
          error="unknown_error"
        />
      )
      expect(screen.getByRole('alert')).toHaveTextContent('unknown_error')
    })

    it('should not display alert when no error', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Mobile Rendering', () => {
    it('should render back button on mobile', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
          isMobile={true}
        />
      )
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    })

    it('should render back link on desktop', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
          isMobile={false}
        />
      )
      const backLink = screen.getByText(/back/i)
      expect(backLink).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty email gracefully', () => {
      render(
        <OTPVerificationModal
          open={true}
          email=""
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should handle null email gracefully', () => {
      render(
        <OTPVerificationModal
          open={true}
          email={null}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should handle rapid state changes', async () => {
      const { rerender } = render(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      rerender(
        <OTPVerificationModal
          open={false}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      rerender(
        <OTPVerificationModal
          open={true}
          email={mockEmail}
          expiredDate={mockExpiredDate}
          sendDate={mockSendDate}
          onVerify={mockOnVerify}
          onRequestNew={mockOnRequestNew}
          onBack={mockOnBack}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
})
