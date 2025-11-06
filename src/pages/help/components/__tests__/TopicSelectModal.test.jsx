/**
 * TopicSelectModal Component Tests
 * Unit tests for topic selection modal
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TopicSelectModal from '../TopicSelectModal'

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_help.side_dpd.select_topic': 'Select Topic',
        'feature.feature_help.side_dpd.frequently_asked_questions': 'FAQ',
        'feature.feature_help.side_dpd.profile': 'Profile',
        'feature.feature_help.side_dpd.my_learning_journey':
          'My Learning Journey',
        'feature.feature_help.side_dpd.learning_activity': 'Learning Activity',
        'feature.feature_help.side_dpd.learning_point': 'Learning Point',
        'feature.feature_help.side_dpd.spv_reviewer': 'Supervisor',
        'feature.feature_help.side_dpd.reviewer_b': 'Reviewer',
        'feature.feature_help.side_dpd.account_data_security':
          'Account Data Security',
        'feature.feature_help.side_dpd.others': 'Others',
        'feature.feature_help.side_dpd.terms_of_service': 'Terms of Service',
        'feature.feature_help.side_dpd.privacy_policy': 'Privacy Policy',
      }
      return translations[key] || key
    },
  }),
}))

// Mock Ant Design components with proper structure
vi.mock('antd', () => {
  const MockListItem = ({ children, onClick, className }) => (
    <li onClick={onClick} className={className} data-testid="list-item">
      {children}
    </li>
  )

  const MockList = ({ dataSource, renderItem, className }) => (
    <ul className={className} data-testid="topic-list">
      {dataSource?.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
    </ul>
  )

  MockList.Item = MockListItem

  const MockModal = ({
    open,
    children,
    onCancel,
    closeIcon,
    width,
    centered,
    className,
    bodyStyle,
    ...props
  }) => {
    if (!open) return null

    return (
      <div
        data-testid="modal"
        data-width={width}
        data-centered={centered}
        className={className}
        style={bodyStyle}
        role="dialog"
        aria-modal="true"
      >
        <div className="ant-modal-content">
          <button
            onClick={onCancel}
            className="ant-modal-close"
            data-testid="modal-close-button"
            aria-label="Close"
          >
            {closeIcon}
          </button>
          <div className="ant-modal-body">{children}</div>
        </div>
      </div>
    )
  }

  const MockText = ({ children, type, className }) => (
    <span
      className={className}
      data-type={type}
      data-testid={type === 'success' ? 'selected-text' : 'text'}
    >
      {children}
    </span>
  )

  const MockTypography = {
    Text: MockText,
  }

  return {
    Modal: MockModal,
    List: MockList,
    Typography: MockTypography,
  }
})

// Mock icons
vi.mock('@ant-design/icons', () => ({
  CloseOutlined: () => (
    <span className="anticon anticon-close" data-testid="close-icon">
      ×
    </span>
  ),
  CheckOutlined: () => (
    <span className="anticon anticon-check" data-testid="check-icon">
      ✓
    </span>
  ),
}))

vi.mock('../../data/helpTopics', () => ({
  getMobileTopicOptions: (t) => [
    t('feature.feature_help.side_dpd.frequently_asked_questions'),
    'Login',
    t('feature.feature_help.side_dpd.profile'),
    t('feature.feature_help.side_dpd.my_learning_journey'),
  ],
}))

describe('TopicSelectModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Visibility', () => {
    it('should not render when visible is false', () => {
      render(
        <TopicSelectModal
          visible={false}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      expect(screen.queryByText('Select Topic')).not.toBeInTheDocument()
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })

    it('should render when visible is true', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      expect(screen.getByText('Select Topic')).toBeInTheDocument()
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })
  })

  describe('Topic Options', () => {
    it('should display all topic options', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      expect(screen.getByText('FAQ')).toBeInTheDocument()
      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('My Learning Journey')).toBeInTheDocument()
    })

    it('should highlight selected topic with checkmark', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="Profile"
          isMobile={true}
        />
      )

      // Check for checkmark icon next to selected topic
      const checkIcon = screen.getByTestId('check-icon')
      expect(checkIcon).toBeInTheDocument()

      // Verify the selected text has the correct type
      const selectedText = screen.getByTestId('selected-text')
      expect(selectedText).toHaveTextContent('Profile')
      expect(selectedText).toHaveAttribute('data-type', 'success')
    })

    it('should not show checkmark for non-selected topics', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      // Should only have 1 checkmark (for FAQ)
      const checkIcons = screen.getAllByTestId('check-icon')
      expect(checkIcons).toHaveLength(1)
    })
  })

  describe('Interactions', () => {
    it('should call onSelect and onClose when topic is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const loginOption = screen.getByText('Login')
      await user.click(loginOption)

      expect(mockOnSelect).toHaveBeenCalledWith('Login')
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const closeButton = screen.getByTestId('modal-close-button')
      expect(closeButton).toBeInTheDocument()

      await user.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should render close icon in close button', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const closeIcon = screen.getByTestId('close-icon')
      expect(closeIcon).toBeInTheDocument()
      expect(closeIcon).toHaveClass('anticon-close')
    })
  })

  describe('Modal Configuration', () => {
    it('should use mobile width when isMobile is true', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const modal = screen.getByTestId('modal')
      expect(modal).toHaveAttribute('data-width', '90%')
    })

    it('should use desktop width when isMobile is false', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={false}
        />
      )

      const modal = screen.getByTestId('modal')
      expect(modal).toHaveAttribute('data-width', '585px')
    })

    it('should be centered', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const modal = screen.getByTestId('modal')
      expect(modal).toHaveAttribute('data-centered', 'true')
    })

    it('should have modal role and aria attributes', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('Content Structure', () => {
    it('should have scrollable content area', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const optionList = screen.getByTestId('topic-list')
      expect(optionList).toBeInTheDocument()
      expect(optionList).toHaveClass('option-company')
      expect(optionList.className).toContain('overflow-y-auto')
    })

    it('should render modal title', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const title = screen.getByText('Select Topic')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H3')
    })

    it('should render all list items', () => {
      render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      const listItems = screen.getAllByTestId('list-item')
      expect(listItems).toHaveLength(4) // 4 mocked topics
    })
  })

  describe('Topic Selection State', () => {
    it('should update selected topic when different topic is clicked', async () => {
      const user = userEvent.setup()

      const { rerender } = render(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="FAQ"
          isMobile={true}
        />
      )

      // Click Profile
      const profileOption = screen.getByText('Profile')
      await user.click(profileOption)

      expect(mockOnSelect).toHaveBeenCalledWith('Profile')

      // Simulate parent component updating selectedTopic
      rerender(
        <TopicSelectModal
          visible={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedTopic="Profile"
          isMobile={true}
        />
      )

      // Now Profile should have the checkmark
      const selectedText = screen.getByTestId('selected-text')
      expect(selectedText).toHaveTextContent('Profile')
    })
  })
})
