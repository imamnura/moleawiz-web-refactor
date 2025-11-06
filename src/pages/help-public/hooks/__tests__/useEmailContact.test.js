/**
 * useEmailContact Hook Tests
 * Unit tests for email contact functionality hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEmailContact } from '../useEmailContact'

// Mock dependencies
vi.mock('@config/constant/customer_support', () => ({
  contactEmail: 'support@example.com',
  subjectEmail: 'Help Request for ###',
  bodyEmail: 'Hello,\n\nI need help with ###.\n\nThank you.',
}))

vi.mock('@/utils', () => ({
  getAppName: () => 'Intikom Learning',
}))

// Mock window.open
const mockWindowOpen = vi.fn()
window.open = mockWindowOpen

describe('useEmailContact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return contactEmail', () => {
    const { result } = renderHook(() => useEmailContact())

    expect(result.current.contactEmail).toBe('support@example.com')
  })

  it('should return handleEmailClick function', () => {
    const { result } = renderHook(() => useEmailContact())

    expect(result.current.handleEmailClick).toBeDefined()
    expect(typeof result.current.handleEmailClick).toBe('function')
  })

  it('should initialize with loading false', () => {
    const { result } = renderHook(() => useEmailContact())

    expect(result.current.loading).toBe(false)
  })

  it('should open mailto link when handleEmailClick is called', async () => {
    const { result } = renderHook(() => useEmailContact())

    await act(async () => {
      await result.current.handleEmailClick()
    })

    expect(mockWindowOpen).toHaveBeenCalled()
    const mailtoUrl = mockWindowOpen.mock.calls[0][0]
    expect(mailtoUrl).toContain('mailto:support@example.com')
  })

  it('should include app name in subject', async () => {
    const { result } = renderHook(() => useEmailContact())

    await act(async () => {
      await result.current.handleEmailClick()
    })

    const mailtoUrl = mockWindowOpen.mock.calls[0][0]
    expect(mailtoUrl).toContain('Intikom Learning')
    expect(mailtoUrl).toContain('subject=')
  })

  it('should include app name in body', async () => {
    const { result } = renderHook(() => useEmailContact())

    await act(async () => {
      await result.current.handleEmailClick()
    })

    const mailtoUrl = mockWindowOpen.mock.calls[0][0]
    expect(mailtoUrl).toContain('body=')
    expect(mailtoUrl).toContain('Intikom Learning')
  })

  it('should open mailto in same window', async () => {
    const { result } = renderHook(() => useEmailContact())

    await act(async () => {
      await result.current.handleEmailClick()
    })

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('mailto:'),
      '_self'
    )
  })

  it('should handle errors gracefully', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mockWindowOpen.mockImplementationOnce(() => {
      throw new Error('Test error')
    })

    const { result } = renderHook(() => useEmailContact())

    await act(async () => {
      await result.current.handleEmailClick()
    })

    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(result.current.loading).toBe(false)

    consoleErrorSpy.mockRestore()
  })

  it('should set loading to false after email is sent', async () => {
    const { result } = renderHook(() => useEmailContact())

    await act(async () => {
      await result.current.handleEmailClick()
    })

    expect(result.current.loading).toBe(false)
  })
})
