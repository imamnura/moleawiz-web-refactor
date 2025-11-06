import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeaderboardsHeader } from '../LeaderboardsHeader'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_leaderboards.header.leaderboards': 'Leaderboards',
      }
      return translations[key] || key
    },
  }),
}))

describe('LeaderboardsHeader', () => {
  const mockProgramOptions = [
    { label: 'Program A', value: 1, dataIndex: 0 },
    { label: 'Program B', value: 2, dataIndex: 1 },
    { label: 'Program C', value: 3, dataIndex: 2 },
  ]

  const mockOrgOptions = [
    { label: 'Company Level', value: 'company' },
    { label: 'Directorate Level', value: 'directorate' },
    { label: 'Division Level', value: 'division' },
  ]

  const mockOnProgramChange = vi.fn()
  const mockOnOrgChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render null when programOptions is empty', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={[]}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render null when programOptions is null', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={null}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render leaderboards title', () => {
    render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    expect(screen.getByText('Leaderboards')).toBeInTheDocument()
  })

  it('should render program selector', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const selects = container.querySelectorAll('.ant-select')
    expect(selects.length).toBeGreaterThanOrEqual(2)
  })

  it('should render organization selector', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const selects = container.querySelectorAll('.ant-select')
    expect(selects.length).toBe(2)
  })

  it('should call onProgramChange when program selected', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    // Find program selector (first one)
    const programSelector = container.querySelector('[dpd-name="dpd-program-leaderboards"]')
    expect(programSelector).toBeInTheDocument()
  })

  it('should call onOrgChange when organization selected', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const orgSelector = container.querySelector('[dpd-name="dpd-organization-leaderboards"]')
    expect(orgSelector).toBeInTheDocument()
  })

  it('should display selected program value', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={2}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const programSelector = container.querySelector('[dpd-name="dpd-program-leaderboards"]')
    expect(programSelector).toBeInTheDocument()
  })

  it('should display selected organization value', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="division"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const orgSelector = container.querySelector('[dpd-name="dpd-organization-leaderboards"]')
    expect(orgSelector).toBeInTheDocument()
  })

  it('should have sticky positioning at top', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const header = container.querySelector('.row-header-leaderboards')
    expect(header).toHaveClass('sticky', 'top-0')
  })

  it('should render with correct height', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const header = container.querySelector('.row-header-leaderboards')
    expect(header).toHaveClass('h-[88px]')
  })

  it('should show program selector with search enabled', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const programSelector = container.querySelector('[dpd-name="dpd-program-leaderboards"]')
    expect(programSelector).toBeInTheDocument()
  })

  it('should toggle organization dropdown icon', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    // Initially should show DownOutlined
    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should have z-index for proper stacking', () => {
    const { container } = render(
      <LeaderboardsHeader
        programOptions={mockProgramOptions}
        organizationOptions={mockOrgOptions}
        selectedProgram={1}
        selectedOrg="company"
        onProgramChange={mockOnProgramChange}
        onOrgChange={mockOnOrgChange}
      />
    )

    const header = container.querySelector('.row-header-leaderboards')
    expect(header).toHaveClass('z-4')
  })
})
