/**
 * useCourseDetail Hook Tests
 * Unit tests for useCourseDetail custom hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCourseDetail } from '../useCourseDetail.js'
import * as learningJourneyAPI from '@/services/api/learningJourney'

vi.mock('@/services/api/learningJourney', () => ({
  learningJourneyAPI: {
    getCourseDetail: vi.fn(),
    getModules: vi.fn(),
  },
}))

describe('useCourseDetail', () => {
  let queryClient

  const mockCourseData = {
    id: 1,
    name: 'Test Course',
    description: 'Test Description',
  }

  const mockModulesData = {
    modules: [
      { id: 1, name: 'Module 1', is_completed: 1 },
      { id: 2, name: 'Module 2', is_completed: 0 },
    ],
    support_modules: [
      { id: 3, name: 'Support 1' },
    ],
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    learningJourneyAPI.learningJourneyAPI.getCourseDetail.mockResolvedValue(mockCourseData)
    learningJourneyAPI.learningJourneyAPI.getModules.mockResolvedValue(mockModulesData)
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should fetch course detail', async () => {
    const { result } = renderHook(() => 
      useCourseDetail('1', '1'), 
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.course).toEqual(mockCourseData)
  })

  it('should return modules list', async () => {
    const { result } = renderHook(() => 
      useCourseDetail('1', '1'), 
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.modules).toHaveLength(2)
  })

  it('should return support modules', async () => {
    const { result } = renderHook(() => 
      useCourseDetail('1', '1'), 
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.supportModules).toHaveLength(1)
  })

  it('should handle API error', async () => {
    learningJourneyAPI.learningJourneyAPI.getCourseDetail.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => 
      useCourseDetail('1', '1'), 
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })
})
