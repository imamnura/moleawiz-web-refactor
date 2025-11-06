/**
 * JourneyCard Tests
 * Unit tests for Journey Card component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import JourneyCard from '../JourneyCard'

// Mock dependencies
vi.mock('@/hooks/useResponsive', () => ({
  useResponsive: vi.fn(() => ({ isMobile: false })),
}))

vi.mock('@/utils/journeyHelpers', () => ({
  calculateProgress: vi.fn((completed, total) => (completed / total) * 100),
  getButtonConfig: vi.fn(() => ({ text: 'Continue', variant: 'primary' })),
  formatDaysLeft: vi.fn((days) => `${days} days left`),
  formatCourseCount: vi.fn((count) => `${count} courses`),
  getProgressColor: vi.fn(() => null),
}))

describe('JourneyCard', () => {
  const mockJourney = {
    id: 1,
    name: 'Test Journey',
    description: 'Test Description',
    thumbnail: 'https://example.com/image.jpg',
    is_new: 0,
    is_completed: 0,
    module_completed: 3,
    total_module: 10,
    course: [{}, {}, {}],
  }

  it('should render journey card', () => {
    renderWithProviders(<JourneyCard journey={mockJourney} index={0} />)
    
    expect(screen.getByText('Test Journey')).toBeInTheDocument()
  })

  it('should display progress information', () => {
    const { container } = renderWithProviders(<JourneyCard journey={mockJourney} index={0} />)
    
    // Check that progress percentage is displayed (30% = 3/10 * 100)
    const progressText = container.textContent
    expect(progressText).toContain('30')
    expect(progressText).toContain('completed')
  })

  it('should show deadline badge when days_left exists', () => {
    const journeyWithDeadline = {
      ...mockJourney,
      days_left: 5,
    }
    
    const { container } = renderWithProviders(<JourneyCard journey={journeyWithDeadline} index={0} />)
    
    // Check for formatted days left text
    expect(container.textContent).toContain('5 days left')
  })

  it('should show new badge when badge_new is true', () => {
    const newJourney = {
      ...mockJourney,
      badge_new: true,
    }
    
    renderWithProviders(<JourneyCard journey={newJourney} index={0} />)
    
    expect(screen.getByText(/new/i)).toBeInTheDocument()
  })

  it('should render in mobile view', async () => {
    const { useResponsive } = await import('@/hooks/useResponsive')
    useResponsive.mockReturnValue({ isMobile: true })
    
    renderWithProviders(<JourneyCard journey={mockJourney} index={0} />)
    
    expect(screen.getByText('Test Journey')).toBeInTheDocument()
  })

  it('should link to journey detail page', () => {
    const { container } = renderWithProviders(
      <JourneyCard journey={mockJourney} index={0} />
    )
    
    const link = container.querySelector(`a[href*="/my-learning-journey/journey/${mockJourney.id}"]`)
    expect(link).toBeTruthy()
  })
})
