/**
 * SCORMPlayer Tests
 * Unit tests for SCORM Player component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import SCORMPlayer from '../SCORMPlayer'

describe('SCORMPlayer', () => {
  const mockModule = {
    id: 1,
    name: 'Test SCORM Module',
  }

  const mockOnComplete = vi.fn()
  const mockOnExit = vi.fn()

  it('should render SCORM iframe', () => {
    const { container } = renderWithProviders(
      <SCORMPlayer
        contentUrl="https://example.com/scorm/index.html"
        module={mockModule}
        onComplete={mockOnComplete}
        onExit={mockOnExit}
        savedData={{}}
        studentId="123"
        studentName="John Doe"
      />
    )
    
    const iframe = container.querySelector('iframe')
    expect(iframe).toBeTruthy()
  })

  it('should set iframe src to content URL', () => {
    const { container } = renderWithProviders(
      <SCORMPlayer
        contentUrl="https://example.com/scorm/index.html"
        module={mockModule}
        onComplete={mockOnComplete}
        onExit={mockOnExit}
        savedData={{}}
        studentId="123"
        studentName="John Doe"
      />
    )
    
    const iframe = container.querySelector('iframe')
    expect(iframe.getAttribute('src')).toBe('https://example.com/scorm/index.html')
  })

  it('should render exit button', () => {
    renderWithProviders(
      <SCORMPlayer
        contentUrl="https://example.com/scorm/index.html"
        module={mockModule}
        onComplete={mockOnComplete}
        onExit={mockOnExit}
        savedData={{}}
        studentId="123"
        studentName="John Doe"
      />
    )
    
    expect(screen.getByText(/exit/i)).toBeInTheDocument()
  })

  it('should call onExit when exit button is clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup()
    
    renderWithProviders(
      <SCORMPlayer
        contentUrl="https://example.com/scorm/index.html"
        module={mockModule}
        onComplete={mockOnComplete}
        onExit={mockOnExit}
        savedData={{}}
        studentId="123"
        studentName="John Doe"
      />
    )
    
    const exitButton = screen.getByText(/exit/i)
    await user.click(exitButton)
    
    expect(mockOnExit).toHaveBeenCalled()
  })

  it('should have fullscreen iframe', () => {
    const { container } = renderWithProviders(
      <SCORMPlayer
        contentUrl="https://example.com/scorm/index.html"
        module={mockModule}
        onComplete={mockOnComplete}
        onExit={mockOnExit}
        savedData={{}}
        studentId="123"
        studentName="John Doe"
      />
    )
    
    const iframe = container.querySelector('iframe')
    expect(iframe.className).toContain('w-full')
    expect(iframe.className).toContain('h-full')
  })
})
