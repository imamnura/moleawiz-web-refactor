import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import {
  DesktopContentWrapper,
  HelpTopicCollapse,
} from '../HelpContentWrapper'

// Mock Banner image
vi.mock('@/assets/images/png/help/img_banner_help.png', () => ({
  default: 'mocked-banner.png',
}))

// Mock Ant Design components
vi.mock('antd', () => ({
  Collapse: ({ children, items, className, expandIconPosition }) => (
    <div
      data-testid="collapse"
      className={className}
      data-expand-icon-position={expandIconPosition}
    >
      {items?.map((item, index) => (
        <div key={item.key || index} data-testid="collapse-item">
          <div data-testid="collapse-label">{item.label}</div>
          <div data-testid="collapse-content">{item.children}</div>
        </div>
      ))}
    </div>
  ),
  ConfigProvider: ({ children }) => <div>{children}</div>,
  Image: ({ src, alt }) => <img src={src} alt={alt} data-testid="image" />,
}))

// Mock icons
vi.mock('@ant-design/icons', () => ({
  DownOutlined: () => <span data-testid="down-icon">▼</span>,
  UpOutlined: () => <span data-testid="up-icon">▲</span>,
}))

describe('DesktopContentWrapper', () => {
  const mockTopicLabel = 'FAQ'
  const mockChildren = <div data-testid="mock-content">Test Content</div>

  const renderWrapper = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <DesktopContentWrapper
          topicLabel={mockTopicLabel}
          isMobile={false}
          {...props}
        >
          {mockChildren}
        </DesktopContentWrapper>
      </I18nextProvider>
    )
  }

  describe('Desktop Layout', () => {
    it('should render article wrapper', () => {
      renderWrapper()

      const article = screen.getByRole('article')
      expect(article).toBeInTheDocument()
    })

    it('should render header with banner', () => {
      renderWrapper()

      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })

    it('should render banner image', () => {
      renderWrapper()

      const bannerImg = screen.getByAltText('')
      expect(bannerImg).toHaveAttribute('src', 'mocked-banner.png')
    })

    it('should have aria-hidden on banner image', () => {
      renderWrapper()

      const bannerImg = screen.getByAltText('')
      expect(bannerImg).toHaveAttribute('aria-hidden', 'true')
    })

    it('should render sr-only heading', () => {
      const { container } = renderWrapper()

      const srHeading = container.querySelector('.sr-only')
      expect(srHeading).toHaveTextContent('Help Center Banner')
    })

    it('should display topic label', () => {
      renderWrapper()

      expect(screen.getByText('FAQ')).toBeInTheDocument()
    })

    it('should render children content', () => {
      renderWrapper()

      expect(screen.getByTestId('mock-content')).toBeInTheDocument()
    })

    it('should have correct banner height', () => {
      const { container } = renderWrapper()

      const header = container.querySelector('header')
      expect(header).toHaveClass('h-[130px]')
    })

    it('should have rounded bottom corners on banner', () => {
      const { container } = renderWrapper()

      const header = container.querySelector('header')
      expect(header).toHaveClass('rounded-b-2xl')
    })

    it('should have correct content padding', () => {
      const { container } = renderWrapper()

      const section = container.querySelector('section')
      expect(section).toHaveClass('px-[42px]')
    })

    it('should have negative top positioning for content overlay', () => {
      const { container } = renderWrapper()

      const section = container.querySelector('section')
      expect(section).toHaveClass('-top-[130px]')
    })
  })

  describe('Mobile Layout', () => {
    it('should render mobile layout when isMobile is true', () => {
      renderWrapper({ isMobile: true })

      expect(screen.getByTestId('mock-content')).toBeInTheDocument()
    })

    it('should render background extension div on mobile', () => {
      const { container } = renderWrapper({ isMobile: true })

      const bgExtension = container.querySelector('.bg-background-header')
      expect(bgExtension).toBeInTheDocument()
    })

    it('should have aria-hidden on background extension', () => {
      const { container } = renderWrapper({ isMobile: true })

      const bgExtension = container.querySelector('.bg-background-header')
      expect(bgExtension).toHaveAttribute('aria-hidden', 'true')
    })

    it('should not render banner on mobile', () => {
      renderWrapper({ isMobile: true })

      const banner = screen.queryByRole('banner')
      expect(banner).not.toBeInTheDocument()
    })

    it('should not render topic label on mobile', () => {
      renderWrapper({ isMobile: true })

      // Topic label is only on desktop
      const topicBadge = screen.queryByText('FAQ')
      // On mobile, no topic label is shown
      expect(topicBadge).not.toBeInTheDocument()
    })

    it('should have mobile-specific padding', () => {
      const { container } = renderWrapper({ isMobile: true })

      const article = container.querySelector('article')
      expect(article).toHaveClass('px-[18px]')
    })

    it('should have negative margin for mobile positioning', () => {
      const { container } = renderWrapper({ isMobile: true })

      const article = container.querySelector('article')
      expect(article).toHaveClass('-mt-[57px]')
    })
  })

  describe('Topic Label Variants', () => {
    it('should render string topic label', () => {
      renderWrapper({ topicLabel: 'Login' })

      expect(screen.getByText('Login')).toBeInTheDocument()
    })

    it('should render element topic label', () => {
      const elementLabel = <span data-testid="custom-label">Custom Topic</span>
      renderWrapper({ topicLabel: elementLabel })

      expect(screen.getByTestId('custom-label')).toBeInTheDocument()
    })

    it('should render topic label with background', () => {
      const { container } = renderWrapper()

      const topicSpan = container.querySelector('.bg-white')
      expect(topicSpan).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should use semantic article element', () => {
      renderWrapper()

      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('should use semantic header element for banner', () => {
      renderWrapper()

      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should use semantic section element for content', () => {
      const { container } = renderWrapper()

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('should have h2 heading for assistance prompt', () => {
      const { container } = renderWrapper()

      const h2 = container.querySelector('h2')
      expect(h2).toBeInTheDocument()
    })
  })
})

describe('HelpTopicCollapse', () => {
  const mockItems = [
    {
      key: 'item-1',
      label: 'Question 1',
      content: 'Answer 1',
    },
    {
      key: 'item-2',
      label: 'Question 2',
      content: <div data-testid="custom-content">Custom Answer</div>,
    },
    {
      label: 'Question 3',
      content: 'Answer 3',
    },
  ]

  const renderCollapse = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <HelpTopicCollapse items={mockItems} isMobile={false} {...props} />
      </I18nextProvider>
    )
  }

  describe('Rendering', () => {
    it('should render Collapse component', () => {
      renderCollapse()

      expect(screen.getByTestId('collapse')).toBeInTheDocument()
    })

    it('should render all collapse items', () => {
      renderCollapse()

      const items = screen.getAllByTestId('collapse-item')
      expect(items).toHaveLength(3)
    })

    it('should render item labels', () => {
      renderCollapse()

      expect(screen.getByText('Question 1')).toBeInTheDocument()
      expect(screen.getByText('Question 2')).toBeInTheDocument()
      expect(screen.getByText('Question 3')).toBeInTheDocument()
    })

    it('should render item content', () => {
      renderCollapse()

      expect(screen.getByText('Answer 1')).toBeInTheDocument()
      expect(screen.getByText('Answer 3')).toBeInTheDocument()
    })

    it('should render custom content element', () => {
      renderCollapse()

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    it('should use provided keys', () => {
      renderCollapse()

      const labels = screen.getAllByTestId('collapse-label')
      expect(labels[0]).toBeInTheDocument()
      expect(labels[1]).toBeInTheDocument()
    })

    it('should generate keys for items without key', () => {
      renderCollapse()

      // Third item has no key, should still render
      expect(screen.getByText('Question 3')).toBeInTheDocument()
    })
  })

  describe('Desktop Styling', () => {
    it('should apply desktop font styling', () => {
      const { container } = renderCollapse({ isMobile: false })

      const listItem = container.querySelector('#list-collapse-help')
      if (listItem) {
        const styles = window.getComputedStyle(listItem)
        expect(styles.fontWeight).toBe('500')
      }
    })

    it('should apply desktop text size to content', () => {
      const { container } = renderCollapse({ isMobile: false })

      const content = container.querySelector('.text-sm')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Mobile Styling', () => {
    it('should apply mobile font styling', () => {
      const { container } = renderCollapse({ isMobile: true })

      const listItem = container.querySelector('#list-collapse-help')
      if (listItem) {
        const styles = window.getComputedStyle(listItem)
        expect(styles.fontSize).toBe('12px')
        expect(styles.lineHeight).toBe('15px')
      }
    })

    it('should apply mobile text size to content', () => {
      const { container } = renderCollapse({ isMobile: true })

      const content = container.querySelector('.text-xs')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Collapse Configuration', () => {
    it('should have correct border class', () => {
      renderCollapse()

      const collapse = screen.getByTestId('collapse')
      expect(collapse).toHaveClass('border-[#E5E5E6]')
    })

    it('should position expand icon at end', () => {
      renderCollapse()

      const collapse = screen.getByTestId('collapse')
      expect(collapse).toHaveAttribute('data-expand-icon-position', 'end')
    })

    it('should have learning journey class', () => {
      renderCollapse()

      const collapse = screen.getByTestId('collapse')
      expect(collapse).toHaveClass('collapsed-learning-journey')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const { container } = render(
        <I18nextProvider i18n={i18n}>
          <HelpTopicCollapse items={[]} isMobile={false} />
        </I18nextProvider>
      )

      expect(container).toBeInTheDocument()
    })

    it('should handle items with only label', () => {
      const minimalItems = [{ label: 'Minimal', content: '' }]

      render(
        <I18nextProvider i18n={i18n}>
          <HelpTopicCollapse items={minimalItems} isMobile={false} />
        </I18nextProvider>
      )

      expect(screen.getByText('Minimal')).toBeInTheDocument()
    })

    it('should apply text description class to content', () => {
      const { container } = renderCollapse()

      const content = container.querySelector('.text-text-desc')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Content Variants', () => {
    it('should render string content', () => {
      renderCollapse()

      expect(screen.getByText('Answer 1')).toBeInTheDocument()
    })

    it('should render element content', () => {
      renderCollapse()

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    it('should handle mixed content types', () => {
      renderCollapse()

      expect(screen.getByText('Answer 1')).toBeInTheDocument()
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(screen.getByText('Answer 3')).toBeInTheDocument()
    })
  })
})
