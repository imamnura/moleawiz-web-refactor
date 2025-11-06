import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HistoryList from '../HistoryList'

// Mock Loader
vi.mock('../../../components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))

// Mock Ant Design
vi.mock('antd', () => ({
  Image: ({ src, alt, fallback }) => (
    <img src={src} alt={alt} data-fallback={fallback} />
  ),
  Divider: ({ className }) => <hr className={className} />,
  Flex: ({ children, align, gap, justify, className }) => (
    <div
      className={className}
      data-align={align}
      data-gap={gap}
      data-justify={justify}
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
        'table.redeem_code': 'Redeem Code',
        'button.copy_code': 'Copy code',
        'rewards.no_history': 'No history available',
      }
      return translations[key] || key
    },
    i18n: { language: 'en' },
  }),
}))

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  formatRewardDateTime: (date, time) => `${date} ${time}`,
  formatPoints: (num) => num?.toLocaleString('en-US') || '0',
}))

// Mock clipboard
vi.mock('../../utils/clipboard', () => ({
  copyToClipboard: vi.fn(() => true),
}))

import { copyToClipboard } from '../../utils/clipboard'

describe('HistoryList Component', () => {
  const mockHistory = [
    {
      id: 1,
      created_date: '2024-12-20',
      created_time: '14:30:00',
      title: 'Voucher Tokopedia Rp 100.000',
      image: 'voucher1.jpg',
      point: 500,
      redeem_code: 'ABC123DEF',
    },
    {
      id: 2,
      created_date: '2024-12-18',
      created_time: '10:15:00',
      title: 'Voucher Shopee Rp 50.000',
      image: 'voucher2.jpg',
      point: 300,
      redeem_code: 'XYZ789GHI',
    },
  ]

  const mockOnCopySuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loader when loading', () => {
      render(
        <HistoryList
          history={[]}
          isLoading={true}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByTestId('loader')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should not show history when loading', () => {
      render(
        <HistoryList
          history={mockHistory}
          isLoading={true}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(
        screen.queryByText('Voucher Tokopedia Rp 100.000')
      ).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no history', () => {
      render(
        <HistoryList
          history={[]}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByText('No history available')).toBeInTheDocument()
      expect(screen.getByAltText('No history available')).toBeInTheDocument()
    })

    it('should show empty state for null history', () => {
      render(
        <HistoryList
          history={null}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByText('No history available')).toBeInTheDocument()
    })

    it('should show empty state for undefined history', () => {
      render(
        <HistoryList
          history={undefined}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByText('No history available')).toBeInTheDocument()
    })

    it('should have ARIA attributes on empty state', () => {
      const { container } = render(
        <HistoryList
          history={[]}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const emptyState = container.querySelector('aside')
      expect(emptyState).toHaveAttribute('role', 'status')
      expect(emptyState).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('History Display', () => {
    it('should render history items', () => {
      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(
        screen.getByText('Voucher Tokopedia Rp 100.000')
      ).toBeInTheDocument()
      expect(screen.getByText('Voucher Shopee Rp 50.000')).toBeInTheDocument()
    })

    it('should display correct number of items', () => {
      const { container } = render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const articles = container.querySelectorAll('article')
      expect(articles).toHaveLength(2)
    })

    it('should display formatted dates and times', () => {
      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByText('2024-12-20 14:30:00')).toBeInTheDocument()
      expect(screen.getByText('2024-12-18 10:15:00')).toBeInTheDocument()
    })

    it('should display formatted points', () => {
      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText('300')).toBeInTheDocument()
    })

    it('should display redeem codes', () => {
      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByText('ABC123DEF')).toBeInTheDocument()
      expect(screen.getByText('XYZ789GHI')).toBeInTheDocument()
    })

    it('should display product images', () => {
      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(
        screen.getByAltText('Voucher Tokopedia Rp 100.000')
      ).toBeInTheDocument()
      expect(
        screen.getByAltText('Voucher Shopee Rp 50.000')
      ).toBeInTheDocument()
    })
  })

  describe('Copy Functionality', () => {
    it('should call copyToClipboard with mobile=true when copy button clicked', async () => {
      const user = userEvent.setup()
      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })
      await user.click(copyButtons[0])

      expect(copyToClipboard).toHaveBeenCalledWith('ABC123DEF', true)
    })

    it('should call onCopySuccess when copy succeeds', async () => {
      const user = userEvent.setup()
      copyToClipboard.mockReturnValue(true)

      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })
      await user.click(copyButtons[0])

      expect(mockOnCopySuccess).toHaveBeenCalled()
    })

    it('should not call onCopySuccess when copy fails', async () => {
      const user = userEvent.setup()
      copyToClipboard.mockReturnValue(false)

      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })
      await user.click(copyButtons[0])

      expect(mockOnCopySuccess).not.toHaveBeenCalled()
    })

    it('should handle missing onCopySuccess callback', async () => {
      const user = userEvent.setup()
      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={null}
        />
      )

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })
      await user.click(copyButtons[0])

      expect(copyToClipboard).toHaveBeenCalled()
    })

    it('should copy correct code for each item', async () => {
      const user = userEvent.setup()
      render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })

      await user.click(copyButtons[0])
      expect(copyToClipboard).toHaveBeenCalledWith('ABC123DEF', true)

      await user.click(copyButtons[1])
      expect(copyToClipboard).toHaveBeenCalledWith('XYZ789GHI', true)
    })
  })

  describe('Accessibility', () => {
    it('should have role="list" on container', () => {
      const { container } = render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const list = container.querySelector('[role="list"]')
      expect(list).toBeInTheDocument()
    })

    it('should have aria-label on list', () => {
      const { container } = render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const list = container.querySelector('[role="list"]')
      expect(list).toHaveAttribute('aria-label', 'Reward history items')
    })

    it('should have role="listitem" on each article', () => {
      const { container } = render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const listItems = container.querySelectorAll('[role="listitem"]')
      expect(listItems).toHaveLength(2)
    })

    it('should use article element for semantic HTML', () => {
      const { container } = render(
        <HistoryList
          history={mockHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const articles = container.querySelectorAll('article')
      expect(articles).toHaveLength(2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle items without created_time', () => {
      const historyWithoutTime = [
        {
          ...mockHistory[0],
          created_time: undefined,
        },
      ]

      render(
        <HistoryList
          history={historyWithoutTime}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByText('2024-12-20')).toBeInTheDocument()
    })

    it('should handle items using created_at instead of created_date', () => {
      const historyWithCreatedAt = [
        {
          ...mockHistory[0],
          created_at: '2024-12-25',
          created_date: undefined,
        },
      ]

      render(
        <HistoryList
          history={historyWithCreatedAt}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(
        screen.getByText('Voucher Tokopedia Rp 100.000')
      ).toBeInTheDocument()
    })

    it('should handle large point values', () => {
      const largePointsHistory = [
        {
          ...mockHistory[0],
          point: 1000000,
        },
      ]

      render(
        <HistoryList
          history={largePointsHistory}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(screen.getByText('1,000,000')).toBeInTheDocument()
    })

    it('should use redeem_code as fallback key if no id', () => {
      const historyWithoutId = [
        {
          created_date: '2024-12-20',
          created_time: '14:30:00',
          title: 'Test Voucher',
          image: 'test.jpg',
          point: 100,
          redeem_code: 'TESTCODE123',
        },
      ]

      const { container } = render(
        <HistoryList
          history={historyWithoutId}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const articles = container.querySelectorAll('article')
      expect(articles).toHaveLength(1)
    })

    it('should display single item correctly', () => {
      const singleItem = [mockHistory[0]]

      render(
        <HistoryList
          history={singleItem}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      expect(
        screen.getByText('Voucher Tokopedia Rp 100.000')
      ).toBeInTheDocument()
    })

    it('should handle many items', () => {
      const manyItems = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        created_date: '2024-12-20',
        created_time: '14:30:00',
        title: `Voucher ${i + 1}`,
        image: `voucher${i + 1}.jpg`,
        point: (i + 1) * 100,
        redeem_code: `CODE${i + 1}`,
      }))

      const { container } = render(
        <HistoryList
          history={manyItems}
          isLoading={false}
          onCopySuccess={mockOnCopySuccess}
        />
      )

      const articles = container.querySelectorAll('article')
      expect(articles).toHaveLength(10)
    })
  })

  describe('PropTypes Validation', () => {
    it('should render with default props', () => {
      const { container } = render(
        <HistoryList onCopySuccess={mockOnCopySuccess} />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should use default isLoading value', () => {
      render(<HistoryList history={[]} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
  })
})
