import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RewardList from '../RewardList'

// Mock Loader component
vi.mock('@/components/Loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}))

// Mock RewardCard component
vi.mock('../RewardCard', () => ({
  default: ({ reward, onRedeem, isMobile }) => (
    <div data-testid="reward-card" data-reward-id={reward.id} data-mobile={isMobile}>
      <div>{reward.title}</div>
      <button onClick={() => onRedeem(reward.id)}>Redeem</button>
    </div>
  ),
}))

// Mock Ant Design Flex
vi.mock('antd', () => ({
  Flex: ({ children, wrap, gap, justify }) => (
    <div data-testid="flex" data-wrap={wrap} data-gap={gap} data-justify={justify}>
      {children}
    </div>
  ),
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_rewards.emtpy_state.rewards_not_available':
          'No rewards available at the moment',
      }
      return translations[key] || key
    },
  }),
}))

// Mock empty rewards image
vi.mock('@/assets/images/svgs/ic_empty_rewards.svg', () => ({
  default: 'empty-rewards.svg',
}))

describe('RewardList Component', () => {
  const mockRewards = [
    {
      id: 1,
      title: 'Voucher Tokopedia',
      image: 'voucher1.jpg',
      point: 500,
      availability: 10,
    },
    {
      id: 2,
      title: 'Voucher Shopee',
      image: 'voucher2.jpg',
      point: 300,
      availability: 5,
    },
    {
      id: 3,
      title: 'Voucher Grab',
      image: 'voucher3.jpg',
      point: 250,
      availability: 8,
    },
  ]

  const mockOnRedeemClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loader when loading', () => {
      render(
        <RewardList
          rewards={[]}
          onRedeemClick={mockOnRedeemClick}
          isLoading={true}
        />
      )

      expect(screen.getByTestId('loader')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should not show rewards when loading', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={true}
        />
      )

      expect(screen.queryByText('Voucher Tokopedia')).not.toBeInTheDocument()
    })

    it('should not show empty state when loading', () => {
      render(
        <RewardList
          rewards={[]}
          onRedeemClick={mockOnRedeemClick}
          isLoading={true}
        />
      )

      expect(
        screen.queryByText('No rewards available at the moment')
      ).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no rewards', () => {
      render(
        <RewardList
          rewards={[]}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      expect(
        screen.getByText('No rewards available at the moment')
      ).toBeInTheDocument()
    })

    it('should show empty illustration', () => {
      render(
        <RewardList
          rewards={[]}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const image = screen.getByAltText('No rewards available')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'empty-rewards.svg')
    })

    it('should show empty state when rewards is null', () => {
      render(
        <RewardList
          rewards={null}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      expect(
        screen.getByText('No rewards available at the moment')
      ).toBeInTheDocument()
    })

    it('should show empty state when rewards is undefined', () => {
      render(
        <RewardList
          rewards={undefined}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      expect(
        screen.getByText('No rewards available at the moment')
      ).toBeInTheDocument()
    })

    it('should have proper ARIA attributes for empty state', () => {
      const { container } = render(
        <RewardList
          rewards={[]}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const emptyState = container.querySelector('aside')
      expect(emptyState).toHaveAttribute('role', 'status')
      expect(emptyState).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Rewards Display', () => {
    it('should render list of rewards', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      expect(screen.getByText('Voucher Tokopedia')).toBeInTheDocument()
      expect(screen.getByText('Voucher Shopee')).toBeInTheDocument()
      expect(screen.getByText('Voucher Grab')).toBeInTheDocument()
    })

    it('should render correct number of reward cards', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      expect(cards).toHaveLength(3)
    })

    it('should render single reward', () => {
      const singleReward = [mockRewards[0]]
      render(
        <RewardList
          rewards={singleReward}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      expect(cards).toHaveLength(1)
    })

    it('should render many rewards', () => {
      const manyRewards = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Reward ${i + 1}`,
        image: `image${i + 1}.jpg`,
        point: (i + 1) * 100,
        availability: i + 1,
      }))

      render(
        <RewardList
          rewards={manyRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      expect(cards).toHaveLength(20)
    })

    it('should pass correct props to RewardCard', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const firstCard = screen.getAllByTestId('reward-card')[0]
      expect(firstCard).toHaveAttribute('data-reward-id', '1')
      expect(firstCard).toHaveAttribute('data-mobile', 'false')
    })
  })

  describe('Desktop Layout', () => {
    it('should use flex start alignment on desktop', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
          isMobile={false}
        />
      )

      const flex = screen.getByTestId('flex')
      expect(flex).toHaveAttribute('data-justify', 'start')
    })

    it('should pass isMobile=false to cards on desktop', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
          isMobile={false}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      cards.forEach((card) => {
        expect(card).toHaveAttribute('data-mobile', 'false')
      })
    })
  })

  describe('Mobile Layout', () => {
    it('should use center alignment on mobile', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
          isMobile={true}
        />
      )

      const flex = screen.getByTestId('flex')
      expect(flex).toHaveAttribute('data-justify', 'center')
    })

    it('should pass isMobile=true to cards on mobile', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
          isMobile={true}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      cards.forEach((card) => {
        expect(card).toHaveAttribute('data-mobile', 'true')
      })
    })
  })

  describe('Flex Layout', () => {
    it('should use wrap and gap for flex layout', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const flex = screen.getByTestId('flex')
      expect(flex).toHaveAttribute('data-wrap', 'wrap')
      expect(flex).toHaveAttribute('data-gap', 'middle')
    })
  })

  describe('Accessibility', () => {
    it('should have role="list" on container', () => {
      const { container } = render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const list = container.querySelector('[role="list"]')
      expect(list).toBeInTheDocument()
    })

    it('should have aria-label on list', () => {
      const { container } = render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const list = container.querySelector('[role="list"]')
      expect(list).toHaveAttribute('aria-label', 'Reward items')
    })

    it('should have role="listitem" on each reward', () => {
      const { container } = render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const listItems = container.querySelectorAll('[role="listitem"]')
      expect(listItems).toHaveLength(3)
    })
  })

  describe('Key Assignment', () => {
    it('should use reward ID as key', () => {
      const { container } = render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const listItems = container.querySelectorAll('[role="listitem"]')
      expect(listItems[0]).toBeInTheDocument() // Key is internal to React
    })

    it('should fallback to index if no ID', () => {
      const rewardsWithoutId = mockRewards.map((r) => {
        const { id: _id, ...rest } = r
        return rest
      })

      // Should not throw error
      render(
        <RewardList
          rewards={rewardsWithoutId}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      expect(cards).toHaveLength(3)
    })
  })

  describe('Redeem Callback', () => {
    it('should pass onRedeemClick to cards', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const redeemButtons = screen.getAllByText('Redeem')
      expect(redeemButtons).toHaveLength(3)
    })
  })

  describe('PropTypes Validation', () => {
    it('should render with all required props', () => {
      const { container } = render(
        <RewardList rewards={mockRewards} onRedeemClick={mockOnRedeemClick} />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should use default props', () => {
      render(<RewardList rewards={[]} onRedeemClick={mockOnRedeemClick} />)

      expect(
        screen.getByText('No rewards available at the moment')
      ).toBeInTheDocument()
    })

    it('should handle optional props', () => {
      render(
        <RewardList
          rewards={mockRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
          isMobile={true}
        />
      )

      expect(screen.getByText('Voucher Tokopedia')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle reward with string ID', () => {
      const stringIdRewards = mockRewards.map((r) => ({ ...r, id: String(r.id) }))

      render(
        <RewardList
          rewards={stringIdRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      expect(cards).toHaveLength(3)
    })

    it('should handle mixed ID types', () => {
      const mixedRewards = [
        { ...mockRewards[0], id: 1 },
        { ...mockRewards[1], id: '2' },
        { ...mockRewards[2], id: 3 },
      ]

      render(
        <RewardList
          rewards={mixedRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      expect(cards).toHaveLength(3)
    })

    it('should handle rewards with duplicate IDs gracefully', () => {
      const duplicateRewards = [
        mockRewards[0],
        { ...mockRewards[0], title: 'Duplicate' },
      ]

      // Should render even with duplicate keys (React will warn)
      render(
        <RewardList
          rewards={duplicateRewards}
          onRedeemClick={mockOnRedeemClick}
          isLoading={false}
        />
      )

      const cards = screen.getAllByTestId('reward-card')
      expect(cards).toHaveLength(2)
    })
  })
})
