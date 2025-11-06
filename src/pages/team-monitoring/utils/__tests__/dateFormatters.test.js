import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  formatDateRange,
  formatTimeRange,
  formatLastAccess,
  calculateDaysLeft,
  calculateEventDuration,
  isToday,
  formatCalendarDate,
} from '../dateFormatters'

describe('dateFormatters Utils', () => {
  describe('formatDateRange', () => {
    it('should format same day range', () => {
      const result = formatDateRange('2024-03-20', '2024-03-20', 'en')
      expect(result).toBe('20 March 2024')
    })

    it('should format same month and year range', () => {
      const result = formatDateRange('2024-03-20', '2024-03-25', 'en')
      expect(result).toBe('20 - 25 March 2024')
    })

    it('should format same year different month range', () => {
      const result = formatDateRange('2024-03-20', '2024-04-05', 'en')
      expect(result).toBe('20 March - 05 April 2024')
    })

    it('should format different year range', () => {
      const result = formatDateRange('2024-12-20', '2025-01-05', 'en')
      expect(result).toBe('20 December 2024 - 05 January 2025')
    })

    it('should handle Indonesian locale', () => {
      const result = formatDateRange('2024-03-20', '2024-03-20', 'id')
      expect(result).toContain('20')
      expect(result).toContain('2024')
    })

    it('should return "-" for missing start date', () => {
      const result = formatDateRange(null, '2024-03-20', 'en')
      expect(result).toBe('-')
    })

    it('should return "-" for missing end date', () => {
      const result = formatDateRange('2024-03-20', null, 'en')
      expect(result).toBe('-')
    })

    it('should handle Date objects', () => {
      const start = new Date('2024-03-20')
      const end = new Date('2024-03-25')
      const result = formatDateRange(start, end, 'en')
      expect(result).toContain('March 2024')
    })
  })

  describe('formatTimeRange', () => {
    it('should format time range correctly', () => {
      const result = formatTimeRange('14:00:00', '16:00:00')
      expect(result).toBe('14:00 - 16:00')
    })

    it('should handle time without seconds', () => {
      const result = formatTimeRange('09:30', '11:45')
      expect(result).toBe('09:30 - 11:45')
    })

    it('should return "-" for missing start time', () => {
      const result = formatTimeRange(null, '16:00:00')
      expect(result).toBe('-')
    })

    it('should return "-" for missing end time', () => {
      const result = formatTimeRange('14:00:00', null)
      expect(result).toBe('-')
    })

    it('should handle Date objects', () => {
      const start = new Date('2024-03-20T14:00:00')
      const end = new Date('2024-03-20T16:00:00')
      const result = formatTimeRange(start, end)
      expect(result).toContain('-')
    })
  })

  describe('formatLastAccess', () => {
    it('should format last access date in English', () => {
      const result = formatLastAccess('2024-03-20', 'en')
      expect(result).toBe('20 Mar 2024')
    })

    it('should format last access date in Indonesian', () => {
      const result = formatLastAccess('2024-03-20', 'id')
      expect(result).toContain('20')
      expect(result).toContain('2024')
    })

    it('should return "-" for missing date', () => {
      const result = formatLastAccess(null, 'en')
      expect(result).toBe('-')
    })

    it('should handle Date object', () => {
      const date = new Date('2024-03-20')
      const result = formatLastAccess(date, 'en')
      expect(result).toContain('Mar 2024')
    })
  })

  describe('calculateDaysLeft', () => {
    beforeEach(() => {
      // Mock current date to 2024-03-20
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-20'))
    })

    it('should calculate days left within 30 days', () => {
      const result = calculateDaysLeft('2024-03-25')
      expect(result).toBe(5)
    })

    it('should return "Overdue" for past dates', () => {
      const result = calculateDaysLeft('2024-03-15')
      expect(result).toBe('Overdue')
    })

    it('should return "-" for dates more than 30 days away', () => {
      const result = calculateDaysLeft('2024-05-01')
      expect(result).toBe('-')
    })

    it('should return 0 for today', () => {
      const result = calculateDaysLeft('2024-03-20')
      expect(result).toBe(0)
    })

    it('should return "-" for missing date', () => {
      const result = calculateDaysLeft(null)
      expect(result).toBe('-')
    })

    it('should handle Date object', () => {
      const date = new Date('2024-03-25')
      const result = calculateDaysLeft(date)
      expect(result).toBe(5)
    })

    it('should return days left exactly at 30 days', () => {
      const result = calculateDaysLeft('2024-04-19')
      expect(result).toBe(30)
    })

    it('should return "-" for 31 days', () => {
      const result = calculateDaysLeft('2024-04-20')
      expect(result).toBe('-')
    })
  })

  describe('calculateEventDuration', () => {
    it('should calculate single day event', () => {
      const result = calculateEventDuration('2024-03-20', '2024-03-20')
      expect(result).toBe(1)
    })

    it('should calculate multi-day event', () => {
      const result = calculateEventDuration('2024-03-20', '2024-03-25')
      expect(result).toBe(6) // Includes both start and end
    })

    it('should return 0 for missing start date', () => {
      const result = calculateEventDuration(null, '2024-03-25')
      expect(result).toBe(0)
    })

    it('should return 0 for missing end date', () => {
      const result = calculateEventDuration('2024-03-20', null)
      expect(result).toBe(0)
    })

    it('should handle Date objects', () => {
      const start = new Date('2024-03-20')
      const end = new Date('2024-03-22')
      const result = calculateEventDuration(start, end)
      expect(result).toBe(3)
    })
  })

  describe('isToday', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-20'))
    })

    it('should return true for today', () => {
      const result = isToday('2024-03-20')
      expect(result).toBe(true)
    })

    it('should return false for past date', () => {
      const result = isToday('2024-03-19')
      expect(result).toBe(false)
    })

    it('should return false for future date', () => {
      const result = isToday('2024-03-21')
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isToday(null)
      expect(result).toBe(false)
    })

    it('should handle Date object', () => {
      const date = new Date('2024-03-20')
      const result = isToday(date)
      expect(result).toBe(true)
    })
  })

  describe('formatCalendarDate', () => {
    it('should format date for calendar', () => {
      const result = formatCalendarDate('2024-03-20')
      expect(result).toBe('2024-03-20')
    })

    it('should return empty string for null', () => {
      const result = formatCalendarDate(null)
      expect(result).toBe('')
    })

    it('should handle Date object', () => {
      const date = new Date('2024-03-20')
      const result = formatCalendarDate(date)
      expect(result).toBe('2024-03-20')
    })

    it('should format single digit month and day with leading zeros', () => {
      const result = formatCalendarDate('2024-01-05')
      expect(result).toBe('2024-01-05')
    })
  })
})
