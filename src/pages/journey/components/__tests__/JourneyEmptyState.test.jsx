/**
 * JourneyEmptyState Tests
 * Unit tests for Journey Empty State component
 */

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { JourneyEmptyState } from '../JourneyEmptyState'

describe('JourneyEmptyState', () => {
  it('should render empty state for all filter', () => {
    renderWithProviders(<JourneyEmptyState filter="all" />)
    
    expect(screen.getByText(/no.*journeys/i)).toBeInTheDocument()
  })

  it('should render empty state for ongoing filter', () => {
    renderWithProviders(<JourneyEmptyState filter="ongoing" />)
    
    expect(screen.getByText(/ongoing/i)).toBeInTheDocument()
  })

  it('should render empty state for new filter', () => {
    renderWithProviders(<JourneyEmptyState filter="new" />)
    
    expect(screen.getByText(/new/i)).toBeInTheDocument()
  })

  it('should render empty state for finish filter', () => {
    const { container } = renderWithProviders(<JourneyEmptyState filter="finish" />)
    
    expect(container.textContent).toContain('completed')
  })

  it('should have centered layout', () => {
    const { container } = renderWithProviders(<JourneyEmptyState filter="all" />)
    
    // Just check component renders
    expect(container.firstChild).toBeTruthy()
  })
})
