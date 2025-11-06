import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEnrolledPrograms, getDefaultProgram } from '../useEnrolledPrograms'
import * as apiHooks from '@services/api'
import { parseISO } from 'date-fns'

// Mock the API
vi.mock('@services/api', () => ({
  useGetEnrolledProgramsQuery: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useEnrolledPrograms', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return empty array when no data', () => {
    apiHooks.useGetEnrolledProgramsQuery.mockImplementation(
      (undefined, options) => {
        const result = {
          data: undefined,
          isLoading: false,
          error: null,
        }

        if (options && options.selectFromResult) {
          return options.selectFromResult(result)
        }
        return result
      }
    )

    const { result } = renderHook(() => useEnrolledPrograms(), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual([])
  })

  it('should sort programs by journey_name', () => {
    const mockData = [
      { journey_id: '2', journey_name: 'Program B' },
      { journey_id: '1', journey_name: 'Program A' },
      { journey_id: '3', journey_name: 'Program C' },
    ]

    // Mock implementation needs to actually call selectFromResult
    apiHooks.useGetEnrolledProgramsQuery.mockImplementation(
      (undefined, options) => {
        const result = {
          data: mockData,
          isLoading: false,
          error: null,
        }

        if (options && options.selectFromResult) {
          return options.selectFromResult(result)
        }
        return result
      }
    )

    const { result } = renderHook(() => useEnrolledPrograms(), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual([
      { journey_id: '1', journey_name: 'Program A' },
      { journey_id: '2', journey_name: 'Program B' },
      { journey_id: '3', journey_name: 'Program C' },
    ])
  })

  it('should handle loading state', () => {
    apiHooks.useGetEnrolledProgramsQuery.mockImplementation(
      (undefined, options) => {
        const result = {
          data: undefined,
          isLoading: true,
          error: null,
        }

        if (options && options.selectFromResult) {
          return options.selectFromResult(result)
        }
        return result
      }
    )

    const { result } = renderHook(() => useEnrolledPrograms(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should use correct query options', () => {
    apiHooks.useGetEnrolledProgramsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    })

    renderHook(() => useEnrolledPrograms(), {
      wrapper: createWrapper(),
    })

    expect(apiHooks.useGetEnrolledProgramsQuery).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        refetchOnMountOrArgChange: 600,
      })
    )
  })
})

describe('getDefaultProgram', () => {
  it('should return null when programs array is empty', () => {
    expect(getDefaultProgram([])).toBeNull()
  })

  it('should return null when programs is null', () => {
    expect(getDefaultProgram(null)).toBeNull()
  })

  it('should return program with most recent last_access_journey', () => {
    const programs = [
      {
        journey_id: '1',
        last_access_journey: '2024-01-01T10:00:00Z',
        enrolled_date: '2024-01-01T00:00:00Z',
      },
      {
        journey_id: '2',
        last_access_journey: '2024-01-15T10:00:00Z',
        enrolled_date: '2024-01-01T00:00:00Z',
      },
      {
        journey_id: '3',
        last_access_journey: '2024-01-10T10:00:00Z',
        enrolled_date: '2024-01-01T00:00:00Z',
      },
    ]

    const result = getDefaultProgram(programs)
    expect(result).toBe(2) // Most recent last_access_journey
  })

  it('should fallback to enrolled_date when no last_access_journey', () => {
    const programs = [
      {
        journey_id: '1',
        enrolled_date: '2024-01-01T00:00:00Z',
      },
      {
        journey_id: '2',
        enrolled_date: '2024-01-15T00:00:00Z',
      },
      {
        journey_id: '3',
        enrolled_date: '2024-01-10T00:00:00Z',
      },
    ]

    const result = getDefaultProgram(programs)
    expect(result).toBe(2) // Most recent enrolled_date
  })

  it('should handle mix of programs with and without last_access_journey', () => {
    const programs = [
      {
        journey_id: '1',
        enrolled_date: '2024-01-01T00:00:00Z',
      },
      {
        journey_id: '2',
        last_access_journey: '2024-01-15T10:00:00Z',
        enrolled_date: '2024-01-01T00:00:00Z',
      },
    ]

    const result = getDefaultProgram(programs)
    expect(result).toBe(2) // Should prioritize last_access_journey
  })

  it('should return integer journey_id', () => {
    const programs = [
      {
        journey_id: '123',
        enrolled_date: '2024-01-01T00:00:00Z',
      },
    ]

    const result = getDefaultProgram(programs)
    expect(result).toBe(123)
    expect(typeof result).toBe('number')
  })
})
