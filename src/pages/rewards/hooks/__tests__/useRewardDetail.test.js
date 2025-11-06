import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useRewardDetail } from '../useRewardDetail'
import { useLazyGetRewardDetailQuery } from '@/services/api/rewardsApi'

// Mock RTK Query lazy hook
vi.mock('@/services/api/rewardsApi', () => ({
  useLazyGetRewardDetailQuery: vi.fn(),
}))

// Mock formatters
vi.mock('../../utils/formatters', () => ({
  convertEnter: vi.fn((text) => text?.replace(/\\n/g, '\n') || ''),
}))

describe('useRewardDetail Hook', () => {
  const mockRewardDetail = {
    id: 1,
    title: 'Premium Voucher',
    description: 'Line 1\\nLine 2\\nLine 3',
    point: 500,
    availability: 10,
    image: 'voucher.jpg',
    terms: 'Terms and conditions',
  }

  const mockTrigger = vi.fn()
  const mockUnwrap = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUnwrap.mockResolvedValue(mockRewardDetail)
    mockTrigger.mockReturnValue({ unwrap: mockUnwrap })
  })

  describe('Initial State', () => {
    it('should return initial null state', () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(result.current.rewardDetail).toBeNull()
      expect(result.current.rawDetail).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should provide fetchDetail function', () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(typeof result.current.fetchDetail).toBe('function')
    })

    it('should provide resetDetail function', () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(typeof result.current.resetDetail).toBe('function')
    })
  })

  describe('Fetch Detail', () => {
    it('should fetch detail by ID', async () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await act(async () => {
        await result.current.fetchDetail(1)
      })

      expect(mockTrigger).toHaveBeenCalledWith(1)
      expect(mockUnwrap).toHaveBeenCalled()
    })

    it('should update state after successful fetch', async () => {
      // Before fetch
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result: beforeResult } = renderHook(() => useRewardDetail())
      expect(beforeResult.current.rewardDetail).toBeNull()

      // Trigger fetch
      await act(async () => {
        await beforeResult.current.fetchDetail(1)
      })

      // After fetch - simulate data loaded
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: mockRewardDetail,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result: afterResult } = renderHook(() => useRewardDetail())
      
      await waitFor(() => {
        expect(afterResult.current.rawDetail).toEqual(mockRewardDetail)
      })
    })

    it('should handle fetch error', async () => {
      const mockError = new Error('Network error')
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockUnwrap.mockRejectedValue(mockError)

      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: true,
          error: mockError,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await act(async () => {
        await result.current.fetchDetail(1)
      })

      expect(consoleError).toHaveBeenCalledWith(
        'Error fetching reward detail:',
        mockError
      )
      consoleError.mockRestore()
    })

    it('should handle different reward IDs', async () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await act(async () => {
        await result.current.fetchDetail(5)
      })
      expect(mockTrigger).toHaveBeenCalledWith(5)

      await act(async () => {
        await result.current.fetchDetail(999)
      })
      expect(mockTrigger).toHaveBeenCalledWith(999)
    })
  })

  describe('Description Processing', () => {
    it('should process description with newlines', async () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: mockRewardDetail,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await waitFor(() => {
        expect(result.current.rewardDetail).not.toBeNull()
      })

      expect(result.current.rewardDetail.description).toBe(
        'Line 1\nLine 2\nLine 3'
      )
    })

    it('should handle empty description', async () => {
      const detailWithoutDesc = { ...mockRewardDetail, description: '' }

      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: detailWithoutDesc,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await waitFor(() => {
        expect(result.current.rewardDetail).not.toBeNull()
      })

      expect(result.current.rewardDetail.description).toBe('')
    })

    it('should handle missing description', async () => {
      const detailWithoutDesc = { ...mockRewardDetail }
      delete detailWithoutDesc.description

      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: detailWithoutDesc,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await waitFor(() => {
        expect(result.current.rewardDetail).not.toBeNull()
      })

      expect(result.current.rewardDetail.description).toBe('')
    })

    it('should preserve other reward properties', async () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: mockRewardDetail,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await waitFor(() => {
        expect(result.current.rewardDetail).not.toBeNull()
      })

      expect(result.current.rewardDetail.id).toBe(mockRewardDetail.id)
      expect(result.current.rewardDetail.title).toBe(mockRewardDetail.title)
      expect(result.current.rewardDetail.point).toBe(mockRewardDetail.point)
      expect(result.current.rewardDetail.availability).toBe(
        mockRewardDetail.availability
      )
    })
  })

  describe('Reset Detail', () => {
    it('should reset detail to null', async () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: mockRewardDetail,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      // Wait for detail to be processed
      await waitFor(() => {
        expect(result.current.rewardDetail).not.toBeNull()
      })

      // Reset
      act(() => {
        result.current.resetDetail()
      })

      expect(result.current.rewardDetail).toBeNull()
    })

    it('should reset when called multiple times', async () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: mockRewardDetail,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await waitFor(() => {
        expect(result.current.rewardDetail).not.toBeNull()
      })

      act(() => {
        result.current.resetDetail()
        result.current.resetDetail()
        result.current.resetDetail()
      })

      expect(result.current.rewardDetail).toBeNull()
    })
  })

  describe('Loading State', () => {
    it('should return loading state', () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: true,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(result.current.isLoading).toBe(true)
    })

    it('should transition from loading to loaded', () => {
      // Loading
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: true,
          isError: false,
          error: null,
        },
      ])
      const loadingResult = renderHook(() => useRewardDetail())
      expect(loadingResult.result.current.isLoading).toBe(true)

      // Loaded
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: mockRewardDetail,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const loadedResult = renderHook(() => useRewardDetail())
      expect(loadedResult.result.current.isLoading).toBe(false)
    })
  })

  describe('Error State', () => {
    it('should return error state', () => {
      const mockError = { message: 'Not found' }

      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: true,
          error: mockError,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toEqual(mockError)
    })

    it('should handle 404 error', () => {
      const notFoundError = {
        status: 404,
        data: { message: 'Reward not found' },
      }

      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: true,
          error: notFoundError,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(result.current.isError).toBe(true)
      expect(result.current.error.status).toBe(404)
    })
  })

  describe('Return Value Structure', () => {
    it('should return all expected properties', () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(result.current).toHaveProperty('rewardDetail')
      expect(result.current).toHaveProperty('rawDetail')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('isError')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('fetchDetail')
      expect(result.current).toHaveProperty('resetDetail')
    })

    it('should return correct types', () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.isError).toBe('boolean')
      expect(typeof result.current.fetchDetail).toBe('function')
      expect(typeof result.current.resetDetail).toBe('function')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null data', async () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: null,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      expect(result.current.rewardDetail).toBeNull()
    })

    it('should handle very long description', async () => {
      const longDescription = 'A'.repeat(10000) + '\\n' + 'B'.repeat(10000)
      const detailWithLongDesc = {
        ...mockRewardDetail,
        description: longDescription,
      }

      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: detailWithLongDesc,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await waitFor(() => {
        expect(result.current.rewardDetail).not.toBeNull()
      })

      expect(result.current.rewardDetail.description).toBeTruthy()
    })

    it('should handle rapid consecutive fetches', async () => {
      useLazyGetRewardDetailQuery.mockReturnValue([
        mockTrigger,
        {
          data: undefined,
          isLoading: false,
          isError: false,
          error: null,
        },
      ])

      const { result } = renderHook(() => useRewardDetail())

      await act(async () => {
        await result.current.fetchDetail(1)
        await result.current.fetchDetail(2)
        await result.current.fetchDetail(3)
      })

      expect(mockTrigger).toHaveBeenCalledTimes(3)
    })
  })
})
