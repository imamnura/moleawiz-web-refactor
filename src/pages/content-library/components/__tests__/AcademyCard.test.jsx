/**
 * AcademyCard Component Tests
 * Unit tests for AcademyCard component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { AcademyCard } from '../AcademyCard'

// Mock hooks
vi.mock('@hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_cl.academy_card.programs': 'Programs',
        'feature.feature_cl.academy_card.enter': 'Enter',
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

describe('AcademyCard', () => {
  const mockAcademy = {
    id: 1,
    name: 'Test Academy',
    description: 'This is a test academy description',
    thumbnail: '/test-thumbnail.jpg',
    total_programs: 5,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render academy information', () => {
    const { container } = render(
      <MemoryRouter>
        <AcademyCard academy={mockAcademy} />
      </MemoryRouter>
    )

    expect(screen.getByText('Test Academy')).toBeInTheDocument()
    expect(
      screen.getByText('This is a test academy description')
    ).toBeInTheDocument()

    // Check that programs count is displayed
    expect(container.textContent).toContain('5')
    expect(container.textContent).toContain('Programs')
  })

  it('should render image with correct src and alt', () => {
    render(
      <BrowserRouter>
        <AcademyCard academy={mockAcademy} />
      </BrowserRouter>
    )

    const image = screen.getByAltText('Test Academy')
    expect(image).toBeInTheDocument()
    expect(image).toHaveClass('ant-image-img')
  })

  it('should navigate to academy detail when clicked', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <AcademyCard academy={mockAcademy} />
      </BrowserRouter>
    )

    const card = screen
      .getByRole('img', { name: 'Test Academy' })
      .closest('.ant-card')
    await user.click(card)

    expect(mockNavigate).toHaveBeenCalledWith('/content-library/academy/1')
  })

  it('should show dash when description is empty', () => {
    const academyWithoutDesc = { ...mockAcademy, description: null }

    render(
      <BrowserRouter>
        <AcademyCard academy={academyWithoutDesc} />
      </BrowserRouter>
    )

    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('should display Enter button in desktop view', () => {
    render(
      <BrowserRouter>
        <AcademyCard academy={mockAcademy} />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: /enter/i })).toBeInTheDocument()
  })

  it('should render as article with proper accessibility in mobile view', async () => {
    const { useIsMobile } = await import('@hooks/useIsMobile')
    useIsMobile.mockReturnValue(true)

    const { container } = render(
      <BrowserRouter>
        <AcademyCard academy={mockAcademy} />
      </BrowserRouter>
    )

    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
    expect(article).toHaveAttribute('role', 'button')
    expect(article).toHaveAttribute('tabIndex', '0')
  })

  it('should navigate on Enter key press in mobile view', async () => {
    const { useIsMobile } = await import('@hooks/useIsMobile')
    useIsMobile.mockReturnValue(true)

    const user = userEvent.setup()

    const { container } = render(
      <BrowserRouter>
        <AcademyCard academy={mockAcademy} />
      </BrowserRouter>
    )

    const article = container.querySelector('article')
    article.focus()
    await user.keyboard('{Enter}')

    expect(mockNavigate).toHaveBeenCalledWith('/content-library/academy/1')
  })
})
