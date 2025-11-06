import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getTimeRemaining,
  formatCountdown,
  isOTPExpired,
  validateOTP,
  filterOTPInput,
} from '../otpHelpers'

describe('OTP Helpers', () => {
  describe('getTimeRemaining', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should return milliseconds until expiration', () => {
      const now = new Date('2024-12-25T10:00:00')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T10:05:00' // 5 minutes later
      const result = getTimeRemaining(expiredDate)

      expect(result).toBe(5 * 60 * 1000) // 300000 ms
    })

    it('should return 0 for expired dates', () => {
      const now = new Date('2024-12-25T10:00:00')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T09:00:00' // 1 hour ago
      const result = getTimeRemaining(expiredDate)

      expect(result).toBe(0)
    })

    it('should return 0 for current time', () => {
      const now = new Date('2024-12-25T10:00:00')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T10:00:00'
      const result = getTimeRemaining(expiredDate)

      expect(result).toBe(0)
    })

    it('should handle different time zones', () => {
      const now = new Date('2024-12-25T10:00:00Z')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T10:10:00Z' // 10 minutes later
      const result = getTimeRemaining(expiredDate)

      expect(result).toBeGreaterThan(0)
    })
  })

  describe('formatCountdown', () => {
    it('should format minutes and seconds with leading zeros', () => {
      expect(formatCountdown(5, 30)).toBe('05:30')
      expect(formatCountdown(0, 5)).toBe('00:05')
      expect(formatCountdown(1, 1)).toBe('01:01')
    })

    it('should format double-digit numbers without extra zeros', () => {
      expect(formatCountdown(10, 45)).toBe('10:45')
      expect(formatCountdown(59, 59)).toBe('59:59')
    })

    it('should handle zero values', () => {
      expect(formatCountdown(0, 0)).toBe('00:00')
    })

    it('should handle maximum values', () => {
      expect(formatCountdown(99, 99)).toBe('99:99')
    })

    it('should work with string-like numbers', () => {
      expect(formatCountdown(5, 30)).toBe('05:30')
    })
  })

  describe('isOTPExpired', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should return false for future expiration', () => {
      const now = new Date('2024-12-25T10:00:00')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T10:05:00' // 5 minutes later
      expect(isOTPExpired(expiredDate)).toBe(false)
    })

    it('should return true for past expiration', () => {
      const now = new Date('2024-12-25T10:00:00')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T09:00:00' // 1 hour ago
      expect(isOTPExpired(expiredDate)).toBe(true)
    })

    it('should return true for current time', () => {
      const now = new Date('2024-12-25T10:00:00')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T10:00:00'
      expect(isOTPExpired(expiredDate)).toBe(true)
    })

    it('should handle edge case - 1 second before expiry', () => {
      const now = new Date('2024-12-25T10:00:00')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T10:00:01'
      expect(isOTPExpired(expiredDate)).toBe(false)
    })
  })

  describe('validateOTP', () => {
    it('should return true for valid 6-digit OTP', () => {
      expect(validateOTP('123456')).toBe(true)
      expect(validateOTP('000000')).toBe(true)
      expect(validateOTP('999999')).toBe(true)
    })

    it('should return false for less than 6 digits', () => {
      expect(validateOTP('12345')).toBe(false)
      expect(validateOTP('1')).toBe(false)
      expect(validateOTP('')).toBe(false)
    })

    it('should return false for more than 6 digits', () => {
      expect(validateOTP('1234567')).toBe(false)
      expect(validateOTP('12345678')).toBe(false)
    })

    it('should return false for non-numeric characters', () => {
      expect(validateOTP('12345a')).toBe(false)
      expect(validateOTP('abcdef')).toBe(false)
      expect(validateOTP('12 456')).toBe(false)
    })

    it('should return false for special characters', () => {
      expect(validateOTP('123-456')).toBe(false)
      expect(validateOTP('123.456')).toBe(false)
      expect(validateOTP('123 456')).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(validateOTP(null)).toBe(false)
      expect(validateOTP(undefined)).toBe(false)
    })

    it('should return false for mixed valid/invalid', () => {
      expect(validateOTP('1234!6')).toBe(false)
      expect(validateOTP('123e56')).toBe(false)
    })
  })

  describe('filterOTPInput', () => {
    it('should remove non-numeric characters', () => {
      expect(filterOTPInput('123abc')).toBe('123')
      expect(filterOTPInput('abc123')).toBe('123')
      expect(filterOTPInput('12a3b4c')).toBe('1234')
    })

    it('should remove special characters', () => {
      expect(filterOTPInput('123-456')).toBe('123456')
      expect(filterOTPInput('123.456')).toBe('123456')
      expect(filterOTPInput('123 456')).toBe('123456')
    })

    it('should preserve only digits', () => {
      expect(filterOTPInput('123456')).toBe('123456')
      expect(filterOTPInput('000000')).toBe('000000')
    })

    it('should handle empty string', () => {
      expect(filterOTPInput('')).toBe('')
    })

    it('should handle all non-numeric', () => {
      expect(filterOTPInput('abcdef')).toBe('')
      expect(filterOTPInput('!@#$%^')).toBe('')
    })

    it('should handle mixed case with numbers', () => {
      expect(filterOTPInput('1A2B3C4D5E6F')).toBe('123456')
    })

    it('should remove e, E, +, -, .', () => {
      expect(filterOTPInput('1e2+3-4.5')).toBe('12345')
      expect(filterOTPInput('1E2+3-4.5')).toBe('12345')
    })

    it('should handle paste events with formatting', () => {
      expect(filterOTPInput('123 456 789')).toBe('123456789')
      expect(filterOTPInput('123-456-789')).toBe('123456789')
    })
  })

  describe('Integration - Complete OTP Flow', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should validate complete OTP verification flow', () => {
      const now = new Date('2024-12-25T10:00:00')
      vi.setSystemTime(now)

      // OTP sent at 10:00, expires at 10:05
      const expiredDate = '2024-12-25T10:05:00'

      // Check not expired
      expect(isOTPExpired(expiredDate)).toBe(false)

      // Get time remaining
      const timeRemaining = getTimeRemaining(expiredDate)
      expect(timeRemaining).toBe(5 * 60 * 1000)

      // Calculate minutes and seconds
      const minutes = Math.floor(timeRemaining / 60000)
      const seconds = Math.floor((timeRemaining % 60000) / 1000)

      // Format countdown
      expect(formatCountdown(minutes, seconds)).toBe('05:00')

      // User enters OTP
      const rawInput = '123abc456'
      const filtered = filterOTPInput(rawInput)
      expect(filtered).toBe('123456')

      // Validate OTP
      expect(validateOTP(filtered)).toBe(true)
    })

    it('should handle expired OTP scenario', () => {
      const now = new Date('2024-12-25T10:06:00')
      vi.setSystemTime(now)

      // OTP expired at 10:05
      const expiredDate = '2024-12-25T10:05:00'

      // Check is expired
      expect(isOTPExpired(expiredDate)).toBe(true)

      // Time remaining should be 0
      expect(getTimeRemaining(expiredDate)).toBe(0)

      // Countdown should show 00:00
      expect(formatCountdown(0, 0)).toBe('00:00')
    })

    it('should handle invalid OTP input', () => {
      const rawInput = '12345' // Only 5 digits
      const filtered = filterOTPInput(rawInput)

      expect(filtered).toBe('12345')
      expect(validateOTP(filtered)).toBe(false)
    })

    it('should handle countdown at last second', () => {
      const now = new Date('2024-12-25T10:04:59')
      vi.setSystemTime(now)

      const expiredDate = '2024-12-25T10:05:00'

      const timeRemaining = getTimeRemaining(expiredDate)
      expect(timeRemaining).toBe(1000) // 1 second

      const minutes = Math.floor(timeRemaining / 60000)
      const seconds = Math.floor((timeRemaining % 60000) / 1000)

      expect(formatCountdown(minutes, seconds)).toBe('00:01')
      expect(isOTPExpired(expiredDate)).toBe(false)
    })
  })
})
