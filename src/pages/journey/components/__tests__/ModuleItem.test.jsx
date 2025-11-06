/**
 * ModuleItem Tests
 * Unit tests for Module Item component
 */

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import ModuleItem from '../ModuleItem'

describe('ModuleItem', () => {
  const mockModule = {
    id: 1,
    fullname: 'Test Module',
    summary: '1',
    is_complete: 0,
    isopen: 1,
    category: null,
  }

  it('should render module name', () => {
    renderWithProviders(
      <ModuleItem
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
      />
    )
    
    expect(screen.getByText('Test Module')).toBeInTheDocument()
  })

  it('should display module number', () => {
    const { container } = renderWithProviders(
      <ModuleItem
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
      />
    )
    
    expect(container.textContent).toContain('1')
  })

  it('should show completed badge', () => {
    const completedModule = {
      ...mockModule,
      is_complete: 1,
    }
    
    const { container } = renderWithProviders(
      <ModuleItem
        module={completedModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
      />
    )
    
    // Check for completed icon (CheckOutlined)
    const icon = container.querySelector('.anticon-check')
    expect(icon).toBeTruthy()
  })

  it('should link to module detail', () => {
    const { container } = renderWithProviders(
      <ModuleItem
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
      />
    )
    
    const link = container.querySelector('a')
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe('/journey/1/course/1/module/1')
  })

  it('should render in mobile view', () => {
    renderWithProviders(
      <ModuleItem
        module={mockModule}
        journeyId="1"
        courseId="1"
        isMobile={true}
      />
    )
    
    expect(screen.getByText('Test Module')).toBeInTheDocument()
  })

  it('should show locked icon for locked module', () => {
    const lockedModule = {
      ...mockModule,
      isopen: 0,
      is_complete: 0,
    }
    
    const { container } = renderWithProviders(
      <ModuleItem
        module={lockedModule}
        journeyId="1"
        courseId="1"
        isMobile={false}
      />
    )
    
    // Check for lock icon (LockFilled)
    const lockIcon = container.querySelector('.anticon-lock')
    expect(lockIcon).toBeTruthy()
  })
})
