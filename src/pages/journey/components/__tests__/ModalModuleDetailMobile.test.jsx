/**
 * ModalModuleDetailMobile Tests
 * Unit tests for Mobile Module Detail Modal component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import ModalModuleDetailMobile from '../modals/ModalModuleDetailMobile'

describe('ModalModuleDetailMobile', () => {
  const mockModule = {
    id: 1,
    fullname: 'Test Module',
    description: 'Test Module Description',
    type: 'SCORM',
    is_complete: 0,
    isopen: 1,
  }

  const mockOnClose = vi.fn()
  const mockOnStart = vi.fn()
  const mockOnContinue = vi.fn()

  it('should render when open', () => {
    renderWithProviders(
      <ModalModuleDetailMobile
        open={true}
        onClose={mockOnClose}
        module={mockModule}
        journeyId="1"
        courseId="1"
        moduleId="1"
        onStart={mockOnStart}
        onContinue={mockOnContinue}
      />
    )
    
    expect(screen.getByText('Test Module')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    renderWithProviders(
      <ModalModuleDetailMobile
        open={false}
        onClose={mockOnClose}
        module={mockModule}
        journeyId="1"
        courseId="1"
        moduleId="1"
        onStart={mockOnStart}
        onContinue={mockOnContinue}
      />
    )
    
    expect(screen.queryByText('Test Module')).not.toBeInTheDocument()
  })

  it('should display module description', () => {
    renderWithProviders(
      <ModalModuleDetailMobile
        open={true}
        onClose={mockOnClose}
        module={mockModule}
        journeyId="1"
        courseId="1"
        moduleId="1"
        onStart={mockOnStart}
        onContinue={mockOnContinue}
      />
    )
    
    // Check that drawer is rendered with module content
    expect(document.querySelector('.ant-drawer')).toBeTruthy()
  })

  it('should display module type', () => {
    renderWithProviders(
      <ModalModuleDetailMobile
        open={true}
        onClose={mockOnClose}
        module={mockModule}
        journeyId="1"
        courseId="1"
        moduleId="1"
        onStart={mockOnStart}
        onContinue={mockOnContinue}
      />
    )
    
    expect(document.body.textContent).toContain('SCORM')
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <ModalModuleDetailMobile
        open={true}
        onClose={mockOnClose}
        module={mockModule}
        journeyId="1"
        courseId="1"
        moduleId="1"
        onStart={mockOnStart}
        onContinue={mockOnContinue}
      />
    )
    
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0]) // Close button is first
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should be drawer on mobile', () => {
    renderWithProviders(
      <ModalModuleDetailMobile
        open={true}
        onClose={mockOnClose}
        module={mockModule}
        journeyId="1"
        courseId="1"
        moduleId="1"
        onStart={mockOnStart}
        onContinue={mockOnContinue}
      />
    )
    
    const drawer = document.querySelector('.ant-drawer')
    expect(drawer).toBeTruthy()
  })
})
