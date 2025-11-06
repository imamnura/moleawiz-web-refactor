import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from '../EmptyState'

// Mock Image component from antd
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Image: ({ src, alt, width, className }) => (
      <img src={src} alt={alt} width={width} className={className} />
    ),
  }
})

describe('EmptyState Component', () => {
  describe('Rendering', () => {
    it('should render empty state message', () => {
      render(<EmptyState message="No data available" isMobile={false} />)
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('should render empty state image', () => {
      const { container } = render(<EmptyState message="No data" isMobile={false} />)
      const image = container.querySelector('img[alt="No content"]')
      expect(image).toBeInTheDocument()
    })

    it('should display custom message', () => {
      const customMessage = 'No programs found for your team'
      render(<EmptyState message={customMessage} isMobile={false} />)
      expect(screen.getByText(customMessage)).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should use large image on desktop', () => {
      const { container } = render(<EmptyState message="No data" isMobile={false} />)
      const image = container.querySelector('img')
      expect(image).toHaveAttribute('width', '240')
    })

    it('should use small image on mobile', () => {
      const { container } = render(<EmptyState message="No data" isMobile={true} />)
      const image = container.querySelector('img')
      expect(image).toHaveAttribute('width', '140')
    })

    it('should adjust font size on mobile', () => {
      const { container } = render(
        <EmptyState message="No data" isMobile={true} />
      )
      const message = container.querySelector('p')
      expect(message).toHaveStyle({ fontSize: '14px' })
    })

    it('should adjust font size on desktop', () => {
      const { container } = render(
        <EmptyState message="No data" isMobile={false} />
      )
      const message = container.querySelector('p')
      expect(message).toHaveStyle({ fontSize: '20px' })
    })
  })

  describe('Styling', () => {
    it('should have centered layout', () => {
      const { container } = render(
        <EmptyState message="No data" isMobile={false} />
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
    })

    it('should have proper padding', () => {
      const { container } = render(
        <EmptyState message="No data" isMobile={false} />
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('py-12', 'px-4')
    })

    it('should have gray text color', () => {
      const { container } = render(
        <EmptyState message="No data" isMobile={false} />
      )
      const message = container.querySelector('p')
      expect(message).toHaveClass('text-[#67686D]')
    })

    it('should have medium font weight', () => {
      const { container } = render(
        <EmptyState message="No data" isMobile={false} />
      )
      const message = container.querySelector('p')
      expect(message).toHaveClass('font-medium')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string message', () => {
      render(<EmptyState message="" isMobile={false} />)
      const message = screen.queryByText(/.+/)
      expect(message).not.toBeInTheDocument()
    })

    it('should handle long messages', () => {
      const longMessage =
        'This is a very long message that should still be displayed properly in the empty state component without any issues'
      render(<EmptyState message={longMessage} isMobile={false} />)
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('should handle special characters in message', () => {
      const specialMessage = 'No data! @#$%^&*()'
      render(<EmptyState message={specialMessage} isMobile={false} />)
      expect(screen.getByText(specialMessage)).toBeInTheDocument()
    })

    it('should handle multiline messages', () => {
      const multilineMessage = 'No data available. Please try again later'
      render(<EmptyState message={multilineMessage} isMobile={false} />)
      expect(screen.getByText(multilineMessage)).toBeInTheDocument()
    })
  })

  describe('PropTypes Validation', () => {
    it('should render with required props', () => {
      const { container } = render(
        <EmptyState message="Test message" isMobile={false} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should handle boolean isMobile prop', () => {
      const { container, rerender } = render(
        <EmptyState message="Test" isMobile={true} />
      )
      const imageMobile = container.querySelector('img')
      expect(imageMobile).toHaveAttribute('width', '140')

      rerender(<EmptyState message="Test" isMobile={false} />)
      const imageDesktop = container.querySelector('img')
      expect(imageDesktop).toHaveAttribute('width', '240')
    })
  })
})
