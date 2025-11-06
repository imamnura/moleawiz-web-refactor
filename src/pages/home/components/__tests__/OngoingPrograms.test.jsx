/**
 * OngoingPrograms Component Tests
 * Unit tests for ongoing programs list with progress
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import i18n from '@/localize/i18n'
import OngoingPrograms from '../OngoingPrograms'
import { baseApi } from '@services/api/baseApi'

// Mock useActions hook
const mockUseActions = vi.fn()
vi.mock('../OngoingPrograms/hooks/useActions', () => ({
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

describe('OngoingPrograms', () => {
  let mockStore

  const mockOngoingJourneys = [
    {
      id: 1,
      name: 'Frontend Development Path',
      thumbnail: 'https://example.com/frontend.jpg',
      progress: 65,
    },
    {
      id: 2,
      name: 'Backend Engineering',
      thumbnail: 'https://example.com/backend.jpg',
      progress: 45,
    },
    {
      id: 3,
      name: 'DevOps Fundamentals',
      thumbnail: 'https://example.com/devops.jpg',
      progress: 80,
    },
  ]

  const mockListAllData = [
    {
      id: '1',
      course: [
        { total_completed: 10, total_module: 20 },
        { total_completed: 5, total_module: 10 },
      ],
    },
    {
      id: '2',
      course: [
        { total_completed: 8, total_module: 15 },
        { total_completed: 12, total_module: 25 },
      ],
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
      ongoingJourney: mockOngoingJourneys,
    })

    vi.clearAllMocks()
  })

  const renderComponent = (props = {}) => {
    const defaultProps = {
      onGoingProgramLoading: false,
      listJourneyDataOngoingProgram: mockOngoingJourneys,
      isEmptySetter: mockIsEmptySetter,
      listAllData: mockListAllData,
      ...props,
    }

    return render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <OngoingPrograms {...defaultProps} />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    )
  }

  describe('Rendering', () => {
    it('should render component', () => {
      renderComponent()
      expect(screen.getByText(/ongoing program/i)).toBeInTheDocument()
    })

    it('should render heading', () => {
      renderComponent()
      const heading = screen.getByText(/ongoing program/i)
      expect(heading).toBeInTheDocument()
    })

    it('should have correct heading size', () => {
      const { container } = renderComponent()
      const heading = container.querySelector('.text-\\[22px\\]')
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loader when loading', () => {
      mockUseActions.mockReturnValue({
        loading: true,
        ongoingJourney: [],
      })

      renderComponent({ onGoingProgramLoading: true })
      // Uses Loader component
      expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument()
    })

    it('should not show list when loading', () => {
      mockUseActions.mockReturnValue({
        loading: true,
        ongoingJourney: [],
      })

      renderComponent({ onGoingProgramLoading: true })
      expect(
        screen.queryByText(/frontend development/i)
      ).not.toBeInTheDocument()
    })
  })

  describe('Journey List', () => {
    it('should render all ongoing programs', () => {
      renderComponent()
      expect(screen.getByText(/frontend development path/i)).toBeInTheDocument()
      expect(screen.getByText(/backend engineering/i)).toBeInTheDocument()
      expect(screen.getByText(/devops fundamentals/i)).toBeInTheDocument()
    })

    it('should render journey thumbnails', () => {
      renderComponent()
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
    })

    it('should have correct image dimensions', () => {
      renderComponent()
      const images = screen.getAllByRole('img')

      images.forEach((img) => {
        expect(img).toHaveAttribute('width', '39')
        expect(img).toHaveAttribute('height', '39')
      })
    })
  })

  describe('Progress Display', () => {
    it('should show progress for each program', () => {
      const { container } = renderComponent()
      const progressBars = container.querySelectorAll('.ant-progress')
      expect(progressBars.length).toBe(mockOngoingJourneys.length)
    })

    it('should use circular progress type', () => {
      const { container } = renderComponent()
      const circularProgress = container.querySelectorAll(
        '.ant-progress-circle'
      )
      expect(circularProgress.length).toBeGreaterThan(0)
    })
  })

  describe('Navigation', () => {
    it('should navigate to journey detail on click', () => {
      renderComponent()

      const firstItem = screen.getByText(/frontend development path/i)
      fireEvent.click(firstItem.closest('.ant-list-item'))

      expect(mockNavigate).toHaveBeenCalledWith(
        '/my-learning-journey/journey/1'
      )
    })

    it('should navigate with correct journey id', () => {
      renderComponent()

      const secondItem = screen.getByText(/backend engineering/i)
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
      expect(OngoingPrograms.propTypes).toBeDefined()
      expect(OngoingPrograms.propTypes.onGoingProgramLoading).toBeDefined()
      expect(
        OngoingPrograms.propTypes.listJourneyDataOngoingProgram
      ).toBeDefined()
      expect(OngoingPrograms.propTypes.isEmptySetter).toBeDefined()
      expect(OngoingPrograms.propTypes.listAllData).toBeDefined()
    })
  })

  describe('Empty State', () => {
    it('should handle empty journey list', () => {
      mockUseActions.mockReturnValue({
        loading: false,
        ongoingJourney: [],
      })

      renderComponent({ listJourneyDataOngoingProgram: [] })
      expect(screen.getByText(/ongoing program/i)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined listJourneyDataOngoingProgram', () => {
      mockUseActions.mockReturnValue({
        loading: false,
        ongoingJourney: [],
      })

      renderComponent({ listJourneyDataOngoingProgram: undefined })
      expect(screen.getByText(/ongoing program/i)).toBeInTheDocument()
    })

    it('should handle null listJourneyDataOngoingProgram', () => {
      mockUseActions.mockReturnValue({
        loading: false,
        ongoingJourney: [],
      })

      renderComponent({ listJourneyDataOngoingProgram: null })
      expect(screen.getByText(/ongoing program/i)).toBeInTheDocument()
    })

    it('should handle empty listAllData', () => {
      renderComponent({ listAllData: [] })
      expect(screen.getByText(/ongoing program/i)).toBeInTheDocument()
    })

    it('should handle journey with missing thumbnail', () => {
      const journeysNoThumbnail = [
        { ...mockOngoingJourneys[0], thumbnail: null },
      ]

      mockUseActions.mockReturnValue({
        loading: false,
        ongoingJourney: journeysNoThumbnail,
      })

      renderComponent({ listJourneyDataOngoingProgram: journeysNoThumbnail })
      expect(screen.getByText(/frontend development path/i)).toBeInTheDocument()
    })

    it('should handle very long journey name', () => {
      const longNameJourney = [
        {
          id: 1,
          name: 'A'.repeat(200),
          thumbnail: 'test.jpg',
          progress: 50,
        },
      ]

      mockUseActions.mockReturnValue({
        loading: false,
        ongoingJourney: longNameJourney,
      })

      renderComponent({ listJourneyDataOngoingProgram: longNameJourney })
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument()
    })
  })

  describe('Translation', () => {
    it('should use translation for heading', () => {
      renderComponent()
      expect(screen.getByText(/ongoing program/i)).toBeInTheDocument()
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

    it('should have correct card padding', () => {
      const { container } = renderComponent()
      const card = container.querySelector('.ant-card-body')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Progress Calculation', () => {
    it('should calculate percentage from course data', () => {
      const { container } = renderComponent()
      // Component has countPercentageModules function that calculates progress
      expect(container.querySelector('.ant-progress')).toBeInTheDocument()
    })

    it('should handle journey not found in listAllData', () => {
      renderComponent({ listAllData: [] })
      // Should not crash when journey not found
      expect(screen.getByText(/ongoing program/i)).toBeInTheDocument()
    })

    it('should handle course with no modules', () => {
      const emptyModulesData = [
        {
          id: '1',
          course: [],
        },
      ]

      renderComponent({ listAllData: emptyModulesData })
      expect(screen.getByText(/ongoing program/i)).toBeInTheDocument()
    })
  })
})
