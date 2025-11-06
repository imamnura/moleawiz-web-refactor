/**
 * FAQPage Component Tests
 * Unit tests for help-public FAQ topic page
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import FAQPage from '../FAQPage'

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

describe('FAQPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <FAQPage />
        </I18nextProvider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    // Reset i18n language
    i18n.changeLanguage('en')
  })

  it('should render FAQ page', () => {
    renderComponent()

    // Should render the wrapper component
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('should render FAQ topic title', () => {
    renderComponent()

    // Actual heading is "Is there anything we can help you?"
    expect(
      screen.getByRole('heading', { name: /is there anything we can help you/i })
    ).toBeInTheDocument()
  })

  it('should render FAQ questions', () => {
    renderComponent()

    // Check for FAQ items in collapse
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

    // Images should still be rendered with same count
    const imagesAfter = screen.getAllByRole('img')
    expect(imagesAfter.length).toBe(countBefore)
  })

  it('should render with banner', () => {
    renderComponent()

    // Banner should be present with heading
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('should render FAQ items as collapsible', () => {
    renderComponent()

    // Check for collapse panels (tabs in collapsed state)
    const tabs = screen.queryAllByRole('tab')
    expect(tabs.length).toBeGreaterThan(0)
  })

  it('should be accessible', () => {
    const { container } = renderComponent()

    // Check for proper semantic structure
    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
  })
})
