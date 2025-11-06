/**
 * CollectionCard Component Tests
 * Unit tests for CollectionCard component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { CollectionCard } from '../CollectionCard'

// Mock hooks
vi.mock('@hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_cl.collection_card.completed': 'Completed',
        'feature.feature_cl.main_collection_card.program_cap': 'PROGRAM',
        'feature.feature_cl.main_collection_card.course_cap': 'COURSE',
        'feature.feature_cl.main_collection_card.module_cap': 'MODULE',
      }
      return translations[key] || key
    },
  }),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('CollectionCard', () => {
  const mockJourneyItem = {
    id: 1,
    type: 'journey',
    name: 'Test Journey',
    description: 'Journey description',
    thumbnail: '/journey.jpg',
    content_library_id: 10,
    journey_id: 1,
    is_complete: false,
  }

  const mockCourseItem = {
    id: 2,
    type: 'course',
    name: 'Test Course',
    description: 'Course description',
    thumbnail: '/course.jpg',
    content_library_id: 10,
    journey_id: 1,
    course_id: 2,
    is_complete: true,
  }

  const mockModuleItem = {
    id: 3,
    type: 'module',
    fullname: 'Test Module',
    description: 'Module description',
    thumbnail: '/module.jpg',
    content_library_id: 10,
    journey_id: 1,
    course_id: 2,
    module_id: 3,
    is_complete: false,
  }

  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render journey item correctly', () => {
    render(
      <BrowserRouter>
        <CollectionCard item={mockJourneyItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    expect(screen.getByText('Test Journey')).toBeInTheDocument()
    expect(screen.getByText('Journey description')).toBeInTheDocument()
    expect(screen.getByText('PROGRAM')).toBeInTheDocument()
  })

  it('should render course item correctly', () => {
    render(
      <BrowserRouter>
        <CollectionCard item={mockCourseItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    expect(screen.getByText('Test Course')).toBeInTheDocument()
    expect(screen.getByText('COURSE')).toBeInTheDocument()
  })

  it('should render module item with fullname', () => {
    render(
      <BrowserRouter>
        <CollectionCard item={mockModuleItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    expect(screen.getByText('Test Module')).toBeInTheDocument()
    expect(screen.getByText('MODULE')).toBeInTheDocument()
  })

  it('should show completion badge when item is complete', () => {
    render(
      <BrowserRouter>
        <CollectionCard item={mockCourseItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('should not show completion badge when item is incomplete', () => {
    render(
      <BrowserRouter>
        <CollectionCard item={mockJourneyItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    expect(screen.queryByText('Completed')).not.toBeInTheDocument()
  })

  it('should navigate to correct path when card is clicked', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CollectionCard item={mockJourneyItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    const card = screen.getByText('Test Journey').closest('.ant-card')
    await user.click(card)

    expect(mockNavigate).toHaveBeenCalledWith(
      '/content-library/academy/10/journey/1'
    )
  })

  it('should open delete modal when delete button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CollectionCard item={mockJourneyItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    // Modal should appear
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should call onDelete when confirmed in modal', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CollectionCard item={mockJourneyItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    // Click delete button on card
    const deleteButton = screen.getAllByRole('button')[0] // First button is delete icon
    await user.click(deleteButton)

    // Confirm in modal - get the danger button
    const modal = screen.getByRole('dialog')
    const buttons = within(modal).getAllByRole('button')
    const confirmButton = buttons.find((btn) =>
      btn.classList.contains('ant-btn-dangerous')
    )
    await user.click(confirmButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockJourneyItem)
  })

  it('should not delete when cancel is clicked in modal', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CollectionCard item={mockJourneyItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    // Click delete button on card
    const deleteButton = screen.getAllByRole('button')[0]
    await user.click(deleteButton)

    // Cancel in modal
    const modal = screen.getByRole('dialog')
    const buttons = within(modal).getAllByRole('button')
    const cancelButton = buttons.find(
      (btn) => !btn.classList.contains('ant-btn-dangerous')
    )
    await user.click(cancelButton)

    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('should render as article in mobile view', async () => {
    const { useIsMobile } = await import('@hooks/useIsMobile')
    useIsMobile.mockReturnValue(true)

    const { container } = render(
      <BrowserRouter>
        <CollectionCard item={mockJourneyItem} onDelete={mockOnDelete} />
      </BrowserRouter>
    )

    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
    expect(article).toHaveAttribute('role', 'button')
  })
})
