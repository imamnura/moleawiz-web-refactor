import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import RewardsPage from '../RewardsPage'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock Redux store
const createMockStore = (
  points = 1000,
  isMobile = false,
  isScalling = false
) => {
  return configureStore({
    reducer: {
      user: () => ({ profile: { points } }),
      isMobile: () => isMobile,
      isScalling: () => isScalling,
    },
  })
}

// Mock Ant Design
vi.mock('antd', () => ({
  Flex: ({ children, className, justify, align, gap }) => (
    <div
      className={className}
      data-justify={justify}
      data-align={align}
      data-gap={gap}
    >
      {children}
    </div>
  ),
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'rewards.title': 'Rewards',
        'rewards.history': 'History',
        'rewards.current_balance': 'Current Balance',
        'rewards.copy_success': 'Code copied successfully!',
      }
      return translations[key] || key
    },
  }),
}))

// Mock hooks
const mockRewards = [
  { id: 1, title: 'Voucher A', point: 500, image: 'a.jpg' },
  { id: 2, title: 'Voucher B', point: 1000, image: 'b.jpg' },
]
const mockRewardDetail = {
  id: 1,
  title: 'Voucher A',
  point: 500,
  description: 'Test',
  image: 'a.jpg',
}
const mockOtpData = {
  email: 'test@example.com',
  verificationCodeExpired: new Date(Date.now() + 300000).toISOString(),
  verificationCodeSent: new Date().toISOString(),
}

const mockUseRewards = vi.fn()
const mockFetchDetail = vi.fn()
const mockResetDetail = vi.fn()
const mockRequestOTP = vi.fn()
const mockVerifyOTP = vi.fn()
const mockRequestNewOTP = vi.fn()
const mockResetOTPFlow = vi.fn()

vi.mock('../hooks/useRewards', () => ({
  default: () => mockUseRewards(),
}))

vi.mock('../hooks/useRewardDetail', () => ({
  default: () => ({
    rewardDetail: mockRewardDetail,
    fetchDetail: mockFetchDetail,
    resetDetail: mockResetDetail,
  }),
}))

vi.mock('../hooks/useRedeemFlow', () => ({
  default: () => ({
    otpData: mockOtpData,
    otpError: null,
    isRequestingOTP: false,
    isVerifyingOTP: false,
    isRedeeming: false,
    requestOTP: mockRequestOTP,
    verifyOTP: mockVerifyOTP,
    requestNewOTP: mockRequestNewOTP,
    resetOTPFlow: mockResetOTPFlow,
  }),
}))

// Mock components
vi.mock('../components/RewardList', () => ({
  default: ({ rewards, onRedeemClick, isLoading, isMobile }) => (
    <div
      data-testid="reward-list"
      data-loading={isLoading}
      data-mobile={isMobile}
    >
      {rewards?.map((reward) => (
        <button key={reward.id} onClick={() => onRedeemClick(reward)}>
          {reward.title}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('../components/RewardDetailModal', () => ({
  default: ({ open, reward, onClose, onRedeem, isLoading }) =>
    open ? (
      <div data-testid="detail-modal" role="dialog">
        <p>{reward?.title}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={onRedeem} disabled={isLoading}>
          Redeem
        </button>
      </div>
    ) : null,
}))

vi.mock('../components/OTPVerificationModal', () => ({
  default: ({
    open,
    email,
    onVerify,
    onRequestNew,
    onBack,
    error,
    isLoading,
  }) =>
    open ? (
      <div data-testid="otp-modal" role="dialog">
        <p>{email}</p>
        {error && <p data-testid="otp-error">{error}</p>}
        <button onClick={() => onVerify('123456')} disabled={isLoading}>
          Verify
        </button>
        <button onClick={onRequestNew}>Request New</button>
        <button onClick={onBack}>Back</button>
      </div>
    ) : null,
}))

vi.mock('../components/RewardSuccessModal', () => ({
  default: ({ open, reward, onClose, onCopySuccess }) =>
    open ? (
      <div data-testid="success-modal" role="dialog">
        <p>{reward?.redeem_code}</p>
        <button onClick={onCopySuccess}>Copy</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}))

vi.mock('../components/RewardUnavailableModal', () => ({
  default: ({ open, onClose }) =>
    open ? (
      <div data-testid="unavailable-modal" role="dialog">
        <button onClick={onClose}>OK</button>
      </div>
    ) : null,
}))

vi.mock('../../../components/SnackBar', () => ({
  default: ({ open, message, onClose }) =>
    open ? (
      <div data-testid="snackbar" role="alert">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}))

// Mock formatters
vi.mock('../utils/formatters', () => ({
  formatPoints: (num) => num?.toLocaleString('en-US') || '0',
}))

describe('RewardsPage', () => {
  const renderWithProviders = (ui, points = 1000, isMobile = false) => {
    return render(
      <Provider store={createMockStore(points, isMobile)}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRewards.mockReturnValue({
      rewards: mockRewards,
      isLoading: false,
    })
  })

  describe('Page Rendering', () => {
    it('should render rewards page', () => {
      renderWithProviders(<RewardsPage />)
      expect(
        screen.getByRole('heading', { name: /rewards/i })
      ).toBeInTheDocument()
    })

    it('should render with semantic HTML structure', () => {
      renderWithProviders(<RewardsPage />)
      const section = screen.getByRole('region', { name: /rewards/i })
      expect(section).toBeInTheDocument()
      expect(section.tagName).toBe('SECTION')
    })

    it('should display current balance', () => {
      renderWithProviders(<RewardsPage />, 1500)
      expect(screen.getByText('Current Balance')).toBeInTheDocument()
      expect(screen.getByText('1,500')).toBeInTheDocument()
    })

    it('should display history button', () => {
      renderWithProviders(<RewardsPage />)
      expect(
        screen.getByRole('button', { name: /history/i })
      ).toBeInTheDocument()
    })

    it('should render RewardList component', () => {
      renderWithProviders(<RewardsPage />)
      expect(screen.getByTestId('reward-list')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to history page when history button clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)
      const historyButton = screen.getByRole('button', { name: /history/i })
      await user.click(historyButton)
      expect(mockNavigate).toHaveBeenCalledWith('/rewards/history')
    })
  })

  describe('Reward Detail Flow', () => {
    it('should open detail modal when reward clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)
      const rewardButton = screen.getByText('Voucher A')
      await user.click(rewardButton)
      await waitFor(() => {
        expect(mockFetchDetail).toHaveBeenCalledWith(1)
      })
      expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
    })

    it('should close detail modal when close clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      // Open modal
      const rewardButton = screen.getByText('Voucher A')
      await user.click(rewardButton)
      await waitFor(() => {
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      })

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      await waitFor(() => {
        expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument()
      })
      expect(mockResetDetail).toHaveBeenCalled()
    })
  })

  describe('OTP Flow', () => {
    it('should open OTP modal when redeem clicked and OTP request successful', async () => {
      mockRequestOTP.mockResolvedValue({ success: true })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      // Open detail modal
      await user.click(screen.getByText('Voucher A'))
      await waitFor(() => {
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      })

      // Click redeem
      const redeemButton = screen.getByRole('button', { name: /redeem/i })
      await user.click(redeemButton)

      await waitFor(() => {
        expect(mockRequestOTP).toHaveBeenCalledWith(1)
        expect(screen.getByTestId('otp-modal')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument()
    })

    it('should show unavailable modal when reward out of stock during OTP request', async () => {
      mockRequestOTP.mockResolvedValue({ success: false, outOfStock: true })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      await user.click(screen.getByText('Voucher A'))
      await waitFor(() => {
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /redeem/i }))

      await waitFor(() => {
        expect(screen.getByTestId('unavailable-modal')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument()
    })

    it('should verify OTP and show success modal', async () => {
      mockRequestOTP.mockResolvedValue({ success: true })
      mockVerifyOTP.mockResolvedValue({
        success: true,
        reward: { id: 1, redeem_code: 'ABC123' },
      })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      // Open detail modal
      await user.click(screen.getByText('Voucher A'))
      await waitFor(() => {
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      })

      // Request OTP
      await user.click(screen.getByRole('button', { name: /redeem/i }))
      await waitFor(() => {
        expect(screen.getByTestId('otp-modal')).toBeInTheDocument()
      })

      // Verify OTP
      const verifyButton = screen.getByRole('button', { name: /verify/i })
      await user.click(verifyButton)

      await waitFor(() => {
        expect(mockVerifyOTP).toHaveBeenCalledWith('123456')
        expect(screen.getByTestId('success-modal')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('otp-modal')).not.toBeInTheDocument()
      expect(mockResetOTPFlow).toHaveBeenCalled()
      expect(mockResetDetail).toHaveBeenCalled()
    })

    it('should show unavailable modal when reward out of stock during verification', async () => {
      mockRequestOTP.mockResolvedValue({ success: true })
      mockVerifyOTP.mockResolvedValue({ success: false, outOfStock: true })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      await user.click(screen.getByText('Voucher A'))
      await waitFor(() =>
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /redeem/i }))
      await waitFor(() =>
        expect(screen.getByTestId('otp-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /verify/i }))

      await waitFor(() => {
        expect(screen.getByTestId('unavailable-modal')).toBeInTheDocument()
      })
      expect(mockResetOTPFlow).toHaveBeenCalled()
      expect(mockResetDetail).toHaveBeenCalled()
    })

    it('should request new OTP when button clicked', async () => {
      mockRequestOTP.mockResolvedValue({ success: true })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      await user.click(screen.getByText('Voucher A'))
      await waitFor(() =>
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /redeem/i }))
      await waitFor(() =>
        expect(screen.getByTestId('otp-modal')).toBeInTheDocument()
      )

      const requestNewButton = screen.getByRole('button', {
        name: /request new/i,
      })
      await user.click(requestNewButton)

      expect(mockRequestNewOTP).toHaveBeenCalled()
    })

    it('should go back to detail modal from OTP modal', async () => {
      mockRequestOTP.mockResolvedValue({ success: true })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      await user.click(screen.getByText('Voucher A'))
      await waitFor(() =>
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /redeem/i }))
      await waitFor(() =>
        expect(screen.getByTestId('otp-modal')).toBeInTheDocument()
      )

      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.queryByTestId('otp-modal')).not.toBeInTheDocument()
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      })
      expect(mockResetOTPFlow).toHaveBeenCalled()
    })
  })

  describe('Success Modal', () => {
    it('should close success modal and reset state', async () => {
      mockRequestOTP.mockResolvedValue({ success: true })
      mockVerifyOTP.mockResolvedValue({
        success: true,
        reward: { id: 1, redeem_code: 'ABC123' },
      })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      await user.click(screen.getByText('Voucher A'))
      await waitFor(() =>
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /redeem/i }))
      await waitFor(() =>
        expect(screen.getByTestId('otp-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /verify/i }))
      await waitFor(() =>
        expect(screen.getByTestId('success-modal')).toBeInTheDocument()
      )

      const closeButtons = screen.getAllByRole('button', { name: /close/i })
      await user.click(closeButtons[0])

      await waitFor(() => {
        expect(screen.queryByTestId('success-modal')).not.toBeInTheDocument()
      })
    })

    it('should show snackbar when copy success clicked', async () => {
      mockRequestOTP.mockResolvedValue({ success: true })
      mockVerifyOTP.mockResolvedValue({
        success: true,
        reward: { id: 1, redeem_code: 'ABC123' },
      })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      await user.click(screen.getByText('Voucher A'))
      await waitFor(() =>
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /redeem/i }))
      await waitFor(() =>
        expect(screen.getByTestId('otp-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /verify/i }))
      await waitFor(() =>
        expect(screen.getByTestId('success-modal')).toBeInTheDocument()
      )

      const copyButton = screen.getByRole('button', { name: /copy/i })
      await user.click(copyButton)

      await waitFor(() => {
        expect(screen.getByTestId('snackbar')).toBeInTheDocument()
        expect(
          screen.getByText('Code copied successfully!')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Unavailable Modal', () => {
    it('should close unavailable modal and reset state', async () => {
      mockRequestOTP.mockResolvedValue({ success: false, outOfStock: true })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      await user.click(screen.getByText('Voucher A'))
      await waitFor(() =>
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /redeem/i }))
      await waitFor(() =>
        expect(screen.getByTestId('unavailable-modal')).toBeInTheDocument()
      )

      const okButton = screen.getByRole('button', { name: /ok/i })
      await user.click(okButton)

      await waitFor(() => {
        expect(
          screen.queryByTestId('unavailable-modal')
        ).not.toBeInTheDocument()
      })
      expect(mockResetDetail).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should display loading state in RewardList', () => {
      mockUseRewards.mockReturnValue({
        rewards: [],
        isLoading: true,
      })
      renderWithProviders(<RewardsPage />)
      const rewardList = screen.getByTestId('reward-list')
      expect(rewardList).toHaveAttribute('data-loading', 'true')
    })
  })

  describe('Mobile Rendering', () => {
    it('should pass mobile prop to components', () => {
      renderWithProviders(<RewardsPage />, 1000, true)
      const rewardList = screen.getByTestId('reward-list')
      expect(rewardList).toHaveAttribute('data-mobile', 'true')
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero balance', () => {
      renderWithProviders(<RewardsPage />, 0)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle null balance', () => {
      renderWithProviders(<RewardsPage />, null)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle empty rewards list', () => {
      mockUseRewards.mockReturnValue({
        rewards: [],
        isLoading: false,
      })
      renderWithProviders(<RewardsPage />)
      expect(screen.getByTestId('reward-list')).toBeInTheDocument()
    })
  })

  describe('Snackbar', () => {
    it('should close snackbar when close clicked', async () => {
      mockRequestOTP.mockResolvedValue({ success: true })
      mockVerifyOTP.mockResolvedValue({
        success: true,
        reward: { id: 1, redeem_code: 'ABC123' },
      })
      const user = userEvent.setup()
      renderWithProviders(<RewardsPage />)

      await user.click(screen.getByText('Voucher A'))
      await waitFor(() =>
        expect(screen.getByTestId('detail-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /redeem/i }))
      await waitFor(() =>
        expect(screen.getByTestId('otp-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /verify/i }))
      await waitFor(() =>
        expect(screen.getByTestId('success-modal')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /copy/i }))
      await waitFor(() =>
        expect(screen.getByTestId('snackbar')).toBeInTheDocument()
      )

      const snackbarCloseButton = screen.getByRole('button', { name: /close/i })
      await user.click(snackbarCloseButton)

      await waitFor(() => {
        expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument()
      })
    })
  })
})
