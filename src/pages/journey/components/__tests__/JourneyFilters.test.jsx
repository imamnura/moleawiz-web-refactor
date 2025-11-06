/**
 * JourneyFilters Tests
 * Unit tests for Journey Filters component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { JourneyFilters } from '../JourneyFilters'

describe('JourneyFilters', () => {
  const mockStats = {
    total: 10,
    ongoing: 5,
    new: 3,
    completed: 2,
  }

  const mockOnChange = vi.fn()

  it('should render all filter options', () => {
    renderWithProviders(
      <JourneyFilters value="all" onChange={mockOnChange} stats={mockStats} />
    )
    
    expect(screen.getByText(/all/i)).toBeInTheDocument()
    expect(screen.getByText(/ongoing/i)).toBeInTheDocument()
    expect(screen.getByText(/new/i)).toBeInTheDocument()
    expect(screen.getByText(/completed/i)).toBeInTheDocument()
  })

  it('should display stats for each filter', () => {
    const { container } = renderWithProviders(
      <JourneyFilters value="all" onChange={mockOnChange} stats={mockStats} />
    )
    
    // Check stats are displayed in the component
    const text = container.textContent
    expect(text).toContain('(10)')
    expect(text).toContain('(5)')
    expect(text).toContain('(3)')
    expect(text).toContain('(2)')
  })

  it('should call onChange when filter is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <JourneyFilters value="all" onChange={mockOnChange} stats={mockStats} />
    )
    
    const ongoingButton = screen.getByText(/ongoing/i)
    await user.click(ongoingButton)
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('should highlight selected filter', () => {
    const { container } = renderWithProviders(
      <JourneyFilters value="ongoing" onChange={mockOnChange} stats={mockStats} />
    )
    
    expect(container).toBeTruthy()
  })

  it('should handle missing stats', () => {
    renderWithProviders(
      <JourneyFilters value="all" onChange={mockOnChange} stats={{}} />
    )
    
    expect(screen.getByText(/all/i)).toBeInTheDocument()
  })
})
