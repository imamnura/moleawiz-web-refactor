import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateEmailLink, openEmailClient } from '../emailUtils'

describe('emailUtils', () => {
  describe('generateEmailLink', () => {
    it('should return empty string for null members', () => {
      const result = generateEmailLink(null, 'Test Program')
      expect(result).toBe('')
    })

    it('should return empty string for empty array', () => {
      const result = generateEmailLink([], 'Test Program')
      expect(result).toBe('')
    })

    it('should generate mailto link for single member', () => {
      const members = [{ email: 'john@test.com' }]
      const result = generateEmailLink(members, 'React Training')
      
      expect(result).toContain('mailto:john@test.com')
      expect(result).toContain('subject=')
      expect(result).toContain('React%20Training')
      expect(result).toContain('body=')
    })

    it('should generate mailto link for multiple members', () => {
      const members = [
        { email: 'john@test.com' },
        { email: 'jane@test.com' },
        { email: 'bob@test.com' },
      ]
      const result = generateEmailLink(members, 'React Training')
      
      expect(result).toContain('john@test.com;jane@test.com;bob@test.com')
    })

    it('should URL encode program name with spaces', () => {
      const members = [{ email: 'test@test.com' }]
      const result = generateEmailLink(members, 'Advanced React Training')
      
      expect(result).toContain('Advanced%20React%20Training')
      expect(result).not.toContain('Advanced React Training')
    })

    it('should include subject with reminder text', () => {
      const members = [{ email: 'test@test.com' }]
      const result = generateEmailLink(members, 'Training')
      
      expect(result).toContain('subject=Reminder%20Penyelesaian%20Program%20Training')
    })

    it('should include pre-filled body', () => {
      const members = [{ email: 'test@test.com' }]
      const result = generateEmailLink(members, 'Training')
      
      expect(result).toContain('body=')
      expect(result).toContain('Tuliskan')
    })

    it('should handle program names with special characters', () => {
      const members = [{ email: 'test@test.com' }]
      const result = generateEmailLink(members, 'React & Node.js Training')
      
      expect(result).toContain('React%20&%20Node.js%20Training')
    })
  })

  describe('openEmailClient', () => {
    beforeEach(() => {
      // Mock window.open
      global.window.open = vi.fn()
    })

    it('should call window.open with mailto link', () => {
      const members = [{ email: 'test@test.com' }]
      openEmailClient(members, 'Training')
      
      expect(window.open).toHaveBeenCalled()
      const callArg = window.open.mock.calls[0][0]
      expect(callArg).toContain('mailto:')
      expect(callArg).toContain('test@test.com')
    })

    it('should not call window.open for empty members', () => {
      openEmailClient([], 'Training')
      expect(window.open).not.toHaveBeenCalled()
    })

    it('should not call window.open for null members', () => {
      openEmailClient(null, 'Training')
      expect(window.open).not.toHaveBeenCalled()
    })

    it('should call window.open with correct mailto format', () => {
      const members = [
        { email: 'john@test.com' },
        { email: 'jane@test.com' },
      ]
      openEmailClient(members, 'React Training')
      
      const callArg = window.open.mock.calls[0][0]
      expect(callArg).toContain('mailto:john@test.com;jane@test.com')
      expect(callArg).toContain('subject=')
      expect(callArg).toContain('body=')
    })
  })
})
