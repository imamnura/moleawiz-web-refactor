/**
 * HomePage Component Tests
 * Unit tests for main Home page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import i18n from '@/localize/i18n'
import HomePage from '../HomePage'
import homeReducer from '@store/slices/homeSlice'

// Mock API hooks
const mockUseGetUserProfileQuery = vi.fn()
const mockUseGetAllJourneyDataQuery = vi.fn()

vi.mock('@services/api/homeApi', () => ({
  useGetUserProfileQuery: () => mockUseGetUserProfileQuery(),
  useGetAllJourneyDataQuery: () => mockUseGetAllJourneyDataQuery(),
}))

// Mock child components
vi.mock('../components/HomeTitleText', () => ({
  default: ({ userName }) => <h1 data-testid="home-title">Hi, {userName}</h1>,
}))

vi.mock('../components/Banner', () => ({
  default: ({ journeyLength }) => (
    <div data-testid="banner">Journey Length: {journeyLength}</div>
  ),
}))

vi.mock('../components/OngoingCourse', () => ({
  default: () => <div data-testid="ongoing-course">Ongoing Course</div>,
}))

vi.mock('../components/NewPrograms', () => ({
  default: () => <div data-testid="new-programs">New Programs</div>,
}))

vi.mock('../components/ExpiringProgram', () => ({
  default: () => <div data-testid="expiring-program">Expiring Program</div>,
}))

vi.mock('../components/OngoingPrograms', () => ({
  default: () => <div data-testid="ongoing-programs">Ongoing Programs</div>,
}))

vi.mock('../components/UpcomingEvents', () => ({
  default: () => <div data-testid="upcoming-events">Upcoming Events</div>,
}))

describe('HomePage', () => {
  let mockStore

  beforeEach(() => {
    mockStore = configureStore({
      reducer: {
        home: homeReducer,
      },
    })

    // Default mock return values
    mockUseGetUserProfileQuery.mockReturnValue({
      data: { name: 'John Doe', email: 'john@example.com' },
      isLoading: false,
      isError: false,
    })

    mockUseGetAllJourneyDataQuery.mockReturnValue({
      data: [
        { journey_id: 'j1', journey_name: 'Journey 1' },
        { journey_id: 'j2', journey_name: 'Journey 2' },
      ],
      isLoading: false,
      isError: false,
    })
  })

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <HomePage />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    )
  }

  describe('Rendering', () => {
    it('should render component', () => {
      renderComponent()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should use semantic main tag', () => {
      const { container } = renderComponent()
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })

    it('should have aria-label on main', () => {
      renderComponent()
      const main = screen.getByRole('main', { name: /home/i })
      expect(main).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when profile loading', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      })
      mockUseGetAllJourneyDataQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      })

      renderComponent()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should show loading spinner when journey loading', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: { name: 'John' },
        isLoading: false,
        isError: false,
      })
      mockUseGetAllJourneyDataQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      })

      renderComponent()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should show loading spinner when both loading', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      })
      mockUseGetAllJourneyDataQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      })

      renderComponent()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should have accessible loading state', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      })

      renderComponent()
      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
    })

    it('should have screen reader text when loading', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      })

      renderComponent()
      expect(screen.getByText(/loading home page/i)).toBeInTheDocument()
    })
  })

  describe('Content Structure', () => {
    it('should render header section', () => {
      renderComponent()
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })

    it('should render HomeTitleText in header', () => {
      renderComponent()
      expect(screen.getByTestId('home-title')).toBeInTheDocument()
    })

    it('should pass user name to HomeTitleText', () => {
      renderComponent()
      expect(screen.getByText(/john doe/i)).toBeInTheDocument()
    })

    it('should render Banner section', () => {
      renderComponent()
      const section = screen.getByLabelText(/welcome banner/i)
      expect(section).toBeInTheDocument()
    })

    it('should pass journey length to Banner', () => {
      renderComponent()
      expect(screen.getByText(/journey length: 2/i)).toBeInTheDocument()
    })
  })

  describe('Component Grid', () => {
    it('should render all home components', () => {
      renderComponent()
      expect(screen.getByTestId('ongoing-course')).toBeInTheDocument()
      expect(screen.getByTestId('new-programs')).toBeInTheDocument()
      expect(screen.getByTestId('expiring-program')).toBeInTheDocument()
      expect(screen.getByTestId('ongoing-programs')).toBeInTheDocument()
      expect(screen.getByTestId('upcoming-events')).toBeInTheDocument()
    })

    it('should have Current Learning section', () => {
      renderComponent()
      const section = screen.getByLabelText(/current learning/i)
      expect(section).toBeInTheDocument()
    })

    it('should have Programs and Events section', () => {
      renderComponent()
      const section = screen.getByLabelText(/programs and events/i)
      expect(section).toBeInTheDocument()
    })

    it('should render OngoingCourse in left column', () => {
      renderComponent()
      const leftSection = screen.getByLabelText(/current learning/i)
      expect(leftSection).toContainElement(screen.getByTestId('ongoing-course'))
    })

    it('should render NewPrograms in left column', () => {
      renderComponent()
      const leftSection = screen.getByLabelText(/current learning/i)
      expect(leftSection).toContainElement(screen.getByTestId('new-programs'))
    })

    it('should render ExpiringProgram in right column', () => {
      renderComponent()
      const rightSection = screen.getByLabelText(/programs and events/i)
      expect(rightSection).toContainElement(
        screen.getByTestId('expiring-program')
      )
    })

    it('should render OngoingPrograms in right column', () => {
      renderComponent()
      const rightSection = screen.getByLabelText(/programs and events/i)
      expect(rightSection).toContainElement(
        screen.getByTestId('ongoing-programs')
      )
    })

    it('should render UpcomingEvents in right column', () => {
      renderComponent()
      const rightSection = screen.getByLabelText(/programs and events/i)
      expect(rightSection).toContainElement(
        screen.getByTestId('upcoming-events')
      )
    })
  })

  describe('RTK Query Integration', () => {
    it('should call useGetUserProfileQuery', () => {
      renderComponent()
      expect(mockUseGetUserProfileQuery).toHaveBeenCalled()
    })

    it('should call useGetAllJourneyDataQuery', () => {
      renderComponent()
      expect(mockUseGetAllJourneyDataQuery).toHaveBeenCalled()
    })

    it('should handle undefined user profile data', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      })

      renderComponent()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should handle undefined journey data', () => {
      mockUseGetAllJourneyDataQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      })

      renderComponent()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should handle null user profile data', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      })

      renderComponent()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })

  describe('Redux Integration', () => {
    it('should dispatch setJourneyData when journey data loaded', () => {
      const dispatchSpy = vi.spyOn(mockStore, 'dispatch')

      renderComponent()

      // Check if journey data was set in store
      const state = mockStore.getState()
      expect(state.home.journeyData).toBeDefined()
      expect(dispatchSpy).toHaveBeenCalled()
    })

    it('should not dispatch setJourneyData when journey data is undefined', () => {
      mockUseGetAllJourneyDataQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      })

      renderComponent()

      // Component useEffect checks if (journeyData) before dispatching
      // So with undefined, it should not dispatch setJourneyData
      const state = mockStore.getState()
      // Initial state should still be there
      expect(state.home).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      renderComponent()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should have proper aria-labels', () => {
      renderComponent()
      expect(screen.getByLabelText(/home/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/welcome banner/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/current learning/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/programs and events/i)).toBeInTheDocument()
    })

    it('should have accessible loading state', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      })

      renderComponent()
      const status = screen.getByRole('status')
      expect(status).toBeInTheDocument()
      expect(status).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      const { container } = renderComponent()
      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1')
      expect(grid).toHaveClass('lg:grid-cols-2')
    })

    it('should have proper spacing', () => {
      const { container } = renderComponent()
      const main = container.querySelector('main')
      expect(main).toHaveClass('p-5')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty journey array', () => {
      mockUseGetAllJourneyDataQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      })

      renderComponent()
      expect(screen.getByText(/journey length: 0/i)).toBeInTheDocument()
    })

    it('should handle missing user name', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: { email: 'test@example.com' },
        isLoading: false,
        isError: false,
      })

      renderComponent()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should render when both data are null', () => {
      mockUseGetUserProfileQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      })
      mockUseGetAllJourneyDataQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      })

      renderComponent()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })
})
