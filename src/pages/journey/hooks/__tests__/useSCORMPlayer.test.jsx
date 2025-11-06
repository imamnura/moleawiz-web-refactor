/**
 * useSCORMPlayer Hook Tests
 * Unit tests for useSCORMPlayer custom hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSCORMPlayer } from '../useSCORMPlayer.js'

// Mock storage utilities
vi.mock('@/utils/storage', () => ({
  setEncryptedStorage: vi.fn(),
  getEncryptedStorage: vi.fn(() => null),
  removeLocalStorage: vi.fn(),
}))

// Mock learning journey service
vi.mock('@/services/api/learningJourney', () => ({
  learningJourneyService: {
    updateModuleProgress: vi.fn(() => Promise.resolve({ success: true })),
  },
}))

describe('useSCORMPlayer', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    vi.clearAllMocks()
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const defaultOptions = {
    moduleId: '123',
    savedData: null,
    onComplete: vi.fn(),
  }

  it('should initialize SCORM player', () => {
    const { result } = renderHook(() => useSCORMPlayer(defaultOptions), {
      wrapper,
    })

    expect(result.current.isInitialized).toBe(false)

    act(() => {
      result.current.handleInitialize()
    })

    expect(result.current.isInitialized).toBe(true)
  })

  it('should handle SCORM completion', async () => {
    const onComplete = vi.fn()
    const { result } = renderHook(
      () => useSCORMPlayer({ ...defaultOptions, onComplete }),
      { wrapper }
    )

    const mockData = {
      'cmi.core.lesson_status': 'completed',
      'cmi.core.score.raw': '100',
    }

    act(() => {
      result.current.handleFinish(mockData)
    })

    await waitFor(() => {
      expect(result.current.isCompleted).toBe(true)
    })

    expect(onComplete).toHaveBeenCalledWith(mockData)
  })

  it('should save SCORM data', () => {
    const { result } = renderHook(() => useSCORMPlayer(defaultOptions), {
      wrapper,
    })

    act(() => {
      result.current.handleSetValue('cmi.core.score.raw', '85')
    })

    expect(result.current.scormData['cmi.core.score.raw']).toBe('85')
  })

  it('should get progress info', () => {
    const { result } = renderHook(() => useSCORMPlayer(defaultOptions), {
      wrapper,
    })

    act(() => {
      result.current.handleSetValue('cmi.core.lesson_status', 'incomplete')
      result.current.handleSetValue('cmi.core.score.raw', '75')
    })

    const progress = result.current.getProgress()

    expect(progress.lessonStatus).toBe('incomplete')
    expect(progress.score).toBe('75')
    expect(progress.isCompleted).toBe(false)
  })
})
