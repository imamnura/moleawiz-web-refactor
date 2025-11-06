import { describe, it, expect } from 'vitest'
import {
  formatNumberWithDot,
  getUserInitial,
  getFullName,
} from '../formatters'

describe('formatNumberWithDot', () => {
  it('should format number with dot separator', () => {
    expect(formatNumberWithDot(1000)).toBe('1.000')
  })

  it('should format large numbers correctly', () => {
    expect(formatNumberWithDot(1000000)).toBe('1.000.000')
  })

  it('should handle string numbers', () => {
    expect(formatNumberWithDot('5000')).toBe('5.000')
  })

  it('should handle numbers less than 1000', () => {
    expect(formatNumberWithDot(500)).toBe('500')
  })

  it('should handle zero', () => {
    expect(formatNumberWithDot(0)).toBe('0')
  })

  it('should handle null and undefined', () => {
    expect(formatNumberWithDot(null)).toBe('0')
    expect(formatNumberWithDot(undefined)).toBe('0')
  })

  it('should format decimal numbers', () => {
    expect(formatNumberWithDot(1234.56)).toBe('1.234.56')
  })
})

describe('getUserInitial', () => {
  it('should return first character uppercase', () => {
    expect(getUserInitial('john')).toBe('J')
  })

  it('should handle already uppercase', () => {
    expect(getUserInitial('JANE')).toBe('J')
  })

  it('should handle mixed case', () => {
    expect(getUserInitial('MixedCase')).toBe('M')
  })

  it('should handle empty string', () => {
    expect(getUserInitial('')).toBe('')
  })

  it('should handle null and undefined', () => {
    expect(getUserInitial(null)).toBe('')
    expect(getUserInitial(undefined)).toBe('')
  })

  it('should handle single character', () => {
    expect(getUserInitial('a')).toBe('A')
  })

  it('should handle unicode characters', () => {
    expect(getUserInitial('álvaro')).toBe('Á')
  })
})

describe('getFullName', () => {
  it('should combine firstname and lastname', () => {
    const user = { firstname: 'John', lastname: 'Doe' }
    expect(getFullName(user)).toBe('John Doe')
  })

  it('should handle only firstname', () => {
    const user = { firstname: 'John', lastname: '' }
    expect(getFullName(user)).toBe('John')
  })

  it('should handle only lastname', () => {
    const user = { firstname: '', lastname: 'Doe' }
    expect(getFullName(user)).toBe('Doe')
  })

  it('should handle empty user object', () => {
    const user = { firstname: '', lastname: '' }
    expect(getFullName(user)).toBe('')
  })

  it('should handle null user', () => {
    expect(getFullName(null)).toBe('')
  })

  it('should handle undefined user', () => {
    expect(getFullName(undefined)).toBe('')
  })

  it('should trim extra whitespace', () => {
    const user = { firstname: '  John  ', lastname: '  Doe  ' }
    expect(getFullName(user)).toBe('John     Doe')
  })

  it('should handle missing properties', () => {
    const user = {}
    expect(getFullName(user)).toBe('')
  })
})
