/**
 * CourseDetailPage Tests
 * Unit tests for Course Detail page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import CourseDetailPage from '../CourseDetailPage'

// Mock hooks
vi.mock('../hooks/useCourseDetail', () => ({
  useCourseDetail: vi.fn(),
}))

vi.mock('@/hooks/useResponsive', () => ({
  default: vi.fn(),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ journeyId: '123', courseId: '456' }),
  }
})

// Mock components
vi.mock('../components/CourseHeader', () => ({
  default: ({ course }) => <div data-testid="course-header">{course.name}</div>,
}))

vi.mock('../components/CourseDescription', () => ({
  default: ({ description }) => (
    <div data-testid="course-description">{description}</div>
  ),
}))

vi.mock('../components/ModuleItem', () => ({
  default: ({ module }) => (
    <div data-testid={`module-${module.id}`}>{module.fullname}</div>
  ),
}))

describe('CourseDetailPage', () => {
  const mockCourse = {
    id: '456',
    name: 'Test Course',
    description: 'Test Course Description',
    thumbnail: 'https://example.com/course.jpg',
    sort: 1,
  }

  const mockModules = [
    {
      id: 'module-1',
      fullname: 'Module 1',
      is_complete: 0,
      isopen: 1,
    },
    {
      id: 'module-2',
      fullname: 'Module 2',
      is_complete: 1,
      isopen: 1,
    },
  ]

  const mockSupportModules = [
    {
      id: 'support-1',
      fullname: 'Support Module 1',
      is_complete: 0,
      isopen: 1,
    },
  ]

  beforeEach(async () => {
    vi.clearAllMocks()

    const useResponsive = (await import('@/hooks/useResponsive')).default
    useResponsive.mockReturnValue({
      isMobile: false,
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner', async () => {
      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: null,
        modules: [],
        supportModules: [],
        isLoading: true,
        error: null,
      })

      const { container } = renderWithProviders(<CourseDetailPage />)

      // Check for Ant Design Spin component
      const spinner = container.querySelector('.ant-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error message', async () => {
      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: null,
        modules: [],
        supportModules: [],
        isLoading: false,
        error: { message: 'Failed to load course' },
      })

      renderWithProviders(<CourseDetailPage />)

      expect(screen.getByText(/error/i)).toBeInTheDocument()
      expect(screen.getByText(/failed to load course/i)).toBeInTheDocument()
    })
  })

  describe('No Data State', () => {
    it('should show empty state when course not found', async () => {
      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: null,
        modules: [],
        supportModules: [],
        isLoading: false,
        error: null,
      })

      renderWithProviders(<CourseDetailPage />)

      expect(screen.getByText(/course not found/i)).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    beforeEach(async () => {
      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: mockCourse,
        modules: mockModules,
        supportModules: mockSupportModules,
        isLoading: false,
        error: null,
      })
    })

    it('should render without main tag', () => {
      renderWithProviders(<CourseDetailPage />)

      const mainElements = document.querySelectorAll('main')
      expect(mainElements.length).toBe(0)
    })

    it('should render course header', () => {
      renderWithProviders(<CourseDetailPage />)

      expect(screen.getByTestId('course-header')).toBeInTheDocument()
      expect(screen.getByText('Test Course')).toBeInTheDocument()
    })

    it('should render course description', () => {
      renderWithProviders(<CourseDetailPage />)

      expect(screen.getByTestId('course-description')).toBeInTheDocument()
      expect(screen.getByText('Test Course Description')).toBeInTheDocument()
    })

    it('should render essential modules heading', () => {
      renderWithProviders(<CourseDetailPage />)

      expect(
        screen.getByRole('heading', { name: /essential modules/i })
      ).toBeInTheDocument()
      expect(screen.getByText(/\(2\)/)).toBeInTheDocument() // Module count
    })

    it('should render all essential modules', () => {
      renderWithProviders(<CourseDetailPage />)

      expect(screen.getByTestId('module-module-1')).toBeInTheDocument()
      expect(screen.getByTestId('module-module-2')).toBeInTheDocument()
      expect(screen.getByText('Module 1')).toBeInTheDocument()
      expect(screen.getByText('Module 2')).toBeInTheDocument()
    })

    it('should render support modules section', () => {
      renderWithProviders(<CourseDetailPage />)

      expect(
        screen.getByRole('heading', { name: /supporting modules/i })
      ).toBeInTheDocument()
      expect(screen.getByTestId('module-support-1')).toBeInTheDocument()
      expect(screen.getByText('Support Module 1')).toBeInTheDocument()
    })

    it('should show divider after description', () => {
      const { container } = renderWithProviders(<CourseDetailPage />)

      const dividers = container.querySelectorAll('.ant-divider')
      expect(dividers.length).toBeGreaterThan(0)
    })

    it('should show empty state when no modules', async () => {
      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: mockCourse,
        modules: [],
        supportModules: [],
        isLoading: false,
        error: null,
      })

      renderWithProviders(<CourseDetailPage />)

      expect(screen.getByText(/no modules/i)).toBeInTheDocument()
    })
  })

  describe('Mobile View', () => {
    beforeEach(async () => {
      const useResponsive = (await import('@/hooks/useResponsive')).default
      useResponsive.mockReturnValue({
        isMobile: true,
      })

      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: mockCourse,
        modules: mockModules,
        supportModules: mockSupportModules,
        isLoading: false,
        error: null,
      })
    })

    it('should apply mobile padding', () => {
      const { container } = renderWithProviders(<CourseDetailPage />)

      const moduleList = container.querySelector('.px-4')
      expect(moduleList).toBeInTheDocument()
    })

    it('should render smaller heading on mobile', () => {
      const { container } = renderWithProviders(<CourseDetailPage />)

      const heading = screen.getByRole('heading', { name: /essential modules/i })
      expect(heading).toHaveClass('text-base')
    })
  })

  describe('Desktop View', () => {
    beforeEach(async () => {
      const useResponsive = (await import('@/hooks/useResponsive')).default
      useResponsive.mockReturnValue({
        isMobile: false,
      })

      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: mockCourse,
        modules: mockModules,
        supportModules: [],
        isLoading: false,
        error: null,
      })
    })

    it('should apply desktop padding', () => {
      const { container } = renderWithProviders(<CourseDetailPage />)

      const moduleList = container.querySelector('.px-6')
      expect(moduleList).toBeInTheDocument()
    })

    it('should render larger heading on desktop', () => {
      const { container } = renderWithProviders(<CourseDetailPage />)

      const heading = screen.getByRole('heading', { name: /essential modules/i })
      expect(heading).toHaveClass('text-lg')
    })
  })

  describe('Module Organization', () => {
    it('should separate essential and support modules', async () => {
      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: mockCourse,
        modules: mockModules,
        supportModules: mockSupportModules,
        isLoading: false,
        error: null,
      })

      renderWithProviders(<CourseDetailPage />)

      // Both sections should exist
      expect(screen.getByRole('heading', { name: /essential/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /supporting/i })).toBeInTheDocument()

      // Module counts should be correct
      expect(screen.getByText(/\(2\)/)).toBeInTheDocument() // Essential
      expect(screen.getByText(/\(1\)/)).toBeInTheDocument() // Supporting
    })

    it('should not show support modules section when empty', async () => {
      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: mockCourse,
        modules: mockModules,
        supportModules: [],
        isLoading: false,
        error: null,
      })

      renderWithProviders(<CourseDetailPage />)

      expect(
        screen.queryByRole('heading', { name: /supporting/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Course without Description', () => {
    it('should not render description section', async () => {
      const { useCourseDetail } = await import('../hooks/useCourseDetail')
      useCourseDetail.mockReturnValue({
        course: { ...mockCourse, description: null },
        modules: mockModules,
        supportModules: [],
        isLoading: false,
        error: null,
      })

      renderWithProviders(<CourseDetailPage />)

      expect(screen.queryByTestId('course-description')).not.toBeInTheDocument()
    })
  })
})
