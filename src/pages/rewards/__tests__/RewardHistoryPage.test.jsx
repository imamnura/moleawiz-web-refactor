import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import RewardHistoryPage from '../RewardHistoryPage'

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
const createMockStore = (isMobile = false) => {
  return configureStore({
    reducer: {
      isMobile: () => isMobile,
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
  Button: ({ children, onClick, icon, className, type }) => (
    <button onClick={onClick} className={className} data-type={type}>
      {icon}
      {children}
    </button>
  ),
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'rewards.history_title': 'Reward History',
        'rewards.copy_success': 'Code copied successfully!',
      }
      return translations[key] || key
    },
  }),
}))

// Mock hook
const mockHistory = [
  {
    id: 1,
    product_name: 'Voucher A',
    point: 500,
    redeem_code: 'ABC123',
    redeem_date: '2024-11-01T10:00:00Z',
    product_image: 'a.jpg',
  },
  {
    id: 2,
    product_name: 'Voucher B',
    point: 1000,
    redeem_code: 'XYZ789',
    redeem_date: '2024-11-02T15:30:00Z',
    product_image: 'b.jpg',
  },
]

const mockUseRewardHistory = vi.fn()

vi.mock('../hooks/useRewardHistory', () => ({
  default: () => mockUseRewardHistory(),
}))

// Mock components
vi.mock('../components/HistoryTable', () => ({
  default: ({ history, isLoading, onCopySuccess }) => (
    <div data-testid="history-table" data-loading={isLoading}>
      {history?.map((item) => (
        <div key={item.id}>
          <p>{item.product_name}</p>
          <button onClick={onCopySuccess}>Copy</button>
        </div>
      ))}
    </div>
  ),
}))

vi.mock('../components/HistoryList', () => ({
  default: ({ history, isLoading, onCopySuccess }) => (
    <div data-testid="history-list" data-loading={isLoading}>
      {history?.map((item) => (
        <div key={item.id}>
          <p>{item.product_name}</p>
          <button onClick={onCopySuccess}>Copy</button>
        </div>
      ))}
    </div>
  ),
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

describe('RewardHistoryPage', () => {
  const renderWithProviders = (ui, isMobile = false) => {
    return render(
      <Provider store={createMockStore(isMobile)}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRewardHistory.mockReturnValue({
      history: mockHistory,
      isLoading: false,
    })
  })

  describe('Page Rendering', () => {
    it('should render history page', () => {
      renderWithProviders(<RewardHistoryPage />)
      expect(
        screen.getByRole('heading', { name: /reward history/i })
      ).toBeInTheDocument()
    })

    it('should render with semantic HTML structure', () => {
      renderWithProviders(<RewardHistoryPage />)
      const section = screen.getByRole('region', { name: /history/i })
      expect(section).toBeInTheDocument()
      expect(section.tagName).toBe('SECTION')
    })

    it('should display back button', () => {
      renderWithProviders(<RewardHistoryPage />)
      expect(
        screen.getByRole('button', { name: /back to rewards/i })
      ).toBeInTheDocument()
    })

    it('should display page title', () => {
      renderWithProviders(<RewardHistoryPage />)
      expect(
        screen.getByRole('heading', { name: /reward history/i })
      ).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate back to rewards page when back button clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RewardHistoryPage />)
      const backButton = screen.getByRole('button', {
        name: /back to rewards/i,
      })
      await user.click(backButton)
      expect(mockNavigate).toHaveBeenCalledWith('/rewards')
    })
  })

  describe('Desktop View', () => {
    it('should render HistoryTable on desktop', () => {
      renderWithProviders(<RewardHistoryPage />, false)
      expect(screen.getByTestId('history-table')).toBeInTheDocument()
      expect(screen.queryByTestId('history-list')).not.toBeInTheDocument()
    })

    it('should display history items in table', () => {
      renderWithProviders(<RewardHistoryPage />, false)
      expect(screen.getByText('Voucher A')).toBeInTheDocument()
      expect(screen.getByText('Voucher B')).toBeInTheDocument()
    })

    it('should pass loading state to HistoryTable', () => {
      mockUseRewardHistory.mockReturnValue({
        history: [],
        isLoading: true,
      })
      renderWithProviders(<RewardHistoryPage />, false)
      const table = screen.getByTestId('history-table')
      expect(table).toHaveAttribute('data-loading', 'true')
    })
  })

  describe('Mobile View', () => {
    it('should render HistoryList on mobile', () => {
      renderWithProviders(<RewardHistoryPage />, true)
      expect(screen.getByTestId('history-list')).toBeInTheDocument()
      expect(screen.queryByTestId('history-table')).not.toBeInTheDocument()
    })

    it('should display history items in list', () => {
      renderWithProviders(<RewardHistoryPage />, true)
      expect(screen.getByText('Voucher A')).toBeInTheDocument()
      expect(screen.getByText('Voucher B')).toBeInTheDocument()
    })

    it('should pass loading state to HistoryList', () => {
      mockUseRewardHistory.mockReturnValue({
        history: [],
        isLoading: true,
      })
      renderWithProviders(<RewardHistoryPage />, true)
      const list = screen.getByTestId('history-list')
      expect(list).toHaveAttribute('data-loading', 'true')
    })
  })

  describe('Copy Functionality', () => {
    it('should show snackbar when copy success on desktop', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RewardHistoryPage />, false)
      const copyButtons = screen.getAllByRole('button', { name: /copy/i })
      await user.click(copyButtons[0])

      await waitFor(() => {
        expect(screen.getByTestId('snackbar')).toBeInTheDocument()
        expect(
          screen.getByText('Code copied successfully!')
        ).toBeInTheDocument()
      })
    })

    it('should show snackbar when copy success on mobile', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RewardHistoryPage />, true)
      const copyButtons = screen.getAllByRole('button', { name: /copy/i })
      await user.click(copyButtons[0])

      await waitFor(() => {
        expect(screen.getByTestId('snackbar')).toBeInTheDocument()
        expect(
          screen.getByText('Code copied successfully!')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Snackbar', () => {
    it('should close snackbar when close clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RewardHistoryPage />)

      const copyButtons = screen.getAllByRole('button', { name: /copy/i })
      await user.click(copyButtons[0])

      await waitFor(() => {
        expect(screen.getByTestId('snackbar')).toBeInTheDocument()
      })

      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByTestId('snackbar')).not.toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should pass loading state to table component', () => {
      mockUseRewardHistory.mockReturnValue({
        history: [],
        isLoading: true,
      })
      renderWithProviders(<RewardHistoryPage />, false)
      const table = screen.getByTestId('history-table')
      expect(table).toHaveAttribute('data-loading', 'true')
    })

    it('should pass loading state to list component', () => {
      mockUseRewardHistory.mockReturnValue({
        history: [],
        isLoading: true,
      })
      renderWithProviders(<RewardHistoryPage />, true)
      const list = screen.getByTestId('history-list')
      expect(list).toHaveAttribute('data-loading', 'true')
    })
  })

  describe('Empty State', () => {
    it('should handle empty history on desktop', () => {
      mockUseRewardHistory.mockReturnValue({
        history: [],
        isLoading: false,
      })
      renderWithProviders(<RewardHistoryPage />, false)
      expect(screen.getByTestId('history-table')).toBeInTheDocument()
    })

    it('should handle empty history on mobile', () => {
      mockUseRewardHistory.mockReturnValue({
        history: [],
        isLoading: false,
      })
      renderWithProviders(<RewardHistoryPage />, true)
      expect(screen.getByTestId('history-list')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null history gracefully', () => {
      mockUseRewardHistory.mockReturnValue({
        history: null,
        isLoading: false,
      })
      renderWithProviders(<RewardHistoryPage />, false)
      expect(screen.getByTestId('history-table')).toBeInTheDocument()
    })

    it('should handle undefined history gracefully', () => {
      mockUseRewardHistory.mockReturnValue({
        history: undefined,
        isLoading: false,
      })
      renderWithProviders(<RewardHistoryPage />, true)
      expect(screen.getByTestId('history-list')).toBeInTheDocument()
    })

    it('should switch between mobile and desktop views', () => {
      const { rerender } = renderWithProviders(<RewardHistoryPage />, false)
      expect(screen.getByTestId('history-table')).toBeInTheDocument()

      rerender(
        <Provider store={createMockStore(true)}>
          <MemoryRouter>
            <RewardHistoryPage />
          </MemoryRouter>
        </Provider>
      )
      expect(screen.getByTestId('history-list')).toBeInTheDocument()
      expect(screen.queryByTestId('history-table')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels on back button', () => {
      renderWithProviders(<RewardHistoryPage />)
      const backButton = screen.getByRole('button', {
        name: /back to rewards/i,
      })
      expect(backButton).toBeInTheDocument()
    })

    it('should have heading with proper ID', () => {
      renderWithProviders(<RewardHistoryPage />)
      const heading = screen.getByRole('heading', { name: /reward history/i })
      expect(heading).toHaveAttribute('id', 'history-title')
    })

    it('should have section with aria-labelledby', () => {
      renderWithProviders(<RewardHistoryPage />)
      const section = screen.getByRole('region', { name: /history/i })
      expect(section).toHaveAttribute('aria-labelledby', 'history-title')
    })
  })

  describe('Data Flow', () => {
    it('should pass history data to table component', () => {
      renderWithProviders(<RewardHistoryPage />, false)
      expect(screen.getByText('Voucher A')).toBeInTheDocument()
      expect(screen.getByText('Voucher B')).toBeInTheDocument()
    })

    it('should pass history data to list component', () => {
      renderWithProviders(<RewardHistoryPage />, true)
      expect(screen.getByText('Voucher A')).toBeInTheDocument()
      expect(screen.getByText('Voucher B')).toBeInTheDocument()
    })

    it('should pass onCopySuccess callback to components', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RewardHistoryPage />, false)

      const copyButtons = screen.getAllByRole('button', { name: /copy/i })
      await user.click(copyButtons[0])

      await waitFor(() => {
        expect(screen.getByTestId('snackbar')).toBeInTheDocument()
      })
    })
  })
})
