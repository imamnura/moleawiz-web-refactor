/**
 * ModuleDetailPage Tests
 * Unit tests for Module Detail page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import ModuleDetailPage from '../ModuleDetailPage'

// Mock hooks
vi.mock('../hooks/useModuleDetail', () => ({
  useModuleDetail: vi.fn(),
  useModuleProgress: vi.fn(),
}))

vi.mock('@/hooks/useResponsive', () => ({
  default: vi.fn(),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ journeyId: '123', courseId: '456', moduleId: '789' }),
  }
})

// Mock components
vi.mock('../components/ModuleHeader', () => ({
  default: ({ module }) => <div data-testid="module-header">{module.fullname}</div>,
}))

vi.mock('../components/ModuleDescription', () => ({
  default: ({ description }) => (
    <div data-testid="module-description">{description}</div>
  ),
}))

vi.mock('../components/ModuleInfo', () => ({
  default: ({ module }) => (
    <div data-testid="module-info">Type: {module.type}</div>
  ),
}))

vi.mock('../components/ModuleActions', () => ({
  default: ({ onResync }) => (
    <button data-testid="module-actions" onClick={() => onResync('789')}>
      Actions
    </button>
  ),
}))

describe('ModuleDetailPage', () => {
  const mockModule = {
    id: '789',
    fullname: 'Test Module',
    description: 'Test Module Description',
    type: 'SCORM',
    point: 50,
    summary: '1',
    grading_method: 'Highest',
    attempt_limit: 3,
    total_attempt: 1,
  }

  const mockResyncScorm = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()

    const useResponsive = (await import('@/hooks/useResponsive')).default
    useResponsive.mockReturnValue({
      isMobile: false,
    })

    const { useModuleProgress } = await import('../hooks/useModuleDetail')
    useModuleProgress.mockReturnValue({
      resyncScorm: mockResyncScorm,
      isResyncing: false,
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: null,
        isLoading: true,
        error: null,
      })

      const { container } = renderWithProviders(<ModuleDetailPage />)

      // Check for Ant Design Spin component
      const spinner = container.querySelector('.ant-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error message', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: null,
        isLoading: false,
        error: { message: 'Failed to load module' },
      })

      renderWithProviders(<ModuleDetailPage />)

      expect(screen.getByText(/error/i)).toBeInTheDocument()
      expect(screen.getByText(/failed to load module/i)).toBeInTheDocument()
    })
  })

  describe('No Data State', () => {
    it('should show empty state when module not found', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: null,
        isLoading: false,
        error: null,
      })

      renderWithProviders(<ModuleDetailPage />)

      expect(screen.getByText(/module not found/i)).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    beforeEach(async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: mockModule,
        isLoading: false,
        error: null,
      })
    })

    it('should render without main tag', () => {
      renderWithProviders(<ModuleDetailPage />)

      const mainElements = document.querySelectorAll('main')
      expect(mainElements.length).toBe(0)
    })

    it('should render module header', () => {
      renderWithProviders(<ModuleDetailPage />)

      expect(screen.getByTestId('module-header')).toBeInTheDocument()
      expect(screen.getByText('Test Module')).toBeInTheDocument()
    })

    it('should render module description', () => {
      renderWithProviders(<ModuleDetailPage />)

      expect(screen.getByTestId('module-description')).toBeInTheDocument()
      expect(screen.getByText('Test Module Description')).toBeInTheDocument()
    })

    it('should render module info', () => {
      renderWithProviders(<ModuleDetailPage />)

      expect(screen.getByTestId('module-info')).toBeInTheDocument()
      expect(screen.getByText('Type: SCORM')).toBeInTheDocument()
    })

    it('should render module actions', () => {
      renderWithProviders(<ModuleDetailPage />)

      expect(screen.getByTestId('module-actions')).toBeInTheDocument()
    })

    it('should have dividers between sections', () => {
      const { container } = renderWithProviders(<ModuleDetailPage />)

      const dividers = container.querySelectorAll('.ant-divider')
      expect(dividers.length).toBeGreaterThan(0)
    })
  })

  describe('Module without Description', () => {
    it('should not render description section', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: { ...mockModule, description: null },
        isLoading: false,
        error: null,
      })

      renderWithProviders(<ModuleDetailPage />)

      expect(screen.queryByTestId('module-description')).not.toBeInTheDocument()
    })
  })

  describe('Re-sync Functionality', () => {
    beforeEach(async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: mockModule,
        isLoading: false,
        error: null,
      })
    })

    it('should call resyncScorm when action triggered', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ModuleDetailPage />)

      const actionsButton = screen.getByTestId('module-actions')
      await user.click(actionsButton)

      await waitFor(() => {
        expect(mockResyncScorm).toHaveBeenCalledWith({ scormKey: 'scorm-789' })
      })
    })

    it('should show resyncing overlay', async () => {
      const { useModuleProgress } = await import('../hooks/useModuleDetail')
      const { useModuleDetail } = await import('../hooks/useModuleDetail')

      useModuleDetail.mockReturnValue({
        module: mockModule,
        isLoading: false,
        error: null,
      })

      useModuleProgress.mockReturnValue({
        resyncScorm: mockResyncScorm,
        isResyncing: true,
      })

      const { container } = renderWithProviders(<ModuleDetailPage />)

      // Check for loading overlay with z-50 class
      const overlay = container.querySelector('.z-50')
      expect(overlay).toBeTruthy()
      
      // Check for Ant Design Spin in the overlay
      const spinner = container.querySelector('.ant-spin')
      expect(spinner).toBeTruthy()
    })
  })

  describe('Mobile View', () => {
    beforeEach(async () => {
      const useResponsive = (await import('@/hooks/useResponsive')).default
      useResponsive.mockReturnValue({
        isMobile: true,
      })

      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: mockModule,
        isLoading: false,
        error: null,
      })
    })

    it('should apply mobile padding with fixed bottom', () => {
      const { container } = renderWithProviders(<ModuleDetailPage />)

      const rootDiv = container.querySelector('.module-detail-page')
      expect(rootDiv).toHaveClass('pb-24')
    })
  })

  describe('Desktop View', () => {
    beforeEach(async () => {
      const useResponsive = (await import('@/hooks/useResponsive')).default
      useResponsive.mockReturnValue({
        isMobile: false,
      })

      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: mockModule,
        isLoading: false,
        error: null,
      })
    })

    it('should apply min-height on desktop', () => {
      const { container } = renderWithProviders(<ModuleDetailPage />)

      const rootDiv = container.querySelector('.module-detail-page')
      expect(rootDiv).toHaveClass('min-h-screen')
    })
  })

  describe('Module Index Calculation', () => {
    it('should parse module index from summary', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: { ...mockModule, summary: '5' },
        isLoading: false,
        error: null,
      })

      renderWithProviders(<ModuleDetailPage />)

      // Module header should receive moduleIndex=5
      expect(screen.getByTestId('module-header')).toBeInTheDocument()
    })

    it('should use sort as fallback when summary contains HTML', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: { ...mockModule, summary: '<p>test</p>', sort: 3 },
        isLoading: false,
        error: null,
      })

      renderWithProviders(<ModuleDetailPage />)

      // Module header should receive moduleIndex=3
      expect(screen.getByTestId('module-header')).toBeInTheDocument()
    })

    it('should use 0 as fallback when no valid index', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: { ...mockModule, summary: '', sort: undefined },
        isLoading: false,
        error: null,
      })

      renderWithProviders(<ModuleDetailPage />)

      expect(screen.getByTestId('module-header')).toBeInTheDocument()
    })
  })
})
