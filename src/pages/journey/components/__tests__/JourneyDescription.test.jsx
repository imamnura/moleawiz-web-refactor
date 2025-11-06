/**
 * JourneyDescription Tests
 * Unit tests for Journey Description component
 */

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import JourneyDescription from '../JourneyDescription'

describe('JourneyDescription', () => {
  it('should render description text', () => {
    const description = 'This is a test journey description'
    renderWithProviders(
      <JourneyDescription description={description} isMobile={false} />
    )
    
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should render empty description', () => {
    const { container } = renderWithProviders(
      <JourneyDescription description="" isMobile={false} />
    )
    
    expect(container).toBeTruthy()
  })

  it('should render in mobile view', () => {
    const description = 'Mobile description'
    renderWithProviders(
      <JourneyDescription description={description} isMobile={true} />
    )
    
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('should render long description', () => {
    const longDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10)
    const { container } = renderWithProviders(
      <JourneyDescription description={longDescription} isMobile={false} />
    )
    
    // Check that description is present (may be truncated in UI)
    expect(container.textContent).toContain('Lorem ipsum')
  })
})
