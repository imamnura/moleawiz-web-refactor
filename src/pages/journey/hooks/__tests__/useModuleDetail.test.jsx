/**
 * useModuleDetail Hook Tests
 * Unit tests for useModuleDetail custom hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useModuleDetail, useModuleProgress } from '../useModuleDetail.js'
import * as learningJourneyAPI from '@/services/api/learningJourney'

vi.mock('@/services/api/learningJourney', () => ({
  learningJourneyAPI: {
    getModuleDetail: vi.fn(),
    completeModule: vi.fn(),
  },
}))

// Mock storage utilities
vi.mock('@/utils', () => ({
  decryptData: vi.fn(() => ({ key: 'data_scorm_web', value: '[]' })),
  getLocalStorage: vi.fn(),
}))

describe('useModuleDetail', () => {
  let queryClient

  const mockModuleData = {
    id: 1,
    name: 'Test Module',
    description: 'Test Description',
    duration: 30,
    type: 'scorm',
    content_url: 'https://example.com/scorm',
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    learningJourneyAPI.learningJourneyAPI.getModuleDetail.mockResolvedValue(mockModuleData)
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should fetch module detail', async () => {
    const { result } = renderHook(() => 
      useModuleDetail('1', '1', '1'), 
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.module).toEqual(mockModuleData)
  })

  it('should handle API error', async () => {
    learningJourneyAPI.learningJourneyAPI.getModuleDetail.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => 
      useModuleDetail('1', '1', '1'), 
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })
})

describe('useModuleProgress', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    learningJourneyAPI.learningJourneyAPI.completeModule.mockResolvedValue({ success: true })
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should resync SCORM progress', async () => {
    const { result } = renderHook(() => 
      useModuleProgress('1', '1', '1'), 
      { wrapper }
    )

    act(() => {
      result.current.resyncScorm({ scormKey: 'test-scorm-key' })
    })

    await waitFor(() => {
      expect(learningJourneyAPI.learningJourneyAPI.completeModule).toHaveBeenCalled()
    })
  })
})
