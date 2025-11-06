/**
 * EmptyState Component Tests
 * Unit tests for EmptyState component
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  it('should render with text only', () => {
    render(<EmptyState text="No data available" showMessage={false} />)

    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('should render with text and message', () => {
    render(
      <EmptyState
        text="No items found"
        message="Try adding some items"
        showMessage={true}
      />
    )

    expect(screen.getByText('No items found')).toBeInTheDocument()
    expect(screen.getByText('Try adding some items')).toBeInTheDocument()
  })

  it('should not render message when showMessage is false', () => {
    render(
      <EmptyState
        text="No items found"
        message="Try adding some items"
        showMessage={false}
      />
    )

    expect(screen.getByText('No items found')).toBeInTheDocument()
    expect(screen.queryByText('Try adding some items')).not.toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    const { container } = render(
      <EmptyState text="Empty" showMessage={false} />
    )

    const section = container.querySelector('section')
    expect(section).toHaveAttribute('role', 'status')
    expect(section).toHaveAttribute('aria-live', 'polite')
  })

  it('should render Ant Design Empty component', () => {
    const { container } = render(
      <EmptyState text="Empty state" showMessage={false} />
    )

    // Check if Ant Design Empty component is rendered
    expect(container.querySelector('.ant-empty')).toBeInTheDocument()
  })
})
