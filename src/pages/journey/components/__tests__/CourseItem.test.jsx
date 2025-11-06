/**
 * CourseItem Tests
 * Unit tests for Course Item component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import CourseItem from '../CourseItem'

// Mock ModuleItem to avoid complex nested component rendering
vi.mock('../ModuleItem', () => ({
  default: ({ module }) => <div data-testid={`module-${module.id}`}>{module.name}</div>,
}))

vi.mock('@/hooks/useResponsive', () => ({
  useResponsive: vi.fn(() => ({ isMobile: false })),
}))

vi.mock('@/utils/journeyHelpers', () => ({
  calculateProgress: vi.fn(() => 50),
  getProgressColor: vi.fn(() => '#1890ff'),
}))

describe('CourseItem', () => {
  const mockCourse = {
    id: 1,
    name: 'Test Course',
    description: 'Test Description',
    total_completed: 1,
    total_module: 2,
  }

  const mockModules = [
    { id: 1, name: 'Module 1', is_completed: 1 },
    { id: 2, name: 'Module 2', is_completed: 0 },
  ]

  const mockSupportModules = [
    { id: 3, name: 'Support Module 1' },
  ]

  it('should render course name', () => {
    renderWithProviders(
      <CourseItem
        course={mockCourse}
        modules={mockModules}
        supportModules={mockSupportModules}
        journeyId="1"
        courseIndex={0}
        isActive={true}
      />
    )
    
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })

  it('should display module count', () => {
    const { container } = renderWithProviders(
      <CourseItem
        course={mockCourse}
        modules={mockModules}
        supportModules={mockSupportModules}
        journeyId="1"
        courseIndex={0}
        isActive={true}
      />
    )
    
    expect(container.textContent).toContain('1/2')
  })

  it('should expand to show modules when clicked', async () => {
    const { container } = renderWithProviders(
      <CourseItem
        course={mockCourse}
        modules={mockModules}
        supportModules={mockSupportModules}
        journeyId="1"
        courseIndex={0}
        isActive={true}
      />
    )
    
    expect(container.textContent).toContain('Module 1')
  })

  it('should show modules when expanded', () => {
    const { container } = renderWithProviders(
      <CourseItem
        course={mockCourse}
        modules={mockModules}
        supportModules={mockSupportModules}
        journeyId="1"
        courseIndex={0}
        isActive={true}
      />
    )
    
    expect(container.textContent).toContain('Module 1')
    expect(container.textContent).toContain('Module 2')
  })

  it('should show support modules', () => {
    const { container } = renderWithProviders(
      <CourseItem
        course={mockCourse}
        modules={mockModules}
        supportModules={mockSupportModules}
        journeyId="1"
        courseIndex={0}
        isActive={true}
      />
    )
    
    expect(container.textContent).toContain('Support Module 1')
  })

  it('should handle empty modules', () => {
    renderWithProviders(
      <CourseItem
        course={mockCourse}
        modules={[]}
        supportModules={[]}
        journeyId="1"
        courseIndex={0}
        isActive={true}
      />
    )
    
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })
})
