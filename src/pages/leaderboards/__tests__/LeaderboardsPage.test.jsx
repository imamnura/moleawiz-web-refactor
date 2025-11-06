import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeaderboardsPage from '../LeaderboardsPage'

// Mock all hooks
vi.mock('../hooks/useLeaderboardsData', () => ({
  useLeaderboardsData: vi.fn(),
}))

// Mock useResponsive hook
vi.mock('@hooks/useResponsive', () => ({
  useResponsive: vi.fn(() => ({ isMobile: false })),
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_leaderboards.empty_state.message':
          'No leaderboard data available',
      }
      return translations[key] || key
    },
  }),
}))

// Mock child components
vi.mock('../components/LeaderboardsHeader', () => ({
  LeaderboardsHeader: ({ onProgramChange, onOrgChange }) => (
    <div data-testid="desktop-header">
      <button onClick={() => onProgramChange('1')}>Change Program</button>
      <button onClick={() => onOrgChange('Company Level')}>
        Change Organization
      </button>
    </div>
  ),
}))

vi.mock('../components/MobileLeaderboardsHeader', () => ({
  MobileLeaderboardsHeader: ({ onProgramClick, onOrgClick }) => (
    <div data-testid="mobile-header">
      <button onClick={onProgramClick}>Program Click</button>
      <button onClick={onOrgClick}>Org Click</button>
    </div>
  ),
}))

vi.mock('../components/PodiumSection', () => ({
  PodiumSection: ({ podiumData }) => (
    <div data-testid="desktop-podium">
      {podiumData ? `Podium: ${podiumData.length}` : 'No podium'}
    </div>
  ),
}))

vi.mock('../components/MobilePodiumSection', () => ({
  MobilePodiumSection: ({ podiumData }) => (
    <div data-testid="mobile-podium">
      {podiumData ? `Mobile Podium: ${podiumData.length}` : 'No podium'}
    </div>
  ),
}))

vi.mock('../components/RankingTable', () => ({
  RankingTable: ({ columnLeft, columnRight }) => (
    <div data-testid="desktop-table">
      Table: {columnLeft?.length || 0} + {columnRight?.length || 0}
    </div>
  ),
}))

vi.mock('../components/MobileRankList', () => ({
  MobileRankList: ({ data }) => (
    <div data-testid="mobile-list">
      Mobile List: {data?.length || 0}
    </div>
  ),
}))

vi.mock('../components/EmptyState', () => ({
  EmptyState: () => <div data-testid="empty-state">Empty State</div>,
}))

vi.mock('../components/SelectorModals', () => ({
  ProgramSelectorModal: ({ visible, onSelect, onClose }) => (
    <div data-testid="program-modal" data-visible={visible}>
      <button onClick={() => onSelect('2')}>Select Program 2</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
  OrganizationSelectorModal: ({ visible, onSelect, onClose }) => (
    <div data-testid="org-modal" data-visible={visible}>
      <button onClick={() => onSelect('Directorate')}>
        Select Directorate
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

// Mock Loader
vi.mock('@components/common/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))

import { useLeaderboardsData } from '../hooks/useLeaderboardsData'
import { useResponsive } from '@hooks/useResponsive'

describe('LeaderboardsPage', () => {
  const mockProgramOptions = [
    { value: '1', label: 'Program Alpha' },
    { value: '2', label: 'Program Beta' },
  ]

  const mockOrgOptions = [
    { value: 'Company Level', label: 'Company Level' },
    { value: 'Directorate', label: 'Directorate' },
  ]

  const mockLeaderboardData = {
    top3: [
      { userid: '1', rank: 1, totalgrade: 1000 },
      { userid: '2', rank: 2, totalgrade: 900 },
      { userid: '3', rank: 3, totalgrade: 800 },
    ],
    columnLeft: [{ userid: '4', rank: 4, totalgrade: 750 }],
    columnRight: [{ userid: '5', rank: 5, totalgrade: 700 }],
    yourRank: '10',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementations
    useResponsive.mockReturnValue({ isMobile: false })

    useLeaderboardsData.mockReturnValue({
      top3: mockLeaderboardData.top3,
      columnLeft: mockLeaderboardData.columnLeft,
      columnRight: mockLeaderboardData.columnRight,
      yourRank: mockLeaderboardData.yourRank,
      programOptions: mockProgramOptions,
      organizationOptions: mockOrgOptions,
      filters: {
        filtPro: '1',
        filtOrg: 'Company Level',
      },
      setFilters: vi.fn(),
      isLoading: false,
      isLoadingPrograms: false,
      hasData: true,
      hasPrograms: true,
    })
  })

  describe('Loading State', () => {
    it('should show loading when isLoading is true', () => {
      useLeaderboardsData.mockReturnValue({
        top3: [],
        columnLeft: [],
        columnRight: [],
        yourRank: null,
        programOptions: [],
        organizationOptions: [],
        filters: {},
        setFilters: vi.fn(),
        isLoading: true,
        isLoadingPrograms: false,
        hasData: false,
        hasPrograms: false,
      })

      render(<LeaderboardsPage />)

      expect(screen.getByTestId('loader')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no programs available', () => {
      useLeaderboardsData.mockReturnValue({
        top3: [],
        columnLeft: [],
        columnRight: [],
        yourRank: null,
        programOptions: [],
        organizationOptions: [],
        filters: {},
        setFilters: vi.fn(),
        isLoading: false,
        isLoadingPrograms: false,
        hasData: false,
        hasPrograms: false,
      })

      render(<LeaderboardsPage />)

      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('should show empty state when no leaderboard data', () => {
      useLeaderboardsData.mockReturnValue({
        top3: [],
        columnLeft: [],
        columnRight: [],
        yourRank: null,
        programOptions: mockProgramOptions,
        organizationOptions: mockOrgOptions,
        filters: { filtPro: '1', filtOrg: 'Company Level' },
        setFilters: vi.fn(),
        isLoading: false,
        isLoadingPrograms: false,
        hasData: false,
        hasPrograms: true,
      })

      render(<LeaderboardsPage />)

      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })
  })

  describe('Desktop Layout', () => {
    it('should render desktop header', () => {
      render(<LeaderboardsPage />)

      expect(screen.getByTestId('desktop-header')).toBeInTheDocument()
    })

    it('should render desktop podium', () => {
      render(<LeaderboardsPage />)

      expect(screen.getByTestId('desktop-podium')).toBeInTheDocument()
    })

    it('should render desktop ranking table', () => {
      render(<LeaderboardsPage />)

      expect(screen.getByTestId('desktop-table')).toBeInTheDocument()
    })

    it('should not render mobile components', () => {
      render(<LeaderboardsPage />)

      expect(screen.queryByTestId('mobile-header')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mobile-podium')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mobile-list')).not.toBeInTheDocument()
    })
  })

  describe('Mobile Layout', () => {
    beforeEach(() => {
      useResponsive.mockReturnValue({ isMobile: true })
    })

    it('should render mobile header on small screens', () => {
      render(<LeaderboardsPage />)

      const mobileHeader = screen.getByTestId('mobile-header')
      expect(mobileHeader).toBeInTheDocument()
    })

    it('should render mobile podium', () => {
      render(<LeaderboardsPage />)

      expect(screen.getByTestId('mobile-podium')).toBeInTheDocument()
    })

    it('should render mobile rank list', () => {
      render(<LeaderboardsPage />)

      expect(screen.getByTestId('mobile-list')).toBeInTheDocument()
    })
  })

  describe('Filter Interactions', () => {
    it('should update filters when program changes', async () => {
      const mockSetFilters = vi.fn()
      useLeaderboardsData.mockReturnValue({
        ...useLeaderboardsData(),
        setFilters: mockSetFilters,
      })

      const user = userEvent.setup()
      render(<LeaderboardsPage />)

      await user.click(screen.getByText('Change Program'))

      expect(mockSetFilters).toHaveBeenCalled()
    })

    it('should update filters when organization changes', async () => {
      const mockSetFilters = vi.fn()
      useLeaderboardsData.mockReturnValue({
        ...useLeaderboardsData(),
        setFilters: mockSetFilters,
      })

      const user = userEvent.setup()
      render(<LeaderboardsPage />)

      await user.click(screen.getByText('Change Organization'))

      expect(mockSetFilters).toHaveBeenCalled()
    })
  })

  describe('Modal Interactions', () => {
    beforeEach(() => {
      useResponsive.mockReturnValue({ isMobile: true })
    })

    it('should open program selector modal on mobile', async () => {
      const user = userEvent.setup()

      render(<LeaderboardsPage />)

      await user.click(screen.getByText('Program Click'))

      await waitFor(() => {
        const modal = screen.getByTestId('program-modal')
        expect(modal).toHaveAttribute('data-visible', 'true')
      })
    })

    it('should open organization selector modal on mobile', async () => {
      const user = userEvent.setup()

      render(<LeaderboardsPage />)

      await user.click(screen.getByText('Org Click'))

      await waitFor(() => {
        const modal = screen.getByTestId('org-modal')
        expect(modal).toHaveAttribute('data-visible', 'true')
      })
    })

    it('should close modals after selection', async () => {
      const user = userEvent.setup()

      render(<LeaderboardsPage />)

      await user.click(screen.getByText('Program Click'))
      await user.click(screen.getByText('Select Program 2'))

      await waitFor(() => {
        const modal = screen.getByTestId('program-modal')
        expect(modal).toHaveAttribute('data-visible', 'false')
      })
    })
  })
})
