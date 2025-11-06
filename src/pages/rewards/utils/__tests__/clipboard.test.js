import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { copyToClipboard, getCopyInput } from '../clipboard'

describe('Clipboard Utilities', () => {
  let mockClipboard
  let mockDocument

  beforeEach(() => {
    // Mock clipboard API
    mockClipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    }

    // Mock navigator
    globalThis.navigator = {
      clipboard: mockClipboard,
    }

    // Mock window.isSecureContext
    globalThis.window = {
      isSecureContext: true,
    }

    // Mock document methods for fallback
    mockDocument = {
      createElement: vi.fn((tag) => {
        const element = {
          value: '',
          style: {},
          setAttribute: vi.fn(),
          select: vi.fn(),
          tagName: tag.toUpperCase(),
        }
        return element
      }),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      execCommand: vi.fn(() => true),
      getSelection: vi.fn(() => ({
        rangeCount: 0,
        getRangeAt: vi.fn(),
        removeAllRanges: vi.fn(),
        addRange: vi.fn(),
      })),
    }

    globalThis.document = mockDocument
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('copyToClipboard - Desktop', () => {
    it('should copy using modern clipboard API on desktop', async () => {
      const text = 'ABC123'
      const result = await copyToClipboard(text, false)

      expect(mockClipboard.writeText).toHaveBeenCalledWith(text)
      expect(result).toBe(true)
    })

    it('should handle clipboard API success', async () => {
      mockClipboard.writeText.mockResolvedValue()

      const result = await copyToClipboard('test-code', false)

      expect(result).toBe(true)
    })

    it('should fallback when clipboard API fails', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'))

      const result = await copyToClipboard('test-code', false)

      // Fallback should be attempted
      expect(mockDocument.createElement).toHaveBeenCalledWith('textarea')
      expect(result).toBe(true)
    })

    it('should copy long text', async () => {
      const longText = 'A'.repeat(1000)
      const result = await copyToClipboard(longText, false)

      expect(mockClipboard.writeText).toHaveBeenCalledWith(longText)
      expect(result).toBe(true)
    })
  })

  describe('copyToClipboard - Mobile', () => {
    it('should try modern API first on mobile when secure', async () => {
      globalThis.window.isSecureContext = true

      const text = 'MOBILE123'
      const result = await copyToClipboard(text, true)

      expect(mockClipboard.writeText).toHaveBeenCalledWith(text)
      expect(result).toBe(true)
    })

    it('should use fallback when not secure context', async () => {
      globalThis.window.isSecureContext = false

      const result = await copyToClipboard('test-code', true)

      expect(mockDocument.createElement).toHaveBeenCalledWith('textarea')
      expect(result).toBe(true)
    })

    it('should use fallback when clipboard API unavailable', async () => {
      globalThis.navigator.clipboard = undefined

      const result = await copyToClipboard('test-code', true)

      expect(mockDocument.createElement).toHaveBeenCalledWith('textarea')
      expect(result).toBe(true)
    })
  })

  describe('Fallback Copy Method', () => {
    it('should create textarea for fallback', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('API unavailable'))

      await copyToClipboard('test-code', false)

      expect(mockDocument.createElement).toHaveBeenCalledWith('textarea')
      expect(mockDocument.body.appendChild).toHaveBeenCalled()
      expect(mockDocument.execCommand).toHaveBeenCalledWith('copy')
      expect(mockDocument.body.removeChild).toHaveBeenCalled()
    })

    it('should set textarea properties correctly', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('API unavailable'))
      const text = 'FALLBACK123'

      const mockTextarea = {
        value: '',
        style: {},
        setAttribute: vi.fn(),
        select: vi.fn(),
        tagName: 'TEXTAREA',
      }

      mockDocument.createElement.mockReturnValue(mockTextarea)

      await copyToClipboard(text, false)

      expect(mockTextarea.value).toBe(text)
      expect(mockTextarea.setAttribute).toHaveBeenCalledWith('readonly', '')
      expect(mockTextarea.style.position).toBe('absolute')
      expect(mockTextarea.style.left).toBe('-9999px')
    })

    it('should handle selection restoration', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('API unavailable'))

      const mockRange = { startContainer: {}, endContainer: {} }
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: vi.fn(() => mockRange),
        removeAllRanges: vi.fn(),
        addRange: vi.fn(),
      }

      mockDocument.getSelection.mockReturnValue(mockSelection)

      await copyToClipboard('test', false)

      expect(mockSelection.removeAllRanges).toHaveBeenCalled()
      expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange)
    })

    it('should handle fallback errors gracefully', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('API unavailable'))
      mockDocument.execCommand.mockImplementation(() => {
        throw new Error('execCommand failed')
      })

      const result = await copyToClipboard('test', false)

      expect(result).toBe(false)
    })
  })

  describe('getCopyInput', () => {
    it('should return element by ID', () => {
      const mockElement = { id: 'test-input', value: 'test' }
      mockDocument.getElementById = vi.fn(() => mockElement)
      globalThis.document = mockDocument

      const result = getCopyInput('test-input')

      expect(mockDocument.getElementById).toHaveBeenCalledWith('test-input')
      expect(result).toBe(mockElement)
    })

    it('should return null for non-existent ID', () => {
      mockDocument.getElementById = vi.fn(() => null)
      globalThis.document = mockDocument

      const result = getCopyInput('non-existent')

      expect(result).toBeNull()
    })

    it('should work with different element IDs', () => {
      const mockElement1 = { id: 'code-redeem' }
      const mockElement2 = { id: 'voucher-code' }

      mockDocument.getElementById = vi.fn((id) => {
        if (id === 'code-redeem') return mockElement1
        if (id === 'voucher-code') return mockElement2
        return null
      })
      globalThis.document = mockDocument

      expect(getCopyInput('code-redeem')).toBe(mockElement1)
      expect(getCopyInput('voucher-code')).toBe(mockElement2)
      expect(getCopyInput('invalid')).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string', async () => {
      const result = await copyToClipboard('', false)
      expect(mockClipboard.writeText).toHaveBeenCalledWith('')
      expect(result).toBe(true)
    })

    it('should handle special characters', async () => {
      const text = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const result = await copyToClipboard(text, false)
      expect(mockClipboard.writeText).toHaveBeenCalledWith(text)
      expect(result).toBe(true)
    })

    it('should handle Unicode characters', async () => {
      const text = '中文字符 🎉 Émojis'
      const result = await copyToClipboard(text, false)
      expect(mockClipboard.writeText).toHaveBeenCalledWith(text)
      expect(result).toBe(true)
    })

    it('should handle newlines', async () => {
      const text = 'Line 1\nLine 2\nLine 3'
      const result = await copyToClipboard(text, false)
      expect(mockClipboard.writeText).toHaveBeenCalledWith(text)
      expect(result).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should log error when clipboard fails', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Clipboard error')
      mockClipboard.writeText.mockRejectedValue(error)
      mockDocument.execCommand.mockReturnValue(true)

      await copyToClipboard('test', false)

      expect(consoleError).toHaveBeenCalledWith('Clipboard error:', error)
      consoleError.mockRestore()
    })

    it('should log fallback usage', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
      mockClipboard.writeText.mockRejectedValue(new Error('API fail'))

      await copyToClipboard('test', false)

      expect(consoleLog).toHaveBeenCalledWith('Copied using fallback method')
      consoleLog.mockRestore()
    })

    it('should log fallback error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClipboard.writeText.mockRejectedValue(new Error('API fail'))
      mockDocument.execCommand.mockImplementation(() => {
        throw new Error('execCommand failed')
      })

      await copyToClipboard('test', false)

      expect(consoleError).toHaveBeenCalledWith(
        'Fallback copy error:',
        expect.any(Error)
      )
      consoleError.mockRestore()
    })
  })
})
