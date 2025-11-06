/**
 * useJourneyDetail Hook Tests
 * Unit tests for useJourneyDetail custom hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useJourneyDetail } from '../useJourneyDetail.js'
import * as learningJourneyAPI from '@/services/api/learningJourney'

// Mock the API service
vi.mock('@/services/api/learningJourney', () => ({
  learningJourneyAPI: {
    getJourneyDetail: vi.fn(),
  },
}))

// Mock date-fns
vi.mock('date-fns', () => ({
  differenceInDays: vi.fn((deadline, today) => 5),
  parseISO: vi.fn((date) => new Date(date)),
}))

describe('useJourneyDetail', () => {
  let queryClient

  const mockJourneyData = {
    id: 1,
    name: 'Test Journey',
    deadline: '2025-12-31',
    is_completed: 0,
    course: [
      { id: 1, name: 'Course 1' },
      { id: 2, name: 'Course 2' },
    ],
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    learningJourneyAPI.learningJourneyAPI.getJourneyDetail.mockResolvedValue(mockJourneyData)
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should fetch journey detail', async () => {
    const { result } = renderHook(() => useJourneyDetail('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.journey).toEqual(mockJourneyData)
  })

  it('should return courses list', async () => {
    const { result } = renderHook(() => useJourneyDetail('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.courses).toHaveLength(2)
    expect(result.current.totalCourses).toBe(2)
  })

  it('should calculate days left', async () => {
    const { result } = renderHook(() => useJourneyDetail('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.daysLeft).toBe(5)
  })

  it('should determine completion status', async () => {
    const { result } = renderHook(() => useJourneyDetail('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isCompleted).toBe(false)
  })

  it('should handle completed journey', async () => {
    learningJourneyAPI.learningJourneyAPI.getJourneyDetail.mockResolvedValue({
      ...mockJourneyData,
      is_completed: 1,
    })

    const { result } = renderHook(() => useJourneyDetail('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isCompleted).toBe(true)
  })

  it('should handle journey without deadline', async () => {
    learningJourneyAPI.learningJourneyAPI.getJourneyDetail.mockResolvedValue({
      ...mockJourneyData,
      deadline: null,
    })

    const { result } = renderHook(() => useJourneyDetail('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.daysLeft).toBeNull()
  })

  it('should not fetch when journeyId is not provided', () => {
    const { result } = renderHook(() => useJourneyDetail(null), { wrapper })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.journey).toBeUndefined()
  })

  it('should handle API error', async () => {
    learningJourneyAPI.learningJourneyAPI.getJourneyDetail.mockRejectedValue(
      new Error('API Error')
    )

    const { result } = renderHook(() => useJourneyDetail('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })
})
