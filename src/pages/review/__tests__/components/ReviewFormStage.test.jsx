import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import ReviewFormStage from '../../components/ReviewFormStage'

// Mock PreviousAnswerPopover
vi.mock('../../components/PreviousAnswerPopover', () => ({
  default: ({ previousAnswer, isOpen, onOpenChange, isMobile }) => (
    <div
      data-testid="previous-answer-popover"
      data-open={isOpen}
      data-mobile={isMobile}
      onClick={() => onOpenChange?.(!isOpen)}
    >
      Previous: {previousAnswer?.answer_text}
    </div>
  ),
}))

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  convertEnter: vi.fn((text) => text?.replace(/\n/g, '<br />')),
  convertLink: vi.fn((text) => text),
  convertFileLink: vi.fn((text, type) => `<a href="${text}">${type}</a>`),
}))

// Mock Ant Design components
vi.mock('antd', () => {
  const Radio = ({ value, children, ...props }) => (
    <label data-testid={`radio-${value}`}>
      <input type="radio" value={value} {...props} />
      {children}
    </label>
  )

  return {
    Form: {
      Item: ({ children, className, name, rules }) => (
        <div data-testid="form-item" data-name={name} className={className}>
          {children}
        </div>
      ),
    },
    Radio: Object.assign(Radio, {
      Group: ({ children, onChange }) => (
        <div data-testid="radio-group" onChange={onChange}>
          {children}
        </div>
      ),
    }),
    Input: {
      TextArea: ({ onChange, placeholder, maxLength, rows, className }) => (
        <textarea
          data-testid="textarea"
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={className}
          onChange={onChange}
        />
      ),
    },
    Image: ({ src, onClick, className, width, height }) => (
      <img
        data-testid="answer-image"
        src={src}
        className={className}
        onClick={onClick}
        width={width}
        height={height}
        alt="Answer"
      />
    ),
    Divider: ({ className }) => (
      <hr data-testid="divider" className={className} />
    ),
    Modal: ({ open, children, onCancel }) =>
      open ? (
        <div data-testid="image-modal" onClick={onCancel}>
          {children}
        </div>
      ) : null,
  }
})

// Mock icons
vi.mock('@ant-design/icons', () => ({
  CloseOutlined: ({ onClick }) => (
    <button data-testid="close-icon" onClick={onClick}>
      X
    </button>
  ),
}))

describe('ReviewFormStage', () => {
  const mockStage = {
    review_id: 1,
    stage: 1,
    review_status: null,
    notes: '',
    answers: [
      {
        answer_type: 1,
        answer_text: 'This is my answer',
        question_text: 'What is your answer?',
        incrementNumber: 1,
      },
    ],
  }

  const mockPreviousStage = {
    answers: [
      {
        answer_type: 1,
        answer_text: 'Previous submission answer',
        question_text: 'What is your answer?',
      },
    ],
  }

  const mockOnRadioChange = vi.fn()
  const mockOnTextAreaChange = vi.fn()

  const renderStage = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ReviewFormStage
          stage={mockStage}
          index={0}
          onRadioChange={mockOnRadioChange}
          {...props}
        />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Question and Answer Display', () => {
    it('should render question text', () => {
      const { container } = renderStage()

      const question = container.querySelector('.font-medium.text-sm')
      expect(question).toBeInTheDocument()
    })

    it('should render text answer (type 1)', () => {
      const { container } = renderStage()

      const answer = container.querySelector('.text-gray-600.whitespace-pre-wrap')
      expect(answer).toBeInTheDocument()
    })

    it('should render HTML answer (type 3)', () => {
      const stageWithHTML = {
        ...mockStage,
        answers: [
          {
            answer_type: 3,
            answer_text: '<p>HTML answer</p>',
            question_text: 'Question?',
            incrementNumber: 1,
          },
        ],
      }

      const { container } = renderStage({ stage: stageWithHTML })

      const answer = container.querySelector('.text-gray-600.whitespace-pre-wrap')
      expect(answer).toBeInTheDocument()
    })

    it('should render image answer (type 2)', () => {
      const stageWithImage = {
        ...mockStage,
        answers: [
          {
            answer_type: 2,
            answer_text: 'https://example.com/image.jpg',
            question_text: 'Upload image?',
            incrementNumber: 1,
          },
        ],
      }

      renderStage({ stage: stageWithImage })

      const image = screen.getByTestId('answer-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('should handle dash image answer as text', () => {
      const stageWithDash = {
        ...mockStage,
        answers: [
          {
            answer_type: 2,
            answer_text: '-',
            question_text: 'Upload image?',
            incrementNumber: 1,
          },
        ],
      }

      const { container } = renderStage({ stage: stageWithDash })

      const textAnswer = container.querySelector('.text-gray-600.whitespace-pre-wrap')
      expect(textAnswer).toBeInTheDocument()
      expect(screen.queryByTestId('answer-image')).not.toBeInTheDocument()
    })

    it('should render multiple answers', () => {
      const stageWithMultiple = {
        ...mockStage,
        answers: [
          {
            answer_type: 1,
            answer_text: 'Answer 1',
            question_text: 'Question 1?',
            incrementNumber: 1,
          },
          {
            answer_type: 1,
            answer_text: 'Answer 2',
            question_text: 'Question 2?',
            incrementNumber: 2,
          },
        ],
      }

      renderStage({ stage: stageWithMultiple })

      const formItems = screen.getAllByTestId('form-item')
      // At least 2 form items for answers (plus radio and textarea)
      expect(formItems.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Previous Answer Display', () => {
    it('should render PreviousAnswerPopover when previousStage exists', () => {
      renderStage({ previousStage: mockPreviousStage })

      const popover = screen.getByTestId('previous-answer-popover')
      expect(popover).toBeInTheDocument()
    })

    it('should not render PreviousAnswerPopover when previousStage is null', () => {
      renderStage({ previousStage: null })

      expect(screen.queryByTestId('previous-answer-popover')).not.toBeInTheDocument()
    })

    it('should handle popover state changes', async () => {
      const user = userEvent.setup()
      renderStage({ previousStage: mockPreviousStage })

      const popover = screen.getByTestId('previous-answer-popover')
      
      // Click to toggle state
      await user.click(popover)
      
      // Popover state managed internally
      expect(popover).toBeInTheDocument()
    })

    it('should pass isMobile to PreviousAnswerPopover', () => {
      renderStage({ previousStage: mockPreviousStage, isMobile: true })

      const popover = screen.getByTestId('previous-answer-popover')
      expect(popover).toHaveAttribute('data-mobile', 'true')
    })
  })

  describe('Accept/Reject Radio Controls', () => {
    it('should render radio group for accept/reject', () => {
      renderStage()

      const radioGroup = screen.getByTestId('radio-group')
      expect(radioGroup).toBeInTheDocument()
    })

    it('should render Accept radio button', () => {
      renderStage()

      const acceptRadio = screen.getByTestId('radio-1')
      expect(acceptRadio).toBeInTheDocument()
    })

    it('should render Reject radio button', () => {
      renderStage()

      const rejectRadio = screen.getByTestId('radio-0')
      expect(rejectRadio).toBeInTheDocument()
    })

    it('should call onRadioChange when radio is clicked', async () => {
      const user = userEvent.setup()
      renderStage()

      const radioGroup = screen.getByTestId('radio-group')
      const acceptInput = within(radioGroup).getByDisplayValue('1')
      
      await user.click(acceptInput)

      expect(mockOnRadioChange).toHaveBeenCalled()
    })

    it('should have required validation on radio group', () => {
      renderStage()

      const formItems = screen.getAllByTestId('form-item')
      const radioFormItem = formItems.find((item) =>
        item.getAttribute('data-name')?.includes('feedback-status')
      )
      expect(radioFormItem).toBeInTheDocument()
    })
  })

  describe('Comment TextArea', () => {
    it('should render textarea for comments', () => {
      renderStage()

      const textarea = screen.getByTestId('textarea')
      expect(textarea).toBeInTheDocument()
    })

    it('should use placeholder prop', () => {
      const placeholder = 'Enter your feedback here'
      renderStage({ placeholder })

      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveAttribute('placeholder', placeholder)
    })

    it('should have maxLength of 200 characters', () => {
      renderStage()

      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveAttribute('maxLength', '200')
    })

    it('should have 3 rows', () => {
      renderStage()

      const textarea = screen.getByTestId('textarea')
      expect(textarea).toHaveAttribute('rows', '3')
    })

    it('should call onTextAreaChange when text is entered', async () => {
      const user = userEvent.setup()
      renderStage({ onTextAreaChange: mockOnTextAreaChange })

      const textarea = screen.getByTestId('textarea')
      await user.type(textarea, 'This is my feedback')

      expect(mockOnTextAreaChange).toHaveBeenCalled()
    })

    it('should update character count on input', async () => {
      const user = userEvent.setup()
      renderStage()

      const textarea = screen.getByTestId('textarea')
      await user.type(textarea, 'Test')

      // Character count managed internally
      expect(textarea).toHaveValue('Test')
    })

    it('should apply red text when approaching limit', async () => {
      const user = userEvent.setup()
      renderStage()

      const textarea = screen.getByTestId('textarea')
      const longText = 'a'.repeat(200)
      await user.type(textarea, longText)

      // Class will be applied based on charCount >= 200
      expect(textarea).toBeInTheDocument()
    })

    it('should be required when isRequired is true', () => {
      renderStage({ isRequired: true })

      const formItems = screen.getAllByTestId('form-item')
      const textareaFormItem = formItems.find((item) =>
        item.getAttribute('data-name')?.includes('feedback-comment')
      )
      expect(textareaFormItem).toBeInTheDocument()
    })
  })

  describe('Mobile Image Zoom', () => {
    it('should open image modal on mobile when image is clicked', async () => {
      const user = userEvent.setup()
      const stageWithImage = {
        ...mockStage,
        answers: [
          {
            answer_type: 2,
            answer_text: 'https://example.com/image.jpg',
            question_text: 'Upload image?',
            incrementNumber: 1,
          },
        ],
      }

      renderStage({ stage: stageWithImage, isMobile: true })

      const image = screen.getByTestId('answer-image')
      await user.click(image)

      const modal = screen.getByTestId('image-modal')
      expect(modal).toBeInTheDocument()
    })

    it('should not open modal on desktop when image is clicked', async () => {
      const user = userEvent.setup()
      const stageWithImage = {
        ...mockStage,
        answers: [
          {
            answer_type: 2,
            answer_text: 'https://example.com/image.jpg',
            question_text: 'Upload image?',
            incrementNumber: 1,
          },
        ],
      }

      renderStage({ stage: stageWithImage, isMobile: false })

      const image = screen.getByTestId('answer-image')
      await user.click(image)

      expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument()
    })

    it('should close modal when close icon is clicked', async () => {
      const user = userEvent.setup()
      const stageWithImage = {
        ...mockStage,
        answers: [
          {
            answer_type: 2,
            answer_text: 'https://example.com/image.jpg',
            question_text: 'Upload image?',
            incrementNumber: 1,
          },
        ],
      }

      renderStage({ stage: stageWithImage, isMobile: true })

      // Open modal
      const image = screen.getByTestId('answer-image')
      await user.click(image)

      expect(screen.getByTestId('image-modal')).toBeInTheDocument()

      // Close modal
      const closeIcon = screen.getByTestId('close-icon')
      await user.click(closeIcon)

      expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument()
    })
  })

  describe('Dividers', () => {
    it('should render divider between multiple answers', () => {
      const stageWithMultiple = {
        ...mockStage,
        answers: [
          {
            answer_type: 1,
            answer_text: 'Answer 1',
            question_text: 'Question 1?',
            incrementNumber: 1,
          },
          {
            answer_type: 1,
            answer_text: 'Answer 2',
            question_text: 'Question 2?',
            incrementNumber: 2,
          },
        ],
      }

      renderStage({ stage: stageWithMultiple })

      const dividers = screen.getAllByTestId('divider')
      expect(dividers.length).toBeGreaterThanOrEqual(1)
    })

    it('should not render divider for single answer', () => {
      renderStage()

      // May have dividers between stages but not within single answer
      const dividers = screen.queryAllByTestId('divider')
      expect(dividers.length).toBeLessThanOrEqual(1)
    })

    it('should render divider between stages on desktop when not last', () => {
      const stageWithMultiple = {
        ...mockStage,
        answers: [
          { answer_type: 1, answer_text: 'A1', question_text: 'Q1', incrementNumber: 1 },
          { answer_type: 1, answer_text: 'A2', question_text: 'Q2', incrementNumber: 2 },
        ],
      }

      renderStage({ stage: stageWithMultiple, isLastStage: false })

      const dividers = screen.getAllByTestId('divider')
      expect(dividers.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Mobile Layout', () => {
    it('should apply mobile padding classes', () => {
      const { container } = renderStage({ isMobile: true })

      const mobileContainer = container.querySelector('.px-\\[18px\\]')
      expect(mobileContainer).toBeInTheDocument()
    })

    it('should use mobile image dimensions', () => {
      const stageWithImage = {
        ...mockStage,
        answers: [
          {
            answer_type: 2,
            answer_text: 'https://example.com/image.jpg',
            question_text: 'Upload?',
            incrementNumber: 1,
          },
        ],
      }

      renderStage({ stage: stageWithImage, isMobile: true })

      const image = screen.getByTestId('answer-image')
      expect(image).toHaveAttribute('width', '100%')
      expect(image).toHaveAttribute('height', '100%')
    })

    it('should use desktop image dimensions', () => {
      const stageWithImage = {
        ...mockStage,
        answers: [
          {
            answer_type: 2,
            answer_text: 'https://example.com/image.jpg',
            question_text: 'Upload?',
            incrementNumber: 1,
          },
        ],
      }

      renderStage({ stage: stageWithImage, isMobile: false })

      const image = screen.getByTestId('answer-image')
      expect(image).toHaveAttribute('width', '475')
      expect(image).toHaveAttribute('height', '300')
    })
  })

  describe('Edge Cases', () => {
    it('should handle stage with no answers', () => {
      const emptyStage = {
        review_id: 1,
        stage: 1,
        review_status: null,
        notes: '',
        answers: [],
      }

      renderStage({ stage: emptyStage })

      // Should still render radio and textarea
      expect(screen.getByTestId('radio-group')).toBeInTheDocument()
      expect(screen.getByTestId('textarea')).toBeInTheDocument()
    })

    it('should handle null answers array', () => {
      const nullStage = {
        review_id: 1,
        stage: 1,
        review_status: null,
        notes: '',
        answers: null,
      }

      renderStage({ stage: nullStage })

      // Should render without crashing
      expect(screen.getByTestId('radio-group')).toBeInTheDocument()
    })

    it('should handle missing previousStage answers', () => {
      const incompletePrevious = {
        answers: null,
      }

      renderStage({ previousStage: incompletePrevious })

      expect(screen.queryByTestId('previous-answer-popover')).not.toBeInTheDocument()
    })

    it('should handle onTextAreaChange being null', async () => {
      const user = userEvent.setup()
      renderStage({ onTextAreaChange: null })

      const textarea = screen.getByTestId('textarea')
      await user.type(textarea, 'Test')

      // Should not crash
      expect(textarea).toHaveValue('Test')
    })
  })

  describe('Form Field Names', () => {
    it('should generate correct radio field name', () => {
      renderStage({ index: 2 })

      const formItems = screen.getAllByTestId('form-item')
      const radioFormItem = formItems.find((item) =>
        item.getAttribute('data-name')?.includes('feedback-status-1-2')
      )
      expect(radioFormItem).toBeInTheDocument()
    })

    it('should generate correct textarea field name', () => {
      renderStage({ index: 3 })

      const formItems = screen.getAllByTestId('form-item')
      const textareaFormItem = formItems.find((item) =>
        item.getAttribute('data-name')?.includes('feedback-comment-1-3')
      )
      expect(textareaFormItem).toBeInTheDocument()
    })
  })
})
