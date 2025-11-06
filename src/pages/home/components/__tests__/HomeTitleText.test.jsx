/**
 * HomeTitleText Component Tests
 * Unit tests for Home title component
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import HomeTitleText from '../HomeTitleText'

describe('HomeTitleText', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      userName: 'John Doe',
      isLoading: false,
      isMobileVersion: false,
      ...props,
    }

    return render(
      <I18nextProvider i18n={i18n}>
        <HomeTitleText {...defaultProps} />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    i18n.changeLanguage('en')
  })

  describe('Rendering', () => {
    it('should render component', () => {
      renderComponent()
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('should render user name', () => {
      renderComponent({ userName: 'Jane Smith' })
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument()
    })

    it('should use h1 tag for semantic HTML', () => {
      renderComponent()
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show skeleton when loading', () => {
      renderComponent({ isLoading: true })
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should have aria-live polite when loading', () => {
      renderComponent({ isLoading: true })
      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
    })

    it('should have screen reader text when loading', () => {
      renderComponent({ isLoading: true })
      expect(screen.getByText(/loading user name/i)).toBeInTheDocument()
    })

    it('should not show user name when loading', () => {
      renderComponent({ isLoading: true, userName: 'Test User' })
      expect(screen.queryByText(/Test User/i)).not.toBeInTheDocument()
    })
  })

  describe('Desktop Version', () => {
    it('should render single line on desktop', () => {
      renderComponent({ isMobileVersion: false })
      const heading = screen.getByRole('heading')
      expect(heading).not.toHaveClass('block')
    })

    it('should have correct text size on desktop', () => {
      renderComponent({ isMobileVersion: false })
      const heading = screen.getByRole('heading')
      expect(heading).toHaveClass('text-xl')
    })

    it('should show greeting text on desktop', () => {
      renderComponent({ isMobileVersion: false })
      expect(screen.getByText(/hi/i)).toBeInTheDocument()
    })
  })

  describe('Mobile Version', () => {
    it('should render multi-line on mobile', () => {
      renderComponent({ isMobileVersion: true })
      const heading = screen.getByRole('heading')
      const spans = heading.querySelectorAll('span.block')
      expect(spans.length).toBeGreaterThan(0)
    })

    it('should have correct text size on mobile', () => {
      renderComponent({ isMobileVersion: true })
      const heading = screen.getByRole('heading')
      expect(heading).toHaveClass('text-lg')
    })

    it('should show both greeting lines on mobile', () => {
      renderComponent({ isMobileVersion: true })
      expect(screen.getByText(/hi/i)).toBeInTheDocument()
    })
  })

  describe('User Name Styling', () => {
    it('should highlight user name with primary color', () => {
      renderComponent({ userName: 'Alice' })
      const nameSpan = screen.getByText('Alice')
      expect(nameSpan).toHaveClass('text-primary')
    })
  })

  describe('Translation', () => {
    it('should use translation keys', () => {
      renderComponent()
      // Component uses i18n, check if text is rendered
      const heading = screen.getByRole('heading')
      expect(heading).toHaveTextContent(/hi/i)
    })

    it('should handle language change', () => {
      const { rerender } = renderComponent()

      // Change language
      i18n.changeLanguage('id')

      rerender(
        <I18nextProvider i18n={i18n}>
          <HomeTitleText
            userName="Test"
            isLoading={false}
            isMobileVersion={false}
          />
        </I18nextProvider>
      )

      const heading = screen.getByRole('heading')
      expect(heading).toBeInTheDocument()
    })
  })

  describe('PropTypes', () => {
    it('should have PropTypes defined', () => {
      expect(HomeTitleText.propTypes).toBeDefined()
      expect(HomeTitleText.propTypes.userName).toBeDefined()
      expect(HomeTitleText.propTypes.isLoading).toBeDefined()
      expect(HomeTitleText.propTypes.isMobileVersion).toBeDefined()
    })

    it('should have default props', () => {
      expect(HomeTitleText.defaultProps).toBeDefined()
      expect(HomeTitleText.defaultProps.userName).toBe('')
      expect(HomeTitleText.defaultProps.isLoading).toBe(false)
      expect(HomeTitleText.defaultProps.isMobileVersion).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should be accessible with proper heading', () => {
      renderComponent()
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('should have accessible loading state', () => {
      renderComponent({ isLoading: true })
      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
    })

    it('should provide screen reader context when loading', () => {
      renderComponent({ isLoading: true })
      const srText = screen.getByText(/loading user name/i)
      expect(srText).toHaveClass('sr-only')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty user name', () => {
      renderComponent({ userName: '' })
      const heading = screen.getByRole('heading')
      expect(heading).toBeInTheDocument()
    })

    it('should handle undefined user name', () => {
      renderComponent({ userName: undefined })
      const heading = screen.getByRole('heading')
      expect(heading).toBeInTheDocument()
    })

    it('should handle null user name', () => {
      renderComponent({ userName: null })
      const heading = screen.getByRole('heading')
      expect(heading).toBeInTheDocument()
    })

    it('should handle very long user name', () => {
      const longName = 'A'.repeat(100)
      renderComponent({ userName: longName })
      expect(screen.getByText(longName)).toBeInTheDocument()
    })

    it('should handle special characters in user name', () => {
      renderComponent({ userName: "John O'Neill" })
      expect(screen.getByText("John O'Neill")).toBeInTheDocument()
    })
  })
})
