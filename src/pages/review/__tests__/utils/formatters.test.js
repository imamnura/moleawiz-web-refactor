import { describe, it, expect } from 'vitest'
import {
  formatModuleDate,
  formatSubmissionDate,
  convertEnter,
  convertLink,
  convertFileLink,
  formatSubmissionNumber,
  canDeleteModule,
} from '../../utils/formatters'

describe('formatters.js', () => {
  describe('formatModuleDate', () => {
    it('should format date correctly for EN locale', () => {
      const result = formatModuleDate('2024-01-25', 'en')
      expect(result).toBe('25 Jan 2024')
    })

    it('should format date correctly for ID locale', () => {
      const result = formatModuleDate('2024-01-25', 'id')
      expect(result).toBe('25 Jan 2024')
    })

    it('should return "-" for null date', () => {
      expect(formatModuleDate(null)).toBe('-')
    })

    it('should return "-" for undefined date', () => {
      expect(formatModuleDate(undefined)).toBe('-')
    })

    it('should handle Date object', () => {
      const date = new Date('2024-01-25')
      const result = formatModuleDate(date, 'en')
      expect(result).toBe('25 Jan 2024')
    })
  })

  describe('formatSubmissionDate', () => {
    it('should format date with time for EN locale', () => {
      const result = formatSubmissionDate('2024-01-25T14:30:00', 'en')
      expect(result).toContain('25 Jan 2024')
      expect(result).toContain('14:30')
    })

    it('should format date with time for ID locale', () => {
      const result = formatSubmissionDate('2024-01-25T09:15:00', 'id')
      expect(result).toContain('25 Jan 2024')
      expect(result).toContain('09:15')
    })

    it('should return "-" for null date', () => {
      expect(formatSubmissionDate(null)).toBe('-')
    })

    it('should return "-" for undefined date', () => {
      expect(formatSubmissionDate(undefined)).toBe('-')
    })

    it('should handle Date object with time', () => {
      const date = new Date('2024-01-25T16:45:00')
      const result = formatSubmissionDate(date, 'en')
      expect(result).toContain('16:45')
    })

    it('should separate date and time with double space', () => {
      const result = formatSubmissionDate('2024-01-25T10:00:00', 'en')
      expect(result).toMatch(/\d{2} \w{3} \d{4}  \d{2}:\d{2}/)
    })
  })

  describe('convertEnter', () => {
    it('should preserve newlines for text with \\n', () => {
      const text = 'Line 1\nLine 2\nLine 3'
      const result = convertEnter(text)
      expect(result).toBe('Line 1\nLine 2\nLine 3')
    })

    it('should handle \\r\\n (Windows line breaks)', () => {
      const text = 'Line 1\r\nLine 2'
      const result = convertEnter(text)
      expect(result).toBe('Line 1\nLine 2')
    })

    it('should handle \\r (Mac line breaks)', () => {
      const text = 'Line 1\rLine 2'
      const result = convertEnter(text)
      expect(result).toBe('Line 1\nLine 2')
    })

    it('should return empty string for null', () => {
      expect(convertEnter(null)).toBe('')
    })

    it('should return empty string for undefined', () => {
      expect(convertEnter(undefined)).toBe('')
    })

    it('should handle text without newlines', () => {
      const text = 'Single line text'
      const result = convertEnter(text)
      expect(result).toBe('Single line text')
    })
  })

  describe('convertLink', () => {
    it('should convert HTTP URLs to clickable links', () => {
      const text = 'Visit http://example.com for more'
      const result = convertLink(text)
      expect(result).toContain('<a target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
      expect(result).toContain('href="http://example.com"')
      expect(result).toContain('>http://example.com</a>')
    })

    it('should convert HTTPS URLs to clickable links', () => {
      const text = 'Visit https://secure.example.com'
      const result = convertLink(text)
      expect(result).toContain('href="https://secure.example.com"')
    })

    it('should convert multiple URLs in text', () => {
      const text = 'Visit http://site1.com and https://site2.com'
      const result = convertLink(text)
      expect(result).toContain('href="http://site1.com"')
      expect(result).toContain('href="https://site2.com"')
    })

    it('should return empty string for null', () => {
      expect(convertLink(null)).toBe('')
    })

    it('should return empty string for undefined', () => {
      expect(convertLink(undefined)).toBe('')
    })

    it('should not modify text without URLs', () => {
      const text = 'No links here'
      const result = convertLink(text)
      expect(result).toBe('No links here')
    })

    it('should handle URLs with query parameters', () => {
      const text = 'https://example.com?param=value&other=123'
      const result = convertLink(text)
      expect(result).toContain('href="https://example.com?param=value&other=123"')
    })
  })

  describe('convertFileLink', () => {
    it('should convert file URL to download link with custom name', () => {
      const url = 'https://cdn.example.com/files/document.pdf'
      const fileName = 'My Document'
      const result = convertFileLink(url, fileName)
      expect(result).toContain('<a target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
      expect(result).toContain('href="https://cdn.example.com/files/document.pdf"')
      expect(result).toContain('>My Document</a>')
    })

    it('should use last part of URL if no fileName provided', () => {
      const url = 'https://cdn.example.com/files/report.xlsx'
      const result = convertFileLink(url)
      expect(result).toContain('>report.xlsx</a>')
    })

    it('should return empty string for null URL', () => {
      expect(convertFileLink(null, 'File')).toBe('')
    })

    it('should return empty string for undefined URL', () => {
      expect(convertFileLink(undefined, 'File')).toBe('')
    })

    it('should handle URL without path', () => {
      const url = 'https://example.com'
      const result = convertFileLink(url, 'Homepage')
      expect(result).toContain('>Homepage</a>')
    })

    it('should extract filename from complex path', () => {
      const url = 'https://storage.cloud.com/bucket/folder/subfolder/image.png'
      const result = convertFileLink(url)
      expect(result).toContain('>image.png</a>')
    })
  })

  describe('formatSubmissionNumber', () => {
    it('should format submission number with # prefix', () => {
      expect(formatSubmissionNumber(1)).toBe('#1')
      expect(formatSubmissionNumber(5)).toBe('#5')
      expect(formatSubmissionNumber(100)).toBe('#100')
    })

    it('should return "-" for null', () => {
      expect(formatSubmissionNumber(null)).toBe('-')
    })

    it('should return "-" for undefined', () => {
      expect(formatSubmissionNumber(undefined)).toBe('-')
    })

    it('should handle zero', () => {
      expect(formatSubmissionNumber(0)).toBe('#0')
    })

    it('should handle negative numbers', () => {
      expect(formatSubmissionNumber(-1)).toBe('#-1')
    })
  })

  describe('canDeleteModule', () => {
    it('should return true if all users submitted and deadline passed', () => {
      const module = {
        has_all_users_first_submission: 1,
        deadline: '2024-01-01', // Past date
      }
      const result = canDeleteModule(module)
      expect(result).toBe(true)
    })

    it('should return false if not all users submitted', () => {
      const module = {
        has_all_users_first_submission: 0,
        deadline: '2024-01-01',
      }
      const result = canDeleteModule(module)
      expect(result).toBe(false)
    })

    it('should return false if deadline not passed', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)
      const module = {
        has_all_users_first_submission: 1,
        deadline: futureDate.toISOString(),
      }
      const result = canDeleteModule(module)
      expect(result).toBe(false)
    })

    it('should return false for null module', () => {
      expect(canDeleteModule(null)).toBe(false)
    })

    it('should return false for undefined module', () => {
      expect(canDeleteModule(undefined)).toBe(false)
    })

    it('should return false if deadline is today (not passed yet)', () => {
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      const module = {
        has_all_users_first_submission: 1,
        deadline: today.toISOString(),
      }
      const result = canDeleteModule(module)
      expect(result).toBe(false)
    })

    it('should handle Date object as deadline', () => {
      const pastDate = new Date('2024-01-01')
      const module = {
        has_all_users_first_submission: 1,
        deadline: pastDate,
      }
      const result = canDeleteModule(module)
      expect(result).toBe(true)
    })
  })
})
