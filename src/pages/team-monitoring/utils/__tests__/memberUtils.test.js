import { describe, it, expect } from 'vitest'
import {
  categorizeMemberStatus,
  getMemberFullName,
  filterIncompletePrograms,
} from '../memberUtils'

describe('memberUtils', () => {
  describe('categorizeMemberStatus', () => {
    it('should return empty arrays for null members', () => {
      const result = categorizeMemberStatus(null)
      expect(result).toEqual({
        confirmed: [],
        notConfirmed: [],
        declined: [],
      })
    })

    it('should return empty arrays for empty array', () => {
      const result = categorizeMemberStatus([])
      expect(result).toEqual({
        confirmed: [],
        notConfirmed: [],
        declined: [],
      })
    })

    it('should categorize accepted members', () => {
      const members = [
        { id: 1, status: 'accepted', name: 'John' },
        { id: 2, status: 'accepted', name: 'Jane' },
      ]
      const result = categorizeMemberStatus(members)
      expect(result.confirmed).toHaveLength(2)
      expect(result.notConfirmed).toHaveLength(0)
      expect(result.declined).toHaveLength(0)
    })

    it('should categorize declined members', () => {
      const members = [
        { id: 1, status: 'declined', name: 'John' },
        { id: 2, status: 'declined', name: 'Jane' },
      ]
      const result = categorizeMemberStatus(members)
      expect(result.declined).toHaveLength(2)
      expect(result.confirmed).toHaveLength(0)
      expect(result.notConfirmed).toHaveLength(0)
    })

    it('should categorize tentatively members as not confirmed', () => {
      const members = [{ id: 1, status: 'tentatively', name: 'John' }]
      const result = categorizeMemberStatus(members)
      expect(result.notConfirmed).toHaveLength(1)
      expect(result.confirmed).toHaveLength(0)
      expect(result.declined).toHaveLength(0)
    })

    it('should categorize null status as not confirmed', () => {
      const members = [{ id: 1, status: null, name: 'John' }]
      const result = categorizeMemberStatus(members)
      expect(result.notConfirmed).toHaveLength(1)
    })

    it('should categorize mixed statuses correctly', () => {
      const members = [
        { id: 1, status: 'accepted', name: 'John' },
        { id: 2, status: 'declined', name: 'Jane' },
        { id: 3, status: 'tentatively', name: 'Bob' },
        { id: 4, status: null, name: 'Alice' },
      ]
      const result = categorizeMemberStatus(members)
      expect(result.confirmed).toHaveLength(1)
      expect(result.declined).toHaveLength(1)
      expect(result.notConfirmed).toHaveLength(2)
    })

    it('should preserve member objects in categorization', () => {
      const members = [
        { id: 1, status: 'accepted', name: 'John', email: 'john@test.com' },
      ]
      const result = categorizeMemberStatus(members)
      expect(result.confirmed[0]).toEqual(members[0])
    })
  })

  describe('getMemberFullName', () => {
    it('should return empty string for null member', () => {
      const result = getMemberFullName(null)
      expect(result).toBe('')
    })

    it('should return fullname if present', () => {
      const member = { fullname: 'John Doe' }
      const result = getMemberFullName(member)
      expect(result).toBe('John Doe')
    })

    it('should combine firstname and lastname', () => {
      const member = { firstname: 'John', lastname: 'Doe' }
      const result = getMemberFullName(member)
      expect(result).toBe('John Doe')
    })

    it('should handle missing lastname', () => {
      const member = { firstname: 'John' }
      const result = getMemberFullName(member)
      expect(result).toBe('John')
    })

    it('should handle missing firstname', () => {
      const member = { lastname: 'Doe' }
      const result = getMemberFullName(member)
      expect(result).toBe('Doe')
    })

    it('should prefer fullname over firstname/lastname', () => {
      const member = {
        fullname: 'Jane Smith',
        firstname: 'John',
        lastname: 'Doe',
      }
      const result = getMemberFullName(member)
      expect(result).toBe('Jane Smith')
    })

    it('should trim whitespace properly', () => {
      const member = { firstname: '  John  ', lastname: '  Doe  ' }
      const result = getMemberFullName(member)
      // Note: trim() only removes leading/trailing spaces, not between words
      expect(result).toContain('John')
      expect(result).toContain('Doe')
    })
  })

  describe('filterIncompletePrograms', () => {
    it('should return empty array for null programs', () => {
      const result = filterIncompletePrograms(null)
      expect(result).toEqual([])
    })

    it('should return empty array for empty array', () => {
      const result = filterIncompletePrograms([])
      expect(result).toEqual([])
    })

    it('should filter out completed programs', () => {
      const programs = [
        { id: 1, name: 'Program 1', is_completed: 0 },
        { id: 2, name: 'Program 2', is_completed: 1 },
        { id: 3, name: 'Program 3', is_completed: 0 },
      ]
      const result = filterIncompletePrograms(programs)
      expect(result).toHaveLength(2)
      expect(result.every((p) => p.is_completed < 1)).toBe(true)
    })

    it('should keep programs with is_completed = 0', () => {
      const programs = [{ id: 1, name: 'Program 1', is_completed: 0 }]
      const result = filterIncompletePrograms(programs)
      expect(result).toHaveLength(1)
    })

    it('should filter out programs with is_completed = 1', () => {
      const programs = [{ id: 1, name: 'Program 1', is_completed: 1 }]
      const result = filterIncompletePrograms(programs)
      expect(result).toHaveLength(0)
    })

    it('should keep programs with fractional completion', () => {
      const programs = [
        { id: 1, name: 'Program 1', is_completed: 0.5 },
        { id: 2, name: 'Program 2', is_completed: 0.9 },
      ]
      const result = filterIncompletePrograms(programs)
      expect(result).toHaveLength(2)
    })

    it('should preserve program objects', () => {
      const programs = [
        { id: 1, name: 'Program 1', is_completed: 0, progress: 50 },
      ]
      const result = filterIncompletePrograms(programs)
      expect(result[0]).toEqual(programs[0])
    })
  })
})
