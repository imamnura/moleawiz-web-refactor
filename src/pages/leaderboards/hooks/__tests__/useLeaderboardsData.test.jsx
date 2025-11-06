import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useLeaderboardsData } from '../useLeaderboardsData'
import * as enrolledProgramsHook from '../useEnrolledPrograms'
import * as leaderboardsHook from '../useLeaderboards'
import * as dataProcessing from '../../utils/dataProcessing'

// Mock dependencies
vi.mock('../useEnrolledPrograms')
vi.mock('../useLeaderboards')
vi.mock('../../utils/dataProcessing')
vi.mock('@/utils', () => ({
  getCompanyName: vi.fn(() => 'Test Company'),
}))

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { user: { id: 1 } }) => state,
      leaderboard: (state = { profileUserData: {} }) => state,
    },
    preloadedState: initialState,
  })
}

const createWrapper = (store) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  )
}

describe('useLeaderboardsData', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    enrolledProgramsHook.useEnrolledPrograms.mockReturnValue({
      data: [],
      isLoading: false,
    })

    enrolledProgramsHook.getDefaultProgram.mockReturnValue(null)

    leaderboardsHook.useLeaderboards.mockReturnValue({
      data: null,
      isLoading: false,
    })

    dataProcessing.processLeaderboardsData.mockReturnValue({
      top3: [],
      columnLeft: [],
      columnRight: [],
      yourRank: null,
    })
  })

  it('should initialize with default filters', () => {
    const store = createMockStore()
    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.filters).toEqual({
      filtPro: null,
      filtOrg: 'company',
    })
  })

  it('should set default program when enrolled programs loaded', () => {
    const mockPrograms = [
      { journey_id: '1', journey_name: 'Program A' },
      { journey_id: '2', journey_name: 'Program B' },
    ]

    enrolledProgramsHook.useEnrolledPrograms.mockReturnValue({
      data: mockPrograms,
      isLoading: false,
    })

    enrolledProgramsHook.getDefaultProgram.mockReturnValue(1)

    const store = createMockStore()
    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.filters.filtPro).toBe(1)
  })

  it('should process leaderboards data correctly', () => {
    const mockLeaderboardsData = {
      boards: [{ rank: 1, userid: '1' }],
      current: [],
    }

    const mockProcessedData = {
      top3: [{ rank: 1, userid: '1' }],
      columnLeft: [],
      columnRight: [],
      yourRank: null,
    }

    leaderboardsHook.useLeaderboards.mockReturnValue({
      data: mockLeaderboardsData,
      isLoading: false,
    })

    dataProcessing.processLeaderboardsData.mockReturnValue(mockProcessedData)

    const store = createMockStore()
    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.top3).toEqual(mockProcessedData.top3)
    expect(result.current.hasData).toBe(true)
  })

  it('should generate program options from enrolled programs', () => {
    const mockPrograms = [
      { journey_id: '1', journey_name: 'Program A' },
      { journey_id: '2', journey_name: 'Program B' },
    ]

    enrolledProgramsHook.useEnrolledPrograms.mockReturnValue({
      data: mockPrograms,
      isLoading: false,
    })

    const store = createMockStore()
    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.programOptions).toEqual([
      { label: 'Program A', value: 1, dataIndex: 0 },
      { label: 'Program B', value: 2, dataIndex: 1 },
    ])
  })

  it('should generate organization options based on profile data', () => {
    const store = createMockStore({
      auth: { user: { id: 1 } },
      leaderboard: {
        profileUserData: {
          directorate: 'IT Directorate',
          division: 'Dev Division',
          department: 'Backend Dept',
        },
      },
    })

    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.organizationOptions.length).toBeGreaterThan(1)
    expect(
      result.current.organizationOptions.some((opt) => opt.value === 'company')
    ).toBe(true)
    expect(
      result.current.organizationOptions.some(
        (opt) => opt.value === 'directorate'
      )
    ).toBe(true)
  })

  it('should handle loading states', () => {
    enrolledProgramsHook.useEnrolledPrograms.mockReturnValue({
      data: [],
      isLoading: true,
    })

    leaderboardsHook.useLeaderboards.mockReturnValue({
      data: null,
      isLoading: true,
    })

    const store = createMockStore()
    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isLoadingPrograms).toBe(true)
    expect(result.current.isLoadingLeaderboards).toBe(true)
  })

  it('should allow updating filters', () => {
    const store = createMockStore()
    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    act(() => {
      result.current.setFilters({
        filtPro: 123,
        filtOrg: 'division',
      })
    })

    expect(result.current.filters).toEqual({
      filtPro: 123,
      filtOrg: 'division',
    })
  })

  it('should indicate hasPrograms correctly', () => {
    enrolledProgramsHook.useEnrolledPrograms.mockReturnValue({
      data: [{ journey_id: '1', journey_name: 'Program A' }],
      isLoading: false,
    })

    const store = createMockStore()
    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.hasPrograms).toBe(true)
  })

  it('should handle empty leaderboards data', () => {
    leaderboardsHook.useLeaderboards.mockReturnValue({
      data: null,
      isLoading: false,
    })

    dataProcessing.processLeaderboardsData.mockReturnValue({
      top3: [],
      columnLeft: [],
      columnRight: [],
      yourRank: null,
    })

    const store = createMockStore()
    const { result } = renderHook(() => useLeaderboardsData(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.hasData).toBe(false)
  })
})
