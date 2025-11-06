import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLeaderboards } from '../useLeaderboards'
import * as apiHooks from '@services/api'

// Mock the API
vi.mock('@services/api', () => ({
  useGetLeaderboardsQuery: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useLeaderboards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should skip query when journeyId is null', () => {
    apiHooks.useGetLeaderboardsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    renderHook(() => useLeaderboards(null, true), {
      wrapper: createWrapper(),
    })

    expect(apiHooks.useGetLeaderboardsQuery).toHaveBeenCalledWith(null, {
      skip: true,
      refetchOnMountOrArgChange: 300,
    })
  })

  it('should skip query when enabled is false', () => {
    apiHooks.useGetLeaderboardsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    renderHook(() => useLeaderboards(123, false), {
      wrapper: createWrapper(),
    })

    expect(apiHooks.useGetLeaderboardsQuery).toHaveBeenCalledWith(123, {
      skip: true,
      refetchOnMountOrArgChange: 300,
    })
  })

  it('should fetch leaderboards when journeyId is provided and enabled', () => {
    const mockData = {
      boards: [{ rank: 1, userid: '1', firstname: 'John' }],
      current: [],
    }

    apiHooks.useGetLeaderboardsQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useLeaderboards(123, true), {
      wrapper: createWrapper(),
    })

    expect(apiHooks.useGetLeaderboardsQuery).toHaveBeenCalledWith(123, {
      skip: false,
      refetchOnMountOrArgChange: 300,
    })

    expect(result.current.data).toEqual(mockData)
  })

  it('should handle loading state', () => {
    apiHooks.useGetLeaderboardsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    const { result } = renderHook(() => useLeaderboards(123, true), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch')

    apiHooks.useGetLeaderboardsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useLeaderboards(123, true), {
      wrapper: createWrapper(),
    })

    expect(result.current.error).toEqual(mockError)
  })

  it('should use default enabled value of true', () => {
    apiHooks.useGetLeaderboardsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    renderHook(() => useLeaderboards(123), {
      wrapper: createWrapper(),
    })

    expect(apiHooks.useGetLeaderboardsQuery).toHaveBeenCalledWith(123, {
      skip: false,
      refetchOnMountOrArgChange: 300,
    })
  })
})
