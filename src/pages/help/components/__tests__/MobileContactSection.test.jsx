/**
 * MobileContactSection Component Tests
 * Unit tests for mobile contact section
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MobileContactSection from '../MobileContactSection'

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_help.side_dpd.contact_more_help':
          'Need more help? Contact us',
      }
      return translations[key] || key
    },
  }),
}))

vi.mock('@/config/constant/customer_support', () => ({
  contactEmail: 'support@example.com',
  subjectEmail: 'Help Request for ###',
  bodyEmail: 'Hello,\n\nMy name is ___ (username: ***).\n\nApp: ###',
}))

vi.mock('@/utils', () => ({
  getAppName: () => 'Intikom Learning',
}))

// Mock window.open
const mockWindowOpen = vi.fn()
window.open = mockWindowOpen

describe('MobileContactSection', () => {
  const mockUserData = {
    userName: 'John Doe',
    userId: 123,
  }

  const mockUserProfile = {
    username: 'johndoe',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render contact section', () => {
    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    expect(screen.getByText('Need more help? Contact us')).toBeInTheDocument()
  })

  it('should render as semantic section element', () => {
    const { container } = render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('aria-label', 'Contact Support')
  })

  it('should display contact email', () => {
    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    expect(screen.getByText('support@example.com')).toBeInTheDocument()
  })

  it('should show loading skeleton when loading', () => {
    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={true}
      />
    )

    expect(screen.queryByText('support@example.com')).not.toBeInTheDocument()
  })

  it('should open mailto link when clicked', async () => {
    const user = userEvent.setup()

    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    const contactButton = screen.getByRole('button', {
      name: /contact support via email/i,
    })
    await user.click(contactButton)

    expect(mockWindowOpen).toHaveBeenCalled()
    const mailtoUrl = mockWindowOpen.mock.calls[0][0]
    expect(mailtoUrl).toContain('mailto:support@example.com')
    expect(mailtoUrl).toContain('subject=')
    expect(mailtoUrl).toContain('body=')
  })

  it('should include user name in email body', async () => {
    const user = userEvent.setup()

    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    const contactButton = screen.getByRole('button', {
      name: /contact support/i,
    })
    await user.click(contactButton)

    const mailtoUrl = mockWindowOpen.mock.calls[0][0]
    expect(mailtoUrl).toContain('John Doe')
  })

  it('should include username in email body', async () => {
    const user = userEvent.setup()

    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    const contactButton = screen.getByRole('button', {
      name: /contact support/i,
    })
    await user.click(contactButton)

    const mailtoUrl = mockWindowOpen.mock.calls[0][0]
    expect(mailtoUrl).toContain('johndoe')
  })

  it('should include app name in email subject and body', async () => {
    const user = userEvent.setup()

    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    const contactButton = screen.getByRole('button', {
      name: /contact support/i,
    })
    await user.click(contactButton)

    const mailtoUrl = mockWindowOpen.mock.calls[0][0]
    expect(mailtoUrl).toContain('Intikom Learning')
  })

  it('should not trigger email when loading', async () => {
    const user = userEvent.setup()

    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={true}
      />
    )

    // Try to click, but skeleton should be rendered
    const contactSection = screen.getByRole('button', {
      name: /contact support/i,
    })
    await user.click(contactSection)

    expect(mockWindowOpen).not.toHaveBeenCalled()
  })

  it('should handle missing user data gracefully', async () => {
    const user = userEvent.setup()

    render(
      <MobileContactSection
        userData={{}}
        userProfile={null}
        loadingProfile={false}
      />
    )

    const contactButton = screen.getByRole('button', {
      name: /contact support/i,
    })
    await user.click(contactButton)

    expect(mockWindowOpen).toHaveBeenCalled()
    // Should still open mailto even without user data
  })

  it('should have correct heading level', () => {
    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('Need more help? Contact us')
  })

  it('should have email icon', () => {
    const { container } = render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    const icon = container.querySelector('img[alt=""]')
    expect(icon).toBeInTheDocument()
  })

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup()

    render(
      <MobileContactSection
        userData={mockUserData}
        userProfile={mockUserProfile}
        loadingProfile={false}
      />
    )

    const contactButton = screen.getByRole('button', {
      name: /contact support/i,
    })

    // Tab to button
    await user.tab()
    expect(contactButton).toHaveFocus()

    // Press Enter
    await user.keyboard('{Enter}')
    expect(mockWindowOpen).toHaveBeenCalled()
  })
})
