import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventCard from '../EventCard'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'feature.feature_tm.member') return 'member'
      return key
    },
  }),
}))

describe('EventCard Component', () => {
  const mockEvent = {
    id: 1,
    fullname: 'John Doe',
    title: 'Team Training',
    date_range: '1-3 Jan 2024',
    time_range: '09:00 - 17:00',
    total_users: 15,
  }

  describe('Rendering', () => {
    it('should render event with fullname', () => {
      const { getByText } = render(<EventCard event={mockEvent} />)

      expect(getByText('John Doe')).toBeInTheDocument()
      expect(getByText('Team Training')).toBeInTheDocument()
      expect(getByText('1-3 Jan 2024')).toBeInTheDocument()
      expect(getByText('09:00 - 17:00')).toBeInTheDocument()
      expect(getByText('15 member')).toBeInTheDocument()
    })

    it('should render event without fullname (fallback to title)', () => {
      const eventNoFullname = { ...mockEvent, fullname: undefined }
      const { getByText, container } = render(<EventCard event={eventNoFullname} />)

      // Title appears twice when no fullname
      const titleElements = container.querySelectorAll('.text-base')
      expect(titleElements[0].textContent).toBe('Team Training')
      expect(getByText('1-3 Jan 2024')).toBeInTheDocument()
    })

    it('should render time icon', () => {
      const { container } = render(<EventCard event={mockEvent} />)
      const timeIcon = container.querySelector('svg')
      expect(timeIcon).toBeInTheDocument()
    })

    it('should render members icon', () => {
      const { container } = render(<EventCard event={mockEvent} />)
      const membersIcon = container.querySelector('img[alt="Members"]')
      expect(membersIcon).toBeInTheDocument()
    })

    it('should render border by default', () => {
      const { container } = render(<EventCard event={mockEvent} />)
      const card = container.firstChild
      expect(card).toHaveClass('border-b')
      expect(card).toHaveClass('border-gray-200')
    })

    it('should not render border when showBorder is false', () => {
      const { container } = render(<EventCard event={mockEvent} showBorder={false} />)
      const card = container.firstChild
      expect(card).not.toHaveClass('border-b')
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      const { container } = render(<EventCard event={mockEvent} onClick={handleClick} />)

      await user.click(container.firstChild)
      expect(handleClick).toHaveBeenCalledWith(mockEvent)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not crash when onClick is not provided', async () => {
      const user = userEvent.setup()
      const { container } = render(<EventCard event={mockEvent} />)

      await user.click(container.firstChild)
      // Should not throw error
    })

    it('should have cursor pointer', () => {
      const { container } = render(<EventCard event={mockEvent} />)
      const card = container.firstChild
      expect(card).toHaveClass('cursor-pointer')
    })
  })

  describe('Styling', () => {
    it('should have correct padding', () => {
      const { container } = render(<EventCard event={mockEvent} />)
      const card = container.firstChild
      expect(card).toHaveClass('py-3')
    })

    it('should render title with correct styles', () => {
      const { container } = render(<EventCard event={mockEvent} />)
      const title = container.querySelector('.text-base.font-medium')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-text-title-mobile')
    })

    it('should render date range with gray color', () => {
      const { getByText } = render(<EventCard event={mockEvent} />)
      const dateRange = getByText('1-3 Jan 2024')
      expect(dateRange).toHaveClass('text-[#757575]')
    })

    it('should render time and members with small text', () => {
      const { getByText } = render(<EventCard event={mockEvent} />)
      const timeText = getByText('09:00 - 17:00')
      const membersText = getByText('15 member')

      expect(timeText.parentElement.parentElement).toHaveClass('text-xs')
      expect(membersText.parentElement.parentElement).toHaveClass('text-xs')
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero members', () => {
      const eventZeroUsers = { ...mockEvent, total_users: 0 }
      const { getByText } = render(<EventCard event={eventZeroUsers} />)
      expect(getByText('0 member')).toBeInTheDocument()
    })

    it('should handle large member count', () => {
      const eventManyUsers = { ...mockEvent, total_users: 9999 }
      const { getByText } = render(<EventCard event={eventManyUsers} />)
      expect(getByText('9999 member')).toBeInTheDocument()
    })

    it('should handle long event title', () => {
      const longTitle = 'This is a very long event title that might wrap to multiple lines in the UI'
      const eventLongTitle = { ...mockEvent, title: longTitle }
      const { getByText } = render(<EventCard event={eventLongTitle} />)
      expect(getByText(longTitle)).toBeInTheDocument()
    })

    it('should handle special characters in title', () => {
      const specialTitle = 'Event & Training™ (2024) - Phase #1'
      const eventSpecial = { ...mockEvent, title: specialTitle }
      const { getByText } = render(<EventCard event={eventSpecial} />)
      expect(getByText(specialTitle)).toBeInTheDocument()
    })
  })

  describe('PropTypes Validation', () => {
    it('should accept valid event object', () => {
      const { getByText } = render(<EventCard event={mockEvent} />)
      expect(getByText('John Doe')).toBeInTheDocument()
    })

    it('should accept event with string or number id', () => {
      const eventStringId = { ...mockEvent, id: 'event-123' }
      const eventNumberId = { ...mockEvent, id: 456 }

      const { rerender, getByText } = render(<EventCard event={eventStringId} />)
      expect(getByText('John Doe')).toBeInTheDocument()

      rerender(<EventCard event={eventNumberId} />)
      expect(getByText('John Doe')).toBeInTheDocument()
    })

    it('should accept optional onClick function', () => {
      const handleClick = vi.fn()
      const { container } = render(<EventCard event={mockEvent} onClick={handleClick} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should accept optional showBorder boolean', () => {
      const { container, rerender } = render(<EventCard event={mockEvent} showBorder={true} />)
      expect(container.firstChild).toHaveClass('border-b')

      rerender(<EventCard event={mockEvent} showBorder={false} />)
      expect(container.firstChild).not.toHaveClass('border-b')
    })
  })
})
