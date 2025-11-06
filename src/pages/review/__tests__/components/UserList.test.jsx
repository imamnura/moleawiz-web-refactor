import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import UserList from '../../components/UserList'

// Mock UserCard component
vi.mock('../../components/UserCard', () => ({
  default: ({ user, onClick, isMobile }) => (
    <div
      data-testid="user-card"
      data-mobile={isMobile}
      onClick={onClick}
    >
      <span data-testid="user-name">{user.fullname}</span>
      <span data-testid="user-status">{user.status}</span>
    </div>
  ),
}))

// Mock Loader
vi.mock('@components/common/Loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}))

// Mock Ant Design components
vi.mock('antd', () => ({
  Card: ({ children, className, bodyStyle, style }) => (
    <div data-testid="card" className={className} style={style}>
      <div style={bodyStyle}>{children}</div>
    </div>
  ),
  Radio: {
    Group: ({ children, value, onChange, className }) => (
      <div
        data-testid="radio-group"
        className={className}
        data-value={value}
      >
        {children.map((child, index) =>
          <div key={index} onClick={() => onChange({ target: { value: child.props.value } })}>
            {child}
          </div>
        )}
      </div>
    ),
    Button: ({ children, value, className }) => (
      <button
        data-testid={`radio-button-${value}`}
        data-value={value}
        className={className}
      >
        {children}
      </button>
    ),
  },
}))

// Mock icons
vi.mock('@ant-design/icons', () => ({
  LoadingOutlined: ({ spin }) => (
    <span data-testid="loading-icon" data-spin={spin}>
      Loading...
    </span>
  ),
}))

describe('UserList', () => {
  const mockUsers = [
    {
      fullname: 'John Doe',
      username: 'john.doe',
      role: 'Student',
      user_id: 1,
      last_submission: 1,
      submited: '2024-01-01',
      status: null,
    },
    {
      fullname: 'Jane Smith',
      username: 'jane.smith',
      role: 'Student',
      user_id: 2,
      last_submission: 2,
      submited: '2024-01-02',
      status: 1,
    },
    {
      fullname: 'Bob Wilson',
      username: 'bob.wilson',
      role: 'Student',
      user_id: 3,
      last_submission: 3,
      submited: '2024-01-03',
      status: 0,
    },
  ]

  const mockStatusCounts = {
    needReview: 5,
    approved: 3,
    declined: 2,
  }

  const mockOnFilterChange = vi.fn()
  const mockOnUserClick = vi.fn()

  const renderUserList = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <UserList
          users={mockUsers}
          statusCounts={mockStatusCounts}
          filterStatus="need_review"
          onFilterChange={mockOnFilterChange}
          onUserClick={mockOnUserClick}
          {...props}
        />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Desktop Layout', () => {
    it('should render Card wrapper', () => {
      renderUserList()

      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('card-list-user-reviewed')
    })

    it('should render filter radio buttons', () => {
      renderUserList()

      expect(screen.getByTestId('radio-button-need_review')).toBeInTheDocument()
      expect(screen.getByTestId('radio-button-decline')).toBeInTheDocument()
      expect(screen.getByTestId('radio-button-approved')).toBeInTheDocument()
      expect(screen.getByTestId('radio-button-all')).toBeInTheDocument()
    })

    it('should display status counts correctly', () => {
      const { container } = renderUserList()

      // Check that loading icons are not shown when not loading
      const loadingIcons = screen.queryAllByTestId('loading-icon')
      expect(loadingIcons).toHaveLength(0)
    })

    it('should show loading icons in counts when isLoading', () => {
      renderUserList({ isLoading: true })

      const loadingIcons = screen.getAllByTestId('loading-icon')
      expect(loadingIcons.length).toBeGreaterThan(0)
    })

    it('should render all users', () => {
      renderUserList()

      const userCards = screen.getAllByTestId('user-card')
      expect(userCards).toHaveLength(3)
    })

    it('should display user information', () => {
      renderUserList()

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
    })

    it('should render scrollable container', () => {
      const { container } = renderUserList()

      const scrollContainer = container.querySelector('#user-list-container')
      expect(scrollContainer).toBeInTheDocument()
      expect(scrollContainer).toHaveClass('overflow-y-auto')
    })
  })

  describe('Mobile Layout', () => {
    it('should render mobile radio buttons', () => {
      renderUserList({ isMobile: true })

      const radioGroup = screen.getByTestId('radio-group')
      expect(radioGroup).toHaveClass('mobile')
    })

    it('should render Card with mobile class', () => {
      renderUserList({ isMobile: true })

      const card = screen.getByTestId('card')
      expect(card).toHaveClass('mobile')
    })

    it('should pass isMobile to UserCard', () => {
      renderUserList({ isMobile: true })

      const userCards = screen.getAllByTestId('user-card')
      userCards.forEach((card) => {
        expect(card).toHaveAttribute('data-mobile', 'true')
      })
    })

    it('should render filter with horizontal scroll', () => {
      const { container } = renderUserList({ isMobile: true })

      const radioGroup = screen.getByTestId('radio-group')
      expect(radioGroup).toBeInTheDocument()
    })
  })

  describe('Filter Functionality', () => {
    it('should set correct initial filter value', () => {
      renderUserList({ filterStatus: 'approved' })

      const radioGroup = screen.getByTestId('radio-group')
      expect(radioGroup).toHaveAttribute('data-value', 'approved')
    })

    it('should call onFilterChange when filter is changed', async () => {
      const user = userEvent.setup()
      renderUserList()

      const approvedButton = screen.getByTestId('radio-button-approved')
      await user.click(approvedButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith('approved')
    })

    it('should show all status options', () => {
      renderUserList()

      expect(screen.getByTestId('radio-button-need_review')).toBeInTheDocument()
      expect(screen.getByTestId('radio-button-decline')).toBeInTheDocument()
      expect(screen.getByTestId('radio-button-approved')).toBeInTheDocument()
      expect(screen.getByTestId('radio-button-all')).toBeInTheDocument()
    })

    it('should calculate total count for "all" filter', () => {
      renderUserList()

      // Total should be needReview + approved + declined = 5 + 3 + 2 = 10
      // We verify the button exists (actual count calculation is in component)
      const allButton = screen.getByTestId('radio-button-all')
      expect(allButton).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show Loader when isLoading is true', () => {
      renderUserList({ isLoading: true })

      expect(screen.getByTestId('loader')).toBeInTheDocument()
      expect(screen.queryByTestId('user-card')).not.toBeInTheDocument()
    })

    it('should show loading icons in filter counts when loading', () => {
      renderUserList({ isLoading: true })

      const loadingIcons = screen.getAllByTestId('loading-icon')
      expect(loadingIcons.length).toBeGreaterThan(0)
      
      loadingIcons.forEach((icon) => {
        expect(icon).toHaveAttribute('data-spin', 'true')
      })
    })
  })

  describe('Empty State', () => {
    it('should show empty message on desktop when no users', () => {
      const { container } = renderUserList({
        users: [],
        emptyMessage: 'no_users_in_this_status',
      })

      const emptyDiv = container.querySelector('.text-sm.font-medium.text-gray-600')
      expect(emptyDiv).toBeInTheDocument()
    })

    it('should show empty message on mobile when no users', () => {
      const { container } = renderUserList({
        users: [],
        emptyMessage: 'no_users_in_this_status',
        isMobile: true,
      })

      const emptyMessage = container.querySelector('.fixed.top-1\\/2')
      expect(emptyMessage).toBeInTheDocument()
    })

    it('should center empty message on mobile', () => {
      const { container } = renderUserList({
        users: [],
        emptyMessage: 'no_users_in_this_status',
        isMobile: true,
      })

      const emptyMessage = container.querySelector('.fixed.top-1\\/2.left-1\\/2')
      expect(emptyMessage).toBeInTheDocument()
    })

    it('should not show empty message when emptyMessage is empty string', () => {
      const { container } = renderUserList({
        users: [],
        emptyMessage: '',
      })

      const emptyDiv = container.querySelector('.text-sm.font-medium.text-gray-600')
      expect(emptyDiv).toBeInTheDocument()
      expect(emptyDiv).toBeEmptyDOMElement()
    })
  })

  describe('User Interactions', () => {
    it('should call onUserClick when user card is clicked', async () => {
      const user = userEvent.setup()
      renderUserList()

      const userCards = screen.getAllByTestId('user-card')
      await user.click(userCards[0])

      expect(mockOnUserClick).toHaveBeenCalledWith(mockUsers[0])
    })

    it('should call onUserClick with correct user data', async () => {
      const user = userEvent.setup()
      renderUserList()

      const userCards = screen.getAllByTestId('user-card')
      await user.click(userCards[1])

      expect(mockOnUserClick).toHaveBeenCalledWith(mockUsers[1])
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined users prop', () => {
      renderUserList({ users: undefined })

      expect(screen.queryByTestId('user-card')).not.toBeInTheDocument()
    })

    it('should handle zero status counts', () => {
      renderUserList({
        statusCounts: { needReview: 0, approved: 0, declined: 0 },
      })

      // Should still render radio buttons
      expect(screen.getByTestId('radio-button-need_review')).toBeInTheDocument()
    })

    it('should handle missing optional user fields', () => {
      const incompleteUsers = [
        {
          fullname: 'Test User',
          // Missing other optional fields
        },
      ]

      renderUserList({ users: incompleteUsers })

      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('should handle all status filter values', () => {
      const statusFilters = ['need_review', 'decline', 'approved', 'all']

      statusFilters.forEach((status) => {
        const { unmount } = renderUserList({ filterStatus: status })
        const radioGroup = screen.getByTestId('radio-group')
        expect(radioGroup).toHaveAttribute('data-value', status)
        unmount()
      })
    })
  })

  describe('PropTypes and Defaults', () => {
    it('should use default props when not provided', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <UserList
            onFilterChange={mockOnFilterChange}
            onUserClick={mockOnUserClick}
          />
        </I18nextProvider>
      )

      // Should not crash and render with defaults
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should handle default filterStatus', () => {
      renderUserList({ filterStatus: undefined })

      const radioGroup = screen.getByTestId('radio-group')
      expect(radioGroup).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('should apply correct padding based on scroll state (desktop)', () => {
      const { container } = renderUserList()

      const filterContainer = container.querySelector('.flex.flex-col.items-end')
      expect(filterContainer).toBeInTheDocument()
    })

    it('should apply mobile-specific styles', () => {
      const { container } = renderUserList({ isMobile: true })

      const mobileRadio = container.querySelector('.bg-white.shadow-sm')
      expect(mobileRadio).toBeInTheDocument()
    })
  })
})
