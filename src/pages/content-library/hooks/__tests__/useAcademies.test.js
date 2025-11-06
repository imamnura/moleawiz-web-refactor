/**
 * useAcademies Hook Tests
 * Unit tests for useAcademies custom hook
 */
import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAcademies } from '../useAcademies'

// Mock the API
vi.mock('@services/api', () => ({
  useGetAcademiesQuery: vi.fn(),
}))

describe('useAcademies', () => {
  it('should return academies data when loaded', async () => {
    const { useGetAcademiesQuery } = await import('@services/api')

    const mockAcademies = [
      { id: 1, name: 'Academy 1', thumbnail: '/img1.jpg', total_programs: 5 },
      { id: 2, name: 'Academy 2', thumbnail: '/img2.jpg', total_programs: 3 },
    ]

    useGetAcademiesQuery.mockReturnValue({
      data: mockAcademies,
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useAcademies())

    expect(result.current.academies).toEqual(mockAcademies)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should return loading state', async () => {
    const { useGetAcademiesQuery } = await import('@services/api')

    useGetAcademiesQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    const { result } = renderHook(() => useAcademies())

    expect(result.current.academies).toEqual([])
    expect(result.current.isLoading).toBe(true)
  })

  it('should return error state', async () => {
    const { useGetAcademiesQuery } = await import('@services/api')

    const mockError = { message: 'Failed to fetch' }

    useGetAcademiesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useAcademies())

    expect(result.current.academies).toEqual([])
    expect(result.current.error).toEqual(mockError)
  })

  it('should return empty array when data is undefined', async () => {
    const { useGetAcademiesQuery } = await import('@services/api')

    useGetAcademiesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useAcademies())

    expect(result.current.academies).toEqual([])
  })
})
