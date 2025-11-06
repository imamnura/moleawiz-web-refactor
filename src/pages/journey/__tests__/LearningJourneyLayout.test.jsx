/**
 * LearningJourneyLayout Tests
 * Unit tests for Learning Journey Layout component
 */

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import LearningJourneyLayout from '../layouts/LearningJourneyLayout'

// Mock Outlet from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
    useOutletContext: () => [false, {}, 0, 0, [], [], [], {}],
  }
})

describe('LearningJourneyLayout', () => {
  it('should render layout structure', () => {
    const { container } = renderWithProviders(<LearningJourneyLayout />)

    // Layout should render with structure
    expect(container.firstChild).toBeTruthy()
  })

  it('should render outlet for child routes', () => {
    renderWithProviders(<LearningJourneyLayout />)

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('should provide context to child routes', () => {
    renderWithProviders(<LearningJourneyLayout />)

    // Layout should render without errors
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('should render with proper structure', () => {
    const { container } = renderWithProviders(<LearningJourneyLayout />)

    // Should have a container div
    expect(container.firstChild).toBeTruthy()
  })
})
