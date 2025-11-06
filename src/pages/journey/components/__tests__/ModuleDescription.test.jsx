/**
 * ModuleDescription Tests
 * Unit tests for Module Description component
 */

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import ModuleDescription from '../ModuleDescription'

describe('ModuleDescription', () => {
  it('should render description text', () => {
    const description = 'This is a module description'
    renderWithProviders(
      <ModuleDescription description={description} isMobile={false} />
    )
    
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should render empty description', () => {
    const { container } = renderWithProviders(
      <ModuleDescription description="" isMobile={false} />
    )
    
    expect(container).toBeTruthy()
  })

  it('should render in mobile view', () => {
    const description = 'Mobile module description'
    renderWithProviders(
      <ModuleDescription description={description} isMobile={true} />
    )
    
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should render long description', () => {
    const longDescription = 'This is a very long module description. '.repeat(20)
    const { container } = renderWithProviders(
      <ModuleDescription description={longDescription} isMobile={false} />
    )
    
    // Check container contains part of the description
    expect(container.textContent).toContain('This is a very long module description')
  })
})
