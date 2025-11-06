import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AchievementList } from '../AchievementList'

// Mock Ant Design
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Image: ({ src, alt, fallback, width, height }) => (
      <img
        data-testid="badge-image"
        src={src || fallback}
        alt={alt}
        width={width}
        height={height}
      />
    ),
    Modal: ({ open, children, onCancel }) =>
      open ? (
        <div data-testid="badge-modal" role="dialog">
          <button data-testid="modal-close" onClick={onCancel}>
            Close
          </button>
          {children}
        </div>
      ) : null,
  }
})

// Mock icons
vi.mock('@ant-design/icons', () => ({
  CloseOutlined: () => <span>X</span>,
}))

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_profile.sec_tab.no_badges_yet': 'No badges yet',
        'feature.feature_profile.sec_popup_badges.from_module': 'From Module',
        'feature.feature_profile.sec_popup_badges.received_on': 'Received on',
        'feature.feature_profile.sec_popup_badges.description': 'Description',
      }
      return translations[key] || key
    },
    i18n: { language: 'en' },
  }),
}))

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  formatProfileDate: (date) => (date ? '15 March 2024' : '-'),
}))

describe('AchievementList', () => {
  const mockAchievements = [
    {
      id: 1,
      name: 'First Login',
      image: 'https://example.com/badge1.png',
      thumbnail: 'https://example.com/thumb1.png',
      module_name: 'Onboarding Module',
      recived: '2024-03-15',
      description: 'Complete your first login',
      point: 10,
    },
    {
      id: 2,
      name: 'Course Completed',
      image: 'https://example.com/badge2.png',
      module_name: 'React Fundamentals',
      recived: '2024-03-20',
      description: 'Finish your first course',
      point: 50,
    },
    {
      id: 3,
      name: 'Quick Learner',
      image: null,
      module_name: null,
      recived: null,
      description: null,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render AchievementList without crashing', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      expect(screen.getByText('First Login')).toBeInTheDocument()
    })

    it('should render all achievements', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      expect(screen.getByText('First Login')).toBeInTheDocument()
      expect(screen.getByText('Course Completed')).toBeInTheDocument()
      expect(screen.getByText('Quick Learner')).toBeInTheDocument()
    })

    it('should render badge images', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      const images = screen.getAllByTestId('badge-image')
      expect(images).toHaveLength(mockAchievements.length)
    })

    it('should render in grid layout', () => {
      const { container } = render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass(
        'grid-cols-2',
        'md:grid-cols-4',
        'lg:grid-cols-6'
      )
    })

    it('should use image field when available', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      const images = screen.getAllByTestId('badge-image')
      expect(images[0]).toHaveAttribute('src', mockAchievements[0].image)
    })

    it('should fallback to thumbnail when image is null', () => {
      const achievementsWithoutImage = [{ ...mockAchievements[0], image: null }]
      render(
        <AchievementList
          achievements={achievementsWithoutImage}
          isLoading={false}
        />
      )
      const image = screen.getByTestId('badge-image')
      expect(image).toHaveAttribute(
        'src',
        achievementsWithoutImage[0].thumbnail
      )
    })
  })

  describe('Loading State', () => {
    it('should show loading message when isLoading is true', () => {
      render(<AchievementList achievements={[]} isLoading={true} />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should not show achievements when loading', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={true} />
      )
      expect(screen.queryByText('First Login')).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty message when no achievements', () => {
      render(<AchievementList achievements={[]} isLoading={false} />)
      expect(screen.getByText('No badges yet')).toBeInTheDocument()
    })

    it('should show empty message when achievements is null', () => {
      render(<AchievementList achievements={null} isLoading={false} />)
      expect(screen.getByText('No badges yet')).toBeInTheDocument()
    })

    it('should show empty message when achievements is undefined', () => {
      render(<AchievementList achievements={undefined} isLoading={false} />)
      expect(screen.getByText('No badges yet')).toBeInTheDocument()
    })
  })

  describe('Modal Interaction', () => {
    it('should open modal when badge is clicked', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      const badge = document.getElementById('badge-0')
      fireEvent.click(badge)

      expect(screen.getByTestId('badge-modal')).toBeInTheDocument()
    })

    it('should close modal when close button is clicked', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-0'))
      expect(screen.getByTestId('badge-modal')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('modal-close'))
      expect(screen.queryByTestId('badge-modal')).not.toBeInTheDocument()
    })

    it('should display badge name in modal', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-0'))

      const modal = screen.getByTestId('badge-modal')
      expect(modal).toHaveTextContent('First Login')
    })

    it('should display correct badge when different badges are clicked', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-1'))

      const modal = screen.getByTestId('badge-modal')
      expect(modal).toHaveTextContent('Course Completed')
    })
  })

  describe('Modal Content - Module Name', () => {
    it('should show module name when available', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-0'))

      expect(screen.getByText('From Module')).toBeInTheDocument()
      expect(screen.getByText('Onboarding Module')).toBeInTheDocument()
    })

    it('should not show module section when module_name is null', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-2'))

      const modal = screen.getByTestId('badge-modal')
      expect(modal).not.toHaveTextContent('From Module')
    })
  })

  describe('Modal Content - Received Date', () => {
    it('should show received date when available', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-0'))

      expect(screen.getByText('Received on')).toBeInTheDocument()
      expect(screen.getByText('15 March 2024')).toBeInTheDocument()
    })

    it('should not show received date section when recived is null', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-2'))

      const modal = screen.getByTestId('badge-modal')
      expect(modal).not.toHaveTextContent('Received on')
    })
  })

  describe('Modal Content - Description', () => {
    it('should show description when available', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-0'))

      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Complete your first login')).toBeInTheDocument()
    })

    it('should not show description section when description is null', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-2'))

      const modal = screen.getByTestId('badge-modal')
      expect(modal).not.toHaveTextContent('Description')
    })
  })

  describe('Badge Display', () => {
    it('should show badge images with correct size', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      const images = screen.getAllByTestId('badge-image')
      expect(images[0]).toHaveAttribute('width', '120')
      expect(images[0]).toHaveAttribute('height', '120')
    })

    it('should truncate long badge names', () => {
      const { container } = render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      const badgeName = container.querySelector('.line-clamp-2')
      expect(badgeName).toBeInTheDocument()
    })

    it('should have hover scale effect', () => {
      const { container } = render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      const badge = container.querySelector('.hover\\:scale-110')
      expect(badge).toBeInTheDocument()
    })

    it('should be centered text', () => {
      const { container } = render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      const badge = container.querySelector('.text-center')
      expect(badge).toBeInTheDocument()
    })

    it('should have cursor pointer', () => {
      const { container } = render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      const badge = container.querySelector('.cursor-pointer')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Modal Image Display', () => {
    it('should show larger image in modal', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      fireEvent.click(document.getElementById('badge-0'))

      const modal = screen.getByTestId('badge-modal')
      const images = modal.querySelectorAll('[data-testid="badge-image"]')

      // Modal should have image with 200x200 size
      expect(images[0]).toHaveAttribute('width', '200')
      expect(images[0]).toHaveAttribute('height', '200')
    })
  })

  describe('PropTypes', () => {
    it('should render with minimal props', () => {
      expect(() => {
        render(<AchievementList />)
      }).not.toThrow()
    })

    it('should handle empty array', () => {
      render(<AchievementList achievements={[]} isLoading={false} />)
      expect(screen.getByText('No badges yet')).toBeInTheDocument()
    })

    it('should handle single achievement', () => {
      const singleAchievement = [mockAchievements[0]]
      render(
        <AchievementList achievements={singleAchievement} isLoading={false} />
      )
      expect(screen.getByText('First Login')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper badge ids', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      expect(document.getElementById('badge-0')).toBeInTheDocument()
      expect(document.getElementById('badge-1')).toBeInTheDocument()
      expect(document.getElementById('badge-2')).toBeInTheDocument()
    })

    it('should have alt text for images', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )
      const images = screen.getAllByTestId('badge-image')
      expect(images[0]).toHaveAttribute('alt', 'First Login')
    })
  })

  describe('Edge Cases', () => {
    it('should handle achievements with missing fields', () => {
      const incompleteAchievements = [
        {
          id: 1,
          name: 'Test Badge',
        },
      ]

      expect(() => {
        render(
          <AchievementList
            achievements={incompleteAchievements}
            isLoading={false}
          />
        )
      }).not.toThrow()
    })

    it('should handle achievements with empty strings', () => {
      const emptyAchievements = [
        {
          id: 1,
          name: '',
          image: '',
          module_name: '',
          recived: '',
          description: '',
        },
      ]

      expect(() => {
        render(
          <AchievementList achievements={emptyAchievements} isLoading={false} />
        )
      }).not.toThrow()
    })

    it('should handle numeric and string ids', () => {
      const mixedIdAchievements = [
        { ...mockAchievements[0], id: 123 },
        { ...mockAchievements[1], id: '456' },
      ]

      render(
        <AchievementList achievements={mixedIdAchievements} isLoading={false} />
      )
      expect(document.getElementById('badge-0')).toBeInTheDocument()
      expect(document.getElementById('badge-1')).toBeInTheDocument()
    })

    it('should handle very long badge names', () => {
      const longNameAchievement = [
        {
          ...mockAchievements[0],
          name: 'This is a very long badge name that should be truncated properly to avoid layout issues',
        },
      ]

      render(
        <AchievementList achievements={longNameAchievement} isLoading={false} />
      )
      expect(document.getElementById('badge-0')).toBeInTheDocument()
    })

    it('should handle very long descriptions', () => {
      const longDescAchievement = [
        {
          ...mockAchievements[0],
          description:
            'This is a very long description that should be displayed properly in the modal without breaking the layout or causing any issues with the UI components.',
        },
      ]

      render(
        <AchievementList achievements={longDescAchievement} isLoading={false} />
      )
      fireEvent.click(document.getElementById('badge-0'))

      expect(screen.getByTestId('badge-modal')).toBeInTheDocument()
    })
  })

  describe('Grid Responsiveness', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-2')
      expect(grid).toHaveClass('md:grid-cols-4')
      expect(grid).toHaveClass('lg:grid-cols-6')
    })

    it('should have proper gap and padding', () => {
      const { container } = render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('gap-6')
      expect(grid).toHaveClass('p-10')
    })
  })

  describe('Multiple Modal Opens', () => {
    it('should maintain separate state for each badge', () => {
      render(
        <AchievementList achievements={mockAchievements} isLoading={false} />
      )

      // Open first badge
      fireEvent.click(document.getElementById('badge-0'))
      const modal1 = screen.getByTestId('badge-modal')
      expect(modal1).toHaveTextContent('First Login')

      // Close
      fireEvent.click(screen.getByTestId('modal-close'))

      // Open second badge
      fireEvent.click(document.getElementById('badge-1'))
      const modal2 = screen.getByTestId('badge-modal')
      expect(modal2).toHaveTextContent('Course Completed')
    })
  })
})
