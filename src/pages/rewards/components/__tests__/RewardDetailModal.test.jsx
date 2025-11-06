import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import RewardDetailModal from '../RewardDetailModal'

// Mock Redux store
const createMockStore = (points = 1000) => {
  return configureStore({
    reducer: {
      user: () => ({ profile: { points } }),
    },
  })
}

// Mock Ant Design
vi.mock('antd', () => ({
  Modal: ({ children, open }) =>
    open ? (
      <div data-testid="modal" role="dialog">
        {children}
      </div>
    ) : null,
  Row: ({ children, className }) => <div className={className}>{children}</div>,
  Col: ({ children, className }) => <div className={className}>{children}</div>,
  Image: ({ src, alt, fallback }) => (
    <img src={src} alt={alt} data-fallback={fallback} />
  ),
  Button: ({ children, onClick, disabled, name }) => (
    <button onClick={onClick} disabled={disabled} name={name}>
      {children}
    </button>
  ),
  Divider: ({ className }) => <hr className={className} />,
  ConfigProvider: ({ children }) => <div>{children}</div>,
}))

// Mock icons
vi.mock('@ant-design/icons', () => ({
  WarningFilled: () => <span data-testid="warning-icon">⚠️</span>,
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_rewards.popup_detail_reward.current_balance':
          'Current Balance',
        'feature.feature_rewards.popup_detail_reward.redeem_with':
          'Redeem With',
        'feature.feature_rewards.popup_detail_reward.new_balance':
          'New Balance',
        'feature.feature_rewards.popup_detail_reward.points': 'Points',
        'feature.feature_rewards.popup_detail_reward.not_enough_points':
          'Not Enough Points',
        'feature.feature_rewards.popup_detail_reward.cancel': 'Cancel',
        'feature.feature_rewards.popup_detail_reward.redeem': 'Redeem',
      }
      return translations[key] || key
    },
  }),
}))

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  formatPoints: (num) => num?.toLocaleString('en-US') || '0',
  hasEnoughPoints: (current, needed) => current >= needed,
  calculateNewBalance: (current, redeem) => current - redeem,
}))

describe('RewardDetailModal Component', () => {
  const mockReward = {
    id: 1,
    title: 'Voucher Tokopedia Rp 100.000',
    image: 'voucher.jpg',
    description: 'Get Rp 100.000 voucher for Tokopedia',
    point: 500,
  }

  const mockOnClose = vi.fn()
  const mockOnRedeem = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithStore = (ui, points = 1000) => {
    return render(<Provider store={createMockStore(points)}>{ui}</Provider>)
  }

  describe('Rendering', () => {
    it('should render modal when open', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      renderWithStore(
        <RewardDetailModal
          open={false}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should not render when reward is null', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={null}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display reward title', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />
      )
      expect(
        screen.getByText('Voucher Tokopedia Rp 100.000')
      ).toBeInTheDocument()
    })

    it('should display reward description', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />
      )
      expect(
        screen.getByText('Get Rp 100.000 voucher for Tokopedia')
      ).toBeInTheDocument()
    })

    it('should display reward image', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />
      )
      expect(
        screen.getByAltText('Voucher Tokopedia Rp 100.000')
      ).toBeInTheDocument()
    })
  })

  describe('Point Calculations - Sufficient Balance', () => {
    it('should display current balance', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        1000
      )
      expect(screen.getByText('Current Balance')).toBeInTheDocument()
      expect(screen.getByText('1,000 Points')).toBeInTheDocument()
    })

    it('should display redeem points', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />
      )
      expect(screen.getByText('Redeem With')).toBeInTheDocument()
      expect(screen.getByText('-500 Points')).toBeInTheDocument()
    })

    it('should display new balance when enough points', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        1000
      )
      expect(screen.getByText('New Balance')).toBeInTheDocument()
      expect(screen.getByText('500 Points')).toBeInTheDocument()
    })

    it('should enable redeem button when enough points', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        1000
      )
      const redeemButton = screen.getByRole('button', { name: /redeem/i })
      expect(redeemButton).not.toBeDisabled()
    })
  })

  describe('Point Calculations - Insufficient Balance', () => {
    it('should show warning when insufficient points', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        100
      )
      expect(screen.getByText('Not Enough Points')).toBeInTheDocument()
      expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
    })

    it('should disable redeem button when insufficient points', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        100
      )
      const redeemButtons = screen.getAllByRole('button')
      const disabledRedeemButton = redeemButtons.find(
        (btn) => btn.disabled && btn.textContent === 'Redeem'
      )
      expect(disabledRedeemButton).toBeTruthy()
    })

    it('should not show new balance when insufficient points', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        100
      )
      expect(screen.queryByText('New Balance')).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onClose when cancel button clicked', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />
      )
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onRedeem when redeem button clicked with enough points', async () => {
      const user = userEvent.setup()
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        1000
      )
      const redeemButton = screen.getByRole('button', { name: /redeem/i })
      await user.click(redeemButton)
      expect(mockOnRedeem).toHaveBeenCalledTimes(1)
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when isLoading true', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
          isLoading={true}
        />,
        1000
      )
      // Spinner is rendered inside the button when loading
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
    })

    it('should disable redeem button when loading', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
          isLoading={true}
        />,
        1000
      )
      const buttons = screen.getAllByRole('button')
      const redeemButton = buttons.find(btn => btn.name === 'btn-redeem-detail-rewards')
      expect(redeemButton).toBeDisabled()
    })
  })

  describe('Mobile/Desktop Rendering', () => {
    it('should render mobile version', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
          isMobile={true}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should render with scaling', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
          isMobile={true}
          isScalling={true}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero balance', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        0
      )
      expect(screen.getByText('0 Points')).toBeInTheDocument()
      expect(screen.getByText('Not Enough Points')).toBeInTheDocument()
    })

    it('should handle exact balance', () => {
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        500
      )
      expect(screen.getByText('500 Points')).toBeInTheDocument()
      expect(screen.getByText('0 Points')).toBeInTheDocument()
    })

    it('should handle large numbers', () => {
      const largeReward = { ...mockReward, point: 1000000 }
      renderWithStore(
        <RewardDetailModal
          open={true}
          reward={largeReward}
          onClose={mockOnClose}
          onRedeem={mockOnRedeem}
        />,
        5000000
      )
      expect(screen.getByText('-1,000,000 Points')).toBeInTheDocument()
    })
  })
})
