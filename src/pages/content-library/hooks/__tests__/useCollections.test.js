/**
 * useCollections Hook Tests
 * Unit tests for useCollections custom hook
 */
import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCollections } from '../useCollections'

// Mock the API
vi.mock('@services/api', () => ({
  useGetCollectionsQuery: vi.fn(),
}))

// Mock collectionUtils
vi.mock('../../utils/collectionUtils', () => ({
  mapFilterToAPI: vi.fn((filter) => {
    const mapping = {
      allcl: 'all',
      programcl: 'journey',
      coursecl: 'course',
      modulecl: 'module',
    }
    return mapping[filter] || 'all'
  }),
}))

describe('useCollections', () => {
  it('should return collections data with totalCount', async () => {
    const { useGetCollectionsQuery } = await import('@services/api')

    const mockCollections = [
      { id: 1, type: 'journey', name: 'Journey 1' },
      { id: 2, type: 'course', name: 'Course 1' },
    ]

    useGetCollectionsQuery.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useCollections('allcl'))

    expect(result.current.collections).toEqual(mockCollections)
    expect(result.current.totalCount).toBe(2)
    expect(result.current.isLoading).toBe(false)
  })

  it('should map filter to API format', async () => {
    const { useGetCollectionsQuery } = await import('@services/api')
    const { mapFilterToAPI } = await import('../../utils/collectionUtils')

    useGetCollectionsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    })

    renderHook(() => useCollections('programcl'))

    expect(mapFilterToAPI).toHaveBeenCalledWith('programcl')
    expect(useGetCollectionsQuery).toHaveBeenCalledWith('journey')
  })

  it('should handle loading state', async () => {
    const { useGetCollectionsQuery } = await import('@services/api')

    useGetCollectionsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    const { result } = renderHook(() => useCollections())

    expect(result.current.collections).toEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.totalCount).toBe(0)
  })

  it('should handle error state', async () => {
    const { useGetCollectionsQuery } = await import('@services/api')

    const mockError = { message: 'Network error' }

    useGetCollectionsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useCollections())

    expect(result.current.error).toEqual(mockError)
  })

  it('should use default filter when not provided', async () => {
    const { useGetCollectionsQuery } = await import('@services/api')
    const { mapFilterToAPI } = await import('../../utils/collectionUtils')

    useGetCollectionsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    })

    renderHook(() => useCollections())

    expect(mapFilterToAPI).toHaveBeenCalledWith('allcl')
  })

  it('should return empty array when data is undefined', async () => {
    const { useGetCollectionsQuery } = await import('@services/api')

    useGetCollectionsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useCollections())

    expect(result.current.collections).toEqual([])
    expect(result.current.totalCount).toBe(0)
  })
})
