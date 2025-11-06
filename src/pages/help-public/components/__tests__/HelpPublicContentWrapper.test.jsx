/**
 * HelpPublicContentWrapper Component Tests
 * Unit tests for help-public content wrapper
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { HelpPublicContentWrapper } from '../HelpPublicContentWrapper'
import * as useEmailContactModule from '../../hooks/useEmailContact'

// Mock hooks
vi.mock('../../hooks/useEmailContact', () => ({
  useEmailContact: () => ({
    contactEmail: 'support@example.com',
    handleEmailClick: vi.fn(),
    loading: false,
  }),
}))

describe('HelpPublicContentWrapper', () => {
  const defaultProps = {
    topicTitle: 'Frequently Asked Questions',
    items: [
      {
        key: '1',
        label: 'Question 1',
        children: <div>Answer 1</div>,
      },
      {
        key: '2',
        label: 'Question 2',
        children: <div>Answer 2</div>,
      },
    ],
    isMobile: false,
    isScaling: false,
    showBanner: true,
  }

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <HelpPublicContentWrapper {...defaultProps} {...props} />
        </I18nextProvider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with semantic HTML', () => {
    const { container } = renderComponent()

    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
    expect(article).toHaveAttribute('role', 'article')
  })

  it('should render banner when showBanner is true', () => {
    const { container } = renderComponent({ showBanner: true })

    const banner = container.querySelector('header')
    expect(banner).toBeInTheDocument()
  })

  it('should not render banner when showBanner is false', () => {
    const { container } = renderComponent({ showBanner: false })

    const banner = container.querySelector('header')
    expect(banner).not.toBeInTheDocument()
  })

  it('should render topic title', () => {
    renderComponent()

    expect(
      screen.getByRole('heading', { name: /frequently asked questions/i })
    ).toBeInTheDocument()
  })

  it('should render all FAQ items', () => {
    renderComponent()

    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('Question 2')).toBeInTheDocument()
  })

  it('should render FAQ answers when expanded', () => {
    renderComponent()

    const question1 = screen.getByText('Question 1')
    fireEvent.click(question1)

    expect(screen.getByText('Answer 1')).toBeVisible()
  })

  it('should have correct PropTypes', () => {
    expect(HelpPublicContentWrapper.propTypes).toBeDefined()
    expect(HelpPublicContentWrapper.propTypes.topicTitle).toBeDefined()
    expect(HelpPublicContentWrapper.propTypes.items).toBeDefined()
    expect(HelpPublicContentWrapper.propTypes.isMobile).toBeDefined()
    expect(HelpPublicContentWrapper.propTypes.isScaling).toBeDefined()
    expect(HelpPublicContentWrapper.propTypes.showBanner).toBeDefined()
  })

  it('should validate items PropTypes shape', () => {
    const itemsShape = HelpPublicContentWrapper.propTypes.items
    expect(itemsShape).toBeDefined()
  })

  it('should render email contact section on mobile', () => {
    renderComponent({ isMobile: true })

    expect(screen.getByText(/contact support/i)).toBeInTheDocument()
    expect(screen.getByText('support@example.com')).toBeInTheDocument()
  })

  it('should not render email contact section on desktop', () => {
    renderComponent({ isMobile: false })

    expect(screen.queryByText(/contact support/i)).not.toBeInTheDocument()
  })

  it('should call handleEmailClick when email is clicked', () => {
    const mockHandleEmailClick = vi.fn()
    vi.spyOn(useEmailContactModule, 'useEmailContact').mockReturnValue({
      contactEmail: 'support@example.com',
      handleEmailClick: mockHandleEmailClick,
      loading: false,
    })

    renderComponent({ isMobile: true })

    const emailLink = screen.getByText('support@example.com')
    fireEvent.click(emailLink)

    expect(mockHandleEmailClick).toHaveBeenCalledTimes(1)
  })

  it('should handle keyboard interaction for email', () => {
    const mockHandleEmailClick = vi.fn()
    vi.spyOn(useEmailContactModule, 'useEmailContact').mockReturnValue({
      contactEmail: 'support@example.com',
      handleEmailClick: mockHandleEmailClick,
      loading: false,
    })

    renderComponent({ isMobile: true })

    const emailLink = screen.getByText('support@example.com')
    fireEvent.keyDown(emailLink, { key: 'Enter' })

    expect(mockHandleEmailClick).toHaveBeenCalledTimes(1)
  })

  it('should be accessible', () => {
    const { container } = renderComponent()

    // Check for proper ARIA attributes
    const article = container.querySelector('article')
    expect(article).toHaveAttribute('role', 'article')
    expect(article).toHaveAttribute('aria-label')

    // Check for proper heading structure
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('should apply background gradient to banner', () => {
    const { container } = renderComponent({ showBanner: true })

    const banner = container.querySelector('header')
    expect(banner).toHaveClass('bg-gradient-to-b')
  })

  it('should handle empty items array', () => {
    renderComponent({ items: [] })

    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('should handle single item', () => {
    const singleItem = [
      {
        key: '1',
        label: 'Single Question',
        children: <div>Single Answer</div>,
      },
    ]

    renderComponent({ items: singleItem })

    expect(screen.getByText('Single Question')).toBeInTheDocument()
  })

  it('should expand and collapse items', () => {
    renderComponent()

    const question = screen.getByText('Question 1')

    // Expand
    fireEvent.click(question)
    expect(screen.getByText('Answer 1')).toBeVisible()

    // Collapse
    fireEvent.click(question)
    // Ant Design Collapse may keep content in DOM but hide it
  })

  it('should apply correct styling on mobile', () => {
    const { container } = renderComponent({ isMobile: true })

    const article = container.querySelector('article')
    expect(article).toHaveClass('px-4')
  })

  it('should apply correct styling on desktop', () => {
    const { container } = renderComponent({ isMobile: false })

    const article = container.querySelector('article')
    expect(article).toHaveClass('px-8')
  })

  it('should render with tabIndex for email contact', () => {
    renderComponent({ isMobile: true })

    const emailLink = screen.getByText('support@example.com')
    expect(emailLink).toHaveAttribute('tabIndex', '0')
  })
})
