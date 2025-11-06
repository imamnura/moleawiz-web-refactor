/**
 * ContentLibraryPage Tests
 * Unit tests for ContentLibraryPage component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ContentLibraryPage } from '../ContentLibraryPage'

// Mock hooks
vi.mock('@hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

// Mock common components
vi.mock('@components/common/HomeTitle', () => ({
  HomeTitle: ({ title }) => <h1>{title}</h1>,
}))

vi.mock('@components/common/Loader', () => ({
  Loader: () => <div>Loading...</div>,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_cl.title': 'Content Library',
        'feature.feature_cl.tab.content_library': 'Content Library',
        'feature.feature_cl.tab.collection': 'Collection',
        'feature.feature_cl.filter.all': 'All',
        'feature.feature_cl.filter.program': 'Programs',
        'feature.feature_cl.filter.course': 'Courses',
        'feature.feature_cl.filter.module': 'Modules',
      }
      return translations[key] || key
    },
  }),
}))

// Mock custom hooks
vi.mock('../hooks/useAcademies', () => ({
  useAcademies: vi.fn(),
}))

vi.mock('../hooks/useCollections', () => ({
  useCollections: vi.fn(),
}))

vi.mock('../hooks/useDeleteCollection', () => ({
  useDeleteCollection: vi.fn(() => ({
    deleteItem: vi.fn(),
  })),
}))

// Simple render helper without Redux
const renderPage = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ContentLibraryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page with title', async () => {
    const { useAcademies } = await import('../hooks/useAcademies')
    const { useCollections } = await import('../hooks/useCollections')

    useAcademies.mockReturnValue({
      academies: [],
      isLoading: false,
      error: null,
    })

    useCollections.mockReturnValue({
      collections: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    })

    renderPage(<ContentLibraryPage />)

    expect(screen.getByText('Content Library')).toBeInTheDocument()
  })

  it('should not render as main element (main is reserved for page layout)', async () => {
    const { useAcademies } = await import('../hooks/useAcademies')
    const { useCollections } = await import('../hooks/useCollections')

    useAcademies.mockReturnValue({
      academies: [],
      isLoading: false,
      error: null,
    })

    useCollections.mockReturnValue({
      collections: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    })

    const { container } = renderPage(<ContentLibraryPage />)

    // Page should NOT have main tag (main is used in page layout)
    expect(container.querySelector('main')).not.toBeInTheDocument()
    // Should use div instead
    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('should render two tabs', async () => {
    const { useAcademies } = await import('../hooks/useAcademies')
    const { useCollections } = await import('../hooks/useCollections')

    useAcademies.mockReturnValue({
      academies: [],
      isLoading: false,
      error: null,
    })

    useCollections.mockReturnValue({
      collections: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    })

    renderPage(<ContentLibraryPage />)

    expect(
      screen.getByRole('tab', { name: /content library/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /collection/i })).toBeInTheDocument()
  })

  it('should display academies when data is loaded', async () => {
    const { useAcademies } = await import('../hooks/useAcademies')
    const { useCollections } = await import('../hooks/useCollections')

    const mockAcademies = [
      {
        id: 1,
        name: 'Academy 1',
        thumbnail: '/img1.jpg',
        total_programs: 5,
        description: 'Desc 1',
      },
      {
        id: 2,
        name: 'Academy 2',
        thumbnail: '/img2.jpg',
        total_programs: 3,
        description: 'Desc 2',
      },
    ]

    useAcademies.mockReturnValue({
      academies: mockAcademies,
      isLoading: false,
      error: null,
    })

    useCollections.mockReturnValue({
      collections: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    })

    renderPage(<ContentLibraryPage />)

    expect(screen.getByText('Academy 1')).toBeInTheDocument()
    expect(screen.getByText('Academy 2')).toBeInTheDocument()
  })
})
