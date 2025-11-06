/**
 * useHelpPublicNavigation Hook Tests
 * Unit tests for help-public navigation hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useHelpPublicNavigation } from '../useHelpPublicNavigation'

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}))

describe('useHelpPublicNavigation', () => {
  const mockNavigate = vi.fn()
  const mockT = vi.fn((key) => key)

  beforeEach(() => {
    vi.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    useTranslation.mockReturnValue({
      t: mockT,
      i18n: { language: 'en' },
    })
  })

  it('should return current topic from URL path', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/faq' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    expect(result.current.currentTopic).toBe(
      'feature.feature_help.side_dpd.frequently_asked_questions'
    )
  })

  it('should handle login topic specially', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/login' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    expect(result.current.currentTopic).toBe('Login')
  })

  it('should return profile topic', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/profile' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    expect(result.current.currentTopic).toBe(
      'feature.feature_help.side_dpd.profile'
    )
  })

  it('should default to FAQ for unknown paths', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/unknown' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    expect(result.current.currentTopic).toBe(
      'feature.feature_help.side_dpd.frequently_asked_questions'
    )
  })

  it('should handle root path', () => {
    useLocation.mockReturnValue({ pathname: '/help-public' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    expect(result.current.currentTopic).toBe(
      'feature.feature_help.side_dpd.frequently_asked_questions'
    )
  })

  it('should provide navigateToTopic function', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/faq' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    expect(result.current.navigateToTopic).toBeDefined()
    expect(typeof result.current.navigateToTopic).toBe('function')
  })

  it('should navigate to topic when navigateToTopic is called', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/faq' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    act(() => {
      result.current.navigateToTopic('profile')
    })

    expect(mockNavigate).toHaveBeenCalledWith('/help-public/profile', {
      replace: true,
    })
  })

  it('should not navigate for invalid topic key', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/faq' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    act(() => {
      result.current.navigateToTopic('invalid')
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should handle mylearningjourney topic', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/mylearningjourney' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    expect(result.current.currentTopic).toBe(
      'feature.feature_help.side_dpd.my_learning_journey'
    )
  })

  it('should handle privacy policy topic', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/privacypolicy' })

    const { result } = renderHook(() => useHelpPublicNavigation())

    expect(result.current.currentTopic).toBe(
      'feature.feature_help.side_dpd.privacy_policy'
    )
  })

  it('should update when location changes', () => {
    const { rerender } = renderHook(() => useHelpPublicNavigation())

    // Initial location
    useLocation.mockReturnValue({ pathname: '/help-public/faq' })
    rerender()

    // Change location
    useLocation.mockReturnValue({ pathname: '/help-public/login' })
    rerender()

    const { result } = renderHook(() => useHelpPublicNavigation())
    expect(result.current.currentTopic).toBe('Login')
  })

  it('should handle language change for login topic', () => {
    useLocation.mockReturnValue({ pathname: '/help-public/login' })
    useTranslation.mockReturnValue({
      t: mockT,
      i18n: { language: 'id' },
    })

    const { result } = renderHook(() => useHelpPublicNavigation())

    // Login should stay as "Login" in both languages
    expect(result.current.currentTopic).toBe('Login')
  })
})
