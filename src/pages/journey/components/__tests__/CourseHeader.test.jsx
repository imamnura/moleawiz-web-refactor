/**
 * CourseHeader Tests
 * Unit tests for Course Header component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import CourseHeader from '../CourseHeader'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('CourseHeader', () => {
  const mockCourse = {
    id: 1,
    name: 'Test Course',
    thumbnail: 'https://example.com/course.jpg',
  }

  it('should render course name', () => {
    renderWithProviders(
      <CourseHeader
        course={mockCourse}
        courseIndex={0}
        journeyId="1"
        isMobile={false}
      />
    )
    
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })

  it('should display course index', () => {
    renderWithProviders(
      <CourseHeader
        course={mockCourse}
        courseIndex={2}
        journeyId="1"
        isMobile={false}
      />
    )
    
    expect(screen.getByText(/3/)).toBeInTheDocument() // courseIndex + 1
  })

  it('should render course thumbnail', () => {
    const { container } = renderWithProviders(
      <CourseHeader
        course={mockCourse}
        courseIndex={0}
        journeyId="1"
        isMobile={false}
      />
    )
    
    const image = container.querySelector('img')
    expect(image).toBeTruthy()
  })

  it('should render in mobile view', () => {
    renderWithProviders(
      <CourseHeader
        course={mockCourse}
        courseIndex={0}
        journeyId="1"
        isMobile={true}
      />
    )
    
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })

  it('should link back to journey detail', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <CourseHeader
        course={mockCourse}
        courseIndex={0}
        journeyId="1"
        isMobile={false}
      />
    )
    
    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/journey/1')
  })
})
