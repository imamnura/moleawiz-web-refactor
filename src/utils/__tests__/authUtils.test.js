/**
 * Auth Utilities Tests
 * Unit tests for authentication helper functions
 */

import { describe, it, expect } from 'vitest'
import {
  validatePassword,
  formatAuthError,
  generateRandomColor,
} from '@utils/authUtils'

describe('Auth Utilities', () => {
  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('Test@12345')

      expect(result.isValid).toBe(true)
      expect(result.requirements.minLength).toBe(true)
      expect(result.requirements.hasUpperCase).toBe(true)
      expect(result.requirements.hasLowerCase).toBe(true)
      expect(result.requirements.hasNumbers).toBe(true)
      expect(result.requirements.hasSpecialChar).toBe(true)
    })

    it('should fail validation for short password', () => {
      const result = validatePassword('Test@1')

      expect(result.isValid).toBe(false)
      expect(result.requirements.minLength).toBe(false)
    })

    it('should fail validation for password without uppercase', () => {
      const result = validatePassword('test@12345')

      expect(result.isValid).toBe(false)
      expect(result.requirements.hasUpperCase).toBe(false)
    })

    it('should fail validation for password without lowercase', () => {
      const result = validatePassword('TEST@12345')

      expect(result.isValid).toBe(false)
      expect(result.requirements.hasLowerCase).toBe(false)
    })

    it('should fail validation for password without numbers', () => {
      const result = validatePassword('Test@Password')

      expect(result.isValid).toBe(false)
      expect(result.requirements.hasNumbers).toBe(false)
    })

    it('should fail validation for password without special characters', () => {
      const result = validatePassword('TestPassword123')

      expect(result.isValid).toBe(false)
      expect(result.requirements.hasSpecialChar).toBe(false)
    })

    it('should validate password with all special characters', () => {
      const specialChars = '!@#$%^&*(),.?":{}|<>'
      const password = `Test${specialChars}123`
      const result = validatePassword(password)

      expect(result.requirements.hasSpecialChar).toBe(true)
    })
  })

  describe('formatAuthError', () => {
    it('should format error with data.message', () => {
      const error = {
        data: {
          message: 'Invalid credentials',
        },
      }

      const result = formatAuthError(error)

      expect(result).toBe('Invalid credentials')
    })

    it('should format error with message property', () => {
      const error = {
        message: 'Network error',
      }

      const result = formatAuthError(error)

      expect(result).toBe('Network error')
    })

    it('should format string error', () => {
      const error = 'Simple error message'

      const result = formatAuthError(error)

      expect(result).toBe('Simple error message')
    })

    it('should return default message for unknown error format', () => {
      const error = { someUnknownProperty: 'value' }

      const result = formatAuthError(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle null error', () => {
      const result = formatAuthError(null)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle undefined error', () => {
      const result = formatAuthError(undefined)

      expect(result).toBe('An unexpected error occurred')
    })
  })

  describe('generateRandomColor', () => {
    it('should generate a valid hex color', () => {
      const color = generateRandomColor()

      expect(color).toMatch(/^#[0-9a-f]{1,6}$/i)
      expect(color).toHaveLength(7)
      expect(color.startsWith('#')).toBe(true)
    })

    it('should generate different colors on multiple calls', () => {
      const colors = new Set()

      // Generate 10 colors
      for (let i = 0; i < 10; i++) {
        colors.add(generateRandomColor())
      }

      // With randomness, we should get at least some different values
      // (though theoretically they could all be the same, it's extremely unlikely)
      expect(colors.size).toBeGreaterThan(1)
    })
  })

  describe('getSpecialDateBackground', () => {
    // This function depends on environment variables and current date
    // We would need to mock import.meta.env and Date for comprehensive testing
    it.skip('should return background configuration - requires env and date mocking', () => {
      // Skipping as this requires complex date and env mocking
    })
  })
})
