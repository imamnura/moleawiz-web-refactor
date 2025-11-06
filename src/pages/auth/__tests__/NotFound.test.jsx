import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/test-utils'
import NotFound from '../NotFound'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'error_page.lost': "Oops! You're lost.",
        'error_page.it_looks':
          "It looks like the page you're looking for doesn't exist.",
        'error_page.maybe': 'Maybe it was moved or deleted.',
        'error_page.back_home': 'Back to Home',
      }
      return translations[key] || key
    },
  }),
  I18nextProvider: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}))

describe('NotFound Component', () => {
  beforeEach(() => {
    document.body.style.background = ''
  })

  it('should render 404 page with all elements', () => {
    renderWithProviders(<NotFound />)

    expect(screen.getByAltText('404 Not Found')).toBeInTheDocument()
    expect(screen.getByText("Oops! You're lost.")).toBeInTheDocument()
    expect(
      screen.getByText(
        "It looks like the page you're looking for doesn't exist."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText('Maybe it was moved or deleted.')
    ).toBeInTheDocument()
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('should set dark background on mount', () => {
    renderWithProviders(<NotFound />)

    expect(document.body.style.background).toBe('rgb(36, 48, 74)')
  })

  it('should reset background on unmount', () => {
    const { unmount } = renderWithProviders(<NotFound />)

    expect(document.body.style.background).toBe('rgb(36, 48, 74)')

    unmount()

    expect(document.body.style.background).toBe('')
  })

  it('should render image with correct dimensions', () => {
    renderWithProviders(<NotFound />)

    const image = screen.getByAltText('404 Not Found')
    expect(image).toHaveStyle({
      width: '770px',
      height: '400px',
      maxWidth: '100%',
    })
  })

  it('should render link to home page', () => {
    renderWithProviders(<NotFound />)

    const link = screen.getByText('Back to Home')
    expect(link).toHaveAttribute('href', '/home')
    expect(link).toHaveStyle({
      textDecoration: 'underline',
      fontSize: '16px',
    })
  })

  it('should render heading with correct styling', () => {
    renderWithProviders(<NotFound />)

    const heading = screen.getByText("Oops! You're lost.")
    expect(heading).toHaveStyle({
      fontSize: '28px',
      marginBottom: '11px',
    })
    expect(heading).toHaveClass('font-weight-bold')
  })

  it('should render description paragraphs with correct styling', () => {
    renderWithProviders(<NotFound />)

    const paragraph1 = screen.getByText(
      "It looks like the page you're looking for doesn't exist."
    )
    const paragraph2 = screen.getByText('Maybe it was moved or deleted.')

    expect(paragraph1).toHaveStyle({
      color: '#FFFFFF',
      fontSize: '16px',
      lineHeight: 'normal',
      marginBottom: '0',
    })

    expect(paragraph2).toHaveStyle({
      color: '#FFFFFF',
      fontSize: '16px',
      lineHeight: 'normal',
      marginBottom: '20px',
    })
  })

  it('should use translations from i18next', () => {
    renderWithProviders(<NotFound />)

    // Verify that translated texts are displayed
    expect(screen.getByText("Oops! You're lost.")).toBeInTheDocument()
    expect(
      screen.getByText(
        "It looks like the page you're looking for doesn't exist."
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText('Maybe it was moved or deleted.')
    ).toBeInTheDocument()
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('should render within page container', () => {
    renderWithProviders(<NotFound />)

    const image = screen.getByAltText('404 Not Found')
    const container = image.closest('.container')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('text-center')

    const page = container.closest('.page')
    expect(page).toBeInTheDocument()
  })

  it('should have accessible image alt text', () => {
    renderWithProviders(<NotFound />)

    const image = screen.getByAltText('404 Not Found')
    expect(image).toHaveAccessibleName('404 Not Found')
  })
})
