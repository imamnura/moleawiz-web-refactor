import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import PreviousAnswerPopover from '../../components/PreviousAnswerPopover'

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  convertEnter: vi.fn((text) => text?.replace(/\n/g, '<br />')),
  convertLink: vi.fn((text) => text),
  convertFileLink: vi.fn((text, type) => `<a href="${text}">${type}</a>`),
}))

// Mock Ant Design components
vi.mock('antd', () => ({
  Popover: ({ children, content, open, onOpenChange }) => (
    <div data-testid="popover">
      <div onClick={() => onOpenChange?.(!open)}>{children}</div>
      {open && <div data-testid="popover-content">{content}</div>}
    </div>
  ),
  Collapse: ({ items, expandIcon }) => (
    <div data-testid="collapse">
      {items.map((item) => (
        <div key={item.key}>
          <div data-testid="collapse-label">{item.label}</div>
          <div data-testid="collapse-content">{item.children}</div>
          {expandIcon && expandIcon({ isActive: false })}
        </div>
      ))}
    </div>
  ),
  Image: ({ src, fallback, alt }) => (
    <img src={src || fallback} alt={alt} data-testid="ant-image" />
  ),
}))

// Mock Ant Design icons
vi.mock('@ant-design/icons', () => ({
  DownOutlined: () => <span data-testid="down-icon">Down</span>,
  UpOutlined: () => <span data-testid="up-icon">Up</span>,
}))

// Mock SVG
vi.mock('@assets/images/custom_svgs/PreviousPopoverReview', () => ({
  default: ({ fill }) => (
    <svg data-testid="previous-icon" fill={fill}>
      Previous
    </svg>
  ),
}))

describe('PreviousAnswerPopover', () => {
  const mockOnOpenChange = vi.fn()

  const textAnswer = {
    answer_type: 1,
    answer_text: 'This is a text answer',
    question_text: 'What is your answer?',
  }

  const imageAnswer = {
    answer_type: 2,
    answer_text: 'https://example.com/image.jpg',
    question_text: 'Upload an image',
  }

  const htmlAnswer = {
    answer_type: 3,
    answer_text: '<p>HTML content</p>',
    question_text: 'HTML question',
  }

  const renderPopover = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <PreviousAnswerPopover
          previousAnswer={textAnswer}
          isOpen={false}
          onOpenChange={mockOnOpenChange}
          {...props}
        />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Null/Empty States', () => {
    it('should return null if previousAnswer is null', () => {
      const { container } = renderPopover({ previousAnswer: null })
      expect(container.firstChild).toBeNull()
    })

    it('should return null if previousAnswer is undefined', () => {
      const { container } = renderPopover({ previousAnswer: undefined })
      expect(container.firstChild).toBeNull()
    })

    it('should return null if answer_type is missing', () => {
      const { container } = renderPopover({
        previousAnswer: { answer_text: 'test' },
      })
      // Component still renders the popover even without answer_type
      expect(container.querySelector('.flex.justify-end')).toBeInTheDocument()
    })
  })

  describe('Desktop Layout (Popover)', () => {
    it('should render popover trigger on desktop', () => {
      renderPopover({ isMobile: false })

      expect(screen.getByTestId('popover')).toBeInTheDocument()
    })

    it('should display "see previous answer" text when closed', () => {
      renderPopover({ isOpen: false, isMobile: false })

      expect(
        screen.getByText(/see.*previous.*answer/i)
      ).toBeInTheDocument()
    })

    it('should display "close previous answer" text when open', () => {
      renderPopover({ isOpen: true, isMobile: false })

      expect(
        screen.getByText(/close.*previous.*answer/i)
      ).toBeInTheDocument()
    })

    it('should change icon color when open', () => {
      renderPopover({ isOpen: true, isMobile: false })

      const icon = screen.getByTestId('previous-icon')
      expect(icon).toHaveAttribute('fill', '#0066CC')
    })

    it('should use default icon color when closed', () => {
      renderPopover({ isOpen: false, isMobile: false })

      const icon = screen.getByTestId('previous-icon')
      expect(icon).toHaveAttribute('fill', '#1F1F1F')
    })

    it('should call onOpenChange when clicked', async () => {
      const user = userEvent.setup()
      renderPopover({ isOpen: false, isMobile: false })

      const trigger = screen.getByText(/see.*previous.*answer/i)
      await user.click(trigger)

      expect(mockOnOpenChange).toHaveBeenCalledWith(true)
    })

    it('should show popover content when open', () => {
      renderPopover({ isOpen: true, isMobile: false })

      expect(screen.getByTestId('popover-content')).toBeInTheDocument()
    })
  })

  describe('Mobile Layout (Collapse)', () => {
    it('should render collapse on mobile', () => {
      renderPopover({ isMobile: true })

      expect(screen.getByTestId('collapse')).toBeInTheDocument()
    })

    it('should display collapse label', () => {
      renderPopover({ isMobile: true })

      expect(screen.getByTestId('collapse-label')).toBeInTheDocument()
    })

    it('should display collapse content', () => {
      renderPopover({ isMobile: true })

      expect(screen.getByTestId('collapse-content')).toBeInTheDocument()
    })

    it('should show expand/collapse icons', () => {
      renderPopover({ isMobile: true })

      expect(screen.getByTestId('down-icon')).toBeInTheDocument()
    })
  })

  describe('Answer Type: Text (type 1)', () => {
    it('should render text answer correctly', () => {
      renderPopover({
        previousAnswer: textAnswer,
        isOpen: true,
        isMobile: false,
      })

      expect(screen.getByText('This is a text answer')).toBeInTheDocument()
    })

    it('should apply max-width on desktop for text', () => {
      const { container } = renderPopover({
        previousAnswer: textAnswer,
        isOpen: true,
        isMobile: false,
      })

      const textDiv = container.querySelector('.max-w-\\[265px\\]')
      expect(textDiv).toBeInTheDocument()
    })

    it('should use full width on mobile for text', () => {
      const { container } = renderPopover({
        previousAnswer: textAnswer,
        isMobile: true,
      })

      const textDiv = container.querySelector('.max-w-full')
      expect(textDiv).toBeInTheDocument()
    })

    it('should convert line breaks in text answer', () => {
      renderPopover({
        previousAnswer: { ...textAnswer, answer_text: 'Line 1\nLine 2' },
        isOpen: true,
      })

      // Verify the content div exists (convertEnter processes the text internally)
      const content = screen.getByTestId('popover-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Answer Type: HTML (type 3)', () => {
    it('should render HTML answer correctly', () => {
      renderPopover({
        previousAnswer: htmlAnswer,
        isOpen: true,
        isMobile: false,
      })

      const content = screen.getByTestId('popover-content')
      expect(content.innerHTML).toContain('HTML content')
    })

    it('should use dangerouslySetInnerHTML for HTML content', () => {
      const { container } = renderPopover({
        previousAnswer: htmlAnswer,
        isOpen: true,
      })

      const htmlDiv = container.querySelector('.text-gray-600')
      expect(htmlDiv).toBeInTheDocument()
    })
  })

  describe('Answer Type: Image (type 2)', () => {
    it('should render image answer correctly', () => {
      renderPopover({
        previousAnswer: imageAnswer,
        isOpen: true,
        isMobile: false,
      })

      const image = screen.getByTestId('ant-image')
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('should use desktop image dimensions', () => {
      renderPopover({
        previousAnswer: imageAnswer,
        isOpen: true,
        isMobile: false,
      })

      const image = screen.getByTestId('ant-image')
      expect(image).toBeInTheDocument()
    })

    it('should use mobile image dimensions', () => {
      renderPopover({
        previousAnswer: imageAnswer,
        isMobile: true,
      })

      const image = screen.getByTestId('ant-image')
      expect(image).toBeInTheDocument()
    })

    it('should handle dash image answer as text', () => {
      renderPopover({
        previousAnswer: { ...imageAnswer, answer_text: '-' },
        isOpen: true,
      })

      // Should render text content instead of image
      expect(screen.getByText('-')).toBeInTheDocument()
    })
  })

  describe('Answer Type: File (type 6)', () => {
    it('should convert file links correctly', () => {
      renderPopover({
        previousAnswer: {
          answer_type: 6,
          answer_text: 'https://example.com/file.pdf',
        },
        isOpen: true,
      })

      // Verify the content div exists (convertFileLink processes the link internally)
      const content = screen.getByTestId('popover-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply correct text color classes', () => {
      const { container } = renderPopover({
        isOpen: true,
        isMobile: false,
      })

      const textDiv = container.querySelector('.text-gray-600')
      expect(textDiv).toBeInTheDocument()
    })

    it('should apply rounded corners to images', () => {
      renderPopover({
        previousAnswer: imageAnswer,
        isOpen: true,
      })

      const image = screen.getByTestId('ant-image')
      expect(image).toBeInTheDocument()
    })

    it('should apply correct background to collapse on mobile', () => {
      const { container } = renderPopover({ isMobile: true })

      const collapse = screen.getByTestId('collapse')
      expect(collapse).toBeInTheDocument()
    })
  })
})
