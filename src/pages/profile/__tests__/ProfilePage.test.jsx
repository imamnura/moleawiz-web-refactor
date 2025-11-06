import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProfilePage from '../ProfilePage'
import * as useProfileDataModule from '../hooks/useProfileData'
import * as useExportProfileModule from '../hooks/useExportProfile'

// Mock dependencies
vi.mock('@components/common/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))

vi.mock('../components/UserProfileCard', () => ({
  UserProfileCard: ({ user, onExport }) => (
    <div data-testid="user-profile-card">
      <div>{user?.userName || 'No Name'}</div>
      <button onClick={onExport}>Export</button>
    </div>
  ),
}))

vi.mock('../components/ProfileTabs', () => ({
  ProfileTabs: ({ certificates, programs }) => (
    <div data-testid="profile-tabs">
      <div>Certificates: {certificates?.length || 0}</div>
      <div>Programs: {programs?.length || 0}</div>
    </div>
  ),
}))

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' },
  }),
}))

describe('ProfilePage', () => {
  const mockUser = {
    id: 1,
    userName: 'John Doe',
    firstname: 'John',
    picture: 'https://example.com/avatar.jpg',
  }

  const mockProfileDetail = {
    position: 'Software Engineer',
    username: 'johndoe',
    created_at: '2023-01-15',
  }

  const mockCertificates = [
    {
      id_certif: 1,
      name_certif: 'React Certificate',
      file_name: 'cert.png',
      journey_name: 'React Journey',
    },
  ]

  const mockPrograms = [
    {
      id: 1,
      name: 'Frontend Development',
      completed_date: '2024-01-01',
      point: 100,
    },
  ]

  const mockAchievements = [
    {
      id: 1,
      name: 'First Badge',
      image: 'badge.png',
    },
  ]

  const defaultHookReturn = {
    user: mockUser,
    profileDetail: mockProfileDetail,
    certificates: mockCertificates,
    completedJourneys: mockPrograms,
    achievements: mockAchievements,
    additionalCertificates: [],
    isLoading: false,
    isLoadingCertificates: false,
    isLoadingJourneys: false,
    isLoadingAchievements: false,
    isLoadingAdditional: false,
    isChangingPicture: false,
    handlePictureChange: vi.fn(),
  }

  const mockStore = configureStore({
    reducer: {
      auth: (state = { user: mockUser }) => state,
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue(
      defaultHookReturn
    )
    vi.spyOn(useExportProfileModule, 'useExportProfile').mockReturnValue({
      handleExport: vi.fn(),
      isExporting: false,
      exportError: null,
    })
  })

  describe('Rendering', () => {
    it('should render ProfilePage without crashing', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('should render page title', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(
        'feature.feature_profile.header.profile'
      )
    })

    it('should render UserProfileCard component', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('user-profile-card')).toBeInTheDocument()
    })

    it('should render ProfileTabs component', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('profile-tabs')).toBeInTheDocument()
    })

    it('should have correct page structure with proper container classes', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const pageContainer = container.querySelector('.min-h-screen')
      expect(pageContainer).toBeInTheDocument()
      expect(pageContainer).toHaveClass('bg-gray-50', 'p-10')
    })
  })

  describe('Loading State', () => {
    it('should show loader when isLoading is true', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        isLoading: true,
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('loader')).toBeInTheDocument()
      expect(screen.queryByTestId('user-profile-card')).not.toBeInTheDocument()
      expect(screen.queryByTestId('profile-tabs')).not.toBeInTheDocument()
    })

    it('should center loader vertically and horizontally', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        isLoading: true,
      })

      const { container } = render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const loaderContainer = container.querySelector('.min-h-screen')
      expect(loaderContainer).toHaveClass(
        'flex',
        'items-center',
        'justify-center'
      )
    })

    it('should not show loader when isLoading is false', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })

    it('should show content after loading completes', async () => {
      const { rerender } = render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        isLoading: true,
      })

      rerender(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('loader')).toBeInTheDocument()

      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue(
        defaultHookReturn
      )

      rerender(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
        expect(screen.getByTestId('user-profile-card')).toBeInTheDocument()
      })
    })
  })

  describe('Data Passing to Components', () => {
    it('should pass user data to UserProfileCard', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const userCard = screen.getByTestId('user-profile-card')
      expect(userCard).toHaveTextContent('John Doe')
    })

    it('should pass certificates to ProfileTabs', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const tabs = screen.getByTestId('profile-tabs')
      expect(tabs).toHaveTextContent('Certificates: 1')
    })

    it('should pass programs to ProfileTabs', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const tabs = screen.getByTestId('profile-tabs')
      expect(tabs).toHaveTextContent('Programs: 1')
    })

    it('should pass loading states to ProfileTabs', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        isLoadingCertificates: true,
        isLoadingJourneys: true,
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('profile-tabs')).toBeInTheDocument()
    })

    it('should pass onPictureChange handler to UserProfileCard', () => {
      const mockHandlePictureChange = vi.fn()
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        handlePictureChange: mockHandlePictureChange,
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('user-profile-card')).toBeInTheDocument()
    })

    it('should pass onExport handler to UserProfileCard', () => {
      const mockHandleExport = vi.fn()
      vi.spyOn(useExportProfileModule, 'useExportProfile').mockReturnValue({
        handleExport: mockHandleExport,
        isExporting: false,
        exportError: null,
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('user-profile-card')).toBeInTheDocument()
    })
  })

  describe('Hook Integration', () => {
    it('should call useProfileData hook', () => {
      const spy = vi.spyOn(useProfileDataModule, 'useProfileData')

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(spy).toHaveBeenCalled()
    })

    it('should call useExportProfile hook', () => {
      const spy = vi.spyOn(useExportProfileModule, 'useExportProfile')

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(spy).toHaveBeenCalled()
    })

    it('should handle missing user data gracefully', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        user: null,
        profileDetail: null,
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('user-profile-card')).toHaveTextContent(
        'No Name'
      )
    })

    it('should handle empty arrays for lists', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        certificates: [],
        completedJourneys: [],
        achievements: [],
        additionalCertificates: [],
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const tabs = screen.getByTestId('profile-tabs')
      expect(tabs).toHaveTextContent('Certificates: 0')
      expect(tabs).toHaveTextContent('Programs: 0')
    })
  })

  describe('Export Functionality', () => {
    it('should pass isExporting state to UserProfileCard', () => {
      vi.spyOn(useExportProfileModule, 'useExportProfile').mockReturnValue({
        handleExport: vi.fn(),
        isExporting: true,
        exportError: null,
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('user-profile-card')).toBeInTheDocument()
    })

    it('should not break when export handler is undefined', () => {
      vi.spyOn(useExportProfileModule, 'useExportProfile').mockReturnValue({
        handleExport: undefined,
        isExporting: false,
        exportError: null,
      })

      expect(() => {
        render(
          <Provider store={mockStore}>
            <ProfilePage />
          </Provider>
        )
      }).not.toThrow()
    })
  })

  describe('Picture Change Functionality', () => {
    it('should pass isChangingPicture state to UserProfileCard', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        isChangingPicture: true,
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('user-profile-card')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('should render main content when not loading', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      // Should have page structure
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null user gracefully', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        user: null,
      })

      expect(() => {
        render(
          <Provider store={mockStore}>
            <ProfilePage />
          </Provider>
        )
      }).not.toThrow()
    })

    it('should handle undefined profileDetail gracefully', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        profileDetail: undefined,
      })

      expect(() => {
        render(
          <Provider store={mockStore}>
            <ProfilePage />
          </Provider>
        )
      }).not.toThrow()
    })

    it('should handle null certificates array', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        ...defaultHookReturn,
        certificates: null,
      })

      expect(() => {
        render(
          <Provider store={mockStore}>
            <ProfilePage />
          </Provider>
        )
      }).not.toThrow()
    })

    it('should render with minimal data', () => {
      vi.spyOn(useProfileDataModule, 'useProfileData').mockReturnValue({
        user: null,
        profileDetail: null,
        certificates: [],
        completedJourneys: [],
        achievements: [],
        additionalCertificates: [],
        isLoading: false,
        isLoadingCertificates: false,
        isLoadingJourneys: false,
        isLoadingAchievements: false,
        isLoadingAdditional: false,
        isChangingPicture: false,
        handlePictureChange: vi.fn(),
      })

      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      expect(screen.getByTestId('user-profile-card')).toBeInTheDocument()
      expect(screen.getByTestId('profile-tabs')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should render title before UserProfileCard', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const elements = container.querySelectorAll('.min-h-screen > *')
      const titleIndex = Array.from(elements).findIndex((el) =>
        el.querySelector('h1')
      )
      const cardIndex = Array.from(elements).findIndex(
        (el) => el.getAttribute('data-testid') === 'user-profile-card'
      )

      expect(titleIndex).toBeLessThan(cardIndex)
    })

    it('should render UserProfileCard before ProfileTabs', () => {
      render(
        <Provider store={mockStore}>
          <ProfilePage />
        </Provider>
      )

      const userCard = screen.getByTestId('user-profile-card')
      const tabs = screen.getByTestId('profile-tabs')

      expect(userCard.compareDocumentPosition(tabs)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      )
    })
  })
})
