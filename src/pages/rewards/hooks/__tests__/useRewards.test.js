import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRewards } from '../useRewards'
import { useGetRewardsQuery } from '@/services/api/rewardsApi'

// Mock RTK Query hook
vi.mock('@/services/api/rewardsApi', () => ({
  useGetRewardsQuery: vi.fn(),
}))

describe('useRewards Hook', () => {
  const mockRewards = [
    {
      id: 1,
      title: 'Reward 1',
      point: 100,
      availability: 10,
      image: 'reward1.jpg',
    },
    {
      id: 2,
      title: 'Reward 2',
      point: 200,
      availability: 5,
      image: 'reward2.jpg',
    },
    {
      id: 3,
      title: 'Reward 3 (Sold Out)',
      point: 150,
      availability: 0,
      image: 'reward3.jpg',
    },
    {
      id: 4,
      title: 'Reward 4',
      point: 300,
      availability: 1,
      image: 'reward4.jpg',
    },
  ]

  const mockRefetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful Data Fetch', () => {
    it('should return rewards and filter available ones', () => {
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.rewards).toHaveLength(3) // Only available
      expect(result.current.allRewards).toHaveLength(4) // All rewards
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should exclude rewards with 0 availability', () => {
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      const soldOutReward = result.current.rewards.find(
        (r) => r.title === 'Reward 3 (Sold Out)'
      )
      expect(soldOutReward).toBeUndefined()
      
      // But it should be in allRewards
      const soldOutInAll = result.current.allRewards.find(
        (r) => r.title === 'Reward 3 (Sold Out)'
      )
      expect(soldOutInAll).toBeDefined()
    })

    it('should include rewards with availability = 1', () => {
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      const lastAvailable = result.current.rewards.find((r) => r.id === 4)
      expect(lastAvailable).toBeDefined()
      expect(lastAvailable.availability).toBe(1)
    })

    it('should return empty array when no rewards', () => {
      useGetRewardsQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.rewards).toEqual([])
      expect(result.current.allRewards).toEqual([])
    })

    it('should return empty array when data is undefined', () => {
      useGetRewardsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.rewards).toEqual([])
      expect(result.current.allRewards).toEqual([])
    })
  })

  describe('Loading State', () => {
    it('should return loading state', () => {
      useGetRewardsQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.rewards).toEqual([])
    })

    it('should transition from loading to loaded', () => {
      const { rerender } = renderHook(() => useRewards())

      // Initially loading
      useGetRewardsQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      rerender()
      expect(useRewards().isLoading).toBe(true)

      // After load
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())
      expect(result.current.isLoading).toBe(false)
      expect(result.current.rewards).toHaveLength(3)
    })
  })

  describe('Error State', () => {
    it('should return error state', () => {
      const mockError = { message: 'Failed to fetch rewards' }

      useGetRewardsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: mockError,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toEqual(mockError)
      expect(result.current.rewards).toEqual([])
    })

    it('should handle network error', () => {
      const networkError = {
        status: 'FETCH_ERROR',
        error: 'Network request failed',
      }

      useGetRewardsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: networkError,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toEqual(networkError)
    })

    it('should handle 404 error', () => {
      const notFoundError = {
        status: 404,
        data: { message: 'Not found' },
      }

      useGetRewardsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: notFoundError,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.isError).toBe(true)
      expect(result.current.error.status).toBe(404)
    })
  })

  describe('Refetch Function', () => {
    it('should provide refetch function', () => {
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.refetch).toBe(mockRefetch)
    })

    it('should call refetch when invoked', async () => {
      mockRefetch.mockResolvedValue({ data: mockRewards })

      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      await result.current.refetch()

      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  describe('Filter Logic', () => {
    it('should filter rewards with negative availability', () => {
      const rewardsWithNegative = [
        ...mockRewards,
        { id: 5, title: 'Invalid', availability: -1 },
      ]

      useGetRewardsQuery.mockReturnValue({
        data: rewardsWithNegative,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.rewards).toHaveLength(3)
      expect(result.current.allRewards).toHaveLength(5)
    })

    it('should handle all sold out rewards', () => {
      const soldOutRewards = mockRewards.map((r) => ({
        ...r,
        availability: 0,
      }))

      useGetRewardsQuery.mockReturnValue({
        data: soldOutRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.rewards).toEqual([])
      expect(result.current.allRewards).toHaveLength(4)
    })

    it('should preserve reward object structure', () => {
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      const firstReward = result.current.rewards[0]
      expect(firstReward).toHaveProperty('id')
      expect(firstReward).toHaveProperty('title')
      expect(firstReward).toHaveProperty('point')
      expect(firstReward).toHaveProperty('availability')
      expect(firstReward).toHaveProperty('image')
    })

    it('should maintain original order', () => {
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.rewards[0].id).toBe(1)
      expect(result.current.rewards[1].id).toBe(2)
      expect(result.current.rewards[2].id).toBe(4) // 3 skipped (sold out)
    })
  })

  describe('Edge Cases', () => {
    it('should handle rewards with very large availability', () => {
      const rewardsWithLarge = [
        { id: 1, title: 'Large Stock', availability: 999999 },
      ]

      useGetRewardsQuery.mockReturnValue({
        data: rewardsWithLarge,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.rewards).toHaveLength(1)
    })

    it('should handle rewards with decimal availability', () => {
      const rewardsWithDecimal = [
        { id: 1, title: 'Decimal', availability: 1.5 },
        { id: 2, title: 'Zero Point Five', availability: 0.5 },
      ]

      useGetRewardsQuery.mockReturnValue({
        data: rewardsWithDecimal,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      // Both should be included (> 0)
      expect(result.current.rewards).toHaveLength(2)
    })

    it('should handle missing availability field', () => {
      const rewardsWithMissing = [
        { id: 1, title: 'No availability field' },
        { id: 2, title: 'With availability', availability: 5 },
      ]

      useGetRewardsQuery.mockReturnValue({
        data: rewardsWithMissing,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      // Only reward with availability > 0
      expect(result.current.rewards).toHaveLength(1)
      expect(result.current.rewards[0].id).toBe(2)
    })

    it('should handle null data gracefully', () => {
      useGetRewardsQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current.rewards).toEqual([])
      expect(result.current.allRewards).toEqual([])
    })
  })

  describe('Return Value Structure', () => {
    it('should return all expected properties', () => {
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(result.current).toHaveProperty('rewards')
      expect(result.current).toHaveProperty('allRewards')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('isError')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('refetch')
    })

    it('should return correct types', () => {
      useGetRewardsQuery.mockReturnValue({
        data: mockRewards,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      })

      const { result } = renderHook(() => useRewards())

      expect(Array.isArray(result.current.rewards)).toBe(true)
      expect(Array.isArray(result.current.allRewards)).toBe(true)
      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.isError).toBe('boolean')
      expect(typeof result.current.refetch).toBe('function')
    })
  })
})
