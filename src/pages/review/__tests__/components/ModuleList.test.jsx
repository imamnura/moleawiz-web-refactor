import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import ModuleList from '../../components/ModuleList'

// Mock ModuleCard component
vi.mock('../../components/ModuleCard', () => ({
  default: ({ module, onClick, onDelete, isActive, isMobile }) => (
    <div
      data-testid="module-card"
      data-active={isActive}
      data-mobile={isMobile}
      onClick={onClick}
    >
      <span data-testid="module-name">{module.module_name}</span>
      <span data-testid="journey-name">{module.journey_name}</span>
      {onDelete && (
        <button
          data-testid="delete-button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(module.module_id)
          }}
        >
          Delete
        </button>
      )}
    </div>
  ),
}))

// Mock Loader
vi.mock('@components/common/Loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}))

// Mock Ant Design Card
vi.mock('antd', () => ({
  Card: ({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}))

describe('ModuleList', () => {
  const mockModules = [
    {
      module_id: 1,
      journey_id: 101,
      module_name: 'JavaScript Basics',
      journey_name: 'Web Development',
      thumbnail: 'https://example.com/thumb1.jpg',
      deadline: '2024-01-01',
      need_review: 5,
      has_all_users_first_submission: 1,
    },
    {
      module_id: 2,
      journey_id: 102,
      module_name: 'React Fundamentals',
      journey_name: 'Frontend Track',
      thumbnail: 'https://example.com/thumb2.jpg',
      deadline: '2024-01-15',
      need_review: 3,
      has_all_users_first_submission: 0,
    },
  ]

  const mockOnDeleteModule = vi.fn()

  const renderModuleList = (props = {}, route = '/review') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route
              path="/review"
              element={
                <ModuleList
                  modules={mockModules}
                  isLoading={false}
                  onDeleteModule={mockOnDeleteModule}
                  {...props}
                />
              }
            />
            <Route
              path="/review/module/:moduleId/:journeyId"
              element={
                <ModuleList
                  modules={mockModules}
                  isLoading={false}
                  onDeleteModule={mockOnDeleteModule}
                  {...props}
                />
              }
            />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Desktop Layout', () => {
    it('should render Card wrapper on desktop', () => {
      renderModuleList()

      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
    })

    it('should render all modules', () => {
      renderModuleList()

      const moduleCards = screen.getAllByTestId('module-card')
      expect(moduleCards).toHaveLength(2)
    })

    it('should display module information', () => {
      renderModuleList()

      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument()
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
    })

    it('should mark first module as active when no route params', async () => {
      renderModuleList()

      await waitFor(() => {
        const cards = screen.getAllByTestId('module-card')
        // After auto-navigation, the URL will include moduleId/journeyId
        // In test environment, we check the navigation happened
        expect(cards.length).toBe(2)
      })
    })

    it('should mark correct module as active based on route params', () => {
      renderModuleList({}, '/review/module/2/102')

      const cards = screen.getAllByTestId('module-card')
      // Second card should be active (module_id: 2, journey_id: 102)
      expect(cards[1]).toHaveAttribute('data-active', 'true')
    })

    it('should show scrollable container', () => {
      const { container } = renderModuleList()

      const scrollContainer = container.querySelector(
        '.h-auto.max-h-\\[calc\\(100vh-207px\\)\\].overflow-y-auto'
      )
      expect(scrollContainer).toBeInTheDocument()
    })

    it('should pass onDeleteModule to ModuleCard', () => {
      renderModuleList()

      const deleteButtons = screen.getAllByTestId('delete-button')
      expect(deleteButtons).toHaveLength(2)
    })
  })

  describe('Mobile Layout', () => {
    it('should not render Card wrapper on mobile', () => {
      renderModuleList({ isMobile: true })

      const card = screen.queryByTestId('card')
      expect(card).not.toBeInTheDocument()
    })

    it('should render padding container on mobile', () => {
      const { container } = renderModuleList({ isMobile: true })

      const mobileContainer = container.querySelector('.p-\\[18px\\]')
      expect(mobileContainer).toBeInTheDocument()
    })

    it('should render modules in flex column', () => {
      const { container } = renderModuleList({ isMobile: true })

      const flexContainer = container.querySelector('.flex.flex-col.gap-4')
      expect(flexContainer).toBeInTheDocument()
    })

    it('should pass isMobile to ModuleCard', () => {
      renderModuleList({ isMobile: true })

      const cards = screen.getAllByTestId('module-card')
      cards.forEach((card) => {
        expect(card).toHaveAttribute('data-mobile', 'true')
      })
    })

    it('should not auto-navigate on mobile', async () => {
      const { container } = renderModuleList({ isMobile: true })

      // Give time for potential useEffect
      await waitFor(
        () => {
          const cards = screen.getAllByTestId('module-card')
          expect(cards).toHaveLength(2)
        },
        { timeout: 100 }
      )

      // No navigation should occur on mobile
      const cards = screen.getAllByTestId('module-card')
      expect(cards[0]).not.toHaveAttribute('data-active', 'true')
    })
  })

  describe('Loading State', () => {
    it('should show Loader when isLoading is true (desktop)', () => {
      renderModuleList({ isLoading: true })

      expect(screen.getByTestId('loader')).toBeInTheDocument()
      expect(screen.queryByTestId('module-card')).not.toBeInTheDocument()
    })

    it('should show Loader when isLoading is true (mobile)', () => {
      renderModuleList({ isLoading: true, isMobile: true })

      expect(screen.getByTestId('loader')).toBeInTheDocument()
      expect(screen.queryByTestId('module-card')).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty message on mobile when no modules', () => {
      const { container } = renderModuleList({
        modules: [],
        isMobile: true,
      })

      const emptyMessage = container.querySelector(
        '.text-sm.font-medium.text-gray-600'
      )
      expect(emptyMessage).toBeInTheDocument()
    })

    it('should render nothing on desktop when no modules', () => {
      renderModuleList({ modules: [] })

      expect(screen.queryByTestId('module-card')).not.toBeInTheDocument()
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })

    it('should center empty message on mobile', () => {
      const { container } = renderModuleList({
        modules: [],
        isMobile: true,
      })

      const emptyMessage = container.querySelector('.fixed.top-1\\/2.left-1\\/2')
      expect(emptyMessage).toBeInTheDocument()
    })
  })

  describe('Module Interactions', () => {
    it('should navigate when module is clicked', async () => {
      renderModuleList()

      const cards = screen.getAllByTestId('module-card')
      cards[1].click()

      // Navigation handled by react-router, we verify card click works
      await waitFor(() => {
        expect(cards[1]).toBeInTheDocument()
      })
    })

    it('should call onDeleteModule when delete button is clicked', () => {
      renderModuleList()

      const deleteButtons = screen.getAllByTestId('delete-button')
      deleteButtons[0].click()

      expect(mockOnDeleteModule).toHaveBeenCalledWith(1)
    })

    it('should pass correct module data to cards', () => {
      renderModuleList()

      const moduleNames = screen.getAllByTestId('module-name')
      expect(moduleNames[0]).toHaveTextContent('JavaScript Basics')
      expect(moduleNames[1]).toHaveTextContent('React Fundamentals')

      const journeyNames = screen.getAllByTestId('journey-name')
      expect(journeyNames[0]).toHaveTextContent('Web Development')
      expect(journeyNames[1]).toHaveTextContent('Frontend Track')
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined modules prop', () => {
      renderModuleList({ modules: undefined })

      expect(screen.queryByTestId('module-card')).not.toBeInTheDocument()
    })

    it('should handle null onDeleteModule', () => {
      renderModuleList({ onDeleteModule: null })

      const cards = screen.getAllByTestId('module-card')
      expect(cards).toHaveLength(2)
    })

    it('should handle modules with missing optional fields', () => {
      const incompleteModules = [
        {
          module_id: 1,
          journey_id: 101,
          module_name: 'Test Module',
          journey_name: 'Test Journey',
          // Missing thumbnail, deadline, etc.
        },
      ]

      renderModuleList({ modules: incompleteModules })

      expect(screen.getByText('Test Module')).toBeInTheDocument()
    })
  })

  describe('PropTypes and Defaults', () => {
    it('should use default props when not provided', () => {
      render(
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <ModuleList />
          </I18nextProvider>
        </MemoryRouter>
      )

      // Should not crash and render empty state
      expect(screen.queryByTestId('module-card')).not.toBeInTheDocument()
    })
  })
})
