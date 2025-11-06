/**
 * JourneyStats Tests
 * Unit tests for Journey Stats component
 */

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import JourneyStats from '../JourneyStats'

describe('JourneyStats', () => {
  it('should render points and courses stats', () => {
    renderWithProviders(
      <JourneyStats points={100} totalCourses={5} isMobile={false} />
    )
    
    expect(screen.getByText(/100/)).toBeInTheDocument()
    expect(screen.getByText(/5/)).toBeInTheDocument()
  })

  it('should display points label', () => {
    renderWithProviders(
      <JourneyStats points={100} totalCourses={5} isMobile={false} />
    )
    
    expect(screen.getByText(/points/i)).toBeInTheDocument()
  })

  it('should display courses label', () => {
    renderWithProviders(
      <JourneyStats points={100} totalCourses={5} isMobile={false} />
    )
    
    expect(screen.getByText(/courses/i)).toBeInTheDocument()
  })

  it('should render in mobile view', () => {
    renderWithProviders(
      <JourneyStats points={50} totalCourses={3} isMobile={true} />
    )
    
    expect(screen.getByText(/50/)).toBeInTheDocument()
    expect(screen.getByText(/3/)).toBeInTheDocument()
  })

  it('should handle zero values', () => {
    const { container } = renderWithProviders(
      <JourneyStats points={0} totalCourses={0} isMobile={false} />
    )
    
    // Should render without errors
    expect(container).toBeTruthy()
  })
})
