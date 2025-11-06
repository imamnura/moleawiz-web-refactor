/**
 * useUserProfile Hook Tests
 * Unit tests for user profile data fetching hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOutletContext } from 'react-router-dom'
import { useUserProfile } from '../useUserProfile'
import * as profileApi from '@services/api/profileApi'

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useOutletContext: vi.fn(),
}))

vi.mock('@services/api/profileApi', () => ({
  useGetProfileDetailQuery: vi.fn(),
}))

describe('useUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial loading state when no userId', () => {
    useOutletContext.mockReturnValue([null, {}])
    profileApi.useGetProfileDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useUserProfile())

    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toBeNull()
    expect(result.current.userData).toEqual({})
  })

  it('should fetch user profile when userId is provided', () => {
    const mockUserData = {
      userId: 123,
      userName: 'Test User',
    }

    const mockProfile = {
      id: 123,
      username: 'testuser',
      email: 'test@example.com',
    }

    useOutletContext.mockReturnValue([null, mockUserData])
    profileApi.useGetProfileDetailQuery.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useUserProfile())

    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.userData).toEqual(mockUserData)
    expect(profileApi.useGetProfileDetailQuery).toHaveBeenCalledWith(123, {
      skip: false,
    })
  })

  it('should show loading state while fetching profile', () => {
    const mockUserData = {
      userId: 456,
      userName: 'Loading User',
    }

    useOutletContext.mockReturnValue([null, mockUserData])
    profileApi.useGetProfileDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    })

    const { result } = renderHook(() => useUserProfile())

    expect(result.current.loading).toBe(true)
    expect(result.current.profile).toBeNull()
  })

  it('should handle error state', () => {
    const mockUserData = {
      userId: 789,
      userName: 'Error User',
    }

    const mockError = {
      status: 404,
      data: { message: 'User not found' },
    }

    useOutletContext.mockReturnValue([null, mockUserData])
    profileApi.useGetProfileDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useUserProfile())

    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toBeNull()
    expect(result.current.error).toEqual(mockError)
  })

  it('should skip query when userId is not provided', () => {
    useOutletContext.mockReturnValue([null, { userName: 'No ID User' }])
    profileApi.useGetProfileDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    })

    renderHook(() => useUserProfile())

    expect(profileApi.useGetProfileDetailQuery).toHaveBeenCalledWith(
      undefined,
      { skip: true }
    )
  })

  it('should handle outlet context with null userData', () => {
    useOutletContext.mockReturnValue([null, null])
    profileApi.useGetProfileDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useUserProfile())

    expect(result.current.userData).toEqual({})
    expect(result.current.profile).toBeNull()
  })

  it('should handle outlet context with undefined', () => {
    useOutletContext.mockReturnValue(undefined)
    profileApi.useGetProfileDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useUserProfile())

    expect(result.current.userData).toEqual({})
    expect(result.current.profile).toBeNull()
  })

  it('should return complete user profile data', () => {
    const mockUserData = {
      userId: 999,
      userName: 'Complete User',
      email: 'complete@test.com',
    }

    const mockProfile = {
      id: 999,
      username: 'completeuser',
      email: 'complete@test.com',
      firstName: 'Complete',
      lastName: 'User',
      phone: '+1234567890',
    }

    useOutletContext.mockReturnValue([null, mockUserData])
    profileApi.useGetProfileDetailQuery.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useUserProfile())

    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.profile.firstName).toBe('Complete')
    expect(result.current.profile.lastName).toBe('User')
  })
})
