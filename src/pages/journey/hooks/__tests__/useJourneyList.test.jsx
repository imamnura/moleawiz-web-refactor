/**
 * useJourneyList Hook Tests
 * Unit tests for useJourneyList custom hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useJourneyList } from '../useJourneyList.js'
import * as learningJourneyAPI from '@/services/api/learningJourney'

// Mock the API service
vi.mock('@/services/api/learningJourney', () => ({
  learningJourneyService: {
    getJourneyList: vi.fn(),
  },
  queryKeys: {
    journeyList: () => ['journeys'],
  },
}))

describe('useJourneyList', () => {
  let queryClient

  const mockJourneys = [
    { id: 1, name: 'Journey 1', is_new: 1, is_completed: 0 },
    { id: 2, name: 'Journey 2', is_new: 0, is_completed: 0 },
    { id: 3, name: 'Journey 3', is_new: 0, is_completed: 1 },
  ]

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    learningJourneyAPI.learningJourneyService.getJourneyList.mockResolvedValue({
      data: mockJourneys,
    })
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should fetch journey list', async () => {
    const { result } = renderHook(() => useJourneyList(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.journeys).toHaveLength(3)
  })

  it('should filter ongoing journeys', async () => {
    const { result } = renderHook(() => useJourneyList(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    result.current.setFilter('ongoing')

    await waitFor(() => {
      expect(result.current.journeys).toHaveLength(1)
      expect(result.current.journeys[0].id).toBe(2)
    })
  })

  it('should filter new journeys', async () => {
    const { result } = renderHook(() => useJourneyList(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    result.current.setFilter('new')

    await waitFor(() => {
      expect(result.current.journeys).toHaveLength(1)
      expect(result.current.journeys[0].id).toBe(1)
    })
  })

  it('should filter finished journeys', async () => {
    const { result } = renderHook(() => useJourneyList(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    result.current.setFilter('finish')

    await waitFor(() => {
      expect(result.current.journeys).toHaveLength(1)
      expect(result.current.journeys[0].id).toBe(3)
    })
  })

  it('should calculate stats correctly', async () => {
    const { result } = renderHook(() => useJourneyList(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.stats).toEqual({
      total: 3,
      completed: 1,
      ongoing: 1,
      new: 1,
    })
  })

  it('should handle empty data', async () => {
    learningJourneyAPI.learningJourneyService.getJourneyList.mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useJourneyList(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.journeys).toHaveLength(0)
    expect(result.current.stats.total).toBe(0)
  })

  it('should handle API error', async () => {
    learningJourneyAPI.learningJourneyService.getJourneyList.mockRejectedValue(
      new Error('API Error')
    )

    const { result } = renderHook(() => useJourneyList(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})
