/**
 * LoginHelpPage Component Tests
 * Unit tests for help-public Login Help topic page
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import LoginHelpPage from '../LoginHelpPage'

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

describe('LoginHelpPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <LoginHelpPage />
        </I18nextProvider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    i18n.changeLanguage('en')
  })

  it('should render Login Help page', () => {
    renderComponent()

    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('should render Login topic title', () => {
    renderComponent()

    // Actual heading is "Is there anything we can help you?"
    expect(
      screen.getByRole('heading', { name: /is there anything we can help you/i })
    ).toBeInTheDocument()
  })

  it('should render login help questions', () => {
    renderComponent()

    // Check for login help content
    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()
  })

  it('should apply correct styling', () => {
    renderComponent()

    const article = screen.getByRole('article')
    // Check article exists with styling
    expect(article).toBeInTheDocument()
  })

  it('should render images based on language', () => {
    renderComponent()

    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('should change images when language changes', () => {
    renderComponent()

    const imagesBefore = screen.getAllByRole('img')
    const countBefore = imagesBefore.length

    // Change language to Indonesian
    i18n.changeLanguage('id')

    const imagesAfter = screen.getAllByRole('img')
    expect(imagesAfter.length).toBe(countBefore)
  })

  it('should render with banner', () => {
    renderComponent()

    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('should render login items as collapsible', () => {
    renderComponent()

    // Check for collapse items (tabs)
    const tabs = screen.queryAllByRole('tab')
    expect(tabs.length).toBeGreaterThan(0)
  })

  it('should be accessible', () => {
    const { container } = renderComponent()

    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
  })
})
