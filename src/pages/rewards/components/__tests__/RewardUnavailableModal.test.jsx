import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RewardUnavailableModal from '../RewardUnavailableModal'

// Mock Ant Design
vi.mock('antd', () => ({
  Modal: ({ children, open, footer }) =>
    open ? (
      <div data-testid="modal" role="dialog">
        {children}
        {footer}
      </div>
    ) : null,
  Button: ({ children, onClick, name, style }) => (
    <button onClick={onClick} name={name} style={style}>
      {children}
    </button>
  ),
  Image: ({ src, alt, fallback }) => (
    <img src={src} alt={alt} data-fallback={fallback} />
  ),
  ConfigProvider: ({ children }) => <div>{children}</div>,
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_rewards.popup_oot.reward_out_of_stock':
          'Reward Out of Stock',
        'feature.feature_rewards.popup_oot.late_claim':
          'Sorry, you were too late to claim this reward.',
        'feature.feature_rewards.popup_oot.someone_already':
          'Someone already redeemed it.',
        'feature.feature_rewards.popup_oot.ok': 'OK',
      }
      return translations[key] || key
    },
  }),
}))

describe('RewardUnavailableModal Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should not render modal when closed', () => {
      render(<RewardUnavailableModal open={false} onClose={mockOnClose} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display out of stock title', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      expect(screen.getByText('Reward Out of Stock')).toBeInTheDocument()
    })

    it('should display message lines', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      expect(
        screen.getByText(/sorry.*too late.*claim.*reward/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/someone already redeemed/i)
      ).toBeInTheDocument()
    })

    it('should display OK button', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument()
    })

    it('should display out of stock icon', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
    })
  })

  describe('User Interactions', () => {
    it('should call onClose when OK button clicked', async () => {
      const user = userEvent.setup()
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      const okButton = screen.getByRole('button', { name: /ok/i })
      await user.click(okButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks on OK button', async () => {
      const user = userEvent.setup()
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      const okButton = screen.getByRole('button', { name: /ok/i })
      await user.click(okButton)
      await user.click(okButton)

      expect(mockOnClose).toHaveBeenCalledTimes(2)
    })
  })

  describe('Mobile Rendering', () => {
    it('should render on mobile', () => {
      render(
        <RewardUnavailableModal
          open={true}
          onClose={mockOnClose}
          isMobile={true}
        />
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Reward Out of Stock')).toBeInTheDocument()
    })

    it('should render with scaling', () => {
      render(
        <RewardUnavailableModal
          open={true}
          onClose={mockOnClose}
          isMobile={true}
          isScalling={true}
        />
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Button Attributes', () => {
    it('should have correct button name', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      const button = screen.getByRole('button', { name: /ok/i })
      expect(button).toHaveAttribute('name', 'btn-ok-reward-unavailable')
    })

    it('should have correct button styles', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      const button = screen.getByRole('button', { name: /ok/i })
      expect(button).toHaveStyle({
        borderRadius: '6px',
        background: '#0066CC',
        color: '#FFFFFF',
      })
    })
  })

  describe('PropTypes Validation', () => {
    it('should render with required props only', () => {
      const { container } = render(
        <RewardUnavailableModal open={true} onClose={mockOnClose} />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should use default isMobile value', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should use default isScalling value', () => {
      render(<RewardUnavailableModal open={true} onClose={mockOnClose} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should not crash when onClose is undefined', () => {
      render(<RewardUnavailableModal open={true} onClose={undefined} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should handle rapid open/close', () => {
      const { rerender } = render(
        <RewardUnavailableModal open={false} onClose={mockOnClose} />
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      rerender(<RewardUnavailableModal open={true} onClose={mockOnClose} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      rerender(<RewardUnavailableModal open={false} onClose={mockOnClose} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
