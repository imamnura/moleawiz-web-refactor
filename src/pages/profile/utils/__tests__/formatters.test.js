import { describe, it, expect } from 'vitest'
import {
  formatProfileDate,
  getUserInitial,
  getFullName,
  formatEmptyValue,
} from '../formatters'

describe('formatters', () => {
  describe('formatProfileDate', () => {
    it('should format date with English locale', () => {
      const date = '2024-03-15'
      const result = formatProfileDate(date, 'en')
      expect(result).toContain('March')
      expect(result).toContain('2024')
    })

    it('should format date with Indonesian locale', () => {
      const date = '2024-03-15'
      const result = formatProfileDate(date, 'id')
      expect(result).toContain('Maret')
      expect(result).toContain('2024')
    })

    it('should return dash for null date', () => {
      const result = formatProfileDate(null, 'en')
      expect(result).toBe('-')
    })

    it('should return dash for undefined date', () => {
      const result = formatProfileDate(undefined, 'en')
      expect(result).toBe('-')
    })

    it('should return dash for empty string date', () => {
      const result = formatProfileDate('', 'en')
      expect(result).toBe('-')
    })

    it('should handle Date object', () => {
      const date = new Date('2024-03-15')
      const result = formatProfileDate(date, 'en')
      expect(result).toContain('March')
      expect(result).toContain('2024')
    })

    it('should use default format "dd MMMM yyyy" when no format provided', () => {
      const date = '2024-03-15'
      const result = formatProfileDate(date, 'en')
      expect(result).toMatch(/^\d{2} \w+ \d{4}$/)
    })

    it('should accept custom format', () => {
      const date = '2024-03-15'
      const result = formatProfileDate(date, 'en', 'yyyy-MM-dd')
      expect(result).toBe('2024-03-15')
    })

    it('should handle ISO date string and Date objects', () => {
      const isoDate = '2024-03-15'
      const dateObj = new Date('2024-03-15')

      const result1 = formatProfileDate(isoDate, 'en')
      const result2 = formatProfileDate(dateObj, 'en')

      expect(result1).toBeTruthy()
      expect(result2).toBeTruthy()
    })

    it('should throw error for invalid date', () => {
      // Function throws RangeError for invalid dates
      expect(() => {
        formatProfileDate('invalid-date', 'en')
      }).toThrow()
    })

    it('should default to Indonesian locale when locale is not "en"', () => {
      const date = '2024-01-15'
      const result = formatProfileDate(date, 'id')
      expect(result).toContain('Januari')
    })

    it('should handle leap year dates', () => {
      const date = '2024-02-29'
      const result = formatProfileDate(date, 'en')
      expect(result).toContain('February')
      expect(result).toContain('29')
    })
  })

  describe('getUserInitial', () => {
    it('should return first letter uppercase for valid name', () => {
      const result = getUserInitial('john')
      expect(result).toBe('J')
    })

    it('should handle already uppercase name', () => {
      const result = getUserInitial('John')
      expect(result).toBe('J')
    })

    it('should return "?" for null name', () => {
      const result = getUserInitial(null)
      expect(result).toBe('?')
    })

    it('should return "?" for undefined name', () => {
      const result = getUserInitial(undefined)
      expect(result).toBe('?')
    })

    it('should return "?" for empty string', () => {
      const result = getUserInitial('')
      expect(result).toBe('?')
    })

    it('should handle single character name', () => {
      const result = getUserInitial('A')
      expect(result).toBe('A')
    })

    it('should only return first character for long names', () => {
      const result = getUserInitial('Alexander')
      expect(result).toBe('A')
    })

    it('should handle names starting with lowercase', () => {
      const result = getUserInitial('alice')
      expect(result).toBe('A')
    })

    it('should handle names with spaces (takes first char)', () => {
      const result = getUserInitial('John Doe')
      expect(result).toBe('J')
    })

    it('should handle special characters', () => {
      const result = getUserInitial('@user')
      expect(result).toBe('@')
    })

    it('should handle numbers', () => {
      const result = getUserInitial('123')
      expect(result).toBe('1')
    })

    it('should handle emoji using Array.from', () => {
      const result = getUserInitial('😀Hello')
      expect(result).toBe('😀')
    })

    it('should handle whitespace-only string', () => {
      const result = getUserInitial('   ')
      expect(result).toBe(' ')
    })

    it('should return "?" for non-string input', () => {
      // Function expects string, returns "?" for falsy
      const result1 = getUserInitial(null)
      const result2 = getUserInitial(undefined)
      expect(result1).toBe('?')
      expect(result2).toBe('?')
    })
  })

  describe('getFullName', () => {
    it('should combine firstname and lastname', () => {
      const user = { firstname: 'John', lastname: 'Doe' }
      const result = getFullName(user)
      expect(result).toBe('John Doe')
    })

    it('should return only firstname when lastname is missing', () => {
      const user = { firstname: 'John' }
      const result = getFullName(user)
      expect(result).toBe('John')
    })

    it('should return only lastname when firstname is missing', () => {
      const user = { lastname: 'Doe' }
      const result = getFullName(user)
      expect(result).toBe('Doe')
    })

    it('should return empty string when both are missing', () => {
      const user = {}
      const result = getFullName(user)
      expect(result).toBe('')
    })

    it('should handle null user object', () => {
      const result = getFullName(null)
      expect(result).toBe('')
    })

    it('should handle undefined user object', () => {
      const result = getFullName(undefined)
      expect(result).toBe('')
    })

    it('should preserve spaces in names', () => {
      // Function doesn't trim, returns as-is with space between
      const user = { firstname: '  John  ', lastname: '  Doe  ' }
      const result = getFullName(user)
      expect(result).toBe('  John     Doe  ')
    })

    it('should handle empty string firstname', () => {
      const user = { firstname: '', lastname: 'Doe' }
      const result = getFullName(user)
      expect(result).toBe('Doe')
    })

    it('should handle empty string lastname', () => {
      const user = { firstname: 'John', lastname: '' }
      const result = getFullName(user)
      expect(result).toBe('John')
    })

    it('should handle both empty strings', () => {
      const user = { firstname: '', lastname: '' }
      const result = getFullName(user)
      expect(result).toBe('')
    })

    it('should handle names with multiple words', () => {
      const user = { firstname: 'Mary Jane', lastname: 'Watson Parker' }
      const result = getFullName(user)
      expect(result).toBe('Mary Jane Watson Parker')
    })

    it('should handle special characters in names', () => {
      const user = { firstname: "O'Brien", lastname: "D'Angelo" }
      const result = getFullName(user)
      expect(result).toBe("O'Brien D'Angelo")
    })

    it('should handle non-Latin characters', () => {
      const user = { firstname: '張', lastname: '偉' }
      const result = getFullName(user)
      expect(result).toBe('張 偉')
    })
  })

  describe('formatEmptyValue', () => {
    it('should return value when value is truthy', () => {
      const result = formatEmptyValue('John Doe')
      expect(result).toBe('John Doe')
    })

    it('should return fallback for null', () => {
      const result = formatEmptyValue(null)
      expect(result).toBe('-')
    })

    it('should return fallback for undefined', () => {
      const result = formatEmptyValue(undefined)
      expect(result).toBe('-')
    })

    it('should return fallback for empty string', () => {
      const result = formatEmptyValue('')
      expect(result).toBe('-')
    })

    it('should use custom fallback', () => {
      const result = formatEmptyValue(null, 'N/A')
      expect(result).toBe('N/A')
    })

    it('should return value for number 0', () => {
      const result = formatEmptyValue(0)
      expect(result).toBe(0)
    })

    it('should return value for boolean false', () => {
      const result = formatEmptyValue(false)
      expect(result).toBe(false)
    })

    it('should handle whitespace-only strings', () => {
      const result = formatEmptyValue('   ')
      expect(result).toBe('   ')
    })

    it('should return value for arrays', () => {
      const result = formatEmptyValue([1, 2, 3])
      expect(result).toEqual([1, 2, 3])
    })

    it('should return value for empty array', () => {
      // Function doesn't check for empty arrays, returns as-is
      const result = formatEmptyValue([])
      expect(result).toEqual([])
    })

    it('should return value for objects', () => {
      const obj = { name: 'John' }
      const result = formatEmptyValue(obj)
      expect(result).toEqual(obj)
    })

    it('should return value for empty object', () => {
      // Function doesn't check for empty objects, returns as-is
      const result = formatEmptyValue({})
      expect(result).toEqual({})
    })

    it('should handle multiple fallback scenarios', () => {
      expect(formatEmptyValue(null, 'Empty')).toBe('Empty')
      expect(formatEmptyValue(undefined, 'Not Set')).toBe('Not Set')
      expect(formatEmptyValue('', 'No Value')).toBe('No Value')
    })

    it('should preserve non-empty strings', () => {
      const result = formatEmptyValue('Software Engineer')
      expect(result).toBe('Software Engineer')
    })

    it('should handle special characters in fallback', () => {
      const result = formatEmptyValue(null, '—')
      expect(result).toBe('—')
    })

    it('should handle emoji in value', () => {
      const result = formatEmptyValue('😀')
      expect(result).toBe('😀')
    })

    it('should return default dash when no fallback provided', () => {
      const result = formatEmptyValue(null)
      expect(result).toBe('-')
    })
  })

  describe('Edge Cases and Integration', () => {
    it('should handle all formatters with null input', () => {
      expect(formatProfileDate(null, 'en')).toBe('-')
      expect(getUserInitial(null)).toBe('?')
      expect(getFullName(null)).toBe('')
      expect(formatEmptyValue(null)).toBe('-')
    })

    it('should handle all formatters with undefined input', () => {
      expect(formatProfileDate(undefined, 'en')).toBe('-')
      expect(getUserInitial(undefined)).toBe('?')
      expect(getFullName(undefined)).toBe('')
      expect(formatEmptyValue(undefined)).toBe('-')
    })

    it('should handle all formatters with empty string input', () => {
      expect(formatProfileDate('', 'en')).toBe('-')
      expect(getUserInitial('')).toBe('?')
      expect(getFullName({ firstname: '', lastname: '' })).toBe('')
      expect(formatEmptyValue('')).toBe('-')
    })

    it('should work in combination', () => {
      const user = { firstname: 'John', lastname: 'Doe' }
      const fullName = getFullName(user)
      const initial = getUserInitial(fullName)
      const formatted = formatEmptyValue(fullName)

      expect(fullName).toBe('John Doe')
      expect(initial).toBe('J')
      expect(formatted).toBe('John Doe')
    })

    it('should handle real-world user profile data', () => {
      const userProfile = {
        firstname: 'Sarah',
        lastname: 'Connor',
        created_at: '2024-01-15',
        position: 'Software Engineer',
      }

      expect(getFullName(userProfile)).toBe('Sarah Connor')
      expect(getUserInitial(userProfile.firstname)).toBe('S')
      expect(formatProfileDate(userProfile.created_at, 'en')).toContain(
        'January'
      )
      expect(formatEmptyValue(userProfile.position)).toBe('Software Engineer')
    })

    it('should handle incomplete user profile data', () => {
      const incompleteProfile = {
        firstname: 'John',
        // lastname missing
        created_at: null,
        position: '',
      }

      expect(getFullName(incompleteProfile)).toBe('John')
      expect(getUserInitial(incompleteProfile.firstname)).toBe('J')
      expect(formatProfileDate(incompleteProfile.created_at, 'en')).toBe('-')
      expect(formatEmptyValue(incompleteProfile.position)).toBe('-')
    })
  })
})
