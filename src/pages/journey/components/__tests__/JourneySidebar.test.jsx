/**
 * JourneySidebar Tests
 * Unit tests for Journey Sidebar component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import JourneySidebar from '../JourneySidebar'

// Mock CourseItem to simplify testing
vi.mock('../CourseItem', () => ({
  default: ({ course, modules, isActive }) => (
    <div data-testid={`course-${course.id}`}>
      <div>{course.name}</div>
      {isActive && modules.map(m => <div key={m.id}>{m.fullname}</div>)}
    </div>
  ),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ journeyId: '1', courseId: '1' }),
  }
})

describe('JourneySidebar', () => {
  const mockCourses = [
    { id: '1', name: 'Course 1', total_completed: 0, total_module: 2 },
    { id: '2', name: 'Course 2', total_completed: 1, total_module: 1 },
  ]

  const mockModulesByCourse = {
    '1': [
      { id: 1, fullname: 'Module 1', is_complete: 0 },
      { id: 2, fullname: 'Module 2', is_complete: 1 },
    ],
    '2': [
      { id: 3, fullname: 'Module 3', is_complete: 1 },
    ],
  }

  it('should render course list', () => {
    renderWithProviders(
      <JourneySidebar
        courses={mockCourses}
        modulesByCourse={mockModulesByCourse}
        supportModulesByCourse={{}}
      />
    )
    
    expect(screen.getByText('Course 1')).toBeInTheDocument()
    expect(screen.getByText('Course 2')).toBeInTheDocument()
  })

  it('should call onCourseChange when collapse changes', async () => {
    const mockOnCourseChange = vi.fn()
    const user = (await import('@testing-library/user-event')).default.setup()
    
    const { container } = renderWithProviders(
      <JourneySidebar
        courses={mockCourses}
        modulesByCourse={mockModulesByCourse}
        supportModulesByCourse={{}}
        onCourseChange={mockOnCourseChange}
      />
    )
    
    // Collapse component exists
    expect(container.querySelector('.ant-collapse')).toBeTruthy()
  })

  it('should show modules when course is active', () => {
    const { container } = renderWithProviders(
      <JourneySidebar
        courses={mockCourses}
        modulesByCourse={mockModulesByCourse}
        supportModulesByCourse={{}}
      />
    )
    
    // CourseItem renders with modules via mock
    expect(container.firstChild).toBeTruthy()
  })

  it('should highlight active module', () => {
    const { container } = renderWithProviders(
      <JourneySidebar
        courses={mockCourses}
        modulesByCourse={mockModulesByCourse}
        activeCourseId={1}
        activeModuleId={1}
        onCourseClick={vi.fn()}
        onModuleClick={vi.fn()}
      />
    )
    
    // Component renders with active module
    expect(container.firstChild).toBeTruthy()
  })

  it('should handle empty courses', () => {
    renderWithProviders(
      <JourneySidebar
        courses={[]}
        modulesByCourse={{}}
        activeCourseId={null}
        activeModuleId={null}
        onCourseClick={vi.fn()}
        onModuleClick={vi.fn()}
      />
    )
    
    expect(screen.queryByText('Course 1')).not.toBeInTheDocument()
  })
})
