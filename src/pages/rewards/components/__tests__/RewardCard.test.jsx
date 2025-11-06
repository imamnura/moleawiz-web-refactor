import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RewardCard from '../RewardCard'

// Mock Ant Design components
vi.mock('antd', () => ({
  Card: ({ children, onClick, className, variant, ...props }) => (
    <div
      data-testid="card"
      onClick={onClick}
      className={className}
      data-variant={variant}
      {...props}
    >
      {children}
    </div>
  ),
  Image: ({ src, alt, fallback, preview, width, height, className }) => (
    <img
      src={src}
      alt={alt}
      data-fallback={fallback}
      data-preview={preview}
      width={width}
      height={height}
      className={className}
    />
  ),
  Button: ({ children, onClick, name, className, style, ...props }) => (
    <button
      onClick={onClick}
      name={name}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </button>
  ),
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_rewards.anchor.main_content.points': 'Points',
        'feature.feature_rewards.anchor.main_content.available': 'Available',
        'feature.feature_rewards.anchor.main_content.redeem': 'Redeem',
      }
      return translations[key] || key
    },
  }),
}))

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  formatPoints: (num) => num?.toLocaleString('en-US') || '0',
}))

// Mock images
vi.mock('@/assets/images/svgs/ic_tagpoints_reward.svg', () => ({
  default: 'tag-points.svg',
}))
vi.mock('@/assets/images/svgs/ic_package_rewards.svg', () => ({
  default: 'package.svg',
}))
vi.mock('@/assets/images/png/general/img_thumb_default.png', () => ({
  default: 'default-image.png',
}))

describe('RewardCard Component', () => {
  const mockReward = {
    id: 1,
    title: 'Voucher Tokopedia Rp 100.000',
    image: 'https://example.com/voucher.jpg',
    point: 500,
    availability: 10,
  }

  const mockOnRedeem = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Desktop Rendering', () => {
    it('should render reward card on desktop', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('Voucher Tokopedia Rp 100.000')).toBeInTheDocument()
      expect(screen.getByAltText('Voucher Tokopedia Rp 100.000')).toBeInTheDocument()
      expect(screen.getByText('500 Points')).toBeInTheDocument()
      expect(screen.getByText('10 Available')).toBeInTheDocument()
    })

    it('should render redeem button on desktop', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const redeemButton = screen.getByRole('button', { name: /redeem/i })
      expect(redeemButton).toBeInTheDocument()
    })

    it('should display product image', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const image = screen.getByAltText('Voucher Tokopedia Rp 100.000')
      expect(image).toHaveAttribute('src', mockReward.image)
      expect(image).toHaveAttribute('width', '228')
      expect(image).toHaveAttribute('height', '156')
    })

    it('should display points icon', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const pointsIcon = screen.getByAltText('Points')
      expect(pointsIcon).toBeInTheDocument()
      expect(pointsIcon).toHaveAttribute('src', 'tag-points.svg')
    })

    it('should display availability icon', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const packageIcon = screen.getByAltText('Package')
      expect(packageIcon).toBeInTheDocument()
      expect(packageIcon).toHaveAttribute('src', 'package.svg')
    })

    it('should have correct desktop card width', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const card = screen.getByTestId('card')
      expect(card).toHaveClass('w-[228px]')
    })
  })

  describe('Mobile Rendering', () => {
    it('should render reward card on mobile', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} isMobile />)

      expect(screen.getByText('Voucher Tokopedia Rp 100.000')).toBeInTheDocument()
      expect(screen.getByText('500 Points')).toBeInTheDocument()
      expect(screen.getByText('10 Available')).toBeInTheDocument()
    })

    it('should NOT render redeem button on mobile', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} isMobile />)

      const redeemButton = screen.queryByRole('button', { name: /redeem/i })
      expect(redeemButton).not.toBeInTheDocument()
    })

    it('should have mobile card width', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} isMobile />)

      const card = screen.getByTestId('card')
      expect(card).toHaveClass('w-[47%]')
    })

    it('should display mobile image dimensions', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} isMobile />)

      const image = screen.getByAltText('Voucher Tokopedia Rp 100.000')
      expect(image).toHaveAttribute('width', '100%')
      expect(image).toHaveAttribute('height', '115')
    })
  })

  describe('User Interactions', () => {
    it('should call onRedeem when redeem button clicked (desktop)', async () => {
      const user = userEvent.setup()
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const redeemButton = screen.getByRole('button', { name: /redeem/i })
      await user.click(redeemButton)

      expect(mockOnRedeem).toHaveBeenCalledWith(1)
      expect(mockOnRedeem).toHaveBeenCalledTimes(1)
    })

    it('should call onRedeem when card clicked (mobile)', async () => {
      const user = userEvent.setup()
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} isMobile />)

      const card = screen.getByTestId('card')
      await user.click(card)

      expect(mockOnRedeem).toHaveBeenCalledWith(1)
      expect(mockOnRedeem).toHaveBeenCalledTimes(1)
    })

    it('should NOT call onRedeem when card clicked (desktop)', async () => {
      const user = userEvent.setup()
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const card = screen.getByTestId('card')
      await user.click(card)

      // Desktop uses button, not card click
      expect(mockOnRedeem).not.toHaveBeenCalled()
    })

    it('should handle multiple button clicks', async () => {
      const user = userEvent.setup()
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const redeemButton = screen.getByRole('button', { name: /redeem/i })
      await user.click(redeemButton)
      await user.click(redeemButton)
      await user.click(redeemButton)

      expect(mockOnRedeem).toHaveBeenCalledTimes(3)
    })
  })

  describe('Data Formatting', () => {
    it('should format points with thousand separator', () => {
      const rewardWithLargePoints = { ...mockReward, point: 15000 }
      render(<RewardCard reward={rewardWithLargePoints} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('15,000 Points')).toBeInTheDocument()
    })

    it('should handle string point values', () => {
      const rewardWithStringPoints = { ...mockReward, point: '2500' }
      render(<RewardCard reward={rewardWithStringPoints} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('2,500 Points')).toBeInTheDocument()
    })

    it('should display availability count', () => {
      const rewardWithHighStock = { ...mockReward, availability: 999 }
      render(<RewardCard reward={rewardWithHighStock} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('999 Available')).toBeInTheDocument()
    })

    it('should handle single availability', () => {
      const lastReward = { ...mockReward, availability: 1 }
      render(<RewardCard reward={lastReward} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('1 Available')).toBeInTheDocument()
    })
  })

  describe('Title Display', () => {
    it('should display short title', () => {
      const shortTitle = { ...mockReward, title: 'Gift Card' }
      render(<RewardCard reward={shortTitle} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('Gift Card')).toBeInTheDocument()
    })

    it('should display long title', () => {
      const longTitle = {
        ...mockReward,
        title: 'Voucher Belanja Tokopedia Senilai Rp 100.000 untuk Semua Kategori Produk',
      }
      render(<RewardCard reward={longTitle} onRedeem={mockOnRedeem} />)

      expect(
        screen.getByText(
          'Voucher Belanja Tokopedia Senilai Rp 100.000 untuk Semua Kategori Produk'
        )
      ).toBeInTheDocument()
    })

    it('should display title with special characters', () => {
      const specialTitle = { ...mockReward, title: 'Voucher & Gift Card - 50%!' }
      render(<RewardCard reward={specialTitle} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('Voucher & Gift Card - 50%!')).toBeInTheDocument()
    })
  })

  describe('Image Handling', () => {
    it('should set fallback image', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const image = screen.getByAltText('Voucher Tokopedia Rp 100.000')
      expect(image).toHaveAttribute('data-fallback', 'default-image.png')
    })

    it('should handle missing image URL', () => {
      const noImageReward = { ...mockReward, image: undefined }
      render(<RewardCard reward={noImageReward} onRedeem={mockOnRedeem} />)

      const image = screen.getByAltText('Voucher Tokopedia Rp 100.000')
      expect(image).toBeInTheDocument()
    })

    it('should disable image preview', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const image = screen.getByAltText('Voucher Tokopedia Rp 100.000')
      expect(image).toHaveAttribute('data-preview', 'false')
    })

    it('should apply rounded corners to image', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const image = screen.getByAltText('Voucher Tokopedia Rp 100.000')
      expect(image).toHaveClass('rounded-t-lg')
    })
  })

  describe('Accessibility', () => {
    it('should use article wrapper for semantic HTML', () => {
      const { container } = render(
        <RewardCard reward={mockReward} onRedeem={mockOnRedeem} />
      )

      const article = container.querySelector('article')
      expect(article).toBeInTheDocument()
    })

    it('should have alt text for product image', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const image = screen.getByAltText('Voucher Tokopedia Rp 100.000')
      expect(image).toBeInTheDocument()
    })

    it('should have alt text for icons', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      expect(screen.getByAltText('Points')).toBeInTheDocument()
      expect(screen.getByAltText('Package')).toBeInTheDocument()
    })

    it('should have button name attribute', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const button = screen.getByRole('button', { name: /redeem/i })
      expect(button).toHaveAttribute('name', 'btn-redeem-rewards')
    })
  })

  describe('Styling', () => {
    it('should apply correct button styles', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const button = screen.getByRole('button', { name: /redeem/i })
      expect(button).toHaveStyle({
        background: '#0066CC',
        color: '#FFFFFF',
        borderColor: '#0066CC',
        borderRadius: '8px',
        fontSize: '12px',
        height: '29px',
      })
    })

    it('should have borderless card variant', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('data-variant', 'borderless')
    })

    it('should apply mobile text styles', () => {
      const { container } = render(
        <RewardCard reward={mockReward} onRedeem={mockOnRedeem} isMobile />
      )

      const titleDiv = container.querySelector('.title-product')
      expect(titleDiv).toHaveClass('mb-[15px]')
    })
  })

  describe('Edge Cases', () => {
    it('should handle reward with ID as string', () => {
      const stringIdReward = { ...mockReward, id: '123' }
      render(<RewardCard reward={stringIdReward} onRedeem={mockOnRedeem} />)

      const button = screen.getByRole('button', { name: /redeem/i })
      expect(button).toBeInTheDocument()
    })

    it('should handle zero availability', () => {
      const noStock = { ...mockReward, availability: 0 }
      render(<RewardCard reward={noStock} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('0 Available')).toBeInTheDocument()
    })

    it('should handle zero points', () => {
      const freeReward = { ...mockReward, point: 0 }
      render(<RewardCard reward={freeReward} onRedeem={mockOnRedeem} />)

      expect(screen.getByText('0 Points')).toBeInTheDocument()
    })

    it('should handle undefined onRedeem on mobile', async () => {
      const user = userEvent.setup()
      render(<RewardCard reward={mockReward} onRedeem={undefined} isMobile />)

      const card = screen.getByTestId('card')
      // Should not throw error
      await user.click(card)
    })
  })

  describe('PropTypes Validation', () => {
    it('should render with all required props', () => {
      const { container } = render(
        <RewardCard reward={mockReward} onRedeem={mockOnRedeem} />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render with optional isMobile prop', () => {
      const { container } = render(
        <RewardCard reward={mockReward} onRedeem={mockOnRedeem} isMobile />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should use default isMobile value', () => {
      render(<RewardCard reward={mockReward} onRedeem={mockOnRedeem} />)

      // Should show desktop version (with button)
      expect(screen.getByRole('button', { name: /redeem/i })).toBeInTheDocument()
    })
  })
})
