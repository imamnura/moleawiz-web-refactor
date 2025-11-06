import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}))

describe('EmptyState', () => {
  it('should render empty state message', () => {
    render(<EmptyState />)

    expect(
      screen.getByText(
        'feature.feature_leaderboards.empty_state.leaderboard_not_available'
      )
    ).toBeInTheDocument()
  })

  it('should render with semantic HTML (section)', () => {
    const { container } = render(<EmptyState />)

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('role', 'status')
    expect(section).toHaveAttribute('aria-label', 'Empty leaderboards state')
  })

  it('should render empty state image', () => {
    render(<EmptyState />)

    const image = screen.getByAltText('Empty State Leaderboards')
    expect(image).toBeInTheDocument()
  })

  it('should use paragraph tag for message', () => {
    const { container } = render(<EmptyState />)

    const paragraph = container.querySelector('p')
    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toHaveTextContent(
      'feature.feature_leaderboards.empty_state.leaderboard_not_available'
    )
  })

  it('should have correct styling classes', () => {
    const { container } = render(<EmptyState />)

    const section = container.querySelector('section')
    expect(section).toHaveClass('flex', 'h-full', 'w-full')
  })
})
