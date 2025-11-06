import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileTabs } from '../ProfileTabs'

// Mock child components
vi.mock('../CertificateList', () => ({
  CertificateList: ({ certificates, isLoading }) => (
    <div data-testid="certificate-list">
      {isLoading ? 'Loading...' : `Certificates: ${certificates?.length || 0}`}
    </div>
  ),
}))

vi.mock('../ProgramList', () => ({
  ProgramList: ({ programs, isLoading }) => (
    <div data-testid="program-list">
      {isLoading ? 'Loading...' : `Programs: ${programs?.length || 0}`}
    </div>
  ),
}))

vi.mock('../AchievementList', () => ({
  AchievementList: ({ achievements, isLoading }) => (
    <div data-testid="achievement-list">
      {isLoading ? 'Loading...' : `Achievements: ${achievements?.length || 0}`}
    </div>
  ),
}))

vi.mock('../AdditionalCertificateList', () => ({
  AdditionalCertificateList: ({ certificates, isLoading }) => (
    <div data-testid="additional-certificate-list">
      {isLoading ? 'Loading...' : `Additional: ${certificates?.length || 0}`}
    </div>
  ),
}))

// Mock Ant Design Tabs
vi.mock('antd', () => ({
  Tabs: ({ items, defaultActiveKey }) => (
    <div data-testid="tabs" data-default-key={defaultActiveKey}>
      {items.map((item) => (
        <div key={item.key} data-testid={`tab-${item.key}`}>
          <div data-testid={`tab-label-${item.key}`}>{item.label}</div>
          <div data-testid={`tab-content-${item.key}`}>{item.children}</div>
        </div>
      ))}
    </div>
  ),
}))

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_profile.sec_tab.certificate': 'Certificate',
        'feature.feature_profile.sec_tab.completed_programs':
          'Completed Programs',
        'feature.feature_profile.sec_tab.achievements': 'Achievements',
        'feature.feature_profile.sec_tab.additional': 'Additional',
      }
      return translations[key] || key
    },
  }),
}))

describe('ProfileTabs', () => {
  const mockCertificates = [
    { id_certif: 1, name_certif: 'React Certificate' },
    { id_certif: 2, name_certif: 'Node Certificate' },
  ]

  const mockPrograms = [{ id: 1, name: 'Frontend Bootcamp' }]

  const mockAchievements = [
    { id: 1, name: 'First Login' },
    { id: 2, name: 'Course Completed' },
    { id: 3, name: 'Quick Learner' },
  ]

  const mockAdditionalCertificates = [
    { id_certif: 10, name_certif: 'Extra Certificate' },
  ]

  const defaultProps = {
    certificates: mockCertificates,
    programs: mockPrograms,
    achievements: mockAchievements,
    additionalCertificates: mockAdditionalCertificates,
    isLoadingCertificates: false,
    isLoadingPrograms: false,
    isLoadingAchievements: false,
    isLoadingAdditional: false,
  }

  describe('Rendering', () => {
    it('should render ProfileTabs without crashing', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByTestId('tabs')).toBeInTheDocument()
    })

    it('should render all four tabs', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByTestId('tab-1')).toBeInTheDocument()
      expect(screen.getByTestId('tab-2')).toBeInTheDocument()
      expect(screen.getByTestId('tab-3')).toBeInTheDocument()
      expect(screen.getByTestId('tab-4')).toBeInTheDocument()
    })

    it('should render tab labels', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByText('Certificate')).toBeInTheDocument()
      expect(screen.getByText('Completed Programs')).toBeInTheDocument()
      expect(screen.getByText('Achievements')).toBeInTheDocument()
      expect(screen.getByText('Additional')).toBeInTheDocument()
    })

    it('should have default active key as "1"', () => {
      render(<ProfileTabs {...defaultProps} />)
      const tabs = screen.getByTestId('tabs')
      expect(tabs).toHaveAttribute('data-default-key', '1')
    })
  })

  describe('Tab Content - Certificate List', () => {
    it('should render CertificateList component', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByTestId('certificate-list')).toBeInTheDocument()
    })

    it('should pass certificates to CertificateList', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByTestId('certificate-list')).toHaveTextContent(
        'Certificates: 2'
      )
    })

    it('should pass loading state to CertificateList', () => {
      const propsWithLoading = {
        ...defaultProps,
        isLoadingCertificates: true,
      }
      render(<ProfileTabs {...propsWithLoading} />)
      expect(screen.getByTestId('certificate-list')).toHaveTextContent(
        'Loading...'
      )
    })

    it('should handle empty certificates array', () => {
      const propsWithEmpty = {
        ...defaultProps,
        certificates: [],
      }
      render(<ProfileTabs {...propsWithEmpty} />)
      expect(screen.getByTestId('certificate-list')).toHaveTextContent(
        'Certificates: 0'
      )
    })
  })

  describe('Tab Content - Program List', () => {
    it('should render ProgramList component', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByTestId('program-list')).toBeInTheDocument()
    })

    it('should pass programs to ProgramList', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByTestId('program-list')).toHaveTextContent(
        'Programs: 1'
      )
    })

    it('should pass loading state to ProgramList', () => {
      const propsWithLoading = {
        ...defaultProps,
        isLoadingPrograms: true,
      }
      render(<ProfileTabs {...propsWithLoading} />)
      expect(screen.getByTestId('program-list')).toHaveTextContent('Loading...')
    })

    it('should handle empty programs array', () => {
      const propsWithEmpty = {
        ...defaultProps,
        programs: [],
      }
      render(<ProfileTabs {...propsWithEmpty} />)
      expect(screen.getByTestId('program-list')).toHaveTextContent(
        'Programs: 0'
      )
    })
  })

  describe('Tab Content - Achievement List', () => {
    it('should render AchievementList component', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByTestId('achievement-list')).toBeInTheDocument()
    })

    it('should pass achievements to AchievementList', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(screen.getByTestId('achievement-list')).toHaveTextContent(
        'Achievements: 3'
      )
    })

    it('should pass loading state to AchievementList', () => {
      const propsWithLoading = {
        ...defaultProps,
        isLoadingAchievements: true,
      }
      render(<ProfileTabs {...propsWithLoading} />)
      expect(screen.getByTestId('achievement-list')).toHaveTextContent(
        'Loading...'
      )
    })

    it('should handle empty achievements array', () => {
      const propsWithEmpty = {
        ...defaultProps,
        achievements: [],
      }
      render(<ProfileTabs {...propsWithEmpty} />)
      expect(screen.getByTestId('achievement-list')).toHaveTextContent(
        'Achievements: 0'
      )
    })
  })

  describe('Tab Content - Additional Certificate List', () => {
    it('should render AdditionalCertificateList component', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(
        screen.getByTestId('additional-certificate-list')
      ).toBeInTheDocument()
    })

    it('should pass additionalCertificates to AdditionalCertificateList', () => {
      render(<ProfileTabs {...defaultProps} />)
      expect(
        screen.getByTestId('additional-certificate-list')
      ).toHaveTextContent('Additional: 1')
    })

    it('should pass loading state to AdditionalCertificateList', () => {
      const propsWithLoading = {
        ...defaultProps,
        isLoadingAdditional: true,
      }
      render(<ProfileTabs {...propsWithLoading} />)
      expect(
        screen.getByTestId('additional-certificate-list')
      ).toHaveTextContent('Loading...')
    })

    it('should handle empty additionalCertificates array', () => {
      const propsWithEmpty = {
        ...defaultProps,
        additionalCertificates: [],
      }
      render(<ProfileTabs {...propsWithEmpty} />)
      expect(
        screen.getByTestId('additional-certificate-list')
      ).toHaveTextContent('Additional: 0')
    })
  })

  describe('PropTypes - Default Values', () => {
    it('should render with minimal props', () => {
      expect(() => {
        render(<ProfileTabs />)
      }).not.toThrow()
    })

    it('should use default empty arrays', () => {
      render(<ProfileTabs />)
      expect(screen.getByTestId('certificate-list')).toHaveTextContent(
        'Certificates: 0'
      )
      expect(screen.getByTestId('program-list')).toHaveTextContent(
        'Programs: 0'
      )
      expect(screen.getByTestId('achievement-list')).toHaveTextContent(
        'Achievements: 0'
      )
      expect(
        screen.getByTestId('additional-certificate-list')
      ).toHaveTextContent('Additional: 0')
    })

    it('should use default loading states as false', () => {
      render(<ProfileTabs />)
      expect(screen.getByTestId('certificate-list')).not.toHaveTextContent(
        'Loading...'
      )
      expect(screen.getByTestId('program-list')).not.toHaveTextContent(
        'Loading...'
      )
      expect(screen.getByTestId('achievement-list')).not.toHaveTextContent(
        'Loading...'
      )
      expect(
        screen.getByTestId('additional-certificate-list')
      ).not.toHaveTextContent('Loading...')
    })
  })

  describe('PropTypes - Null/Undefined Handling', () => {
    it('should handle null arrays', () => {
      const propsWithNull = {
        certificates: null,
        programs: null,
        achievements: null,
        additionalCertificates: null,
        isLoadingCertificates: false,
        isLoadingPrograms: false,
        isLoadingAchievements: false,
        isLoadingAdditional: false,
      }

      expect(() => {
        render(<ProfileTabs {...propsWithNull} />)
      }).not.toThrow()
    })

    it('should handle undefined loading states', () => {
      const propsWithUndefined = {
        ...defaultProps,
        isLoadingCertificates: undefined,
        isLoadingPrograms: undefined,
        isLoadingAchievements: undefined,
        isLoadingAdditional: undefined,
      }

      expect(() => {
        render(<ProfileTabs {...propsWithUndefined} />)
      }).not.toThrow()
    })
  })

  describe('Layout and Structure', () => {
    it('should have proper container styling', () => {
      const { container } = render(<ProfileTabs {...defaultProps} />)
      const tabContainer = container.querySelector('.mt-5.rounded-lg.bg-white')
      expect(tabContainer).toBeInTheDocument()
    })

    it('should have shadow styling', () => {
      const { container } = render(<ProfileTabs {...defaultProps} />)
      const tabContainer = container.querySelector(
        '.shadow-\\[3px_0_16px_rgba\\(0\\,0\\,0\\,0\\.1\\)\\]'
      )
      expect(tabContainer).toBeInTheDocument()
    })

    it('should have padding', () => {
      const { container } = render(<ProfileTabs {...defaultProps} />)
      const tabContainer = container.querySelector('.p-5')
      expect(tabContainer).toBeInTheDocument()
    })
  })

  describe('All Tabs Loading Together', () => {
    it('should handle all tabs loading at once', () => {
      const allLoadingProps = {
        ...defaultProps,
        isLoadingCertificates: true,
        isLoadingPrograms: true,
        isLoadingAchievements: true,
        isLoadingAdditional: true,
      }

      render(<ProfileTabs {...allLoadingProps} />)

      expect(screen.getByTestId('certificate-list')).toHaveTextContent(
        'Loading...'
      )
      expect(screen.getByTestId('program-list')).toHaveTextContent('Loading...')
      expect(screen.getByTestId('achievement-list')).toHaveTextContent(
        'Loading...'
      )
      expect(
        screen.getByTestId('additional-certificate-list')
      ).toHaveTextContent('Loading...')
    })
  })

  describe('Large Data Sets', () => {
    it('should handle large number of certificates', () => {
      const largeCertificates = Array.from({ length: 50 }, (_, i) => ({
        id_certif: i,
        name_certif: `Certificate ${i}`,
      }))

      const largeProps = {
        ...defaultProps,
        certificates: largeCertificates,
      }

      render(<ProfileTabs {...largeProps} />)
      expect(screen.getByTestId('certificate-list')).toHaveTextContent(
        'Certificates: 50'
      )
    })

    it('should handle large number of programs', () => {
      const largePrograms = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Program ${i}`,
      }))

      const largeProps = {
        ...defaultProps,
        programs: largePrograms,
      }

      render(<ProfileTabs {...largeProps} />)
      expect(screen.getByTestId('program-list')).toHaveTextContent(
        'Programs: 100'
      )
    })
  })

  describe('Translation Keys', () => {
    it('should use correct translation keys for tab labels', () => {
      render(<ProfileTabs {...defaultProps} />)

      // Check that translations are applied correctly
      expect(screen.getByText('Certificate')).toBeInTheDocument()
      expect(screen.getByText('Completed Programs')).toBeInTheDocument()
      expect(screen.getByText('Achievements')).toBeInTheDocument()
      expect(screen.getByText('Additional')).toBeInTheDocument()
    })
  })
})
