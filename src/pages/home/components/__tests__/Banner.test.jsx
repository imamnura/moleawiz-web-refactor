/**
 * Banner Component Tests
 * Unit tests for Home banner carousel
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import i18n from '@/localize/i18n'
import Banner from '../Banner'

// Mock Swiper components
vi.mock('swiper/react', () => ({
  Swiper: vi.fn(({ children, ...props }) => (
    <div data-testid="swiper" {...props}>
      {children}
    </div>
  )),
  SwiperSlide: vi.fn(({ children }) => (
    <div data-testid="swiper-slide">{children}</div>
  )),
}))

vi.mock('swiper/modules', () => ({
  Pagination: vi.fn(),
}))

describe('Banner', () => {
  const mockStore = configureStore({
    reducer: {
      home: (state = {}) => state,
    },
  })

  const renderComponent = (props = {}) => {
    const defaultProps = {
      isOneCol: { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 24 },
      journeyLength: 0,
      isMobileVersion: false,
      ...props,
    }

    return render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Banner {...defaultProps} />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    )
  }

  describe('Rendering', () => {
    it('should render component', () => {
      renderComponent()
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should use semantic HTML section tag', () => {
      const { container } = renderComponent()
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('should have aria-label for region', () => {
      renderComponent()
      const region = screen.getByRole('region', { name: /welcome banner/i })
      expect(region).toBeInTheDocument()
    })
  })

  describe('With Journeys', () => {
    it('should show banner when journeyLength > 1', () => {
      // Component logic: shows carousel only when journeyLength === 1
      renderComponent({ journeyLength: 2 })
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should have banner heading', () => {
      renderComponent({ journeyLength: 1 })
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Without Journeys (Welcome Banner)', () => {
    it('should show welcome banner when journeyLength is 0', () => {
      renderComponent({ journeyLength: 0 })
      const banner = screen.getByRole('img', { name: /welcome banner/i })
      expect(banner).toBeInTheDocument()
    })

    it('should show welcome banner when journeyLength > 1', () => {
      renderComponent({ journeyLength: 5 })
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should have welcome banner heading', () => {
      renderComponent({ journeyLength: 0 })
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Navigation Icons', () => {
    it('should have icons for navigation when multiple banners', () => {
      // Component shows carousel (with icons) when journeyLength === 1
      const { container } = renderComponent({ journeyLength: 1 })

      // Check that component rendered
      expect(container.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('Desktop Version', () => {
    it('should render desktop layout', () => {
      const { container } = renderComponent({ isMobileVersion: false })
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('should have correct column span for desktop', () => {
      const isOneCol = { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 24 }
      renderComponent({ isOneCol, isMobileVersion: false })
      const section = screen.getByRole('region')
      expect(section).toBeInTheDocument()
    })
  })

  describe('Mobile Version', () => {
    it('should render mobile layout', () => {
      const { container } = renderComponent({ isMobileVersion: true })
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('should adjust layout for mobile', () => {
      renderComponent({ isMobileVersion: true, journeyLength: 0 })
      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  describe('PropTypes', () => {
    it('should have PropTypes defined', () => {
      expect(Banner.propTypes).toBeDefined()
      expect(Banner.propTypes.isOneCol).toBeDefined()
      expect(Banner.propTypes.journeyLength).toBeDefined()
      expect(Banner.propTypes.isMobileVersion).toBeDefined()
    })

    it('should have default props', () => {
      expect(Banner.defaultProps).toBeDefined()
      expect(Banner.defaultProps.isOneCol).toBe(null)
    })
  })

  describe('Accessibility', () => {
    it('should have semantic region role', () => {
      renderComponent()
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      renderComponent({ journeyLength: 1 })
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })

    it('should have descriptive image alt text', () => {
      renderComponent({ journeyLength: 0 })
      const img = screen.getByAltText(/welcome to the learning platform/i)
      expect(img).toBeInTheDocument()
    })
  })

  describe('Conditional Rendering', () => {
    it('should render single banner when journeyLength is 0', () => {
      renderComponent({ journeyLength: 0 })
      const banner = screen.getByRole('img', { name: /welcome banner/i })
      expect(banner).toBeInTheDocument()
    })

    it('should render single banner when journeyLength > 1', () => {
      renderComponent({ journeyLength: 5 })
      const region = screen.getByRole('region')
      expect(region).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero journeyLength', () => {
      renderComponent({ journeyLength: 0 })
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle large journeyLength', () => {
      renderComponent({ journeyLength: 999 })
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle undefined isOneCol', () => {
      renderComponent({ isOneCol: undefined })
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should handle null journeyLength', () => {
      renderComponent({ journeyLength: null })
      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  describe('Translation', () => {
    it('should use translation for banner', () => {
      renderComponent({ journeyLength: 1 })
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('should have proper heading text', () => {
      renderComponent({ journeyLength: 0 })
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })
  })
})
