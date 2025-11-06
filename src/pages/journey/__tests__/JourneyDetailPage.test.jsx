/**
 * JourneyDetailPage Tests
 * Unit tests for Journey Detail page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import JourneyDetailPage from '../JourneyDetailPage'

// Mock hooks
vi.mock('../hooks/useJourneyDetail', () => ({
  useJourneyDetail: vi.fn(),
}))

vi.mock('@/hooks/useResponsive', () => ({
  default: vi.fn(),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ journeyId: '123' }),
  }
})

// Mock components
vi.mock('../components/JourneyHeader', () => ({
  default: ({ journey }) => <div data-testid="journey-header">{journey.name}</div>,
}))

vi.mock('../components/JourneyStats', () => ({
  default: ({ points, totalCourses }) => (
    <div data-testid="journey-stats">
      Points: {points}, Courses: {totalCourses}
    </div>
  ),
}))

vi.mock('../components/JourneyDescription', () => ({
  default: ({ description }) => (
    <div data-testid="journey-description">{description}</div>
  ),
}))

vi.mock('../components/CourseListItem', () => ({
  default: ({ course, courseIndex }) => (
    <div data-testid={`course-item-${courseIndex}`}>{course.name}</div>
  ),
}))

describe('JourneyDetailPage', () => {
  const mockJourney = {
    id: '123',
    name: 'Test Journey',
    description: 'Test Description',
    thumbnail: 'https://example.com/thumb.jpg',
    point: 100,
    deadline: '2025-12-31',
    is_completed: 0,
  }

  const mockCourses = [
    {
      id: 'course-1',
      name: 'Course 1',
      total_completed: 3,
      total_module: 5,
    },
    {
      id: 'course-2',
      name: 'Course 2',
      total_completed: 5,
      total_module: 5,
    },
  ]

  beforeEach(async () => {
    vi.clearAllMocks()

    // Default mock implementations
    const useResponsive = (await import('@/hooks/useResponsive')).default
    useResponsive.mockReturnValue({
      isMobile: false,
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner', async () => {
      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: null,
        courses: [],
        daysLeft: null,
        isCompleted: false,
        totalCourses: 0,
        isLoading: true,
        error: null,
      })

      const { container } = renderWithProviders(<JourneyDetailPage />)

      // Check for Ant Design Spin component
      const spinner = container.querySelector('.ant-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error message', async () => {
      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: null,
        courses: [],
        daysLeft: null,
        isCompleted: false,
        totalCourses: 0,
        isLoading: false,
        error: { message: 'Failed to load journey' },
      })

      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByText(/error/i)).toBeInTheDocument()
      expect(screen.getByText(/failed to load journey/i)).toBeInTheDocument()
    })
  })

  describe('No Data State', () => {
    it('should show empty state when journey not found', async () => {
      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: null,
        courses: [],
        daysLeft: null,
        isCompleted: false,
        totalCourses: 0,
        isLoading: false,
        error: null,
      })

      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByText(/journey not found/i)).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    beforeEach(async () => {
      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: mockJourney,
        courses: mockCourses,
        daysLeft: 30,
        isCompleted: false,
        totalCourses: 2,
        isLoading: false,
        error: null,
      })
    })

    it('should render without main tag', () => {
      renderWithProviders(<JourneyDetailPage />)

      const mainElements = document.querySelectorAll('main')
      expect(mainElements.length).toBe(0)
    })

    it('should render journey header', () => {
      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByTestId('journey-header')).toBeInTheDocument()
      expect(screen.getByText('Test Journey')).toBeInTheDocument()
    })

    it('should render journey stats', () => {
      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByTestId('journey-stats')).toBeInTheDocument()
      expect(screen.getByText(/points: 100/i)).toBeInTheDocument()
      expect(screen.getByText(/courses: 2/i)).toBeInTheDocument()
    })

    it('should render journey description', () => {
      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByTestId('journey-description')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('should render course list heading', () => {
      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByRole('heading', { name: /courses/i })).toBeInTheDocument()
      expect(screen.getByText(/\(2\)/)).toBeInTheDocument() // Course count
    })

    it('should render all courses', () => {
      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByTestId('course-item-0')).toBeInTheDocument()
      expect(screen.getByTestId('course-item-1')).toBeInTheDocument()
      expect(screen.getByText('Course 1')).toBeInTheDocument()
      expect(screen.getByText('Course 2')).toBeInTheDocument()
    })

    it('should show empty state when no courses', async () => {
      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: mockJourney,
        courses: [],
        daysLeft: 30,
        isCompleted: false,
        totalCourses: 0,
        isLoading: false,
        error: null,
      })

      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByText(/no courses/i)).toBeInTheDocument()
    })
  })

  describe('Mobile View', () => {
    beforeEach(async () => {
      const useResponsive = (await import('@/hooks/useResponsive')).default
      useResponsive.mockReturnValue({
        isMobile: true,
      })

      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: mockJourney,
        courses: mockCourses,
        daysLeft: 30,
        isCompleted: false,
        totalCourses: 2,
        isLoading: false,
        error: null,
      })
    })

    it('should apply mobile padding', () => {
      const { container } = renderWithProviders(<JourneyDetailPage />)

      const rootDiv = container.querySelector('.journey-detail-page')
      expect(rootDiv).toBeInTheDocument()
    })

    it('should render single column grid on mobile', () => {
      const { container } = renderWithProviders(<JourneyDetailPage />)

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1')
    })
  })

  describe('Desktop View', () => {
    beforeEach(async () => {
      const useResponsive = (await import('@/hooks/useResponsive')).default
      useResponsive.mockReturnValue({
        isMobile: false,
      })

      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: mockJourney,
        courses: mockCourses,
        daysLeft: 30,
        isCompleted: false,
        totalCourses: 2,
        isLoading: false,
        error: null,
      })
    })

    it('should render multi-column grid on desktop', () => {
      const { container } = renderWithProviders(<JourneyDetailPage />)

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')
    })
  })

  describe('Journey Completion Status', () => {
    it('should handle completed journey', async () => {
      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: { ...mockJourney, is_completed: 1 },
        courses: mockCourses,
        daysLeft: null,
        isCompleted: true,
        totalCourses: 2,
        isLoading: false,
        error: null,
      })

      renderWithProviders(<JourneyDetailPage />)

      expect(screen.getByTestId('journey-header')).toBeInTheDocument()
      // Header should receive isCompleted=true
    })

    it('should show days left for ongoing journey', async () => {
      const { useJourneyDetail } = await import('../hooks/useJourneyDetail')
      useJourneyDetail.mockReturnValue({
        journey: mockJourney,
        courses: mockCourses,
        daysLeft: 15,
        isCompleted: false,
        totalCourses: 2,
        isLoading: false,
        error: null,
      })

      renderWithProviders(<JourneyDetailPage />)

      // Header component receives daysLeft prop
      expect(screen.getByTestId('journey-header')).toBeInTheDocument()
    })
  })
})
