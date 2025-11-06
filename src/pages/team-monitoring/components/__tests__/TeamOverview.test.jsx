import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import TeamOverview from '../TeamOverview'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'feature.feature_tm.member') return 'member'
      if (key === 'feature.feature_tm.show_team_profile') return 'Show Team Profile'
      return key
    },
  }),
}))

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Image: ({ src, alt, width, height, preview }) => (
      <img src={src} alt={alt} width={width} height={height} />
    ),
  }
})

describe('TeamOverview Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('Rendering', () => {
    it('should render team count', () => {
      const { getByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={25} isLoading={false} />
        </MemoryRouter>
      )
      expect(getByText('25 member')).toBeInTheDocument()
    })

    it('should render team icon', () => {
      const { container } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={false} />
        </MemoryRouter>
      )
      const icon = container.querySelector('img[alt="Team"]')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('width', '32')
      expect(icon).toHaveAttribute('height', '32')
    })

    it('should render Show Team Profile button', () => {
      const { getByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={false} />
        </MemoryRouter>
      )
      const button = getByText('Show Team Profile')
      expect(button).toBeInTheDocument()
    })

    it('should render zero team count', () => {
      const { getByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={0} isLoading={false} />
        </MemoryRouter>
      )
      expect(getByText('0 member')).toBeInTheDocument()
    })

    it('should render large team count', () => {
      const { getByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={9999} isLoading={false} />
        </MemoryRouter>
      )
      expect(getByText('9999 member')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should render loading skeleton when isLoading is true', () => {
      const { container } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={true} />
        </MemoryRouter>
      )
      const skeleton = container.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('bg-gray-200')
      expect(skeleton).toHaveClass('h-8')
      expect(skeleton).toHaveClass('rounded')
    })

    it('should not render content when loading', () => {
      const { queryByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={true} />
        </MemoryRouter>
      )
      expect(queryByText('10 member')).not.toBeInTheDocument()
      expect(queryByText('Show Team Profile')).not.toBeInTheDocument()
    })

    it('should render content when not loading', () => {
      const { getByText, container } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={false} />
        </MemoryRouter>
      )
      expect(getByText('10 member')).toBeInTheDocument()
      expect(getByText('Show Team Profile')).toBeInTheDocument()
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to team profile when button clicked', async () => {
      const user = userEvent.setup()
      const { getByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={false} />
        </MemoryRouter>
      )

      const button = getByText('Show Team Profile')
      await user.click(button)

      expect(mockNavigate).toHaveBeenCalledWith('/team-monitoring/team-profile')
      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })

    it('should not navigate when loading', async () => {
      const user = userEvent.setup()
      const { queryByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={true} />
        </MemoryRouter>
      )

      const button = queryByText('Show Team Profile')
      expect(button).not.toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('should render with correct layout', () => {
      const { container } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={false} />
        </MemoryRouter>
      )
      // Just verify container exists
      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render team count with correct text style', () => {
      const { getByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={false} />
        </MemoryRouter>
      )
      const teamText = getByText('10 member')
      expect(teamText).toHaveClass('text-sm')
      expect(teamText).toHaveClass('font-medium')
      expect(teamText).toHaveClass('text-[#424242]')
    })

    it('should render button with correct text', () => {
      const { getByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={false} />
        </MemoryRouter>
      )
      const button = getByText('Show Team Profile')
      expect(button).toBeInTheDocument()
    })
  })

  describe('PropTypes Validation', () => {
    it('should accept required teamCount number', () => {
      const { getByText } = render(
        <MemoryRouter>
          <TeamOverview teamCount={15} isLoading={false} />
        </MemoryRouter>
      )
      expect(getByText('15 member')).toBeInTheDocument()
    })

    it('should accept required isLoading boolean', () => {
      const { container, rerender } = render(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={false} />
        </MemoryRouter>
      )
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument()

      rerender(
        <MemoryRouter>
          <TeamOverview teamCount={10} isLoading={true} />
        </MemoryRouter>
      )
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })
})
