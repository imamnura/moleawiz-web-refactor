import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileLeaderboardsHeader } from '../MobileLeaderboardsHeader'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_leaderboards.title': 'Leaderboards',
        'feature.feature_leaderboards.header.select_program': 'Select Program',
        'feature.feature_leaderboards.header.all_organization': 'All Organization',
      }
      return translations[key] || key
    },
  }),
}))

describe('MobileLeaderboardsHeader', () => {
  const mockOnProgramClick = vi.fn()
  const mockOnOrgClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render header with semantic HTML', () => {
    const { container } = render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('should render leaderboards title', () => {
    render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    expect(screen.getByText('Leaderboards')).toBeInTheDocument()
  })

  it('should display selected program name', () => {
    render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    expect(screen.getByText('Program Alpha')).toBeInTheDocument()
  })

  it('should display selected organization level', () => {
    render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    expect(screen.getByText('Company Level')).toBeInTheDocument()
  })

  it('should show placeholder when no program selected', () => {
    render(
      <MobileLeaderboardsHeader
        selectedProgram={null}
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    expect(screen.getByText('Select Program')).toBeInTheDocument()
  })

  it('should show placeholder when no organization selected', () => {
    render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg={null}
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    expect(screen.getByText('All Organization')).toBeInTheDocument()
  })

  it('should call onProgramClick when program selector clicked', async () => {
    const user = userEvent.setup()

    render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const programButton = screen.getByText('Program Alpha').closest('button')
    await user.click(programButton)

    expect(mockOnProgramClick).toHaveBeenCalledTimes(1)
  })

  it('should call onOrgClick when organization selector clicked', async () => {
    const user = userEvent.setup()

    render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const orgButton = screen.getByText('Company Level').closest('button')
    await user.click(orgButton)

    expect(mockOnOrgClick).toHaveBeenCalledTimes(1)
  })

  it('should render program selector as button with type="button"', () => {
    const { container } = render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const programButton = screen.getByText('Program Alpha').closest('button')
    expect(programButton).toHaveAttribute('type', 'button')
    expect(programButton).toHaveAttribute('aria-label', 'Select program')
  })

  it('should render organization selector as button with type="button"', () => {
    const { container } = render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const orgButton = screen.getByText('Company Level').closest('button')
    expect(orgButton).toHaveAttribute('type', 'button')
    expect(orgButton).toHaveAttribute('aria-label', 'Select organization level')
  })

  it('should have sticky positioning at top', () => {
    const { container } = render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky', 'top-0')
  })

  it('should have correct height', () => {
    const { container } = render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const header = container.querySelector('header')
    expect(header).toHaveClass('h-[118px]')
  })

  it('should have gradient background', () => {
    const { container } = render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const header = container.querySelector('header')
    expect(header).toHaveClass('bg-linear-to-r')
  })

  it('should render DownOutlined icons', () => {
    const { container } = render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThanOrEqual(2)
  })

  it('should truncate long program names', () => {
    render(
      <MobileLeaderboardsHeader
        selectedProgram="This is a very long program name that should be truncated"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const programText = screen.getByText(
      'This is a very long program name that should be truncated'
    )
    expect(programText).toHaveClass('truncate')
  })

  it('should have z-index for proper layering', () => {
    const { container } = render(
      <MobileLeaderboardsHeader
        selectedProgram="Program Alpha"
        selectedOrg="Company Level"
        onProgramClick={mockOnProgramClick}
        onOrgClick={mockOnOrgClick}
      />
    )

    const header = container.querySelector('header')
    expect(header).toHaveClass('z-4')
  })
})
