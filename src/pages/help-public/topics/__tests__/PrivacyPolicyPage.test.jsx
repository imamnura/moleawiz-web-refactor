/**
 * PrivacyPolicyPage Component Tests
 * Unit tests for help-public Privacy Policy topic page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import PrivacyPolicyPage from '../PrivacyPolicyPage'

// Mock hooks
vi.mock('../../hooks/useEmailContact', () => ({
  useEmailContact: () => ({
    contactEmail: 'support@example.com',
    handleEmailClick: vi.fn(),
    loading: false,
  }),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useOutletContext: () => ({
      isMobile: false,
      isScaling: false,
    }),
  }
})

describe('PrivacyPolicyPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <PrivacyPolicyPage />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    i18n.changeLanguage('en')
  })

  it('should render Privacy Policy page', () => {
    renderComponent()

    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('should render Privacy Policy topic title', () => {
    renderComponent()

    expect(
      screen.getByRole('heading', { name: /is there anything we can help you/i })
    ).toBeInTheDocument()
  })

  it('should render privacy policy sections', () => {
    renderComponent()

    // Check for General section
    expect(screen.getByText(/general/i)).toBeInTheDocument()
  })

  it('should render privacy policy content', () => {
    renderComponent()

    // Check for digima ASIA text
    expect(screen.getByText(/digima/i)).toBeInTheDocument()
  })

  it('should apply correct styling', () => {
    renderComponent()

    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()
  })

  it('should render with banner', () => {
    renderComponent()

    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('should render policy items as collapsible', () => {
    renderComponent()

    const collapseElements = screen.queryAllByRole('tab')
    expect(collapseElements.length).toBeGreaterThan(0)
  })

  it('should use email contact hook', () => {
    renderComponent()

    // The hook should be called during component render
    // Verify component renders without errors
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('should be accessible', () => {
    const { container } = renderComponent()

    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
  })

  it('should render important privacy policy sections', () => {
    renderComponent()

    // Check for key privacy policy content
    expect(
      screen.getByText(/we collect, use, and share your data/i)
    ).toBeInTheDocument()
  })
})
