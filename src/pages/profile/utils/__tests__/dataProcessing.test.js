import { describe, it, expect } from 'vitest'
import {
  sortCertificates,
  filterCompletedJourney,
  groupCertificatesByJourney,
  calculateTotalPoints,
  filterAchievementsByType,
} from '../dataProcessing'

describe('dataProcessing', () => {
  describe('sortCertificates', () => {
    it('should sort certificates by date descending (newest first)', () => {
      const certificates = [
        { id: 1, name_certif: 'Old Cert', recived: '2023-01-01' },
        { id: 2, name_certif: 'New Cert', recived: '2024-03-15' },
        { id: 3, name_certif: 'Middle Cert', recived: '2023-06-20' },
      ]

      const sorted = sortCertificates(certificates)

      expect(sorted[0].name_certif).toBe('New Cert')
      expect(sorted[1].name_certif).toBe('Middle Cert')
      expect(sorted[2].name_certif).toBe('Old Cert')
    })

    it('should handle "received" field (correct spelling)', () => {
      const certificates = [
        { id: 1, name_certif: 'Cert A', received: '2023-01-01' },
        { id: 2, name_certif: 'Cert B', received: '2024-03-15' },
      ]

      const sorted = sortCertificates(certificates)

      expect(sorted[0].name_certif).toBe('Cert B')
      expect(sorted[1].name_certif).toBe('Cert A')
    })

    it('should handle "recived" field (typo in API)', () => {
      const certificates = [
        { id: 1, name_certif: 'Cert A', recived: '2023-01-01' },
        { id: 2, name_certif: 'Cert B', recived: '2024-03-15' },
      ]

      const sorted = sortCertificates(certificates)

      expect(sorted[0].name_certif).toBe('Cert B')
      expect(sorted[1].name_certif).toBe('Cert A')
    })

    it('should prioritize "recived" over "received"', () => {
      const certificates = [
        { id: 1, recived: '2024-03-15', received: '2023-01-01' },
        { id: 2, recived: '2023-06-20', received: '2024-01-01' },
      ]

      const sorted = sortCertificates(certificates)

      // Should use "recived" field for sorting
      expect(sorted[0].id).toBe(1)
      expect(sorted[1].id).toBe(2)
    })

    it('should handle Date objects', () => {
      const certificates = [
        { id: 1, recived: new Date('2023-01-01') },
        { id: 2, recived: new Date('2024-03-15') },
      ]

      const sorted = sortCertificates(certificates)

      expect(sorted[0].id).toBe(2)
      expect(sorted[1].id).toBe(1)
    })

    it('should handle mixed Date objects and strings', () => {
      const certificates = [
        { id: 1, recived: '2023-01-01' },
        { id: 2, recived: new Date('2024-03-15') },
      ]

      const sorted = sortCertificates(certificates)

      expect(sorted[0].id).toBe(2)
      expect(sorted[1].id).toBe(1)
    })

    it('should return empty array for null input', () => {
      const sorted = sortCertificates(null)
      expect(sorted).toEqual([])
    })

    it('should return empty array for undefined input', () => {
      const sorted = sortCertificates(undefined)
      expect(sorted).toEqual([])
    })

    it('should return empty array for empty array input', () => {
      const sorted = sortCertificates([])
      expect(sorted).toEqual([])
    })

    it('should handle single certificate', () => {
      const certificates = [{ id: 1, recived: '2024-03-15' }]
      const sorted = sortCertificates(certificates)
      expect(sorted).toHaveLength(1)
      expect(sorted[0].id).toBe(1)
    })

    it('should handle certificates with same date', () => {
      const certificates = [
        { id: 1, recived: '2024-03-15' },
        { id: 2, recived: '2024-03-15' },
        { id: 3, recived: '2024-03-15' },
      ]

      const sorted = sortCertificates(certificates)
      expect(sorted).toHaveLength(3)
    })

    it('should handle certificates with missing date fields', () => {
      const certificates = [
        { id: 1, recived: '2024-03-15' },
        { id: 2 }, // no date field
        { id: 3, recived: '2024-01-01' },
      ]

      const sorted = sortCertificates(certificates)
      expect(sorted).toHaveLength(3)
    })

    it('should not mutate original array', () => {
      const certificates = [
        { id: 1, recived: '2023-01-01' },
        { id: 2, recived: '2024-03-15' },
      ]

      const original = [...certificates]
      sortCertificates(certificates)

      expect(certificates).toEqual(original)
    })
  })

  describe('filterCompletedJourney', () => {
    it('should filter journeys where is_new === 0 and is_completed === 1', () => {
      const journeys = [
        { id: 1, name: 'Completed Journey', is_new: 0, is_completed: 1 },
        { id: 2, name: 'New Journey', is_new: 1, is_completed: 1 },
        { id: 3, name: 'Incomplete Journey', is_new: 0, is_completed: 0 },
        { id: 4, name: 'Another Completed', is_new: 0, is_completed: 1 },
      ]

      const filtered = filterCompletedJourney(journeys)

      expect(filtered).toHaveLength(2)
      expect(filtered[0].name).toBe('Completed Journey')
      expect(filtered[1].name).toBe('Another Completed')
    })

    it('should sort by completed_date descending', () => {
      const journeys = [
        { id: 1, is_new: 0, is_completed: 1, completed_date: '2023-01-01' },
        { id: 2, is_new: 0, is_completed: 1, completed_date: '2024-03-15' },
        { id: 3, is_new: 0, is_completed: 1, completed_date: '2023-06-20' },
      ]

      const filtered = filterCompletedJourney(journeys)

      expect(filtered[0].id).toBe(2)
      expect(filtered[1].id).toBe(3)
      expect(filtered[2].id).toBe(1)
    })

    it('should filter out new journeys (is_new === 1)', () => {
      const journeys = [
        { id: 1, is_new: 1, is_completed: 1 },
        { id: 2, is_new: 0, is_completed: 1 },
      ]

      const filtered = filterCompletedJourney(journeys)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe(2)
    })

    it('should filter out incomplete journeys (is_completed === 0)', () => {
      const journeys = [
        { id: 1, is_new: 0, is_completed: 0 },
        { id: 2, is_new: 0, is_completed: 1 },
      ]

      const filtered = filterCompletedJourney(journeys)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe(2)
    })

    it('should return empty array for null input', () => {
      const filtered = filterCompletedJourney(null)
      expect(filtered).toEqual([])
    })

    it('should return empty array for undefined input', () => {
      const filtered = filterCompletedJourney(undefined)
      expect(filtered).toEqual([])
    })

    it('should return empty array for empty array input', () => {
      const filtered = filterCompletedJourney([])
      expect(filtered).toEqual([])
    })

    it('should handle journeys with missing fields', () => {
      const journeys = [
        { id: 1, is_new: 0, is_completed: 1 },
        { id: 2 }, // missing is_new and is_completed
        { id: 3, is_completed: 1 }, // missing is_new
      ]

      const filtered = filterCompletedJourney(journeys)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe(1)
    })

    it('should handle Date objects in completed_date', () => {
      const journeys = [
        {
          id: 1,
          is_new: 0,
          is_completed: 1,
          completed_date: new Date('2023-01-01'),
        },
        {
          id: 2,
          is_new: 0,
          is_completed: 1,
          completed_date: new Date('2024-03-15'),
        },
      ]

      const filtered = filterCompletedJourney(journeys)

      expect(filtered[0].id).toBe(2)
      expect(filtered[1].id).toBe(1)
    })

    it('should handle string "0" and "1" values', () => {
      const journeys = [
        { id: 1, is_new: '0', is_completed: '1' },
        { id: 2, is_new: '1', is_completed: '1' },
      ]

      const filtered = filterCompletedJourney(journeys)

      // Strict equality check: '0' !== 0, so this should return empty
      expect(filtered).toHaveLength(0)
    })

    it('should not mutate original array', () => {
      const journeys = [
        { id: 1, is_new: 0, is_completed: 1 },
        { id: 2, is_new: 1, is_completed: 1 },
      ]

      const original = [...journeys]
      filterCompletedJourney(journeys)

      expect(journeys).toEqual(original)
    })
  })

  describe('groupCertificatesByJourney', () => {
    it('should group certificates by journey_id', () => {
      const certificates = [
        { id: 1, name: 'Cert 1', journey_id: 'journey-a' },
        { id: 2, name: 'Cert 2', journey_id: 'journey-b' },
        { id: 3, name: 'Cert 3', journey_id: 'journey-a' },
      ]

      const grouped = groupCertificatesByJourney(certificates)

      expect(grouped['journey-a']).toHaveLength(2)
      expect(grouped['journey-b']).toHaveLength(1)
    })

    it('should return empty object for null input', () => {
      const grouped = groupCertificatesByJourney(null)
      expect(grouped).toEqual({})
    })

    it('should return empty object for undefined input', () => {
      const grouped = groupCertificatesByJourney(undefined)
      expect(grouped).toEqual({})
    })

    it('should return empty object for empty array', () => {
      const grouped = groupCertificatesByJourney([])
      expect(grouped).toEqual({})
    })

    it('should handle single certificate', () => {
      const certificates = [{ id: 1, journey_id: 'journey-a' }]

      const grouped = groupCertificatesByJourney(certificates)

      expect(Object.keys(grouped)).toHaveLength(1)
      expect(grouped['journey-a']).toHaveLength(1)
    })

    it('should handle certificates with same journey_id', () => {
      const certificates = [
        { id: 1, journey_id: 'journey-a' },
        { id: 2, journey_id: 'journey-a' },
        { id: 3, journey_id: 'journey-a' },
      ]

      const grouped = groupCertificatesByJourney(certificates)

      expect(Object.keys(grouped)).toHaveLength(1)
      expect(grouped['journey-a']).toHaveLength(3)
    })

    it('should handle certificates with missing journey_id', () => {
      const certificates = [
        { id: 1, journey_id: 'journey-a' },
        { id: 2 }, // no journey_id
        { id: 3, journey_id: 'journey-b' },
      ]

      const grouped = groupCertificatesByJourney(certificates)

      expect(grouped['journey-a']).toHaveLength(1)
      expect(grouped['journey-b']).toHaveLength(1)
      expect(grouped['undefined']).toHaveLength(1)
    })

    it('should handle numeric journey_id', () => {
      const certificates = [
        { id: 1, journey_id: 123 },
        { id: 2, journey_id: 456 },
        { id: 3, journey_id: 123 },
      ]

      const grouped = groupCertificatesByJourney(certificates)

      expect(grouped['123']).toHaveLength(2)
      expect(grouped['456']).toHaveLength(1)
    })

    it('should preserve certificate data in grouped result', () => {
      const certificates = [
        { id: 1, name: 'Cert A', journey_id: 'journey-1' },
        { id: 2, name: 'Cert B', journey_id: 'journey-1' },
      ]

      const grouped = groupCertificatesByJourney(certificates)

      expect(grouped['journey-1'][0].name).toBe('Cert A')
      expect(grouped['journey-1'][1].name).toBe('Cert B')
    })
  })

  describe('calculateTotalPoints', () => {
    it('should sum points from all achievements', () => {
      const achievements = [
        { id: 1, name: 'Badge 1', point: 10 },
        { id: 2, name: 'Badge 2', point: 20 },
        { id: 3, name: 'Badge 3', point: 30 },
      ]

      const total = calculateTotalPoints(achievements)
      expect(total).toBe(60)
    })

    it('should handle string points', () => {
      const achievements = [
        { id: 1, point: '10' },
        { id: 2, point: '20' },
      ]

      const total = calculateTotalPoints(achievements)
      expect(total).toBe(30)
    })

    it('should return 0 for null input', () => {
      const total = calculateTotalPoints(null)
      expect(total).toBe(0)
    })

    it('should return 0 for undefined input', () => {
      const total = calculateTotalPoints(undefined)
      expect(total).toBe(0)
    })

    it('should return 0 for empty array', () => {
      const total = calculateTotalPoints([])
      expect(total).toBe(0)
    })

    it('should handle achievements with missing point field', () => {
      const achievements = [
        { id: 1, point: 10 },
        { id: 2 }, // no point field
        { id: 3, point: 20 },
      ]

      const total = calculateTotalPoints(achievements)
      expect(total).toBe(30)
    })

    it('should handle achievements with 0 points', () => {
      const achievements = [
        { id: 1, point: 0 },
        { id: 2, point: 10 },
      ]

      const total = calculateTotalPoints(achievements)
      expect(total).toBe(10)
    })

    it('should handle achievements with negative points', () => {
      const achievements = [
        { id: 1, point: -10 },
        { id: 2, point: 30 },
      ]

      const total = calculateTotalPoints(achievements)
      expect(total).toBe(20)
    })

    it('should handle achievements with decimal points', () => {
      const achievements = [
        { id: 1, point: 10.5 },
        { id: 2, point: 20.7 },
      ]

      // Note: Function uses parseInt which truncates decimals
      const total = calculateTotalPoints(achievements)
      expect(total).toBe(30) // 10 + 20 (decimals truncated)
    })

    it('should handle achievements with null points', () => {
      const achievements = [
        { id: 1, point: 10 },
        { id: 2, point: null },
        { id: 3, point: 20 },
      ]

      const total = calculateTotalPoints(achievements)
      expect(total).toBe(30)
    })

    it('should handle achievements with undefined points', () => {
      const achievements = [
        { id: 1, point: 10 },
        { id: 2, point: undefined },
        { id: 3, point: 20 },
      ]

      const total = calculateTotalPoints(achievements)
      expect(total).toBe(30)
    })

    it('should handle large numbers', () => {
      const achievements = [
        { id: 1, point: 1000000 },
        { id: 2, point: 2000000 },
      ]

      const total = calculateTotalPoints(achievements)
      expect(total).toBe(3000000)
    })
  })

  describe('filterAchievementsByType', () => {
    it('should filter achievements by type', () => {
      const achievements = [
        { id: 1, name: 'Gold Badge', type: 'gold' },
        { id: 2, name: 'Silver Badge', type: 'silver' },
        { id: 3, name: 'Another Gold', type: 'gold' },
      ]

      const filtered = filterAchievementsByType(achievements, 'gold')

      expect(filtered).toHaveLength(2)
      expect(filtered[0].name).toBe('Gold Badge')
      expect(filtered[1].name).toBe('Another Gold')
    })

    it('should return empty array when no matches', () => {
      const achievements = [
        { id: 1, type: 'gold' },
        { id: 2, type: 'silver' },
      ]

      const filtered = filterAchievementsByType(achievements, 'bronze')
      expect(filtered).toEqual([])
    })

    it('should return empty array for null input', () => {
      const filtered = filterAchievementsByType(null, 'gold')
      expect(filtered).toEqual([])
    })

    it('should return empty array for undefined input', () => {
      const filtered = filterAchievementsByType(undefined, 'gold')
      expect(filtered).toEqual([])
    })

    it('should return empty array for empty array input', () => {
      const filtered = filterAchievementsByType([], 'gold')
      expect(filtered).toEqual([])
    })

    it('should handle case-sensitive type matching', () => {
      const achievements = [
        { id: 1, type: 'Gold' },
        { id: 2, type: 'gold' },
      ]

      const filtered = filterAchievementsByType(achievements, 'gold')

      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe(2)
    })

    it('should handle achievements with missing type field', () => {
      const achievements = [
        { id: 1, type: 'gold' },
        { id: 2 }, // no type field
        { id: 3, type: 'gold' },
      ]

      const filtered = filterAchievementsByType(achievements, 'gold')

      expect(filtered).toHaveLength(2)
    })

    it('should handle numeric types', () => {
      const achievements = [
        { id: 1, type: 1 },
        { id: 2, type: 2 },
        { id: 3, type: 1 },
      ]

      const filtered = filterAchievementsByType(achievements, 1)

      expect(filtered).toHaveLength(2)
    })

    it('should not mutate original array', () => {
      const achievements = [
        { id: 1, type: 'gold' },
        { id: 2, type: 'silver' },
      ]

      const original = [...achievements]
      filterAchievementsByType(achievements, 'gold')

      expect(achievements).toEqual(original)
    })

    it('should preserve all achievement data', () => {
      const achievements = [{ id: 1, name: 'Badge', type: 'gold', points: 100 }]

      const filtered = filterAchievementsByType(achievements, 'gold')

      expect(filtered[0]).toEqual(achievements[0])
    })
  })

  describe('Edge Cases and Integration', () => {
    it('should handle all functions with null input', () => {
      expect(sortCertificates(null)).toEqual([])
      expect(filterCompletedJourney(null)).toEqual([])
      expect(groupCertificatesByJourney(null)).toEqual({})
      expect(calculateTotalPoints(null)).toBe(0)
      expect(filterAchievementsByType(null, 'gold')).toEqual([])
    })

    it('should handle all functions with undefined input', () => {
      expect(sortCertificates(undefined)).toEqual([])
      expect(filterCompletedJourney(undefined)).toEqual([])
      expect(groupCertificatesByJourney(undefined)).toEqual({})
      expect(calculateTotalPoints(undefined)).toBe(0)
      expect(filterAchievementsByType(undefined, 'gold')).toEqual([])
    })

    it('should handle all functions with empty array input', () => {
      expect(sortCertificates([])).toEqual([])
      expect(filterCompletedJourney([])).toEqual([])
      expect(groupCertificatesByJourney([])).toEqual({})
      expect(calculateTotalPoints([])).toBe(0)
      expect(filterAchievementsByType([], 'gold')).toEqual([])
    })

    it('should work in combination for real-world scenario', () => {
      const certificates = [
        { id: 1, recived: '2023-01-01', journey_id: 'journey-a' },
        { id: 2, recived: '2024-03-15', journey_id: 'journey-b' },
        { id: 3, recived: '2023-06-20', journey_id: 'journey-a' },
      ]

      const sorted = sortCertificates(certificates)
      const grouped = groupCertificatesByJourney(sorted)

      expect(sorted[0].id).toBe(2)
      expect(grouped['journey-a']).toHaveLength(2)
      expect(grouped['journey-b']).toHaveLength(1)
    })
  })
})
