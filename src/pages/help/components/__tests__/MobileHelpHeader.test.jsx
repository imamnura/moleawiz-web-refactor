/**
 * MobileHelpHeader Component Tests
 * Unit tests for mobile help header component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MobileHelpHeader from '../MobileHelpHeader'

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_help.main_header.assistance_prompt':
          'What can we help you with?',
      }
      return translations[key] || key
    },
  }),
}))

describe('MobileHelpHeader', () => {
  const mockOnTopicClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render header with title', () => {
    render(
      <MobileHelpHeader selectedTopic="FAQ" onTopicClick={mockOnTopicClick} />
    )

    expect(screen.getByText('What can we help you with?')).toBeInTheDocument()
  })

  it('should render as semantic header element', () => {
    const { container } = render(
      <MobileHelpHeader selectedTopic="FAQ" onTopicClick={mockOnTopicClick} />
    )

    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('should display selected topic', () => {
    render(
      <MobileHelpHeader
        selectedTopic="Profile"
        onTopicClick={mockOnTopicClick}
      />
    )

    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('should call onTopicClick when topic selector is clicked', async () => {
    const user = userEvent.setup()

    render(
      <MobileHelpHeader selectedTopic="FAQ" onTopicClick={mockOnTopicClick} />
    )

    const topicButton = screen.getByRole('button', {
      name: /select topic/i,
    })
    await user.click(topicButton)

    expect(mockOnTopicClick).toHaveBeenCalledTimes(1)
  })

  it('should render with dropdown icon', () => {
    const { container } = render(
      <MobileHelpHeader selectedTopic="FAQ" onTopicClick={mockOnTopicClick} />
    )

    // Ant Design DownOutlined renders as svg with specific class
    const icon = container.querySelector('.anticon-down')
    expect(icon).toBeInTheDocument()
  })

  it('should have correct ARIA label on topic selector button', () => {
    render(
      <MobileHelpHeader
        selectedTopic="Learning Point"
        onTopicClick={mockOnTopicClick}
      />
    )

    const button = screen.getByRole('button', {
      name: /select topic.*learning point/i,
    })
    expect(button).toBeInTheDocument()
  })

  it('should render banner image with aria-hidden', () => {
    const { container } = render(
      <MobileHelpHeader selectedTopic="FAQ" onTopicClick={mockOnTopicClick} />
    )

    const bannerContainer = container.querySelector('div[aria-hidden="true"]')
    expect(bannerContainer).toBeInTheDocument()

    const bannerImage = container.querySelector('img[alt=""]')
    expect(bannerImage).toBeInTheDocument()
  })

  it('should render h1 heading for title', () => {
    render(
      <MobileHelpHeader selectedTopic="FAQ" onTopicClick={mockOnTopicClick} />
    )

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('What can we help you with?')
  })

  it('should update when selectedTopic prop changes', () => {
    const { rerender } = render(
      <MobileHelpHeader selectedTopic="FAQ" onTopicClick={mockOnTopicClick} />
    )

    expect(screen.getByText('FAQ')).toBeInTheDocument()

    rerender(
      <MobileHelpHeader
        selectedTopic="Profile"
        onTopicClick={mockOnTopicClick}
      />
    )

    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.queryByText('FAQ')).not.toBeInTheDocument()
  })

  it('should have sticky positioning classes', () => {
    const { container } = render(
      <MobileHelpHeader selectedTopic="FAQ" onTopicClick={mockOnTopicClick} />
    )

    const header = container.querySelector('header')
    expect(header?.className).toContain('sticky')
    expect(header?.className).toContain('top-0')
  })
})
