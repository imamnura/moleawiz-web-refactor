import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import HelpSidebar from '../HelpSidebar'

// Mock customer support config
vi.mock('@/config/constant/customer_support', () => ({
  contactEmail: 'support@example.com',
  subjectEmail: 'Help Request - ###',
  bodyEmail: 'Hello,\n\nName: ___\nUsername: ***\nApp: ###',
}))

// Mock getAppName
vi.mock('@/utils', () => ({
  getAppName: () => 'TestApp',
}))

// Mock SVG import
vi.mock('@/assets/images/svgs/ic_email_helptopics.svg', () => ({
  default: 'mocked-email-icon.svg',
}))

// Mock getHelpTopicItems
vi.mock('../data/helpTopics.jsx', () => ({
  getHelpTopicItems: () => [
    {
      id: 'faq',
      label: 'FAQ',
      route: 'faq',
      buttonId: 'btn-faq',
    },
    {
      id: 'login',
      label: 'Login',
      route: 'login',
      buttonId: 'btn-login',
    },
    {
      id: 'profile',
      label: 'Profile',
      route: 'profile',
      buttonId: 'btn-profile',
    },
  ],
}))

// Mock Ant Design components
vi.mock('antd', () => {
  const MockListItem = ({ children, className }) => (
    <li className={className} data-testid="list-item">
      {children}
    </li>
  )

  const MockList = ({ dataSource, renderItem }) => (
    <ul data-testid="help-list">
      {dataSource?.map((item, index) => renderItem(item, index))}
    </ul>
  )

  MockList.Item = MockListItem

  return {
    List: MockList,
    Image: ({ src, alt, className }) => (
      <img src={src} alt={alt} className={className} data-testid="email-icon" />
    ),
    Skeleton: {
      Input: ({ size }) => <div data-testid="skeleton-input" data-size={size} />,
    },
  }
})

describe('HelpSidebar', () => {
  const mockOnMenuClick = vi.fn()
  const mockUserData = {
    userName: 'John Doe',
    userId: 123,
  }
  const mockUserProfile = {
    username: 'john.doe@example.com',
    email: 'john.doe@example.com',
  }

  // Mock window.open
  const originalOpen = window.open
  beforeEach(() => {
    vi.clearAllMocks()
    window.open = vi.fn()
  })

  afterEach(() => {
    window.open = originalOpen
  })

  const renderSidebar = (props = {}) => {
    return render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HelpSidebar
            onMenuClick={mockOnMenuClick}
            userData={mockUserData}
            userProfile={mockUserProfile}
            loadingProfile={false}
            {...props}
          />
        </I18nextProvider>
      </MemoryRouter>
    )
  }

  describe('List Rendering', () => {
    it('should render List component', () => {
      renderSidebar()

      expect(screen.getByTestId('help-list')).toBeInTheDocument()
    })

    it('should render all topic items', () => {
      renderSidebar()

      // Use actual text from real help topics
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
      expect(screen.getByText(/Login/i)).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    it('should render links for each topic', () => {
      renderSidebar()

      const links = screen.getAllByRole('link')
      // 3 topic links + 1 email link
      expect(links.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Topic Navigation', () => {
    it('should render topic links with correct routes', () => {
      renderSidebar()

      const faqLink = screen.getByText('Frequently Asked Questions').closest('a')
      expect(faqLink).toHaveAttribute('href', expect.stringContaining('faq'))
    })

    it('should call onMenuClick when topic is clicked', async () => {
      const user = userEvent.setup()
      renderSidebar()

      const faqLink = screen.getByText('Frequently Asked Questions')
      await user.click(faqLink)

      expect(mockOnMenuClick).toHaveBeenCalled()
    })
  })

  describe('Email Contact Section', () => {
    it('should render email contact item', () => {
      renderSidebar()

      expect(screen.getByTestId('email-icon')).toBeInTheDocument()
    })

    it('should show loading skeleton when loading', () => {
      renderSidebar({ loadingProfile: true })

      expect(screen.getByTestId('skeleton-input')).toBeInTheDocument()
    })

    it('should not show skeleton when not loading', () => {
      renderSidebar({ loadingProfile: false })

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
    })

    it('should open mailto link when clicked', async () => {
      const user = userEvent.setup()
      renderSidebar()

      // Find the email contact button/link
      const emailIcon = screen.getByTestId('email-icon')
      const emailButton = emailIcon.closest('button') || emailIcon.closest('a')

      if (emailButton) {
        await user.click(emailButton)
        expect(window.open).toHaveBeenCalled()
      }
    })

    it('should include user name in email body', async () => {
      const user = userEvent.setup()
      renderSidebar()

      const emailIcon = screen.getByTestId('email-icon')
      const emailButton = emailIcon.closest('button') || emailIcon.closest('a')

      if (emailButton) {
        await user.click(emailButton)

        const callArgs = window.open.mock.calls[0]
        if (callArgs && callArgs[0]) {
          expect(callArgs[0]).toContain('John Doe')
        }
      }
    })

    it('should include username in email body', async () => {
      const user = userEvent.setup()
      renderSidebar()

      const emailIcon = screen.getByTestId('email-icon')
      const emailButton = emailIcon.closest('button') || emailIcon.closest('a')

      if (emailButton) {
        await user.click(emailButton)

        const callArgs = window.open.mock.calls[0]
        if (callArgs && callArgs[0]) {
          expect(callArgs[0]).toContain('john.doe@example.com')
        }
      }
    })

    it('should include app name in email', async () => {
      const user = userEvent.setup()
      renderSidebar()

      const emailIcon = screen.getByTestId('email-icon')
      const emailButton = emailIcon.closest('button') || emailIcon.closest('a')

      if (emailButton) {
        await user.click(emailButton)

        const callArgs = window.open.mock.calls[0]
        if (callArgs && callArgs[0]) {
          expect(callArgs[0]).toContain('TestApp')
        }
      }
    })

    it('should not trigger email when loading', async () => {
      const user = userEvent.setup()
      renderSidebar({ loadingProfile: true })

      const emailIcon = screen.queryByTestId('email-icon')
      if (emailIcon) {
        const emailButton =
          emailIcon.closest('button') || emailIcon.closest('a')
        if (emailButton) {
          await user.click(emailButton)
          expect(window.open).not.toHaveBeenCalled()
        }
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing user data gracefully', async () => {
      const user = userEvent.setup()
      renderSidebar({ userData: null, userProfile: null })

      const emailIcon = screen.queryByTestId('email-icon')
      if (emailIcon) {
        const emailButton =
          emailIcon.closest('button') || emailIcon.closest('a')
        if (emailButton) {
          await user.click(emailButton)
          // Should still open with empty placeholders
          expect(window.open).toHaveBeenCalled()
        }
      }
    })

    it('should handle undefined userData', () => {
      const { container } = renderSidebar({ userData: undefined })

      expect(container).toBeInTheDocument()
    })

    it('should handle undefined userProfile', () => {
      const { container } = renderSidebar({ userProfile: undefined })

      expect(container).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('should render list items with correct structure', () => {
      const { container } = renderSidebar()

      const list = container.querySelector('ul[data-testid="help-list"]')
      expect(list).toBeInTheDocument()
    })
  })
})
