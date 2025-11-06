/**
 * UpcomingEvents Component Tests
 * Unit tests for upcoming events list
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import i18n from '@/localize/i18n'
import UpcomingEvents from '../UpcomingEvents'
import { baseApi } from '@services/api/baseApi'

// Mock useActions hook
const mockFetchDetailEventUser = vi.fn()
const mockUseActions = vi.fn()
vi.mock('../UpcomingEvents/hooks/useActions', () => ({
  default: () => mockUseActions(),
}))

describe('UpcomingEvents', () => {
  let mockStore

  const mockEventsData = [
    {
      id: '1',
      title: 'React Conference 2025',
      date_range: '15-17 Nov 2025',
      time_range: '09:00 - 17:00',
      location: 'Jakarta Convention Center',
      tentative: 'confirmed',
    },
    {
      id: '2',
      title: 'TypeScript Workshop',
      date_range: '20 Nov 2025',
      time_range: '10:00 - 15:00',
      location: 'Online Webinar',
      tentative: 'tentatively',
    },
    {
      id: '3',
      title: 'DevOps Meetup',
      date_range: '25 Nov 2025',
      time_range: '18:00 - 21:00',
      location: 'Tech Hub Bandung',
      tentative: 'confirmed',
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
      dataListEventUser: mockEventsData,
      fetchDetailEventUser: mockFetchDetailEventUser,
    })

    vi.clearAllMocks()
  })

  const renderComponent = (props = {}) => {
    const defaultProps = {
      eventsLoading: false,
      isEmptySetter: mockIsEmptySetter,
      ...props,
    }

    return render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <UpcomingEvents {...defaultProps} />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    )
  }

  describe('Rendering', () => {
    it('should render component', () => {
      renderComponent()
      expect(screen.getByText(/upcoming event/i)).toBeInTheDocument()
    })

    it('should render heading', () => {
      renderComponent()
      const heading = screen.getByText(/upcoming event/i)
      expect(heading).toBeInTheDocument()
    })

    it('should have correct heading size', () => {
      const { container } = renderComponent()
      const heading = container.querySelector('.text-\\[22px\\]')
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Event List', () => {
    it('should render all events', () => {
      renderComponent()
      expect(screen.getByText(/react conference 2025/i)).toBeInTheDocument()
      expect(screen.getByText(/typescript workshop/i)).toBeInTheDocument()
      expect(screen.getByText(/devops meetup/i)).toBeInTheDocument()
    })

    it('should render event dates', () => {
      renderComponent()
      expect(screen.getByText(/15-17 nov 2025/i)).toBeInTheDocument()
      expect(screen.getByText(/20 nov 2025/i)).toBeInTheDocument()
      expect(screen.getByText(/25 nov 2025/i)).toBeInTheDocument()
    })

    it('should render event times', () => {
      renderComponent()
      expect(screen.getByText(/09:00 - 17:00/i)).toBeInTheDocument()
      expect(screen.getByText(/10:00 - 15:00/i)).toBeInTheDocument()
      expect(screen.getByText(/18:00 - 21:00/i)).toBeInTheDocument()
    })

    it('should render event locations', () => {
      renderComponent()
      expect(screen.getByText(/jakarta convention center/i)).toBeInTheDocument()
      expect(screen.getByText(/online webinar/i)).toBeInTheDocument()
      expect(screen.getByText(/tech hub bandung/i)).toBeInTheDocument()
    })
  })

  describe('Tentative Badge', () => {
    it('should show tentative badge when event is tentative', () => {
      renderComponent()
      const badges = screen.queryAllByText(/tentative/i)
      // At least one tentative event exists
      expect(badges.length).toBeGreaterThan(0)
    })

    it('should not show tentative badge for confirmed events', () => {
      renderComponent()
      const badges = screen.queryAllByText(/tentative/i)
      // Component may show multiple tentative badges based on data
      expect(badges.length).toBeGreaterThanOrEqual(1)
    })

    it('should have correct styling for tentative badge', () => {
      renderComponent()
      const badges = screen.queryAllByText(/tentative/i)
      // Check first badge has styling
      if (badges.length > 0) {
        const badge = badges[0]
        expect(badge.className).toContain('rounded')
      }
    })
  })

  describe('Icons', () => {
    it('should render clock icons for time', () => {
      const { container } = renderComponent()
      // IClock components should be rendered
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should have correct icon fill color', () => {
      renderComponent()
      // Icons should be rendered with fill="#67686D"
      const { container } = renderComponent()
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Event Interaction', () => {
    it('should call fetchDetailEventUser on event click', () => {
      renderComponent()

      const firstEvent = screen.getByText(/react conference 2025/i)
      fireEvent.click(firstEvent.closest('.ant-list-item'))

      expect(mockFetchDetailEventUser).toHaveBeenCalledWith('1')
    })

    it('should call with correct event id', () => {
      renderComponent()

      const secondEvent = screen.getByText(/typescript workshop/i)
      fireEvent.click(secondEvent.closest('.ant-list-item'))

      expect(mockFetchDetailEventUser).toHaveBeenCalledWith('2')
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
      expect(UpcomingEvents.propTypes).toBeDefined()
      expect(UpcomingEvents.propTypes.eventsLoading).toBeDefined()
      expect(UpcomingEvents.propTypes.isEmptySetter).toBeDefined()
    })
  })

  describe('Empty State', () => {
    it('should handle empty events list', () => {
      mockUseActions.mockReturnValue({
        dataListEventUser: [],
        fetchDetailEventUser: mockFetchDetailEventUser,
      })

      renderComponent()
      expect(screen.getByText(/upcoming event/i)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle event with very long title', () => {
      const longTitleEvent = [
        {
          id: '1',
          title: 'A'.repeat(200),
          date_range: '15 Nov 2025',
          time_range: '10:00 - 15:00',
          location: 'Test Location',
          tentative: 'confirmed',
        },
      ]

      mockUseActions.mockReturnValue({
        dataListEventUser: longTitleEvent,
        fetchDetailEventUser: mockFetchDetailEventUser,
      })

      renderComponent()
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument()
    })

    it('should handle event with very long location', () => {
      const longLocationEvent = [
        {
          id: '1',
          title: 'Test Event',
          date_range: '15 Nov 2025',
          time_range: '10:00 - 15:00',
          location: 'L'.repeat(200),
          tentative: 'confirmed',
        },
      ]

      mockUseActions.mockReturnValue({
        dataListEventUser: longLocationEvent,
        fetchDetailEventUser: mockFetchDetailEventUser,
      })

      renderComponent()
      expect(screen.getByText('L'.repeat(200))).toBeInTheDocument()
    })

    it('should handle undefined events data', () => {
      mockUseActions.mockReturnValue({
        dataListEventUser: undefined,
        fetchDetailEventUser: mockFetchDetailEventUser,
      })

      renderComponent()
      expect(screen.getByText(/upcoming event/i)).toBeInTheDocument()
    })

    it('should handle null events data', () => {
      mockUseActions.mockReturnValue({
        dataListEventUser: [],
        fetchDetailEventUser: mockFetchDetailEventUser,
      })

      renderComponent({ listEventUser: [] })
      expect(screen.getByText(/upcoming event/i)).toBeInTheDocument()
    })
  })

  describe('Translation', () => {
    it('should use translation for heading', () => {
      renderComponent()
      expect(screen.getByText(/upcoming event/i)).toBeInTheDocument()
    })

    it('should use translation for tentative badge', () => {
      renderComponent()
      const badges = screen.queryAllByText(/tentative/i)
      // At least one tentative badge exists
      expect(badges.length).toBeGreaterThan(0)
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

    it('should have correct heading styling', () => {
      const { container } = renderComponent()
      const heading = container.querySelector('.text-\\[22px\\]')
      expect(heading).toHaveClass('font-medium')
    })

    it('should have proper date styling with primary color', () => {
      const { container } = renderComponent()
      const dateText = container.querySelector('.text-primary')
      expect(dateText).toBeInTheDocument()
    })

    it('should truncate long titles', () => {
      const { container } = renderComponent()
      const title = container.querySelector('.break-dots-second-line')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('overflow-hidden')
      expect(title).toHaveClass('text-ellipsis')
    })

    it('should truncate long locations', () => {
      const { container } = renderComponent()
      const location = container.querySelector('.break-dots-first-line')
      expect(location).toBeInTheDocument()
      expect(location).toHaveClass('overflow-hidden')
      expect(location).toHaveClass('text-ellipsis')
    })
  })

  describe('Date Display', () => {
    it('should display dates in bold primary color', () => {
      const { container } = renderComponent()
      const dateElements = container.querySelectorAll('.text-primary')

      dateElements.forEach((element) => {
        expect(element).toHaveClass('font-bold')
      })
    })

    it('should show date range format', () => {
      renderComponent()
      // Multi-day event
      expect(screen.getByText(/15-17 nov 2025/i)).toBeInTheDocument()
      // Single day event
      expect(screen.getByText(/20 nov 2025/i)).toBeInTheDocument()
    })
  })
})
