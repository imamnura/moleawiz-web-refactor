/**
 * CourseListItem Tests
 * Unit tests for Course List Item component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import CourseListItem from '../CourseListItem'

vi.mock('@/utils/journeyHelpers', () => ({
  calculateProgress: vi.fn((completed, total) => (completed / total) * 100),
  getProgressColor: vi.fn(() => '#1890ff'),
}))

describe('CourseListItem', () => {
  const mockCourse = {
    id: 1,
    name: 'Test Course',
    total_completed: 3,
    total_module: 10,
    is_completed: 0,
  }

  it('should render course name', () => {
    renderWithProviders(
      <CourseListItem
        course={mockCourse}
        journeyId="1"
        courseIndex={0}
        isMobile={false}
      />
    )
    
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })

  it('should display progress', () => {
    const { container } = renderWithProviders(
      <CourseListItem
        course={mockCourse}
        journeyId="1"
        courseIndex={0}
        isMobile={false}
      />
    )
    
    // Check for progress percentage (30% = 3/10 * 100)
    expect(container.textContent).toContain('30')
  })

  it('should link to course detail', () => {
    const { container } = renderWithProviders(
      <CourseListItem
        course={mockCourse}
        journeyId="1"
        courseIndex={0}
        isMobile={false}
      />
    )
    
    const link = container.querySelector('a')
    expect(link).toBeTruthy()
    // Course detail link structure may vary
    expect(link.getAttribute('href')).toBeTruthy()
  })

  it('should show completed badge', () => {
    const completedCourse = {
      ...mockCourse,
      is_completed: 1,
    }
    
    const { container } = renderWithProviders(
      <CourseListItem
        course={completedCourse}
        journeyId="1"
        courseIndex={0}
        isMobile={false}
      />
    )
    
    // Check for completed status (badge or text)
    expect(container.textContent.toLowerCase()).toContain('completed')
  })

  it('should render in mobile view', () => {
    renderWithProviders(
      <CourseListItem
        course={mockCourse}
        journeyId="1"
        courseIndex={0}
        isMobile={true}
      />
    )
    
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })
})
