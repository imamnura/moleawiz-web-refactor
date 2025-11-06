import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserProfileCard } from '../UserProfileCard'

// Mock Ant Design components
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Avatar: ({ children, src, className }) => (
      <div data-testid="avatar" data-src={src} className={className}>
        {children}
      </div>
    ),
    Button: ({ children, onClick, icon, loading, id, className }) => (
      <button
        data-testid={id || 'button'}
        id={id}
        onClick={onClick}
        disabled={loading}
        className={className}
      >
        {icon}
        {children}
      </button>
    ),
  }
})

// Mock icons
vi.mock('@ant-design/icons', () => ({
  CameraFilled: () => <span>Camera</span>,
  ExportOutlined: () => <span>Export</span>,
}))

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' },
  }),
}))

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  formatProfileDate: (date) => (date ? '15 January 2023' : '-'),
  getUserInitial: (name) => (name ? name[0].toUpperCase() : '?'),
  formatEmptyValue: (value) => value || '-',
}))

describe('UserProfileCard', () => {
  const mockUser = {
    userName: 'John Doe',
    firstname: 'John',
    picture: 'https://example.com/avatar.jpg',
    userPosition: 'Software Engineer',
    userUsername: 'johndoe',
    created_at: '2023-01-15',
  }

  const mockProfileDetail = {
    position: 'Senior Developer',
    username: 'john.doe',
    created_at: '2023-02-20',
  }

  const defaultProps = {
    user: mockUser,
    profileDetail: mockProfileDetail,
    onPictureChange: vi.fn(),
    onExport: vi.fn(),
    isExporting: false,
    isChangingPicture: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render UserProfileCard without crashing', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(screen.getByTestId('avatar')).toBeInTheDocument()
    })

    it('should render avatar with user picture', () => {
      render(<UserProfileCard {...defaultProps} />)
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toHaveAttribute('data-src', mockUser.picture)
    })

    it('should render user initials in avatar when no picture', () => {
      const propsWithoutPicture = {
        ...defaultProps,
        user: { ...mockUser, picture: null },
      }
      render(<UserProfileCard {...propsWithoutPicture} />)
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toHaveTextContent('J')
    })

    it('should render user name', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should render role label', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(
        screen.getByText('feature.feature_profile.header.role')
      ).toBeInTheDocument()
    })

    it('should render username label', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(
        screen.getByText('feature.feature_profile.header.username')
      ).toBeInTheDocument()
    })

    it('should render registered date label', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(
        screen.getByText('feature.feature_profile.header.registered_on')
      ).toBeInTheDocument()
    })

    it('should render export button', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(
        screen.getByTestId('btn-export-profile-user-profile')
      ).toBeInTheDocument()
    })

    it('should render camera button', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(screen.getByTestId('btn-upload-user-profile')).toBeInTheDocument()
    })

    it('should render hidden file input', () => {
      render(<UserProfileCard {...defaultProps} />)
      const fileInput = document.getElementById('id-upload-user-profile')
      expect(fileInput).toBeInTheDocument()
      expect(fileInput).toHaveClass('hidden')
      expect(fileInput).toHaveAttribute('type', 'file')
      expect(fileInput).toHaveAttribute('accept', 'image/*')
    })
  })

  describe('User Data Display', () => {
    it('should display user position from user object', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    })

    it('should fallback to profileDetail position if user position is missing', () => {
      const propsWithoutUserPosition = {
        ...defaultProps,
        user: { ...mockUser, userPosition: null },
      }
      render(<UserProfileCard {...propsWithoutUserPosition} />)
      expect(screen.getByText('Senior Developer')).toBeInTheDocument()
    })

    it('should display username from user object', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(screen.getByText('johndoe')).toBeInTheDocument()
    })

    it('should fallback to profileDetail username if user username is missing', () => {
      const propsWithoutUserUsername = {
        ...defaultProps,
        user: { ...mockUser, userUsername: null },
      }
      render(<UserProfileCard {...propsWithoutUserUsername} />)
      expect(screen.getByText('john.doe')).toBeInTheDocument()
    })

    it('should display formatted date', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(screen.getByText('15 January 2023')).toBeInTheDocument()
    })

    it('should display dash when position is missing', () => {
      const propsWithoutPosition = {
        ...defaultProps,
        user: { ...mockUser, userPosition: null },
        profileDetail: { ...mockProfileDetail, position: null },
      }
      render(<UserProfileCard {...propsWithoutPosition} />)
      const roleSections = screen.getAllByText('-')
      expect(roleSections.length).toBeGreaterThan(0)
    })

    it('should use firstname when userName is missing', () => {
      const propsWithFirstname = {
        ...defaultProps,
        user: { ...mockUser, userName: null, firstname: 'Jane' },
      }
      render(<UserProfileCard {...propsWithFirstname} />)
      expect(screen.getByText('Jane')).toBeInTheDocument()
    })

    it('should display dash when all name fields are missing', () => {
      const propsWithoutName = {
        ...defaultProps,
        user: { ...mockUser, userName: null, firstname: null },
      }
      render(<UserProfileCard {...propsWithoutName} />)
      expect(screen.getByText('-')).toBeInTheDocument()
    })
  })

  describe('Avatar Upload Functionality', () => {
    it('should open file selector when avatar is clicked', () => {
      render(<UserProfileCard {...defaultProps} />)
      const avatar = screen.getByTestId('avatar')
      const fileInput = document.getElementById('id-upload-user-profile')

      const clickSpy = vi.spyOn(fileInput, 'click')
      fireEvent.click(avatar.parentElement)

      expect(clickSpy).toHaveBeenCalled()
    })

    it('should accept only image files', () => {
      render(<UserProfileCard {...defaultProps} />)
      const fileInput = document.getElementById('id-upload-user-profile')
      expect(fileInput).toHaveAttribute('accept', 'image/*')
    })

    it('should call onPictureChange when file is selected', () => {
      const mockOnPictureChange = vi.fn()
      render(
        <UserProfileCard
          {...defaultProps}
          onPictureChange={mockOnPictureChange}
        />
      )

      const fileInput = document.getElementById('id-upload-user-profile')
      const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })

      fireEvent.change(fileInput, { target: { files: [file] } })

      expect(mockOnPictureChange).toHaveBeenCalledWith(file)
    })

    it('should not call onPictureChange when no file is selected', () => {
      const mockOnPictureChange = vi.fn()
      render(
        <UserProfileCard
          {...defaultProps}
          onPictureChange={mockOnPictureChange}
        />
      )

      const fileInput = document.getElementById('id-upload-user-profile')
      fireEvent.change(fileInput, { target: { files: [] } })

      expect(mockOnPictureChange).not.toHaveBeenCalled()
    })

    it('should not crash when onPictureChange is not provided', () => {
      const propsWithoutHandler = {
        ...defaultProps,
        onPictureChange: undefined,
      }

      expect(() => {
        render(<UserProfileCard {...propsWithoutHandler} />)
      }).not.toThrow()
    })

    it('should show loading state on camera button when uploading', () => {
      const propsWithLoading = {
        ...defaultProps,
        isChangingPicture: true,
      }
      render(<UserProfileCard {...propsWithLoading} />)
      const cameraButton = screen.getByTestId('btn-upload-user-profile')
      expect(cameraButton).toBeDisabled()
    })
  })

  describe('Export Functionality', () => {
    it('should call onExport when export button is clicked', () => {
      const mockOnExport = vi.fn()
      render(<UserProfileCard {...defaultProps} onExport={mockOnExport} />)

      const exportButton = screen.getByTestId('btn-export-profile-user-profile')
      fireEvent.click(exportButton)

      expect(mockOnExport).toHaveBeenCalledTimes(1)
    })

    it('should display export button text', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(
        screen.getByText('feature.feature_profile.header.export_profile')
      ).toBeInTheDocument()
    })

    it('should show loading state when exporting', () => {
      const propsWithExporting = {
        ...defaultProps,
        isExporting: true,
      }
      render(<UserProfileCard {...propsWithExporting} />)
      const exportButton = screen.getByTestId('btn-export-profile-user-profile')
      expect(exportButton).toBeDisabled()
    })

    it('should not call onExport when button is disabled', () => {
      const mockOnExport = vi.fn()
      const propsWithExporting = {
        ...defaultProps,
        onExport: mockOnExport,
        isExporting: true,
      }
      render(<UserProfileCard {...propsWithExporting} />)

      const exportButton = screen.getByTestId('btn-export-profile-user-profile')
      fireEvent.click(exportButton)

      expect(mockOnExport).not.toHaveBeenCalled()
    })
  })

  describe('Layout and Structure', () => {
    it('should have proper card styling', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />)
      const card = container.querySelector('.rounded-lg.bg-white')
      expect(card).toBeInTheDocument()
    })

    it('should have flex layout for main content', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />)
      const flexContainer = container.querySelector(
        '.flex.items-center.justify-between'
      )
      expect(flexContainer).toBeInTheDocument()
    })

    it('should have vertical dividers between info sections', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />)
      const dividers = container.querySelectorAll('.h-10.w-px.bg-gray-300')
      expect(dividers.length).toBeGreaterThan(0)
    })

    it('should position camera button absolutely', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />)
      const cameraButton = container.querySelector('.absolute.bottom-0.right-0')
      expect(cameraButton).toBeInTheDocument()
    })
  })

  describe('PropTypes Validation', () => {
    it('should render with minimal required props', () => {
      const minimalProps = {
        onPictureChange: vi.fn(),
        onExport: vi.fn(),
      }

      expect(() => {
        render(<UserProfileCard {...minimalProps} />)
      }).not.toThrow()
    })

    it('should handle null user gracefully', () => {
      const propsWithNullUser = {
        ...defaultProps,
        user: null,
      }

      expect(() => {
        render(<UserProfileCard {...propsWithNullUser} />)
      }).not.toThrow()
    })

    it('should handle null profileDetail gracefully', () => {
      const propsWithNullDetail = {
        ...defaultProps,
        profileDetail: null,
      }

      expect(() => {
        render(<UserProfileCard {...propsWithNullDetail} />)
      }).not.toThrow()
    })
  })

  describe('Locale Support', () => {
    it('should use English locale by default', () => {
      render(<UserProfileCard {...defaultProps} />)
      // Date formatter should be called with 'en' locale
      expect(screen.getByText('15 January 2023')).toBeInTheDocument()
    })

    it('should support Indonesian locale', () => {
      vi.mock('react-i18next', () => ({
        useTranslation: () => ({
          t: (key) => key,
          i18n: { language: 'id' },
        }),
      }))

      render(<UserProfileCard {...defaultProps} />)
      expect(screen.getByText('15 January 2023')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper file input id', () => {
      render(<UserProfileCard {...defaultProps} />)
      const fileInput = document.getElementById('id-upload-user-profile')
      expect(fileInput).toHaveAttribute('id', 'id-upload-user-profile')
    })

    it('should have proper button ids', () => {
      render(<UserProfileCard {...defaultProps} />)
      expect(
        document.getElementById('btn-upload-user-profile')
      ).toBeInTheDocument()
      expect(
        document.getElementById('btn-export-profile-user-profile')
      ).toBeInTheDocument()
    })

    it('should make avatar container clickable', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />)
      const avatarContainer = container.querySelector(
        '.relative.cursor-pointer'
      )
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing all user data', () => {
      const propsWithNoData = {
        ...defaultProps,
        user: null,
        profileDetail: null,
      }

      render(<UserProfileCard {...propsWithNoData} />)
      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })

    it('should handle empty string values', () => {
      const propsWithEmptyStrings = {
        ...defaultProps,
        user: {
          userName: '',
          firstname: '',
          userPosition: '',
          userUsername: '',
          created_at: '',
        },
      }

      render(<UserProfileCard {...propsWithEmptyStrings} />)
      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })

    it('should handle file input ref when not mounted', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />)
      const avatarContainer = container.querySelector(
        '.relative.cursor-pointer'
      )

      // Remove file input
      const fileInput = document.getElementById('id-upload-user-profile')
      fileInput.remove()

      // Should not crash when clicking avatar
      expect(() => {
        fireEvent.click(avatarContainer)
      }).not.toThrow()
    })
  })
})
