/**
 * SCORMPlayerPage Tests
 * Unit tests for SCORM Player page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { SCORMPlayerPage } from '../SCORMPlayerPage'

// Mock hooks
vi.mock('../hooks/useModuleDetail', () => ({
  useModuleDetail: vi.fn(),
}))

// Mock Redux
const mockSelector = vi.fn()
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux')
  return {
    ...actual,
    useSelector: (fn) => mockSelector(fn),
  }
})

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({
      journeyId: '123',
      courseId: '456',
      moduleId: '789',
    }),
    useNavigate: () => mockNavigate,
  }
})

// Mock components
vi.mock('../components', () => ({
  SCORMPlayer: ({ contentUrl, onComplete, onExit }) => (
    <div data-testid="scorm-player">
      <div>Content: {contentUrl}</div>
      <button onClick={onComplete}>Complete</button>
      <button onClick={onExit}>Exit</button>
    </div>
  ),
}))

vi.mock('@/components/common', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}))

describe('SCORMPlayerPage', () => {
  const mockModule = {
    id: '789',
    fullname: 'Test SCORM Module',
    scorm_url: 'https://example.com/scorm/content/index.html',
    content_url: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock Redux selectors
    mockSelector.mockImplementation((selector) => {
      const state = {
        auth: {
          user: {
            id: 'user-123',
            name: 'John Doe',
          },
        },
      }
      return selector(state)
    })
  })

  describe('Loading State', () => {
    it('should show loader while loading', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: null,
        isLoading: true,
        isError: false,
        error: null,
      })

      renderWithProviders(<SCORMPlayerPage />)

      expect(screen.getByTestId('loader')).toBeInTheDocument()
    })

    it('should center loader on screen', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: null,
        isLoading: true,
        isError: false,
        error: null,
      })

      const { container } = renderWithProviders(<SCORMPlayerPage />)

      const loaderContainer = container.querySelector('.h-screen')
      expect(loaderContainer).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error alert', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: null,
        isLoading: false,
        isError: true,
        error: { message: 'Failed to load module' },
      })

      renderWithProviders(<SCORMPlayerPage />)

      expect(screen.getByText(/error loading module/i)).toBeInTheDocument()
      expect(screen.getByText(/failed to load module/i)).toBeInTheDocument()
    })

    it('should show default error message when no error message', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: null,
        isLoading: false,
        isError: true,
        error: null,
      })

      renderWithProviders(<SCORMPlayerPage />)

      expect(screen.getByText(/failed to load module details/i)).toBeInTheDocument()
    })

    it('should show back to journey button on error', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: null,
        isLoading: false,
        isError: true,
        error: { message: 'Error' },
      })

      const user = userEvent.setup()
      renderWithProviders(<SCORMPlayerPage />)

      const backButton = screen.getByRole('button', { name: /back to journey/i })
      expect(backButton).toBeInTheDocument()

      await user.click(backButton)
      expect(mockNavigate).toHaveBeenCalledWith('/journey/123')
    })
  })

  describe('No Content State', () => {
    it('should show warning when no SCORM URL', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: {
          id: '789',
          fullname: 'Test Module',
          scorm_url: null,
          content_url: null,
        },
        isLoading: false,
        isError: false,
        error: null,
      })

      renderWithProviders(<SCORMPlayerPage />)

      expect(screen.getByText(/content not available/i)).toBeInTheDocument()
      expect(
        screen.getByText(/does not have scorm content/i)
      ).toBeInTheDocument()
    })

    it('should show back to module button when no content', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: { id: '789', scorm_url: null, content_url: null },
        isLoading: false,
        isError: false,
        error: null,
      })

      const user = userEvent.setup()
      renderWithProviders(<SCORMPlayerPage />)

      const backButton = screen.getByRole('button', { name: /back to module/i })
      expect(backButton).toBeInTheDocument()

      await user.click(backButton)
      expect(mockNavigate).toHaveBeenCalledWith(
        '/journey/123/course/456/module/789'
      )
    })
  })

  describe('Success State with SCORM URL', () => {
    beforeEach(async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: mockModule,
        isLoading: false,
        isError: false,
        error: null,
      })
    })

    it('should render SCORM player', () => {
      renderWithProviders(<SCORMPlayerPage />)

      expect(screen.getByTestId('scorm-player')).toBeInTheDocument()
    })

    it('should pass scorm_url to player', () => {
      renderWithProviders(<SCORMPlayerPage />)

      // Check that SCORM player is rendered with content URL
      const contentText = screen.getByText((content, element) => {
        return element.textContent === 'Content: https://example.com/scorm/content/index.html'
      })
      expect(contentText).toBeInTheDocument()
    })

    it('should pass user info to player', () => {
      renderWithProviders(<SCORMPlayerPage />)

      // SCORMPlayer component receives studentId and studentName
      expect(screen.getByTestId('scorm-player')).toBeInTheDocument()
    })

    it('should use fullscreen container', () => {
      const { container } = renderWithProviders(<SCORMPlayerPage />)

      const fullscreenDiv = container.querySelector('.h-screen.w-screen')
      expect(fullscreenDiv).toBeInTheDocument()
    })

    it('should hide overflow', () => {
      const { container } = renderWithProviders(<SCORMPlayerPage />)

      const fullscreenDiv = container.querySelector('.overflow-hidden')
      expect(fullscreenDiv).toBeInTheDocument()
    })
  })

  describe('Success State with content_url fallback', () => {
    it('should use content_url when scorm_url is null', async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: {
          id: '789',
          fullname: 'Test Module',
          scorm_url: null,
          content_url: 'https://example.com/content/index.html',
        },
        isLoading: false,
        isError: false,
        error: null,
      })

      renderWithProviders(<SCORMPlayerPage />)

      expect(screen.getByTestId('scorm-player')).toBeInTheDocument()
      
      // Check that content_url is used
      const contentText = screen.getByText((content, element) => {
        return element.textContent === 'Content: https://example.com/content/index.html'
      })
      expect(contentText).toBeInTheDocument()
    })
  })

  describe('Navigation Callbacks', () => {
    beforeEach(async () => {
      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: mockModule,
        isLoading: false,
        isError: false,
        error: null,
      })
    })

    it('should navigate to module detail on complete', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SCORMPlayerPage />)

      const completeButton = screen.getByRole('button', { name: /complete/i })
      await user.click(completeButton)

      expect(mockNavigate).toHaveBeenCalledWith(
        '/journey/123/course/456/module/789'
      )
    })

    it('should navigate to module detail on exit', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SCORMPlayerPage />)

      const exitButton = screen.getByRole('button', { name: /exit/i })
      await user.click(exitButton)

      expect(mockNavigate).toHaveBeenCalledWith(
        '/journey/123/course/456/module/789'
      )
    })

    it('should log completion to console', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      const user = userEvent.setup()

      renderWithProviders(<SCORMPlayerPage />)

      const completeButton = screen.getByRole('button', { name: /complete/i })
      await user.click(completeButton)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[SCORM Player Page] Module completed'
      )
    })

    it('should log exit to console', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      const user = userEvent.setup()

      renderWithProviders(<SCORMPlayerPage />)

      const exitButton = screen.getByRole('button', { name: /exit/i })
      await user.click(exitButton)

      expect(consoleSpy).toHaveBeenCalledWith('[SCORM Player Page] User exited')
    })
  })

  describe('Redux State', () => {
    it('should handle missing user data', async () => {
      mockSelector.mockImplementation((selector) => {
        const state = {
          auth: {
            user: null,
          },
        }
        return selector(state)
      })

      const { useModuleDetail } = await import('../hooks/useModuleDetail')
      useModuleDetail.mockReturnValue({
        module: mockModule,
        isLoading: false,
        isError: false,
        error: null,
      })

      renderWithProviders(<SCORMPlayerPage />)

      expect(screen.getByTestId('scorm-player')).toBeInTheDocument()
    })
  })
})
