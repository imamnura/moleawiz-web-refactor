import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRewardHistory } from '../useRewardHistory'
import { useGetRewardHistoryQuery } from '@/services/api/rewardsApi'

// Mock RTK Query hook
vi.mock('@/services/api/rewardsApi', () => ({
  useGetRewardHistoryQuery: vi.fn(),
}))

describe('useRewardHistory Hook', () => {
  const mockHistory = [
    {
      id: 1,
      reward_name: 'Voucher Tokopedia',
      redeem_code: 'ABC123',
      reward_points: 500,
      redeem_date: '2024-12-20',
      status: 'success',
    },
    {
      id: 2,
      reward_name: 'Voucher Shopee',
      redeem_code: 'DEF456',
      reward_points: 300,
      redeem_date: '2024-12-18',
      status: 'success',
    },
    {
      id: 3,
      reward_name: 'Voucher Grab',
      redeem_code: 'GHI789',
      reward_points: 250,
      redeem_date: '2024-12-15',
      status: 'success',
    },
  ]

  const mockRefetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful Data Fetch', () => {
    it('should return history data', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.history).toEqual(mockHistory)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should handle empty history', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.history).toEqual([])
    })

  it('should return empty array when data is undefined', () => {
    useGetRewardHistoryQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    const { result } = renderHook(() => useRewardHistory())

    expect(result.current.history).toEqual([])
  })
  it('should preserve history item structure', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      const firstItem = result.current.history[0]
      expect(firstItem).toHaveProperty('id')
      expect(firstItem).toHaveProperty('reward_name')
      expect(firstItem).toHaveProperty('redeem_code')
      expect(firstItem).toHaveProperty('reward_points')
      expect(firstItem).toHaveProperty('redeem_date')
      expect(firstItem).toHaveProperty('status')
    })

    it('should maintain original order', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.history[0].id).toBe(1)
      expect(result.current.history[1].id).toBe(2)
      expect(result.current.history[2].id).toBe(3)
    })
  })

  describe('Loading State', () => {
    it('should return loading state', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.history).toEqual([])
    })

    it('should transition from loading to loaded', () => {
      // Loading
      useGetRewardHistoryQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const loadingResult = renderHook(() => useRewardHistory())
      expect(loadingResult.result.current.isLoading).toBe(true)

      // Loaded
      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const loadedResult = renderHook(() => useRewardHistory())
      expect(loadedResult.result.current.isLoading).toBe(false)
      expect(loadedResult.result.current.history).toHaveLength(3)
    })
  })

  describe('Error State', () => {
    it('should return error state', () => {
      const mockError = { message: 'Failed to fetch history' }

      useGetRewardHistoryQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: mockError,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toEqual(mockError)
      expect(result.current.history).toEqual([])
    })

    it('should handle network error', () => {
      const networkError = {
        status: 'FETCH_ERROR',
        error: 'Network request failed',
      }

      useGetRewardHistoryQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: networkError,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.isError).toBe(true)
      expect(result.current.error.status).toBe('FETCH_ERROR')
    })

    it('should handle 401 unauthorized', () => {
      const authError = {
        status: 401,
        data: { message: 'Unauthorized' },
      }

      useGetRewardHistoryQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: authError,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.isError).toBe(true)
      expect(result.current.error.status).toBe(401)
    })
  })

  describe('Refetch Function', () => {
    it('should provide refetch function', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.refetch).toBe(mockRefetch)
    })

    it('should call refetch when invoked', async () => {
      mockRefetch.mockResolvedValue({ data: mockHistory })

      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      await result.current.refetch()

      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  describe('Pagination Data', () => {
    it('should not return pagination metadata (hook returns simple array)', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.history).toHaveLength(3)
      expect(result.current).not.toHaveProperty('page')
      expect(result.current).not.toHaveProperty('limit')
      expect(result.current).not.toHaveProperty('total')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null data', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.history).toEqual([])
    })

    it('should handle missing data array', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.history).toEqual([])
    })

    it('should handle large history list', () => {
      const largeHistory = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        reward_name: `Reward ${i + 1}`,
        redeem_code: `CODE${i + 1}`,
        reward_points: (i + 1) * 100,
        redeem_date: '2024-12-20',
        status: 'success',
      }))

      useGetRewardHistoryQuery.mockReturnValue({
        data: largeHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.history).toHaveLength(100)
    })

    it('should handle history with special characters in codes', () => {
      const specialCharsData = [
        {
          id: 1,
          reward_name: 'Special Voucher',
          redeem_code: 'ABC-123_DEF*456',
          reward_points: 500,
          redeem_date: '2024-12-20',
          status: 'success',
        },
      ]

      useGetRewardHistoryQuery.mockReturnValue({
        data: specialCharsData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current.history[0].redeem_code).toBe('ABC-123_DEF*456')
    })
  })

  describe('Return Value Structure', () => {
    it('should return all expected properties', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(result.current).toHaveProperty('history')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('isError')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('refetch')
    })

    it('should return correct types', () => {
      useGetRewardHistoryQuery.mockReturnValue({
        data: mockHistory,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewardHistory())

      expect(Array.isArray(result.current.history)).toBe(true)
      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.isError).toBe('boolean')
      expect(typeof result.current.refetch).toBe('function')
    })
  })
})
