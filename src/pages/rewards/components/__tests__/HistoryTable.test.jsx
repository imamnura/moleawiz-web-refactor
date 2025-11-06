import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HistoryTable from '../HistoryTable'

// Mock Ant Design
vi.mock('antd', () => ({
  Table: ({ columns, dataSource, loading, locale }) => {
    if (loading) return <div data-testid="table-loading">Loading...</div>
    if (!dataSource || dataSource.length === 0) {
      return <div data-testid="empty-table">{locale.emptyText}</div>
    }
    return (
      <table data-testid="history-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((item, index) => (
            <tr key={item.id || index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(item[col.dataIndex], item) : item[col.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  },
  Image: ({ src, alt, fallback }) => (
    <img src={src} alt={alt} data-fallback={fallback} />
  ),
  Flex: ({ children, align, gap, justify }) => (
    <div data-align={align} data-gap={gap} data-justify={justify}>{children}</div>
  ),
  ConfigProvider: ({ children }) => <div>{children}</div>,
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'table.date_time': 'Date & Time',
        'table.product': 'Product',
        'table.points': 'Points',
        'table.redeem_code': 'Redeem Code',
        'button.copy_code': 'Copy code',
        'rewards.no_history': 'No history found',
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

describe('HistoryTable Component', () => {
  const mockHistory = [
    {
      id: 1,
      created_at: '2024-12-20',
      created_time: '14:30:00',
      title: 'Voucher Tokopedia',
      image: 'voucher1.jpg',
      point: 500,
      redeem_code: 'ABC123',
    },
    {
      id: 2,
      created_at: '2024-12-18',
      created_time: '10:15:00',
      title: 'Voucher Shopee',
      image: 'voucher2.jpg',
      point: 300,
      redeem_code: 'DEF456',
    },
  ]

  const mockOnCopySuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render table with history data', () => {
      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.getByTestId('history-table')).toBeInTheDocument()
      expect(screen.getByText('Voucher Tokopedia')).toBeInTheDocument()
      expect(screen.getByText('Voucher Shopee')).toBeInTheDocument()
    })

    it('should render table headers', () => {
      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.getByText('Date & Time')).toBeInTheDocument()
      expect(screen.getByText('Product')).toBeInTheDocument()
      expect(screen.getByText('Points')).toBeInTheDocument()
      expect(screen.getByText('Redeem Code')).toBeInTheDocument()
    })

    it('should display formatted dates', () => {
      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.getByText('2024-12-20 14:30:00')).toBeInTheDocument()
      expect(screen.getByText('2024-12-18 10:15:00')).toBeInTheDocument()
    })

    it('should display formatted points', () => {
      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText('300')).toBeInTheDocument()
    })

    it('should display redeem codes', () => {
      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.getByText('ABC123')).toBeInTheDocument()
      expect(screen.getByText('DEF456')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading state', () => {
      render(<HistoryTable history={[]} isLoading={true} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.getByTestId('table-loading')).toBeInTheDocument()
    })

    it('should not show table when loading', () => {
      render(<HistoryTable history={mockHistory} isLoading={true} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.queryByTestId('history-table')).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no history', () => {
      render(<HistoryTable history={[]} isLoading={false} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.getByText('No history found')).toBeInTheDocument()
    })

    it('should show empty state for undefined history', () => {
      render(<HistoryTable history={undefined} isLoading={false} onCopySuccess={mockOnCopySuccess} />)

      expect(screen.getByText('No history found')).toBeInTheDocument()
    })
  })

  describe('Copy Functionality', () => {
    it('should call copyToClipboard when copy button clicked', async () => {
      const user = userEvent.setup()
      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })
      await user.click(copyButtons[0])

      expect(copyToClipboard).toHaveBeenCalledWith('ABC123', false)
    })

    it('should call onCopySuccess when copy succeeds', async () => {
      const user = userEvent.setup()
      copyToClipboard.mockReturnValue(true)

      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })
      await user.click(copyButtons[0])

      expect(mockOnCopySuccess).toHaveBeenCalled()
    })

    it('should not call onCopySuccess when copy fails', async () => {
      const user = userEvent.setup()
      copyToClipboard.mockReturnValue(false)

      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })
      await user.click(copyButtons[0])

      expect(mockOnCopySuccess).not.toHaveBeenCalled()
    })

    it('should handle missing onCopySuccess callback', async () => {
      const user = userEvent.setup()
      render(<HistoryTable history={mockHistory} onCopySuccess={null} />)

      const copyButtons = screen.getAllByRole('button', { name: /copy code/i })
      await user.click(copyButtons[0])

      expect(copyToClipboard).toHaveBeenCalled()
    })
  })

  describe('Images', () => {
    it('should display product images', () => {
      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      const images = screen.getAllByRole('img')
      const productImages = images.filter(img => img.alt && !img.alt.includes('Copy'))
      
      expect(productImages.length).toBeGreaterThan(0)
    })

    it('should have fallback for images', () => {
      render(<HistoryTable history={mockHistory} onCopySuccess={mockOnCopySuccess} />)

      const images = screen.getAllByRole('img')
      const imageWithFallback = images.find(img => img.getAttribute('data-fallback'))
      
      expect(imageWithFallback).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle items without created_time', () => {
      const historyWithoutTime = [{
        ...mockHistory[0],
        created_time: undefined,
      }]

      render(<HistoryTable history={historyWithoutTime} onCopySuccess={mockOnCopySuccess} />)
      expect(screen.getByText('2024-12-20')).toBeInTheDocument()
    })

    it('should handle large point values', () => {
      const largePointsHistory = [{
        ...mockHistory[0],
        point: 1000000,
      }]

      render(<HistoryTable history={largePointsHistory} onCopySuccess={mockOnCopySuccess} />)
      expect(screen.getByText('1,000,000')).toBeInTheDocument()
    })
  })
})
