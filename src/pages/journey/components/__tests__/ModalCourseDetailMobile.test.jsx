/**
 * ModalCourseDetailMobile Tests
 * Unit tests for Mobile Course Detail Modal component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import ModalCourseDetailMobile from '../modals/ModalCourseDetailMobile'

vi.mock('@/utils/journeyHelpers', () => ({
  calculateProgress: vi.fn(() => 50),
  getProgressColor: vi.fn(() => '#1890ff'),
}))

describe('ModalCourseDetailMobile', () => {
  const mockCourse = {
    id: 1,
    name: 'Test Course',
    description: 'Test Course Description',
    total_module: 10,
    total_completed: 5,
  }

  const mockOnClose = vi.fn()

  it('should render when open', () => {
    renderWithProviders(
      <ModalCourseDetailMobile
        open={true}
        onClose={mockOnClose}
        course={mockCourse}
        journeyId="1"
        courseId="1"
      />
    )
    
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    renderWithProviders(
      <ModalCourseDetailMobile
        open={false}
        onClose={mockOnClose}
        course={mockCourse}
        journeyId="1"
        courseId="1"
      />
    )
    
    expect(screen.queryByText('Test Course')).not.toBeInTheDocument()
  })

  it('should display course description', () => {
    renderWithProviders(
      <ModalCourseDetailMobile
        open={true}
        onClose={mockOnClose}
        course={mockCourse}
        journeyId="1"
        courseId="1"
      />
    )
    
    expect(document.body.textContent).toContain('Test Course Description')
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <ModalCourseDetailMobile
        open={true}
        onClose={mockOnClose}
        course={mockCourse}
        journeyId="1"
        courseId="1"
      />
    )
    
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0]) // Close button is first
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should be drawer on mobile', () => {
    renderWithProviders(
      <ModalCourseDetailMobile
        open={true}
        onClose={mockOnClose}
        course={mockCourse}
        journeyId="1"
        courseId="1"
      />
    )
    
    const drawer = document.querySelector('.ant-drawer')
    expect(drawer).toBeTruthy()
  })
})
