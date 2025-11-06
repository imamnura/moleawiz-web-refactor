import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import UserCard from '../../components/UserCard'

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  formatSubmissionDate: vi.fn((date) => '01 Nov 2025'),
  formatSubmissionNumber: vi.fn((num) => `#${num}`),
}))

describe('UserCard', () => {
  const mockUser = {
    user_id: 100,
    fullname: 'John Doe',
    username: 'johndoe',
    role: 'Student',
    last_submission: 1,
    submited: '2025-11-01',
    status: null, // need review
  }

  const mockOnClick = vi.fn()

  const renderUserCard = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <UserCard user={mockUser} onClick={mockOnClick} {...props} />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Desktop Layout', () => {
    it('should render user information correctly', () => {
      renderUserCard()

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('johndoe')).toBeInTheDocument()
    })

    it('should display formatted submission number', () => {
      renderUserCard()

      expect(screen.getByText('#1')).toBeInTheDocument()
    })

    it('should display formatted submission date', () => {
      renderUserCard()

      expect(screen.getByText('01 Nov 2025')).toBeInTheDocument()
    })

    it('should show need review badge when status is null', () => {
      renderUserCard()

      const badge = screen.getByText(/need.*review/i)
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('text-blue-600')
    })

    it('should show approved badge with green color when status is 1', () => {
      renderUserCard({
        user: { ...mockUser, status: 1 },
      })

      const badge = screen.getByText(/approved/i)
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('text-green-600')
    })

    it('should show declined badge with red color when status is 0', () => {
      renderUserCard({
        user: { ...mockUser, status: 0 },
      })

      const badge = screen.getByText(/declined/i)
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('text-red-600')
    })

    it('should call onClick when card is clicked', async () => {
      const user = userEvent.setup()
      renderUserCard()

      const card = screen.getByText('John Doe').closest('div')
      await user.click(card)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should show hover effect on desktop', () => {
      const { container } = renderUserCard()

      // Get the main card div (parent of the text)
      const card = container.querySelector('.hover\\:bg-gray-50')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('hover:bg-gray-50')
    })
  })

  describe('Mobile Layout', () => {
    it('should render mobile layout correctly', () => {
      renderUserCard({ isMobile: true })

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('johndoe')).not.toBeInTheDocument() // username not shown on mobile
    })

    it('should display role on mobile', () => {
      renderUserCard({ isMobile: true })

      expect(screen.getByText('Student')).toBeInTheDocument()
    })

    it('should show status badge with correct background on mobile', () => {
      renderUserCard({
        user: { ...mockUser, status: null },
        isMobile: true,
      })

      const badge = screen.getByText(/need.*review/i).closest('div')
      expect(badge).toHaveClass('bg-orange-50')
    })

    it('should position status badge absolutely on mobile', () => {
      renderUserCard({ isMobile: true })

      const badge = screen.getByText(/need.*review/i).closest('div')
      expect(badge).toHaveClass('absolute')
      expect(badge).toHaveClass('top-[17px]')
      expect(badge).toHaveClass('right-0')
    })
  })

  describe('Edge Cases', () => {
    it('should not render if user status is undefined', () => {
      const { container } = renderUserCard({
        user: { ...mockUser, status: undefined },
      })

      expect(container.firstChild).toBeNull()
    })

    it('should not render if user status is empty string', () => {
      const { container } = renderUserCard({
        user: { ...mockUser, status: '' },
      })

      expect(container.firstChild).toBeNull()
    })

    it('should handle missing submitted date gracefully', () => {
      renderUserCard({
        user: { ...mockUser, submited: null },
      })

      expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('should handle missing role on mobile', () => {
      renderUserCard({
        user: { ...mockUser, role: null },
        isMobile: true,
      })

      expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('should truncate long fullname on mobile', () => {
      renderUserCard({
        user: { ...mockUser, fullname: 'Very Long Name That Should Be Truncated' },
        isMobile: true,
      })

      const nameElement = screen.getByText('Very Long Name That Should Be Truncated')
      expect(nameElement).toHaveClass('truncate')
    })
  })

  describe('Status Background Colors', () => {
    it('should use orange background for need review status', () => {
      renderUserCard({ isMobile: true, user: { ...mockUser, status: null } })

      const badge = screen.getByText(/need.*review/i).closest('div')
      expect(badge).toHaveClass('bg-orange-50')
    })

    it('should use green background for approved status', () => {
      renderUserCard({ isMobile: true, user: { ...mockUser, status: 1 } })

      const badge = screen.getByText(/approved/i).closest('div')
      expect(badge).toHaveClass('bg-green-50')
    })

    it('should use orange background for declined status', () => {
      renderUserCard({ isMobile: true, user: { ...mockUser, status: 0 } })

      const badge = screen.getByText(/declined/i).closest('div')
      expect(badge).toHaveClass('bg-orange-50')
    })
  })
})
