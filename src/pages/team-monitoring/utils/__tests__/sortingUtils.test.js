import { describe, it, expect } from 'vitest'
import {
  sortProgramMembers,
  sortTeamsByOngoing,
  sortTeamsByName,
  sortProgramsByProgress,
  paginateData,
} from '../sortingUtils'

describe('sortingUtils', () => {
  describe('sortProgramMembers', () => {
    it('should return empty array for null members', () => {
      const result = sortProgramMembers(null)
      expect(result).toEqual([])
    })

    it('should return empty array for empty array', () => {
      const result = sortProgramMembers([])
      expect(result).toEqual([])
    })

    it('should sort incomplete members by progress ascending', () => {
      const members = [
        { fullname: 'John', progress: 75 },
        { fullname: 'Jane', progress: 25 },
        { fullname: 'Bob', progress: 50 },
      ]
      const result = sortProgramMembers(members)
      
      expect(result[0].progress).toBe(25)
      expect(result[1].progress).toBe(50)
      expect(result[2].progress).toBe(75)
    })

    it('should place incomplete members before complete', () => {
      const members = [
        { fullname: 'John', progress: 100 },
        { fullname: 'Jane', progress: 50 },
        { fullname: 'Bob', progress: 100 },
      ]
      const result = sortProgramMembers(members)
      
      expect(result[0].progress).toBe(50) // Incomplete first
      expect(result[1].progress).toBe(100)
      expect(result[2].progress).toBe(100)
    })

    it('should sort complete members alphabetically by fullname', () => {
      const members = [
        { fullname: 'Charlie', progress: 100 },
        { fullname: 'Alice', progress: 100 },
        { fullname: 'Bob', progress: 100 },
      ]
      const result = sortProgramMembers(members)
      
      expect(result[0].fullname).toBe('Alice')
      expect(result[1].fullname).toBe('Bob')
      expect(result[2].fullname).toBe('Charlie')
    })

    it('should handle complex scenario with incomplete and complete', () => {
      const members = [
        { fullname: 'Zara', progress: 100 },
        { fullname: 'Alice', progress: 30 },
        { fullname: 'Bob', progress: 100 },
        { fullname: 'Charlie', progress: 60 },
      ]
      const result = sortProgramMembers(members)
      
      // Incomplete first (sorted by progress)
      expect(result[0].fullname).toBe('Alice')
      expect(result[0].progress).toBe(30)
      expect(result[1].fullname).toBe('Charlie')
      expect(result[1].progress).toBe(60)
      
      // Complete second (sorted alphabetically)
      expect(result[2].fullname).toBe('Bob')
      expect(result[3].fullname).toBe('Zara')
    })

    it('should treat progress >= 100 as complete', () => {
      const members = [
        { fullname: 'John', progress: 100 },
        { fullname: 'Jane', progress: 99 },
      ]
      const result = sortProgramMembers(members)
      
      expect(result[0].progress).toBe(99) // Incomplete
      expect(result[1].progress).toBe(100) // Complete
    })
  })

  describe('sortTeamsByOngoing', () => {
    it('should return empty array for null teams', () => {
      const result = sortTeamsByOngoing(null)
      expect(result).toEqual([])
    })

    it('should sort teams by total_ongoing descending', () => {
      const teams = [
        { fullname: 'John', total_ongoing: 2 },
        { fullname: 'Jane', total_ongoing: 5 },
        { fullname: 'Bob', total_ongoing: 1 },
      ]
      const result = sortTeamsByOngoing(teams)
      
      expect(result[0].total_ongoing).toBe(5)
      expect(result[1].total_ongoing).toBe(2)
      expect(result[2].total_ongoing).toBe(1)
    })

    it('should handle teams with same ongoing count', () => {
      const teams = [
        { fullname: 'John', total_ongoing: 3 },
        { fullname: 'Jane', total_ongoing: 3 },
      ]
      const result = sortTeamsByOngoing(teams)
      
      expect(result).toHaveLength(2)
      expect(result[0].total_ongoing).toBe(3)
      expect(result[1].total_ongoing).toBe(3)
    })

    it('should not mutate original array', () => {
      const teams = [
        { fullname: 'John', total_ongoing: 1 },
        { fullname: 'Jane', total_ongoing: 3 },
      ]
      const original = [...teams]
      sortTeamsByOngoing(teams)
      
      expect(teams).toEqual(original)
    })
  })

  describe('sortTeamsByName', () => {
    it('should return empty array for null teams', () => {
      const result = sortTeamsByName(null)
      expect(result).toEqual([])
    })

    it('should sort teams alphabetically by fullname', () => {
      const teams = [
        { fullname: 'Charlie' },
        { fullname: 'Alice' },
        { fullname: 'Bob' },
      ]
      const result = sortTeamsByName(teams)
      
      expect(result[0].fullname).toBe('Alice')
      expect(result[1].fullname).toBe('Bob')
      expect(result[2].fullname).toBe('Charlie')
    })

    it('should handle case-insensitive sorting', () => {
      const teams = [
        { fullname: 'charlie' },
        { fullname: 'Alice' },
        { fullname: 'bob' },
      ]
      const result = sortTeamsByName(teams)
      
      expect(result[0].fullname).toBe('Alice')
      expect(result[1].fullname).toBe('bob')
      expect(result[2].fullname).toBe('charlie')
    })

    it('should not mutate original array', () => {
      const teams = [{ fullname: 'Bob' }, { fullname: 'Alice' }]
      const original = [...teams]
      sortTeamsByName(teams)
      
      expect(teams).toEqual(original)
    })
  })

  describe('sortProgramsByProgress', () => {
    it('should return empty array for null programs', () => {
      const result = sortProgramsByProgress(null)
      expect(result).toEqual([])
    })

    it('should sort programs by progress ascending', () => {
      const programs = [
        { name: 'Program 1', progress: 75 },
        { name: 'Program 2', progress: 25 },
        { name: 'Program 3', progress: 50 },
      ]
      const result = sortProgramsByProgress(programs)
      
      expect(result[0].progress).toBe(25)
      expect(result[1].progress).toBe(50)
      expect(result[2].progress).toBe(75)
    })

    it('should handle programs with same progress', () => {
      const programs = [
        { name: 'Program 1', progress: 50 },
        { name: 'Program 2', progress: 50 },
      ]
      const result = sortProgramsByProgress(programs)
      
      expect(result).toHaveLength(2)
      expect(result[0].progress).toBe(50)
      expect(result[1].progress).toBe(50)
    })

    it('should not mutate original array', () => {
      const programs = [
        { name: 'Program 1', progress: 75 },
        { name: 'Program 2', progress: 25 },
      ]
      const original = [...programs]
      sortProgramsByProgress(programs)
      
      expect(programs).toEqual(original)
    })
  })

  describe('paginateData', () => {
    it('should return empty array for null data', () => {
      const result = paginateData(null, 0, 12)
      expect(result).toEqual([])
    })

    it('should return first page of data', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }))
      const result = paginateData(data, 0, 12)
      
      expect(result).toHaveLength(12)
      expect(result[0].id).toBe(1)
      expect(result[11].id).toBe(12)
    })

    it('should return second page of data', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }))
      const result = paginateData(data, 12, 12)
      
      expect(result).toHaveLength(12)
      expect(result[0].id).toBe(13)
      expect(result[11].id).toBe(24)
    })

    it('should return partial page if less data available', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }))
      const result = paginateData(data, 0, 12)
      
      expect(result).toHaveLength(10)
    })

    it('should use default page size of 12', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }))
      const result = paginateData(data, 0)
      
      expect(result).toHaveLength(12)
    })

    it('should handle custom page size', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }))
      const result = paginateData(data, 0, 5)
      
      expect(result).toHaveLength(5)
    })

    it('should return empty array when startIndex is out of bounds', () => {
      const data = [{ id: 1 }, { id: 2 }]
      const result = paginateData(data, 10, 12)
      
      expect(result).toEqual([])
    })
  })
})
