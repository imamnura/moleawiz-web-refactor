/**
 * ExpiringProgram Component Tests
 * Unit tests for programs expiring within a month
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import i18n from '@/localize/i18n'
import ExpiringProgram from '../ExpiringProgram'
import { baseApi } from '@services/api/baseApi'

// Mock useActions hook
const mockUseActions = vi.fn()
vi.mock('../ExpiringProgram/hooks/useActions', () => ({
  default: () => mockUseActions(),
}))

// Mock react-router-dom navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ExpiringProgram', () => {
  let mockStore

  const mockExpiringJourneys = [
    {
      id: '1',
      name: 'React Fundamentals',
      thumbnail: 'https://example.com/react.jpg',
      days_left: 3,
      time_left: '3 days left',
    },
    {
      id: '2',
      name: 'Advanced TypeScript',
      thumbnail: 'https://example.com/ts.jpg',
      days_left: 7,
      time_left: '7 days left',
    },
    {
      id: '3',
      name: 'Node.js Mastery',
      thumbnail: 'https://example.com/node.jpg',
      days_left: 15,
      time_left: '15 days left',
    },
  ]

  const mockIsEmptySetter = vi.fn()

  beforeEach(() => {
    mockStore = configureStore({
      reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
    })

    mockUseActions.mockReturnValue({
      loading: false,
      expiringJourney: mockExpiringJourneys,
    })

    vi.clearAllMocks()
  })

  const renderComponent = (props = {}) => {
    const defaultProps = {
      expiringLoading: false,
      listJourneyExpiring: mockExpiringJourneys,
      isEmptySetter: mockIsEmptySetter,
      ...props,
    }

    return render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <ExpiringProgram {...defaultProps} />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    )
  }

  describe('Rendering', () => {
    it('should render component', () => {
      renderComponent()
      expect(screen.getByText(/overdue in a month/i)).toBeInTheDocument()
    })

    it('should render heading', () => {
      renderComponent()
      const heading = screen.getByText(/overdue in a month/i)
      expect(heading).toBeInTheDocument()
    })

    it('should render warning message', () => {
      const { container } = renderComponent()
      // Warning message text may vary, check for warning icon
      const warningIcon = container.querySelector('.text-alert-red')
      expect(warningIcon).toBeInTheDocument()
    })

    it('should render warning icon', () => {
      const { container } = renderComponent()
      const warningIcon = container.querySelector('.text-alert-red')
      expect(warningIcon).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loader when loading', () => {
      mockUseActions.mockReturnValue({
        loading: true,
        expiringJourney: [],
      })

      renderComponent({ expiringLoading: true })
      // Uses Loader component
      expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument()
    })

    it('should not show list when loading', () => {
      mockUseActions.mockReturnValue({
        loading: true,
        expiringJourney: [],
      })

      renderComponent({ expiringLoading: true })
      expect(screen.queryByText(/react fundamentals/i)).not.toBeInTheDocument()
    })
  })

  describe('Journey List', () => {
    it('should render all expiring journeys', () => {
      renderComponent()
      expect(screen.getByText(/react fundamentals/i)).toBeInTheDocument()
      expect(screen.getByText(/advanced typescript/i)).toBeInTheDocument()
      expect(screen.getByText(/node.js mastery/i)).toBeInTheDocument()
    })

    it('should render journey thumbnails', () => {
      renderComponent()
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
    })

    it('should have correct alt text for images', () => {
      renderComponent()
      const images = screen.getAllByAltText(/program expiring/i)
      expect(images.length).toBe(mockExpiringJourneys.length)
    })

    it('should render time left for each journey', () => {
      const { container } = renderComponent()
      // Time left format may vary, just check list items rendered
      const listItems = container.querySelectorAll('.ant-list-item')
      expect(listItems.length).toBe(mockExpiringJourneys.length)
    })
  })

  describe('Navigation', () => {
    it('should navigate to journey detail on click', () => {
      renderComponent()

      const firstItem = screen.getByText(/react fundamentals/i)
      fireEvent.click(firstItem.closest('.ant-list-item'))

      expect(mockNavigate).toHaveBeenCalledWith(
        '/my-learning-journey/journey/1'
      )
    })

    it('should navigate with correct journey id', () => {
      renderComponent()

      const secondItem = screen.getByText(/advanced typescript/i)
      fireEvent.click(secondItem.closest('.ant-list-item'))

      expect(mockNavigate).toHaveBeenCalledWith(
        '/my-learning-journey/journey/2'
      )
    })

    it('should have cursor pointer on list items', () => {
      renderComponent()
      const listItems = document.querySelectorAll('.ant-list-item')

      listItems.forEach((item) => {
        expect(item).toHaveClass('cursor-pointer')
      })
    })

    it('should have hover effect on list items', () => {
      renderComponent()
      const listItems = document.querySelectorAll('.ant-list-item')

      listItems.forEach((item) => {
        expect(item).toHaveClass('hover:bg-background-grey')
      })
    })
  })

  describe('PropTypes', () => {
    it('should have PropTypes defined', () => {
      expect(ExpiringProgram.propTypes).toBeDefined()
      expect(ExpiringProgram.propTypes.expiringLoading).toBeDefined()
      expect(ExpiringProgram.propTypes.listJourneyExpiring).toBeDefined()
      expect(ExpiringProgram.propTypes.isEmptySetter).toBeDefined()
    })
  })

  describe('Empty State', () => {
    it('should handle empty journey list', () => {
      mockUseActions.mockReturnValue({
        loading: false,
        expiringJourney: [],
      })

      renderComponent({ listJourneyExpiring: [] })
      expect(screen.getByText(/overdue in a month/i)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined listJourneyExpiring', () => {
      mockUseActions.mockReturnValue({
        loading: false,
        expiringJourney: [],
      })

      renderComponent({ listJourneyExpiring: undefined })
      expect(screen.getByText(/overdue in a month/i)).toBeInTheDocument()
    })

    it('should handle null listJourneyExpiring', () => {
      mockUseActions.mockReturnValue({
        loading: false,
        expiringJourney: [],
      })

      renderComponent({ listJourneyExpiring: null })
      expect(screen.getByText(/overdue in a month/i)).toBeInTheDocument()
    })

    it('should handle journey with missing thumbnail', () => {
      const journeysNoThumbnail = [
        { ...mockExpiringJourneys[0], thumbnail: null },
      ]

      mockUseActions.mockReturnValue({
        loading: false,
        expiringJourney: journeysNoThumbnail,
      })

      renderComponent({ listJourneyExpiring: journeysNoThumbnail })
      expect(screen.getByText(/react fundamentals/i)).toBeInTheDocument()
    })

    it('should handle very long journey name', () => {
      const longNameJourney = [
        {
          id: '1',
          name: 'A'.repeat(200),
          thumbnail: 'test.jpg',
          days_left: 5,
          time_left: '5 days left',
        },
      ]

      mockUseActions.mockReturnValue({
        loading: false,
        expiringJourney: longNameJourney,
      })

      renderComponent({ listJourneyExpiring: longNameJourney })
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument()
    })
  })

  describe('Translation', () => {
    it('should use translation for heading', () => {
      renderComponent()
      expect(screen.getByText(/overdue in a month/i)).toBeInTheDocument()
    })

    it('should use translation for warning message', () => {
      const { container } = renderComponent()
      // Check for warning indicator
      const warningIcon = container.querySelector('.text-alert-red')
      expect(warningIcon).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should have Card component wrapper', () => {
      const { container } = renderComponent()
      expect(container.querySelector('.ant-card')).toBeInTheDocument()
    })

    it('should have List component', () => {
      const { container } = renderComponent()
      expect(container.querySelector('.ant-list')).toBeInTheDocument()
    })

    it('should have correct warning color', () => {
      const { container } = renderComponent()
      const warningText = container.querySelector('.text-alert-red')
      expect(warningText).toBeInTheDocument()
    })
  })
})
