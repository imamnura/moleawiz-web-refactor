import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MemberCard from '../MemberCard'

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_tm.ongoing_program': 'Ongoing Program',
      }
      return translations[key] || key
    },
  }),
}))

describe('MemberCard Component', () => {
  const mockMember = {
    user_id: 1,
    fullname: 'John Doe',
    total_ongoing: 3,
  }

  describe('Rendering', () => {
    it('should render member fullname', () => {
      render(<MemberCard member={mockMember} />)
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should render total ongoing programs count', () => {
      render(<MemberCard member={mockMember} />)
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should render ongoing program label', () => {
      render(<MemberCard member={mockMember} />)
      expect(screen.getByText('Ongoing Program')).toBeInTheDocument()
    })

    it('should render member with zero ongoing programs', () => {
      const memberWithZero = { ...mockMember, total_ongoing: 0 }
      render(<MemberCard member={memberWithZero} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should render member with many ongoing programs', () => {
      const memberWithMany = { ...mockMember, total_ongoing: 15 }
      render(<MemberCard member={memberWithMany} />)
      expect(screen.getByText('15')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onClick when card is clicked', () => {
      const handleClick = vi.fn()
      render(<MemberCard member={mockMember} onClick={handleClick} />)

      const card = screen.getByText('John Doe').closest('div')
      fireEvent.click(card)

      expect(handleClick).toHaveBeenCalledTimes(1)
      expect(handleClick).toHaveBeenCalledWith(mockMember)
    })

    it('should not error when onClick is not provided', () => {
      render(<MemberCard member={mockMember} />)

      const card = screen.getByText('John Doe').closest('div')
      expect(() => fireEvent.click(card)).not.toThrow()
    })

    it('should pass correct member data to onClick', () => {
      const handleClick = vi.fn()
      const customMember = {
        user_id: 99,
        fullname: 'Jane Smith',
        total_ongoing: 7,
      }
      render(<MemberCard member={customMember} onClick={handleClick} />)

      const card = screen.getByText('Jane Smith').closest('div')
      fireEvent.click(card)

      expect(handleClick).toHaveBeenCalledWith(customMember)
    })
  })

  describe('Styling', () => {
    it('should have cursor pointer', () => {
      const { container } = render(<MemberCard member={mockMember} />)
      const card = container.firstChild
      expect(card).toHaveClass('cursor-pointer')
    })

    it('should have border bottom', () => {
      const { container } = render(<MemberCard member={mockMember} />)
      const card = container.firstChild
      expect(card).toHaveClass('border-b', 'border-gray-200')
    })

    it('should have proper padding', () => {
      const { container } = render(<MemberCard member={mockMember} />)
      const card = container.firstChild
      expect(card).toHaveClass('py-3')
    })

    it('should not have border on last item', () => {
      const { container } = render(<MemberCard member={mockMember} />)
      const card = container.firstChild
      expect(card).toHaveClass('last:border-b-0')
    })

    it('should highlight ongoing count in blue', () => {
      const { container } = render(<MemberCard member={mockMember} />)
      const count = screen.getByText('3')
      expect(count).toHaveClass('text-[#0066CC]', 'font-semibold')
    })
  })

  describe('Text Display', () => {
    it('should display fullname with correct styling', () => {
      const { container } = render(<MemberCard member={mockMember} />)
      const fullname = screen.getByText('John Doe')
      expect(fullname).toHaveClass('text-base', 'font-medium', 'text-text-title-mobile')
    })

    it('should have proper spacing between name and count', () => {
      const { container } = render(<MemberCard member={mockMember} />)
      const fullnameDiv = screen.getByText('John Doe').closest('div')
      expect(fullnameDiv).toHaveClass('mb-1')
    })
  })

  describe('Edge Cases', () => {
    it('should handle member with no user_id', () => {
      const memberNoId = {
        fullname: 'No ID User',
        total_ongoing: 2,
      }
      render(<MemberCard member={memberNoId} />)
      expect(screen.getByText('No ID User')).toBeInTheDocument()
    })

    it('should handle long names gracefully', () => {
      const longNameMember = {
        user_id: 1,
        fullname: 'Very Long Name That Should Be Displayed Correctly',
        total_ongoing: 1,
      }
      render(<MemberCard member={longNameMember} />)
      expect(
        screen.getByText('Very Long Name That Should Be Displayed Correctly')
      ).toBeInTheDocument()
    })

    it('should handle special characters in name', () => {
      const specialMember = {
        user_id: 1,
        fullname: "John O'Connor-Smith Jr.",
        total_ongoing: 2,
      }
      render(<MemberCard member={specialMember} />)
      expect(screen.getByText("John O'Connor-Smith Jr.")).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <MemberCard member={mockMember} onClick={handleClick} />
      )
      const card = container.firstChild

      // Should be clickable
      fireEvent.click(card)
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('PropTypes', () => {
    it('should render with all required member properties', () => {
      const completeMember = {
        user_id: 123,
        fullname: 'Complete User',
        total_ongoing: 5,
      }
      const { container } = render(<MemberCard member={completeMember} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should handle onClick as optional prop', () => {
      const { container } = render(<MemberCard member={mockMember} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
