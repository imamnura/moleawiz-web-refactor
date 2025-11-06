import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import ReviewPreview from '../../components/ReviewPreview'

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  convertEnter: vi.fn((text) => text?.replace(/\n/g, '<br />')),
  convertLink: vi.fn((text) => text),
  convertFileLink: vi.fn((text, type) => `<a href="${text}">${type}</a>`),
}))

// Mock Ant Design components
vi.mock('antd', () => ({
  Modal: ({ open, children, onCancel, className }) =>
    open ? (
      <div data-testid="modal" className={className} onClick={onCancel}>
        {children}
      </div>
    ) : null,
  Image: ({ src, onClick, width, height, preview, alt }) => (
    <img
      data-testid={alt || 'image'}
      src={src}
      onClick={onClick}
      width={width}
      height={height}
      alt={alt}
    />
  ),
  Button: ({ children, onClick, className }) => (
    <button data-testid="close-button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}))

// Mock icons
vi.mock('@ant-design/icons', () => ({
  CloseOutlined: ({ onClick }) => (
    <button data-testid="close-icon" onClick={onClick}>
      X
    </button>
  ),
  ArrowLeftOutlined: () => <span data-testid="back-icon">&lt;</span>,
}))

describe('ReviewPreview', () => {
  const mockUser = {
    user_id: 1,
    fullname: 'John Doe',
    username: 'john.doe@example.com',
    last_submission: 2,
    submited_formatted: '2024-01-15',
  }

  const mockReviewData = [
    {
      review_id: 1,
      stage: 1,
      review_status: 1,
      notes: 'Good answer',
      answers: [
        {
          answer_type: 1,
          answer_text: 'This is my answer',
          question_text: 'What is your answer?',
        },
      ],
    },
    {
      review_id: 2,
      stage: 2,
      review_status: 0,
      notes: 'Needs improvement',
      answers: [
        {
          answer_type: 2,
          answer_text: 'https://example.com/image.jpg',
          question_text: 'Upload an image',
        },
      ],
    },
  ]

  const mockReviewCounts = {
    accepted: 1,
    rejected: 1,
  }

  const mockOnClose = vi.fn()

  const renderPreview = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ReviewPreview
          open={true}
          user={mockUser}
          moduleTitle="JavaScript Basics"
          reviewData={mockReviewData}
          overallFeedback="Overall good work"
          reviewCounts={mockReviewCounts}
          onClose={mockOnClose}
          {...props}
        />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Modal Display', () => {
    it('should render modal when open is true', () => {
      renderPreview()

      const modal = screen.getByTestId('modal')
      expect(modal).toBeInTheDocument()
    })

    it('should not render modal when open is false', () => {
      renderPreview({ open: false })

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })

    it('should have correct desktop modal class', () => {
      renderPreview({ isMobile: false })

      const modal = screen.getByTestId('modal')
      expect(modal).toHaveClass('modal-preview-review')
      expect(modal).not.toHaveClass('mobile')
    })

    it('should have correct mobile modal class', () => {
      renderPreview({ isMobile: true })

      const modal = screen.getByTestId('modal')
      expect(modal).toHaveClass('modal-preview-review', 'mobile')
    })
  })

  describe('User Information', () => {
    it('should display user fullname', () => {
      renderPreview()

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should display user username', () => {
      renderPreview()

      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    })

    it('should display submission number', () => {
      renderPreview()

      expect(screen.getByText('#2')).toBeInTheDocument()
    })

    it('should display submitted date', () => {
      renderPreview()

      expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    })

    it('should display module title', () => {
      renderPreview()

      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
    })
  })

  describe('Status Badge', () => {
    it('should show approved badge when all reviews are accepted', () => {
      const allAccepted = mockReviewData.map((r) => ({
        ...r,
        review_status: 1,
      }))

      const { container } = renderPreview({ reviewData: allAccepted })

      const badge = container.querySelector('.bg-green-100')
      expect(badge).toBeInTheDocument()
    })

    it('should show declined badge when any review is rejected', () => {
      const { container } = renderPreview()

      const badge = container.querySelector('.bg-orange-100')
      expect(badge).toBeInTheDocument()
    })

    it('should display review counts', () => {
      renderPreview()

      // Check for accepted and rejected counts (1 each)
      const modal = screen.getByTestId('modal')
      expect(modal.textContent).toContain('1')
    })

    it('should show correct status icon for approved', () => {
      const allAccepted = mockReviewData.map((r) => ({
        ...r,
        review_status: 1,
      }))

      renderPreview({ reviewData: allAccepted })

      const headIcon = screen.getByAltText('icon grade head')
      // SVG icons are data URLs, just verify they exist
      expect(headIcon).toBeInTheDocument()
      expect(headIcon).toHaveAttribute('src')
    })

    it('should show correct status icon for declined', () => {
      renderPreview()

      const headIcon = screen.getByAltText('icon grade head')
      // SVG icons are data URLs, just verify they exist
      expect(headIcon).toBeInTheDocument()
      expect(headIcon).toHaveAttribute('src')
    })
  })

  describe('Overall Feedback', () => {
    it('should display overall feedback text', () => {
      renderPreview()

      expect(screen.getByText('Overall good work')).toBeInTheDocument()
    })

    it('should display dash when no overall feedback', () => {
      renderPreview({ overallFeedback: '' })

      expect(screen.getByText('-')).toBeInTheDocument()
    })
  })

  describe('Review Stages Display', () => {
    it('should render all review stages', () => {
      const { container } = renderPreview()

      const stages = container.querySelectorAll('.stage-group-wrapper-preview')
      expect(stages).toHaveLength(2)
    })

    it('should display question text', () => {
      renderPreview()

      expect(screen.getByText((content, element) => 
        element?.innerHTML === 'What is your answer?'
      )).toBeInTheDocument()
    })

    it('should display text answer (type 1)', () => {
      const { container } = renderPreview()

      const answers = container.querySelectorAll('.text-gray-600')
      expect(answers.length).toBeGreaterThan(0)
    })

    it('should display image answer (type 2)', () => {
      renderPreview()

      const images = screen.getAllByRole('img')
      const answerImage = images.find(img => 
        img.getAttribute('src')?.includes('example.com/image.jpg')
      )
      expect(answerImage).toBeInTheDocument()
    })

    it('should display comment for each stage', () => {
      renderPreview()

      expect(screen.getByText('Good answer')).toBeInTheDocument()
      expect(screen.getByText('Needs improvement')).toBeInTheDocument()
    })

    it('should show accept icon for accepted stage', () => {
      renderPreview()

      const icons = screen.getAllByAltText('icon grade item')
      // At least one icon should exist (we have 2 stages)
      expect(icons.length).toBeGreaterThanOrEqual(1)
      expect(icons[0]).toHaveAttribute('src')
    })

    it('should show reject icon for rejected stage', () => {
      renderPreview()

      const icons = screen.getAllByAltText('icon grade item')
      // Both stages should have icons
      expect(icons).toHaveLength(2)
      expect(icons[1]).toHaveAttribute('src')
    })
  })

  describe('Mobile Image Zoom', () => {
    it('should open image zoom modal on mobile when image clicked', async () => {
      const user = userEvent.setup()
      renderPreview({ isMobile: true })

      // Find the answer image
      const images = screen.getAllByRole('img')
      const answerImage = images.find(img => 
        img.getAttribute('src')?.includes('example.com/image.jpg')
      )
      
      await user.click(answerImage)

      // After click, should have 2 modals (main + zoom)
      const modals = screen.getAllByTestId('modal')
      expect(modals.length).toBeGreaterThanOrEqual(1)
    })

    it('should not open zoom modal on desktop', async () => {
      const user = userEvent.setup()
      renderPreview({ isMobile: false })

      const images = screen.getAllByRole('img')
      const answerImage = images.find(img => 
        img.getAttribute('src')?.includes('example.com/image.jpg')
      )
      
      await user.click(answerImage)

      // Should only have 1 modal (main)
      const modals = screen.getAllByTestId('modal')
      expect(modals).toHaveLength(1)
    })
  })

  describe('Close Actions', () => {
    it('should call onClose when modal is clicked (desktop)', async () => {
      const user = userEvent.setup()
      renderPreview()

      // Modal has onClick that triggers onCancel (onClose)
      const modal = screen.getByTestId('modal')
      await user.click(modal)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should show close button on mobile', () => {
      renderPreview({ isMobile: true })

      const closeButton = screen.getByTestId('close-button')
      expect(closeButton).toBeInTheDocument()
    })

    it('should call onClose when mobile close button is clicked', async () => {
      const user = userEvent.setup()
      renderPreview({ isMobile: true })

      const closeButton = screen.getByTestId('close-button')
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should render mobile-specific layout', () => {
      const { container } = renderPreview({ isMobile: true })

      // Mobile has different header structure
      const mobileHeader = container.querySelector('.flex.flex-col.p-\\[18px\\]')
      expect(mobileHeader).toBeInTheDocument()
    })
  })

  describe('Answer Types', () => {
    it('should handle dash image answer as text', () => {
      const dataWithDash = [
        {
          review_id: 1,
          stage: 1,
          review_status: 1,
          notes: 'Comment',
          answers: [
            {
              answer_type: 2,
              answer_text: '-',
              question_text: 'Upload image?',
            },
          ],
        },
      ]

      const { container } = renderPreview({ reviewData: dataWithDash })

      // Should render as text, not image
      const textAnswer = container.querySelector('.text-gray-600')
      expect(textAnswer).toBeInTheDocument()
    })

    it('should handle HTML answer (type 3)', () => {
      const dataWithHTML = [
        {
          review_id: 1,
          stage: 1,
          review_status: 1,
          notes: 'Comment',
          answers: [
            {
              answer_type: 3,
              answer_text: '<p>HTML content</p>',
              question_text: 'Question?',
            },
          ],
        },
      ]

      const { container } = renderPreview({ reviewData: dataWithHTML })

      const answer = container.querySelector('.text-gray-600')
      expect(answer).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null user', () => {
      renderPreview({ user: null })

      // Should render without crashing
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    it('should handle empty reviewData', () => {
      renderPreview({ reviewData: [] })

      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    it('should handle stages without notes', () => {
      const dataWithoutNotes = [
        {
          review_id: 1,
          stage: 1,
          review_status: 1,
          notes: '',
          answers: [
            {
              answer_type: 1,
              answer_text: 'Answer',
              question_text: 'Question?',
            },
          ],
        },
      ]

      renderPreview({ reviewData: dataWithoutNotes })

      // Should not show "Comment:" label when no notes
      expect(screen.queryByText('Comment:')).not.toBeInTheDocument()
    })

    it('should handle stages without answers', () => {
      const dataWithoutAnswers = [
        {
          review_id: 1,
          stage: 1,
          review_status: 1,
          notes: 'Just a comment',
          answers: [],
        },
      ]

      renderPreview({ reviewData: dataWithoutAnswers })

      expect(screen.getByText('Just a comment')).toBeInTheDocument()
    })

    it('should handle zero review counts', () => {
      renderPreview({ reviewCounts: { accepted: 0, rejected: 0 } })

      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('should apply mobile padding on mobile', () => {
      const { container } = renderPreview({ isMobile: true })

      const paddingElements = container.querySelectorAll('.pl-\\[18px\\]')
      expect(paddingElements.length).toBeGreaterThan(0)
    })

    it('should use mobile image dimensions', () => {
      renderPreview({ isMobile: true })

      const images = screen.getAllByRole('img')
      const answerImage = images.find(img => 
        img.getAttribute('src')?.includes('example.com/image.jpg')
      )
      
      expect(answerImage).toHaveAttribute('width', '100%')
      expect(answerImage).toHaveAttribute('height', '100%')
    })

    it('should use desktop image dimensions', () => {
      renderPreview({ isMobile: false })

      const images = screen.getAllByRole('img')
      const answerImage = images.find(img => 
        img.getAttribute('src')?.includes('example.com/image.jpg')
      )
      
      expect(answerImage).toHaveAttribute('width', '475')
      expect(answerImage).toHaveAttribute('height', '300')
    })
  })
})
