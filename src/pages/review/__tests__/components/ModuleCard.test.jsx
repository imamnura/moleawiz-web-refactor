import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import ModuleCard from '../../components/ModuleCard'

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  formatModuleDate: vi.fn((date) => '30 Nov 2025'),
  canDeleteModule: vi.fn((module) => module.can_delete === true),
}))

// Mock Ant Design Image
vi.mock('antd', () => ({
  Image: ({ src, fallback, alt, width, height }) => (
    <img
      src={src || fallback}
      alt={alt}
      width={width}
      height={height}
      data-testid="ant-image"
    />
  ),
}))

describe('ModuleCard', () => {
  const mockModule = {
    module_id: 101,
    journey_id: 10,
    module_name: 'JavaScript Fundamentals',
    journey_name: 'Web Development',
    thumbnail: 'https://via.placeholder.com/150',
    deadline: '2025-11-30',
    need_review: 5,
    has_all_users_first_submission: 1,
    can_delete: false,
  }

  const mockOnClick = vi.fn()
  const mockOnDelete = vi.fn()

  const renderModuleCard = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ModuleCard
          module={mockModule}
          onClick={mockOnClick}
          onDelete={mockOnDelete}
          {...props}
        />
      </I18nextProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Desktop Layout', () => {
    it('should render module information correctly', () => {
      renderModuleCard()

      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Web Development')).toBeInTheDocument()
    })

    it('should display thumbnail with fallback', () => {
      renderModuleCard()

      const images = screen.getAllByTestId('ant-image')
      const thumbnail = images.find((img) =>
        img.alt.includes('Thumbnail Module Review')
      )
      expect(thumbnail).toBeInTheDocument()
      expect(thumbnail).toHaveAttribute(
        'src',
        'https://via.placeholder.com/150'
      )
    })

    it('should format deadline correctly', () => {
      renderModuleCard()

      expect(screen.getByText('30 Nov 2025')).toBeInTheDocument()
    })

    it('should show need review count', () => {
      renderModuleCard()

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should call onClick when card is clicked', async () => {
      const user = userEvent.setup()
      renderModuleCard()

      const card = screen.getByText('JavaScript Fundamentals').closest('div')
      await user.click(card)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should show delete icon when module can be deleted', () => {
      renderModuleCard({
        module: { ...mockModule, can_delete: true },
      })

      const deleteIcon = screen.getByAltText('Delete Module')
      expect(deleteIcon).toBeInTheDocument()
    })

    it('should not show delete icon when module cannot be deleted', () => {
      renderModuleCard({
        module: { ...mockModule, can_delete: false },
      })

      const deleteIcon = screen.queryByAltText('Delete Module')
      expect(deleteIcon).not.toBeInTheDocument()
    })

    it('should call onDelete when delete icon is clicked', async () => {
      const user = userEvent.setup()
      const deletableModule = { ...mockModule, can_delete: true }
      
      renderModuleCard({
        module: deletableModule,
      })

      const deleteIcon = screen.getByAltText('Delete Module')
      await user.click(deleteIcon)

      expect(mockOnDelete).toHaveBeenCalledTimes(1)
      expect(mockOnDelete).toHaveBeenCalledWith(deletableModule)
    })

    it('should stop propagation when delete is clicked', async () => {
      const user = userEvent.setup()
      renderModuleCard({
        module: { ...mockModule, can_delete: true },
      })

      const deleteIcon = screen.getByAltText('Delete Module')
      await user.click(deleteIcon)

      // onClick should not be called when delete is clicked
      expect(mockOnClick).not.toHaveBeenCalled()
      expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })

    it('should apply active styling when isActive is true', () => {
      const { container } = renderModuleCard({ isActive: true })

      const activeCard = container.querySelector('.bg-blue-50')
      expect(activeCard).toBeInTheDocument()
    })

    it('should apply hover styling when isActive is false', () => {
      const { container } = renderModuleCard({ isActive: false })

      const hoverCard = container.querySelector('.hover\\:bg-gray-50')
      expect(hoverCard).toBeInTheDocument()
    })
  })

  describe('Mobile Layout', () => {
    it('should render mobile layout correctly', () => {
      renderModuleCard({ isMobile: true })

      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Web Development')).toBeInTheDocument()
    })

    it('should use mobile image dimensions', () => {
      renderModuleCard({ isMobile: true })

      const images = screen.getAllByTestId('ant-image')
      const thumbnail = images.find((img) => img.alt.includes('Thumbnail'))
      expect(thumbnail).toHaveAttribute('width', '101')
      expect(thumbnail).toHaveAttribute('height', '116')
    })

    it('should display module name with line clamp on mobile', () => {
      renderModuleCard({ isMobile: true })

      const moduleName = screen.getByText('JavaScript Fundamentals')
      expect(moduleName).toHaveClass('line-clamp-2')
    })

    it('should truncate long program names on mobile', () => {
      renderModuleCard({
        module: {
          ...mockModule,
          journey_name: 'Very Long Program Name That Should Be Truncated',
        },
        isMobile: true,
      })

      const programName = screen.getByText(
        'Very Long Program Name That Should Be Truncated'
      )
      expect(programName).toHaveClass('truncate')
    })

    it('should render in card container with shadow', () => {
      const { container } = renderModuleCard({ isMobile: true })

      const card = container.querySelector('.shadow-sm')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing thumbnail gracefully', () => {
      renderModuleCard({
        module: { ...mockModule, thumbnail: null },
      })

      const images = screen.getAllByTestId('ant-image')
      expect(images.length).toBeGreaterThan(0)
    })

    it('should handle missing need_review count', () => {
      renderModuleCard({
        module: { ...mockModule, need_review: 0 },
      })

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should truncate very long module names on desktop', () => {
      renderModuleCard({
        module: {
          ...mockModule,
          module_name: 'Very Long Module Name That Should Be Truncated',
        },
      })

      const moduleName = screen.getByText(
        'Very Long Module Name That Should Be Truncated'
      )
      expect(moduleName).toHaveClass('truncate')
    })

    it('should handle missing onDelete prop', () => {
      expect(() => {
        renderModuleCard({
          module: { ...mockModule, can_delete: true },
          onDelete: null,
        })
      }).not.toThrow()
    })
  })

  describe('Table Layout', () => {
    it('should render data in table format on desktop', () => {
      renderModuleCard()

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('should have correct table structure', () => {
      renderModuleCard()

      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(3) // Program, Deadline, Need Review
    })

    it('should use flex layout on mobile (not table)', () => {
      const { container } = renderModuleCard({ isMobile: true })

      const table = container.querySelector('table')
      expect(table).not.toBeInTheDocument()
    })
  })
})
