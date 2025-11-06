/**
 * ModuleInfo Tests
 * Unit tests for Module Info component
 */

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import ModuleInfo from '../ModuleInfo'

describe('ModuleInfo', () => {
  const mockModule = {
    type: 'SCORM',
    grading_method: 'Highest Grade',
    attempt_limit: 3,
    total_attempt: 1,
    attempt_collect_point: 0,
    infopoint: ['Learn basics', 'Practice exercises'],
    badges: [],
  }

  it('should render module type', () => {
    renderWithProviders(
      <ModuleInfo module={mockModule} isMobile={false} />
    )
    
    expect(screen.getByText('SCORM')).toBeInTheDocument()
  })

  it('should render grading method', () => {
    renderWithProviders(
      <ModuleInfo module={mockModule} isMobile={false} />
    )
    
    expect(screen.getByText('Highest Grade')).toBeInTheDocument()
  })

  it('should render attempt limit', () => {
    const { container } = renderWithProviders(
      <ModuleInfo module={mockModule} isMobile={false} />
    )
    
    expect(container.textContent).toContain('3')
  })

  it('should render total attempts', () => {
    renderWithProviders(
      <ModuleInfo module={mockModule} isMobile={false} />
    )
    
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should render in mobile view', () => {
    renderWithProviders(
      <ModuleInfo module={mockModule} isMobile={true} />
    )
    
    expect(screen.getByText('SCORM')).toBeInTheDocument()
  })

  it('should handle missing optional fields', () => {
    const minimalModule = {
      attempt_limit: 0,
      total_attempt: 0,
    }
    
    const { container } = renderWithProviders(
      <ModuleInfo module={minimalModule} isMobile={false} />
    )
    
    expect(container.textContent).toContain('0')
  })
})
