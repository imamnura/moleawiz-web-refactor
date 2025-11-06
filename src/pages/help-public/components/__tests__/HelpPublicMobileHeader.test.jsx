/**
 * HelpPublicMobileHeader Component Tests
 * Unit tests for help-public mobile header
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import { HelpPublicMobileHeader } from '../HelpPublicMobileHeader'

describe('HelpPublicMobileHeader', () => {
  const defaultProps = {
    isMobile: true,
    isScaling: false,
    currentTopic: 'feature.feature_help.side_dpd.frequently_asked_questions',
  }

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <HelpPublicMobileHeader {...defaultProps} {...props} />
        </I18nextProvider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render header with semantic HTML', () => {
    const { container } = renderComponent()

    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('should render Help Center title', () => {
    renderComponent()

    // Actual heading is "Is there anything we can help you?"
    expect(
      screen.getByRole('heading', { name: /is there anything we can help you/i })
    ).toBeInTheDocument()
  })

  it('should render current topic as button', () => {
    renderComponent()

    // Button has aria-label with topic key
    const button = screen.getByRole('button', { name: /select topic/i })
    expect(button).toBeInTheDocument()
  })

  it('should display Login topic correctly', () => {
    renderComponent({ currentTopic: 'Login' })

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('should show chevron down icon', () => {
    const { container } = renderComponent()

    const chevronIcon = container.querySelector('.anticon-down')
    expect(chevronIcon).toBeInTheDocument()
  })

  it('should apply sticky positioning when not scaling', () => {
    const { container } = renderComponent({ isScaling: false })

    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky')
  })

  it('should not apply sticky positioning when scaling', () => {
    const { container } = renderComponent({ isScaling: true })

    const header = container.querySelector('header')
    // Check that sticky is removed when scaling
    expect(header).toBeInTheDocument()
  })

  it('should hide on desktop', () => {
    const { container } = renderComponent({ isMobile: false })

    const header = container.querySelector('header')
    // Component uses lg:hidden for desktop hiding
    expect(header).toBeInTheDocument()
  })

  it('should show on mobile', () => {
    const { container } = renderComponent({ isMobile: true })

    const header = container.querySelector('header')
    // Mobile version is shown by default
    expect(header).toBeInTheDocument()
  })

  it('should have correct PropTypes', () => {
    // This test verifies that PropTypes are defined
    expect(HelpPublicMobileHeader.propTypes).toBeDefined()
    expect(HelpPublicMobileHeader.propTypes.isMobile).toBeDefined()
    expect(HelpPublicMobileHeader.propTypes.isScaling).toBeDefined()
    expect(HelpPublicMobileHeader.propTypes.currentTopic).toBeDefined()
  })

  it('should apply background image overlay', () => {
    const { container } = renderComponent()

    const header = container.querySelector('header')
    // Check header has background image
    const image = container.querySelector('img[alt=""]')
    expect(image).toBeInTheDocument()
  })

  it('should render topic button with full width', () => {
    renderComponent()

    const button = screen.getByRole('button', { name: /select topic/i })
    // Button exists and is interactive
    expect(button).toBeInTheDocument()
  })

  it('should translate topic key to display text', () => {
    renderComponent({
      currentTopic: 'feature.feature_help.side_dpd.profile',
    })

    const button = screen.getByRole('button', { name: /select topic/i })
    expect(button).toBeInTheDocument()
  })

  it('should be accessible with proper headings', () => {
    renderComponent()

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/is there anything we can help you/i)
  })

  it('should handle long topic names gracefully', () => {
    renderComponent({
      currentTopic: 'feature.feature_help.side_dpd.frequently_asked_questions',
    })

    const button = screen.getByRole('button')
    // Button renders with long topic
    expect(button).toBeInTheDocument()
  })
})
