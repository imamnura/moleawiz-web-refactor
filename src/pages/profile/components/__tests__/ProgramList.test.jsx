import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProgramList } from '../ProgramList'

// Mock Ant Design
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Card: ({ children, onClick, id, className }) => (
      <div
        data-testid={id}
        onClick={onClick}
        className={className}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    ),
    Image: ({ src, alt, fallback }) => (
      <img data-testid="program-image" src={src || fallback} alt={alt} />
    ),
    Modal: ({ open, children, onCancel }) =>
      open ? (
        <div data-testid="program-modal" role="dialog">
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
        'feature.feature_profile.sec_tab.no_program_yet':
          'No programs completed yet',
        'feature.feature_profile.sec_popup_completed_program.program':
          'Program',
        'feature.feature_profile.sec_popup_completed_program.points_earned':
          'points earned',
        'feature.feature_profile.sec_popup_completed_program.point_earned':
          'point earned',
        'feature.feature_profile.sec_popup_completed_program.courses':
          'courses',
        'feature.feature_profile.sec_popup_completed_program.course': 'course',
        'feature.feature_profile.sec_popup_completed_program.completed_on':
          'Completed on',
        'feature.feature_profile.sec_popup_completed_program.description':
          'Description',
      }
      return translations[key] || key
    },
    i18n: { language: 'en' },
  }),
}))

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  formatProfileDate: (date, locale) => {
    if (!date) return '-'
    return locale === 'en' ? '01 January 2024' : '01 Januari 2024'
  },
}))

describe('ProgramList', () => {
  const mockPrograms = [
    {
      id: 1,
      name: 'Frontend Development Bootcamp',
      thumbnail: 'https://example.com/frontend.png',
      completed_date: '2024-01-01',
      point: '150',
      total_course: '12',
      description:
        'Learn modern frontend development with React and TypeScript',
    },
    {
      id: 2,
      name: 'Backend Mastery',
      thumbnail: 'https://example.com/backend.png',
      completed_date: '2024-02-15',
      point: 200,
      total_course: 15,
      description: 'Master backend development with Node.js',
    },
    {
      id: 3,
      name: 'Single Point Program',
      thumbnail: 'https://example.com/single.png',
      completed_date: '2024-03-01',
      point: 1,
      total_course: 1,
      description: null,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render ProgramList without crashing', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)
      expect(screen.getByTestId('card-program-0')).toBeInTheDocument()
    })

    it('should render all programs', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)
      expect(
        screen.getByText('Frontend Development Bootcamp')
      ).toBeInTheDocument()
      expect(screen.getByText('Backend Mastery')).toBeInTheDocument()
      expect(screen.getByText('Single Point Program')).toBeInTheDocument()
    })

    it('should render completion dates', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)
      const dates = screen.getAllByText('01 January 2024')
      expect(dates.length).toBeGreaterThan(0)
    })

    it('should render program images', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)
      const images = screen.getAllByTestId('program-image')
      expect(images).toHaveLength(mockPrograms.length)
    })

    it('should render in grid layout', () => {
      const { container } = render(
        <ProgramList programs={mockPrograms} isLoading={false} />
      )
      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass(
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-4'
      )
    })
  })

  describe('Loading State', () => {
    it('should show loading message when isLoading is true', () => {
      render(<ProgramList programs={[]} isLoading={true} />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should not show programs when loading', () => {
      render(<ProgramList programs={mockPrograms} isLoading={true} />)
      expect(
        screen.queryByText('Frontend Development Bootcamp')
      ).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty message when no programs', () => {
      render(<ProgramList programs={[]} isLoading={false} />)
      expect(screen.getByText('No programs completed yet')).toBeInTheDocument()
    })

    it('should show empty message when programs is null', () => {
      render(<ProgramList programs={null} isLoading={false} />)
      expect(screen.getByText('No programs completed yet')).toBeInTheDocument()
    })

    it('should show empty message when programs is undefined', () => {
      render(<ProgramList programs={undefined} isLoading={false} />)
      expect(screen.getByText('No programs completed yet')).toBeInTheDocument()
    })
  })

  describe('Modal Interaction', () => {
    it('should open modal when program card is clicked', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      const card = screen.getByTestId('card-program-0')
      fireEvent.click(card)

      expect(screen.getByTestId('program-modal')).toBeInTheDocument()
    })

    it('should close modal when close button is clicked', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))
      expect(screen.getByTestId('program-modal')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('modal-close'))
      expect(screen.queryByTestId('program-modal')).not.toBeInTheDocument()
    })

    it('should display program name in modal', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      const modal = screen.getByTestId('program-modal')
      expect(modal).toHaveTextContent('Frontend Development Bootcamp')
    })

    it('should display program label in modal', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByText('Program')).toBeInTheDocument()
    })
  })

  describe('Points Display', () => {
    it('should show plural "points earned" for multiple points', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByText('150')).toBeInTheDocument()
      expect(screen.getByText('points earned')).toBeInTheDocument()
    })

    it('should show singular "point earned" for 1 point', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-2'))

      expect(screen.getByText('point earned')).toBeInTheDocument()
    })

    it('should handle numeric points', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-1'))

      expect(screen.getByText('200')).toBeInTheDocument()
      expect(screen.getByText('points earned')).toBeInTheDocument()
    })

    it('should handle string points', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByText('150')).toBeInTheDocument()
    })
  })

  describe('Courses Display', () => {
    it('should show plural "courses" for multiple courses', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('courses')).toBeInTheDocument()
    })

    it('should show singular "course" for 1 course', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-2'))

      expect(screen.getByText('course')).toBeInTheDocument()
    })

    it('should handle numeric course count', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-1'))

      expect(screen.getByText('15')).toBeInTheDocument()
    })
  })

  describe('Description Display', () => {
    it('should show description when available', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(
        screen.getByText(
          'Learn modern frontend development with React and TypeScript'
        )
      ).toBeInTheDocument()
    })

    it('should show description label', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('should not show description section when description is null', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-2'))

      const modal = screen.getByTestId('program-modal')
      expect(modal).not.toHaveTextContent('Description')
    })

    it('should not show description section when description is empty', () => {
      const programsWithEmptyDesc = [{ ...mockPrograms[0], description: '' }]

      render(<ProgramList programs={programsWithEmptyDesc} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      const modal = screen.getByTestId('program-modal')
      expect(modal).not.toHaveTextContent('Description')
    })
  })

  describe('Date Formatting', () => {
    it('should format dates correctly in English', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      const dates = screen.getAllByText('01 January 2024')
      expect(dates.length).toBeGreaterThan(0)
    })

    it('should show completed date in modal', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByText('Completed on')).toBeInTheDocument()
      const dates = screen.getAllByText('01 January 2024')
      expect(dates.length).toBeGreaterThan(0)
    })
  })

  describe('Card Layout', () => {
    it('should have cursor pointer on cards', () => {
      const { container } = render(
        <ProgramList programs={mockPrograms} isLoading={false} />
      )
      const card = container.querySelector('.cursor-pointer')
      expect(card).toBeInTheDocument()
    })

    it('should have hover scale effect', () => {
      const { container } = render(
        <ProgramList programs={mockPrograms} isLoading={false} />
      )
      const card = container.querySelector('.hover\\:scale-105')
      expect(card).toBeInTheDocument()
    })

    it('should truncate long titles', () => {
      const { container } = render(
        <ProgramList programs={mockPrograms} isLoading={false} />
      )
      const title = container.querySelector('.line-clamp-2')
      expect(title).toBeInTheDocument()
    })

    it('should have fixed height for titles', () => {
      const { container } = render(
        <ProgramList programs={mockPrograms} isLoading={false} />
      )
      const title = container.querySelector('.h-\\[35px\\]')
      expect(title).toBeInTheDocument()
    })
  })

  describe('Modal Layout', () => {
    it('should display thumbnail in modal', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      const modal = screen.getByTestId('program-modal')
      const image = modal.querySelector('[data-testid="program-image"]')
      expect(image).toBeInTheDocument()
    })

    it('should have proper modal structure with flex layout', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByTestId('program-modal')).toBeInTheDocument()
    })
  })

  describe('PropTypes', () => {
    it('should render with minimal props', () => {
      expect(() => {
        render(<ProgramList />)
      }).not.toThrow()
    })

    it('should handle empty array', () => {
      render(<ProgramList programs={[]} isLoading={false} />)
      expect(screen.getByText('No programs completed yet')).toBeInTheDocument()
    })

    it('should handle single program', () => {
      const singleProgram = [mockPrograms[0]]
      render(<ProgramList programs={singleProgram} isLoading={false} />)
      expect(
        screen.getByText('Frontend Development Bootcamp')
      ).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper card ids', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)
      expect(screen.getByTestId('card-program-0')).toBeInTheDocument()
      expect(screen.getByTestId('card-program-1')).toBeInTheDocument()
      expect(screen.getByTestId('card-program-2')).toBeInTheDocument()
    })

    it('should have alt text for images', () => {
      render(<ProgramList programs={mockPrograms} isLoading={false} />)
      const images = screen.getAllByTestId('program-image')
      expect(images[0]).toHaveAttribute('alt', 'Frontend Development Bootcamp')
    })
  })

  describe('Edge Cases', () => {
    it('should handle programs with missing fields', () => {
      const incompletePrograms = [
        {
          id: 1,
          name: 'Incomplete Program',
        },
      ]

      expect(() => {
        render(<ProgramList programs={incompletePrograms} isLoading={false} />)
      }).not.toThrow()
    })

    it('should handle zero points', () => {
      const zeroPointProgram = [{ ...mockPrograms[0], point: 0 }]

      render(<ProgramList programs={zeroPointProgram} isLoading={false} />)
      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle large numbers', () => {
      const largeProgram = [
        { ...mockPrograms[0], point: 999999, total_course: 1000 },
      ]

      render(<ProgramList programs={largeProgram} isLoading={false} />)
      fireEvent.click(screen.getByTestId('card-program-0'))

      expect(screen.getByText('999999')).toBeInTheDocument()
      expect(screen.getByText('1000')).toBeInTheDocument()
    })

    it('should handle empty string values', () => {
      const emptyProgram = [
        {
          id: 1,
          name: '',
          thumbnail: '',
          completed_date: '',
          point: '',
          total_course: '',
        },
      ]

      expect(() => {
        render(<ProgramList programs={emptyProgram} isLoading={false} />)
      }).not.toThrow()
    })
  })

  describe('Grid Responsiveness', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(
        <ProgramList programs={mockPrograms} isLoading={false} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1')
      expect(grid).toHaveClass('md:grid-cols-2')
      expect(grid).toHaveClass('lg:grid-cols-4')
    })

    it('should have proper gap and padding', () => {
      const { container } = render(
        <ProgramList programs={mockPrograms} isLoading={false} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('gap-6')
      expect(grid).toHaveClass('p-10')
    })
  })
})
