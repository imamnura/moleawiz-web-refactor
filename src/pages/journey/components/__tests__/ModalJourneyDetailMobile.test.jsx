/**
 * ModalJourneyDetailMobile Tests
 * Unit tests for Mobile Journey Detail Modal component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import ModalJourneyDetailMobile from '../modals/ModalJourneyDetailMobile'

vi.mock('@/utils/journeyHelpers', () => ({
  formatDaysLeft: vi.fn((days) => `${days} days left`),
  calculateProgress: vi.fn(() => 50),
}))

describe('ModalJourneyDetailMobile', () => {
  const mockJourney = {
    id: 1,
    name: 'Test Journey',
    description: 'Test Description',
    points: 100,
    total_module: 10,
    module_completed: 5,
  }

  const mockOnClose = vi.fn()

  it('should render when open', () => {
    renderWithProviders(
      <ModalJourneyDetailMobile
        open={true}
        onClose={mockOnClose}
        journey={mockJourney}
        journeyId="1"
      />
    )
    
    expect(screen.getByText('Test Journey')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    renderWithProviders(
      <ModalJourneyDetailMobile
        open={false}
        onClose={mockOnClose}
        journey={mockJourney}
        journeyId="1"
      />
    )
    
    expect(screen.queryByText('Test Journey')).not.toBeInTheDocument()
  })

  it('should display journey description', () => {
    renderWithProviders(
      <ModalJourneyDetailMobile
        open={true}
        onClose={mockOnClose}
        journey={mockJourney}
        journeyId="1"
      />
    )
    
    // Description is rendered in the drawer body
    expect(document.body.textContent).toContain('Test Description')
  })

  it('should display module stats', () => {
    renderWithProviders(
      <ModalJourneyDetailMobile
        open={true}
        onClose={mockOnClose}
        journey={mockJourney}
        journeyId="1"
      />
    )
    
    // Check for module count
    expect(document.body.textContent).toContain('10')
    expect(document.body.textContent).toContain('5')
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <ModalJourneyDetailMobile
        open={true}
        onClose={mockOnClose}
        journey={mockJourney}
        journeyId="1"
      />
    )
    
    // Get the close button (first button, CloseOutlined icon)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should be drawer on mobile', () => {
    renderWithProviders(
      <ModalJourneyDetailMobile
        open={true}
        onClose={mockOnClose}
        journey={mockJourney}
        journeyId="1"
      />
    )
    
    // Drawer is rendered in document body, not in container
    const drawer = document.querySelector('.ant-drawer')
    expect(drawer).toBeTruthy()
  })
})
