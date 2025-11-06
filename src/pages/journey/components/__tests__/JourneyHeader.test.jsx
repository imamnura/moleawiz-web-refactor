/**
 * JourneyHeader Tests
 * Unit tests for Journey Header component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import JourneyHeader from '../JourneyHeader'

vi.mock('@/hooks/useResponsive', () => ({
  useResponsive: vi.fn(() => ({ isMobile: false })),
}))

vi.mock('@/utils/journeyHelpers', () => ({
  formatDaysLeft: vi.fn((days) => {
    if (days === 'overdue') return 'Overdue'
    return `${days} days left`
  }),
}))

describe('JourneyHeader', () => {
  const mockJourney = {
    id: 1,
    name: 'Test Journey',
    thumbnail: 'https://example.com/image.jpg',
  }

  it('should render journey name', () => {
    renderWithProviders(
      <JourneyHeader journey={mockJourney} daysLeft={null} isCompleted={false} />
    )
    
    expect(screen.getByText('Test Journey')).toBeInTheDocument()
  })

  it('should display deadline badge when days left is provided', () => {
    const { container } = renderWithProviders(
      <JourneyHeader journey={mockJourney} daysLeft={5} isCompleted={false} />
    )
    
    // Case insensitive check
    expect(container.textContent.toLowerCase()).toContain('5 days left')
  })

  it('should not show deadline badge when journey is completed', () => {
    const { container } = renderWithProviders(
      <JourneyHeader journey={mockJourney} daysLeft={5} isCompleted={true} />
    )
    
    expect(container.textContent).not.toContain('5 days left')
  })

  it('should show overdue badge', () => {
    const { container } = renderWithProviders(
      <JourneyHeader journey={mockJourney} daysLeft="overdue" isCompleted={false} />
    )
    
    expect(container.textContent).toContain('Overdue')
  })

  it('should render thumbnail image', () => {
    const { container } = renderWithProviders(
      <JourneyHeader journey={mockJourney} daysLeft={null} isCompleted={false} />
    )
    
    const image = container.querySelector('img')
    expect(image).toBeTruthy()
  })

  it('should render in mobile view', async () => {
    const { useResponsive } = await import('@/hooks/useResponsive')
    useResponsive.mockReturnValue({ isMobile: true })
    
    renderWithProviders(
      <JourneyHeader journey={mockJourney} daysLeft={null} isCompleted={false} isMobile={true} />
    )
    
    expect(screen.getByText('Test Journey')).toBeInTheDocument()
  })
})
