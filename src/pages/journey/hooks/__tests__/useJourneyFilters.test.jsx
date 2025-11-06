/**
 * useJourneyFilters Hook Tests
 * Unit tests for useJourneyFilters custom hook
 */

import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useJourneyFilters } from '../useJourneyFilters.js'

describe('useJourneyFilters', () => {
  const mockJourneys = [
    { id: 1, name: 'Journey 1', is_new: 1, is_completed: 0 },
    { id: 2, name: 'Journey 2', is_new: 0, is_completed: 0 },
    { id: 3, name: 'Journey 3', is_new: 0, is_completed: 1 },
  ]

  it('should return all journeys by default', () => {
    const { result } = renderHook(() => 
      useJourneyFilters(mockJourneys, false)
    )

    expect(result.current.allJourneys).toHaveLength(3)
  })

  it('should filter by category', () => {
    const { result } = renderHook(() => 
      useJourneyFilters(mockJourneys, false)
    )

    const ongoingJourneys = result.current.filterByCategory('ongoing')
    expect(ongoingJourneys).toHaveLength(1)
    expect(ongoingJourneys[0].id).toBe(2)
  })

  it('should filter new journeys', () => {
    const { result } = renderHook(() => 
      useJourneyFilters(mockJourneys, false)
    )

    const newJourneys = result.current.filterByCategory('new')
    expect(newJourneys).toHaveLength(1)
    expect(newJourneys[0].id).toBe(1)
  })

  it('should filter finished journeys', () => {
    const { result } = renderHook(() => 
      useJourneyFilters(mockJourneys, false)
    )

    const finishedJourneys = result.current.filterByCategory('finish')
    expect(finishedJourneys).toHaveLength(1)
    expect(finishedJourneys[0].id).toBe(3)
  })

  it('should handle loading state', () => {
    const { result } = renderHook(() => 
      useJourneyFilters([], true)
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('should handle empty journeys', () => {
    const { result } = renderHook(() => 
      useJourneyFilters([], false)
    )

    expect(result.current.allJourneys).toHaveLength(0)
  })
})
