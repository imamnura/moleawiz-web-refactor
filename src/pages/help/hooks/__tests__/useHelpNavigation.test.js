/**
 * useHelpNavigation Hook Tests
 * Unit tests for help navigation state management hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useHelpNavigation } from '../useHelpNavigation'
import * as helpTopics from '../../data/helpTopics'

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}))

vi.mock('../../data/helpTopics', () => ({
  mapLabelToRoute: vi.fn(),
  mapRouteToLabel: vi.fn(),
}))

describe('useHelpNavigation', () => {
  const mockNavigate = vi.fn()
  const mockT = vi.fn((key) => key)

  beforeEach(() => {
    vi.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    useTranslation.mockReturnValue({
      t: mockT,
      i18n: { language: 'en' },
    })

    // Mock DOM querySelector
    document.querySelectorAll = vi.fn(() => [])
    document.querySelector = vi.fn(() => null)
  })

  it('should initialize with FAQ topic from root path', () => {
    useLocation.mockReturnValue({ pathname: '/help/faq' })
    helpTopics.mapRouteToLabel.mockReturnValue('FAQ')

    const { result } = renderHook(() => useHelpNavigation())

    expect(result.current.activeTopic).toBe('faq')
  })

  it('should extract topic from URL path', () => {
    useLocation.mockReturnValue({ pathname: '/help/profile' })
    helpTopics.mapRouteToLabel.mockReturnValue('Profile')

    const { result } = renderHook(() => useHelpNavigation())

    expect(result.current.activeTopic).toBe('profile')
  })

  it('should handle nested paths correctly', () => {
    useLocation.mockReturnValue({ pathname: '/help/mylearningjourney' })
    helpTopics.mapRouteToLabel.mockReturnValue('My Learning Journey')

    const { result } = renderHook(() => useHelpNavigation())

    expect(result.current.activeTopic).toBe('mylearningjourney')
    expect(result.current.selectedLabel).toBe('My Learning Journey')
  })

  it('should initialize modal as not visible', () => {
    useLocation.mockReturnValue({ pathname: '/help/faq' })
    helpTopics.mapRouteToLabel.mockReturnValue('FAQ')

    const { result } = renderHook(() => useHelpNavigation())

    expect(result.current.modalVisible).toBe(false)
  })

  it('should allow setting modal visibility', () => {
    useLocation.mockReturnValue({ pathname: '/help/faq' })
    helpTopics.mapRouteToLabel.mockReturnValue('FAQ')

    const { result } = renderHook(() => useHelpNavigation())

    act(() => {
      result.current.setModalVisible(true)
    })

    expect(result.current.modalVisible).toBe(true)
  })

  it('should navigate to selected topic', () => {
    useLocation.mockReturnValue({ pathname: '/help/faq' })
    helpTopics.mapRouteToLabel.mockReturnValue('FAQ')
    helpTopics.mapLabelToRoute.mockReturnValue('profile')

    const { result } = renderHook(() => useHelpNavigation())

    act(() => {
      result.current.navigateToTopic('Profile')
    })

    expect(mockNavigate).toHaveBeenCalledWith('/help/profile', {
      replace: true,
    })
    expect(result.current.selectedLabel).toBe('Profile')
    expect(result.current.modalVisible).toBe(false)
  })

  it('should close modal after navigation', () => {
    useLocation.mockReturnValue({ pathname: '/help/faq' })
    helpTopics.mapRouteToLabel.mockReturnValue('FAQ')
    helpTopics.mapLabelToRoute.mockReturnValue('login')

    const { result } = renderHook(() => useHelpNavigation())

    act(() => {
      result.current.setModalVisible(true)
    })

    expect(result.current.modalVisible).toBe(true)

    act(() => {
      result.current.navigateToTopic('Login')
    })

    expect(result.current.modalVisible).toBe(false)
  })

  it('should update active topic when location changes', () => {
    const { rerender } = renderHook(() => useHelpNavigation())

    // Initial location
    useLocation.mockReturnValue({ pathname: '/help/faq' })
    helpTopics.mapRouteToLabel.mockReturnValue('FAQ')
    rerender()

    // Change location
    useLocation.mockReturnValue({ pathname: '/help/login' })
    helpTopics.mapRouteToLabel.mockReturnValue('Login')
    rerender()

    const { result } = renderHook(() => useHelpNavigation())
    expect(result.current.activeTopic).toBe('login')
  })

  it('should provide getCurrentTopic function', () => {
    useLocation.mockReturnValue({ pathname: '/help/learningpoint' })
    helpTopics.mapRouteToLabel.mockReturnValue('Learning Point')

    const { result } = renderHook(() => useHelpNavigation())

    expect(result.current.getCurrentTopic).toBeDefined()
    expect(typeof result.current.getCurrentTopic).toBe('function')
  })

  it.skip('should default to faq when no path segments', () => {
    useLocation.mockReturnValue({ pathname: '/help' })
    helpTopics.mapRouteToLabel.mockReturnValue('FAQ')

    const { result } = renderHook(() => useHelpNavigation())

    expect(result.current.activeTopic).toBe('faq')
  })

  it('should handle language changes', () => {
    useLocation.mockReturnValue({ pathname: '/help/faq' })

    // Initial language
    useTranslation.mockReturnValue({
      t: mockT,
      i18n: { language: 'en' },
    })
    helpTopics.mapRouteToLabel.mockReturnValue('FAQ')

    const { rerender } = renderHook(() => useHelpNavigation())

    // Change language
    useTranslation.mockReturnValue({
      t: mockT,
      i18n: { language: 'id' },
    })
    helpTopics.mapRouteToLabel.mockReturnValue('Pertanyaan Umum')

    rerender()

    // Label should update based on new language
    expect(helpTopics.mapRouteToLabel).toHaveBeenCalled()
  })
})
