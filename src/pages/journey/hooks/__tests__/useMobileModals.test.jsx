/**
 * useMobileModals Hook Tests
 * Unit tests for useMobileModals custom hook
 */

import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMobileModals } from '../useMobileModals.js'

describe('useMobileModals', () => {
  it('should initialize with all modals closed', () => {
    const { result } = renderHook(() => useMobileModals())

    expect(result.current.journeyModalOpen).toBe(false)
    expect(result.current.courseModalOpen).toBe(false)
    expect(result.current.moduleModalOpen).toBe(false)
  })

  it('should open journey modal', () => {
    const { result } = renderHook(() => useMobileModals())

    act(() => {
      result.current.openJourneyModal()
    })

    expect(result.current.journeyModalOpen).toBe(true)
  })

  it('should close journey modal', () => {
    const { result } = renderHook(() => useMobileModals())

    act(() => {
      result.current.openJourneyModal()
    })

    expect(result.current.journeyModalOpen).toBe(true)

    act(() => {
      result.current.closeJourneyModal()
    })

    expect(result.current.journeyModalOpen).toBe(false)
  })

  it('should open course modal', () => {
    const { result } = renderHook(() => useMobileModals())

    act(() => {
      result.current.openCourseModal()
    })

    expect(result.current.courseModalOpen).toBe(true)
  })

  it('should close course modal', () => {
    const { result } = renderHook(() => useMobileModals())

    act(() => {
      result.current.openCourseModal()
    })

    act(() => {
      result.current.closeCourseModal()
    })

    expect(result.current.courseModalOpen).toBe(false)
  })

  it('should open module modal', () => {
    const { result } = renderHook(() => useMobileModals())

    act(() => {
      result.current.openModuleModal()
    })

    expect(result.current.moduleModalOpen).toBe(true)
  })

  it('should close module modal', () => {
    const { result } = renderHook(() => useMobileModals())

    act(() => {
      result.current.openModuleModal()
    })

    act(() => {
      result.current.closeModuleModal()
    })

    expect(result.current.moduleModalOpen).toBe(false)
  })

  it('should handle multiple modals independently', () => {
    const { result } = renderHook(() => useMobileModals())

    act(() => {
      result.current.openJourneyModal()
      result.current.openCourseModal()
    })

    expect(result.current.journeyModalOpen).toBe(true)
    expect(result.current.courseModalOpen).toBe(true)
    expect(result.current.moduleModalOpen).toBe(false)
  })
})
