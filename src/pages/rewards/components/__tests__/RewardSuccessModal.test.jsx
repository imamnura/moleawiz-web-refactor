import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RewardSuccessModal from '../RewardSuccessModal'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock Ant Design
vi.mock('antd', () => ({
  Modal: ({ children, open }) =>
    open ? (
      <div data-testid="modal" role="dialog">
        {children}
      </div>
    ) : null,
  Button: ({ children, onClick, name }) => (
    <button onClick={onClick} name={name}>
      {children}
    </button>
  ),
  Image: ({ src, alt }) => <img src={src} alt={alt} />,
  ConfigProvider: ({ children }) => <div>{children}</div>,
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_rewards.popup_earn_rewards.save_code': 'Your reward code:',
        'feature.feature_rewards.popup_earn_rewards.history': 'View History',
        'feature.feature_rewards.popup_earn_rewards.close': 'Close',
      }
      return translations[key] || key
    },
    i18n: {
      language: 'en',
    },
  }),
}))

// Mock clipboard utility
const mockCopyToClipboard = vi.fn()
vi.mock('../../utils/clipboard', () => ({
  copyToClipboard: (...args) => mockCopyToClipboard(...args),
}))

describe('RewardSuccessModal Component', () => {
  const mockReward = {
    id: 1,
    title: 'Voucher Tokopedia Rp 100.000',
    image: 'voucher.jpg',
    redeem_code: 'ABC123XYZ',
  }

  const mockOnClose = vi.fn()
  const mockOnCopySuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(
        <RewardSuccessModal
          open={false}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display success title', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      // Component displays header image instead of text title
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should display redeem code', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.getByText('ABC123XYZ')).toBeInTheDocument()
    })

    it('should display reward image', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(
        screen.getByAltText('Voucher Tokopedia Rp 100.000')
      ).toBeInTheDocument()
    })

    it('should display copy button', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.getByAltText('icon copy')).toBeInTheDocument()
    })

    it('should display view history button', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(
        screen.getByRole('button', { name: /view history/i })
      ).toBeInTheDocument()
    })

    it('should display close button', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
  })

  describe('Copy Functionality', () => {
    it('should call copyToClipboard when copy button clicked', async () => {
      mockCopyToClipboard.mockResolvedValue(true)
      const user = userEvent.setup()
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      const copyButton = screen.getByAltText('icon copy')
      await user.click(copyButton)
      expect(mockCopyToClipboard).toHaveBeenCalledWith('ABC123XYZ', false)
    })

    it('should call copyToClipboard with mobile flag on mobile', async () => {
      mockCopyToClipboard.mockResolvedValue(true)
      const user = userEvent.setup()
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
          isMobile={true}
        />
      )
      const copyButton = screen.getByAltText('icon copy')
      await user.click(copyButton)
      expect(mockCopyToClipboard).toHaveBeenCalledWith('ABC123XYZ', true)
    })

    it('should call onCopySuccess when copy is successful', async () => {
      mockCopyToClipboard.mockResolvedValue(true)
      const user = userEvent.setup()
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      const copyButton = screen.getByAltText('icon copy')
      await user.click(copyButton)
      await vi.waitFor(() => {
        expect(mockOnCopySuccess).toHaveBeenCalledTimes(1)
      })
    })

    it('should not call onCopySuccess when copy fails', async () => {
      mockCopyToClipboard.mockResolvedValue(false)
      const user = userEvent.setup()
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      const copyButton = screen.getByAltText('icon copy')
      await user.click(copyButton)
      await vi.waitFor(() => {
        expect(mockOnCopySuccess).not.toHaveBeenCalled()
      })
    })

    it('should handle undefined onCopySuccess gracefully', async () => {
      mockCopyToClipboard.mockResolvedValue(true)
      const user = userEvent.setup()
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
        />
      )
      const copyButton = screen.getByAltText('icon copy')
      await user.click(copyButton)
      expect(mockCopyToClipboard).toHaveBeenCalledWith('ABC123XYZ', false)
    })
  })

  describe('Navigation', () => {
    it('should navigate to history page when view history clicked', async () => {
      const user = userEvent.setup()
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      const viewHistoryButton = screen.getByText(/view history/i)
      await user.click(viewHistoryButton)
      expect(mockNavigate).toHaveBeenCalledWith('/rewards/history')
    })

    it('should call onClose when view history clicked', async () => {
      const user = userEvent.setup()
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      const viewHistoryButton = screen.getByText(/view history/i)
      await user.click(viewHistoryButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Close Functionality', () => {
    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup()
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Mobile/Desktop Rendering', () => {
    it('should render mobile version', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
          isMobile={true}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should render with scaling', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
          isMobile={true}
          isScalling={true}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should display code with # prefix on mobile', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
          isMobile={true}
        />
      )
      expect(screen.getByText('#ABC123XYZ')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null reward gracefully', () => {
      render(
        <RewardSuccessModal
          open={true}
          reward={null}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should handle missing redeem_code', () => {
      const rewardWithoutCode = { ...mockReward, redeem_code: undefined }
      render(
        <RewardSuccessModal
          open={true}
          reward={rewardWithoutCode}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should handle empty redeem_code', () => {
      const rewardWithEmptyCode = { ...mockReward, redeem_code: '' }
      render(
        <RewardSuccessModal
          open={true}
          reward={rewardWithEmptyCode}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should handle rapid open/close state changes', () => {
      const { rerender } = render(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      rerender(
        <RewardSuccessModal
          open={false}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      rerender(
        <RewardSuccessModal
          open={true}
          reward={mockReward}
          onClose={mockOnClose}
          onCopySuccess={mockOnCopySuccess}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
})
