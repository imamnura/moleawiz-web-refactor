import { describe, it, expect } from 'vitest'
import {
  formatPoints,
  formatRewardDate,
  formatRewardDateTime,
  convertEnter,
  calculateNewBalance,
  hasEnoughPoints,
} from '../formatters'

describe('Rewards Formatters', () => {
  describe('formatPoints', () => {
    it('should format number with dot separator', () => {
      expect(formatPoints(10000)).toBe('10.000')
      expect(formatPoints(1000000)).toBe('1.000.000')
      expect(formatPoints(500)).toBe('500')
    })

    it('should handle string numbers', () => {
      expect(formatPoints('10000')).toBe('10.000')
      expect(formatPoints('500')).toBe('500')
    })

    it('should handle zero', () => {
      expect(formatPoints(0)).toBe('0')
      expect(formatPoints('0')).toBe('0')
    })

    it('should return empty string for null/undefined', () => {
      expect(formatPoints(null)).toBe('')
      expect(formatPoints(undefined)).toBe('')
    })

    it('should handle negative numbers', () => {
      expect(formatPoints(-1000)).toBe('-1.000')
    })

    it('should handle large numbers', () => {
      expect(formatPoints(1000000000)).toBe('1.000.000.000')
    })
  })

  describe('formatRewardDate', () => {
    it('should format date in English', () => {
      const result = formatRewardDate('2024-12-25', 'en')
      expect(result).toBe('25 Dec 2024')
    })

    it('should format date in Indonesian', () => {
      const result = formatRewardDate('2024-12-25', 'id')
      expect(result).toBe('25 Des 2024')
    })

    it('should default to English', () => {
      const result = formatRewardDate('2024-01-15')
      expect(result).toBe('15 Jan 2024')
    })

    it('should handle Date objects', () => {
      const date = new Date('2024-03-10')
      const result = formatRewardDate(date, 'en')
      expect(result).toContain('Mar')
      expect(result).toContain('2024')
    })

    it('should handle leap year dates', () => {
      const result = formatRewardDate('2024-02-29', 'en')
      expect(result).toBe('29 Feb 2024')
    })
  })

  describe('formatRewardDateTime', () => {
    it('should combine date and time', () => {
      const result = formatRewardDateTime('2024-12-25', '14:30', 'en')
      expect(result).toBe('25 Dec 2024 14:30')
    })

    it('should work with Indonesian locale', () => {
      const result = formatRewardDateTime('2024-01-15', '09:00', 'id')
      expect(result).toBe('15 Jan 2024 09:00')
    })

    it('should handle different time formats', () => {
      const result = formatRewardDateTime('2024-06-01', '23:59', 'en')
      expect(result).toBe('01 Jun 2024 23:59')
    })

    it('should handle empty time', () => {
      const result = formatRewardDateTime('2024-06-01', '', 'en')
      expect(result).toBe('01 Jun 2024 ')
    })
  })

  describe('convertEnter', () => {
    it('should preserve newlines', () => {
      const input = 'Line 1\nLine 2\nLine 3'
      const result = convertEnter(input)
      expect(result).toBe('Line 1\nLine 2\nLine 3')
    })

    it('should handle \\r\\n (Windows)', () => {
      const input = 'Line 1\r\nLine 2'
      const result = convertEnter(input)
      expect(result).toBe('Line 1\nLine 2')
    })

    it('should handle \\r (old Mac)', () => {
      const input = 'Line 1\rLine 2'
      const result = convertEnter(input)
      expect(result).toBe('Line 1\nLine 2')
    })

    it('should return empty string for null/undefined', () => {
      expect(convertEnter(null)).toBe('')
      expect(convertEnter(undefined)).toBe('')
      expect(convertEnter('')).toBe('')
    })

    it('should handle mixed line endings', () => {
      const input = 'Line 1\nLine 2\r\nLine 3\rLine 4'
      const result = convertEnter(input)
      expect(result).toBe('Line 1\nLine 2\nLine 3\nLine 4')
    })

    it('should preserve text without newlines', () => {
      const input = 'No newlines here'
      const result = convertEnter(input)
      expect(result).toBe('No newlines here')
    })
  })

  describe('calculateNewBalance', () => {
    it('should subtract redeem points from current balance', () => {
      expect(calculateNewBalance(1000, 300)).toBe(700)
      expect(calculateNewBalance(5000, 2500)).toBe(2500)
    })

    it('should handle string inputs', () => {
      expect(calculateNewBalance('1000', '300')).toBe(700)
      expect(calculateNewBalance('5000', '2500')).toBe(2500)
    })

    it('should handle zero balance', () => {
      expect(calculateNewBalance(100, 100)).toBe(0)
    })

    it('should allow negative balance (no validation)', () => {
      // Function doesn't validate, just calculates
      expect(calculateNewBalance(100, 200)).toBe(-100)
    })

    it('should handle large numbers', () => {
      expect(calculateNewBalance(1000000, 500000)).toBe(500000)
    })

    it('should parse integers (ignore decimals)', () => {
      expect(calculateNewBalance(100.99, 50.99)).toBe(50)
    })
  })

  describe('hasEnoughPoints', () => {
    it('should return true when balance is sufficient', () => {
      expect(hasEnoughPoints(1000, 500)).toBe(true)
      expect(hasEnoughPoints(1000, 1000)).toBe(true)
    })

    it('should return false when balance is insufficient', () => {
      expect(hasEnoughPoints(500, 1000)).toBe(false)
      expect(hasEnoughPoints(999, 1000)).toBe(false)
    })

    it('should handle string inputs', () => {
      expect(hasEnoughPoints('1000', '500')).toBe(true)
      expect(hasEnoughPoints('500', '1000')).toBe(false)
    })

    it('should handle zero balance', () => {
      expect(hasEnoughPoints(0, 100)).toBe(false)
      expect(hasEnoughPoints(0, 0)).toBe(true)
    })

    it('should handle edge case - exactly equal', () => {
      expect(hasEnoughPoints(5000, 5000)).toBe(true)
    })

    it('should handle large numbers', () => {
      expect(hasEnoughPoints(1000000, 999999)).toBe(true)
      expect(hasEnoughPoints(1000000, 1000001)).toBe(false)
    })

    it('should parse integers (ignore decimals)', () => {
      expect(hasEnoughPoints(100.99, 100.1)).toBe(true) // Becomes 100 >= 100
    })
  })

  describe('Edge Cases & Integration', () => {
    it('should handle complete redeem flow calculation', () => {
      const currentBalance = 5000
      const redeemPoints = 2000

      expect(hasEnoughPoints(currentBalance, redeemPoints)).toBe(true)
      const newBalance = calculateNewBalance(currentBalance, redeemPoints)
      expect(newBalance).toBe(3000)
      expect(formatPoints(newBalance)).toBe('3.000')
    })

    it('should handle insufficient points scenario', () => {
      const currentBalance = 1000
      const redeemPoints = 2000

      expect(hasEnoughPoints(currentBalance, redeemPoints)).toBe(false)
      // In real app, this wouldn't be called if insufficient points
      const newBalance = calculateNewBalance(currentBalance, redeemPoints)
      expect(newBalance).toBe(-1000)
    })

    it('should handle all formatters with same date', () => {
      const date = '2024-12-25'
      const time = '15:30'

      const dateOnly = formatRewardDate(date, 'en')
      expect(dateOnly).toBe('25 Dec 2024')

      const dateTime = formatRewardDateTime(date, time, 'en')
      expect(dateTime).toBe('25 Dec 2024 15:30')
    })
  })
})
