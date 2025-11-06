/**
 * useSidebarData Hook Tests
 * Unit tests for useSidebarData custom hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useJourneySidebarData } from '../useSidebarData.js'
import * as learningJourneyAPI from '@/services/api/learningJourney'

vi.mock('@/services/api/learningJourney', () => ({
  learningJourneyAPI: {
    getCourses: vi.fn(),
    getModules: vi.fn(),
  },
}))

describe('useJourneySidebarData', () => {
  let queryClient

  const mockCoursesData = {
    courses: [
      { id: 1, name: 'Course 1', is_completed: 0 },
      { id: 2, name: 'Course 2', is_completed: 1 },
    ],
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    learningJourneyAPI.learningJourneyAPI.getCourses.mockResolvedValue(mockCoursesData)
    learningJourneyAPI.learningJourneyAPI.getModules.mockResolvedValue({
      modules: [],
      support_modules: [],
    })
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should fetch courses for journey', async () => {
    const { result } = renderHook(() => useJourneySidebarData('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.courses).toHaveLength(2)
  })

  it('should handle empty courses', async () => {
    learningJourneyAPI.learningJourneyAPI.getCourses.mockResolvedValue({ courses: [] })

    const { result } = renderHook(() => useJourneySidebarData('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.courses).toHaveLength(0)
  })

  it('should not fetch when journeyId is null', () => {
    const { result } = renderHook(() => useJourneySidebarData(null), { wrapper })

    expect(result.current.courses).toEqual([])
  })

  it('should handle API error', async () => {
    learningJourneyAPI.learningJourneyAPI.getCourses.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useJourneySidebarData('1'), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })
})
