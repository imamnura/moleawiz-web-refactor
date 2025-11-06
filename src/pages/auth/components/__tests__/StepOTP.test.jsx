import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../../test/test-utils'
import StepOTP from '../StepOTP'

// Mock react-countdown
vi.mock('react-countdown', () => ({
  default: ({ renderer }) => {
    // Simulate active countdown
    const mockCompleted = false
    const mockMinutes = 4
    const mockSeconds = 59
    return renderer({
      minutes: mockMinutes,
      seconds: mockSeconds,
      completed: mockCompleted,
    })
  },
}))

describe('StepOTP Component', () => {
  const mockProps = {
    username: 'test@example.com',
    expiredDate: new Date(Date.now() + 300000).toISOString(), // 5 minutes from now
    sendDate: new Date().toISOString(),
    onVerify: vi.fn(),
    onRequestNew: vi.fn(),
    onBack: vi.fn(),
    onExpired: vi.fn(),
    showInput: true,
    showVerifyButton: true,
    showRequestButton: false,
    isLoading: false,
    error: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render OTP verification form with all elements', () => {
    renderWithProviders(<StepOTP {...mockProps} />)

    expect(screen.getByText('Verify Your Account')).toBeInTheDocument()
    expect(
      screen.getByText(/Please enter the verification code sent to/i)
    ).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Expire in')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Verification Code')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('should display countdown timer correctly', () => {
    renderWithProviders(<StepOTP {...mockProps} />)

    // Check for countdown display (mocked to show 04:59)
    expect(screen.getByText('04:59')).toBeInTheDocument()
  })

  it('should show validation error when OTP is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<StepOTP {...mockProps} />)

    const verifyButton = screen.getByRole('button', { name: /verify/i })
    await user.click(verifyButton)

    await waitFor(() => {
      expect(
        screen.getByText('Please enter verification code')
      ).toBeInTheDocument()
    })

    expect(mockProps.onVerify).not.toHaveBeenCalled()
  })

  it('should show validation error when OTP is only whitespace', async () => {
    const user = userEvent.setup()
    renderWithProviders(<StepOTP {...mockProps} />)

    const otpInput = screen.getByPlaceholderText('Verification Code')
    const verifyButton = screen.getByRole('button', { name: /verify/i })

    await user.type(otpInput, '   ')
    await user.click(verifyButton)

    await waitFor(() => {
      expect(
        screen.getByText('Please enter verification code')
      ).toBeInTheDocument()
    })

    expect(mockProps.onVerify).not.toHaveBeenCalled()
  })

  it('should call onVerify with OTP value on successful submission', async () => {
    const user = userEvent.setup()
    renderWithProviders(<StepOTP {...mockProps} />)

    const otpInput = screen.getByPlaceholderText('Verification Code')
    const verifyButton = screen.getByRole('button', { name: /verify/i })

    await user.type(otpInput, '123456')
    await user.click(verifyButton)

    await waitFor(() => {
      expect(mockProps.onVerify).toHaveBeenCalledWith('123456')
    })
  })

  it('should clear validation error when user types in OTP field', async () => {
    const user = userEvent.setup()
    renderWithProviders(<StepOTP {...mockProps} />)

    const otpInput = screen.getByPlaceholderText('Verification Code')
    const verifyButton = screen.getByRole('button', { name: /verify/i })

    // First trigger validation error
    await user.click(verifyButton)
    await waitFor(() => {
      expect(
        screen.getByText('Please enter verification code')
      ).toBeInTheDocument()
    })

    // Then type in the field
    await user.type(otpInput, '1')

    // Error should be cleared
    await waitFor(() => {
      expect(
        screen.queryByText('Please enter verification code')
      ).not.toBeInTheDocument()
    })
  })

  it('should call onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<StepOTP {...mockProps} />)

    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)

    expect(mockProps.onBack).toHaveBeenCalledTimes(1)
  })

  it('should call onRequestNew when request button is clicked', async () => {
    const user = userEvent.setup()
    const props = {
      ...mockProps,
      showVerifyButton: false,
      showRequestButton: true,
    }
    renderWithProviders(<StepOTP {...props} />)

    const requestButton = screen.getByRole('button', {
      name: /request verification code/i,
    })
    await user.click(requestButton)

    expect(mockProps.onRequestNew).toHaveBeenCalledTimes(1)
  })

  it('should show loading state on verify button', () => {
    const props = { ...mockProps, isLoading: true }
    renderWithProviders(<StepOTP {...props} />)

    const verifyButton = screen.getByRole('button', { name: /verify/i })
    expect(verifyButton).toHaveClass('ant-btn-loading')
  })

  it('should show loading state on request button', () => {
    const props = {
      ...mockProps,
      showVerifyButton: false,
      showRequestButton: true,
      isLoading: true,
    }
    renderWithProviders(<StepOTP {...props} />)

    const requestButton = screen.getByRole('button', {
      name: /request verification code/i,
    })
    expect(requestButton).toHaveClass('ant-btn-loading')
  })

  it('should display error message when error prop is provided', () => {
    const props = {
      ...mockProps,
      error: { message: 'Invalid verification code' },
    }
    renderWithProviders(<StepOTP {...props} />)

    expect(screen.getByText('Invalid verification code')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should display generic error message when error has no message', () => {
    const props = {
      ...mockProps,
      error: {},
    }
    renderWithProviders(<StepOTP {...props} />)

    expect(
      screen.getByText('Verification failed. Please try again.')
    ).toBeInTheDocument()
  })

  it('should hide OTP input when showInput is false', () => {
    const props = { ...mockProps, showInput: false }
    renderWithProviders(<StepOTP {...props} />)

    expect(
      screen.queryByPlaceholderText('Verification Code')
    ).not.toBeInTheDocument()
  })

  it('should hide verify button when showVerifyButton is false', () => {
    const props = { ...mockProps, showVerifyButton: false }
    renderWithProviders(<StepOTP {...props} />)

    expect(
      screen.queryByRole('button', { name: /^verify$/i })
    ).not.toBeInTheDocument()
  })

  it('should hide request button when showRequestButton is false', () => {
    renderWithProviders(<StepOTP {...mockProps} />)

    expect(
      screen.queryByRole('button', { name: /request verification code/i })
    ).not.toBeInTheDocument()
  })

  it('should handle OTP input change correctly', async () => {
    const user = userEvent.setup()
    renderWithProviders(<StepOTP {...mockProps} />)

    const otpInput = screen.getByPlaceholderText('Verification Code')
    await user.type(otpInput, '654321')

    expect(otpInput).toHaveValue(654321) // number input
  })

  it('should apply error styling when there is a validation error', async () => {
    const user = userEvent.setup()
    renderWithProviders(<StepOTP {...mockProps} />)

    const verifyButton = screen.getByRole('button', { name: /verify/i })
    await user.click(verifyButton)

    const otpInput = screen.getByPlaceholderText('Verification Code')

    await waitFor(() => {
      expect(otpInput).toHaveClass('border-red-500')
    })
  })

  it('should display email icon with alt text', () => {
    renderWithProviders(<StepOTP {...mockProps} />)

    const emailIcon = screen.getByAltText('Email icon')
    expect(emailIcon).toBeInTheDocument()
  })
})
