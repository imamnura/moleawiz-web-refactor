import { describe, it, expect } from 'vitest'
import {
  sortByFIFO,
  sortByLIFO,
  sortByName,
  filterByStatus,
  countByStatus,
  processReviewData,
  countReviewDecisions,
  combineUserData,
} from '../../utils/dataProcessing'

describe('dataProcessing.js', () => {
  describe('sortByFIFO', () => {
    it('should sort submissions by oldest first', () => {
      const submissions = [
        { id: 1, submited: '2024-01-03' },
        { id: 2, submited: '2024-01-01' },
        { id: 3, submited: '2024-01-02' },
      ]
      const result = sortByFIFO(submissions)
      expect(result[0].id).toBe(2)
      expect(result[1].id).toBe(3)
      expect(result[2].id).toBe(1)
    })

    it('should return empty array for null input', () => {
      expect(sortByFIFO(null)).toEqual([])
    })

    it('should return empty array for undefined input', () => {
      expect(sortByFIFO(undefined)).toEqual([])
    })

    it('should return empty array for non-array input', () => {
      expect(sortByFIFO('not array')).toEqual([])
    })

    it('should not mutate original array', () => {
      const original = [
        { id: 1, submited: '2024-01-03' },
        { id: 2, submited: '2024-01-01' },
      ]
      const result = sortByFIFO(original)
      expect(original[0].id).toBe(1)
      expect(result[0].id).toBe(2)
    })

    it('should handle Date objects', () => {
      const submissions = [
        { id: 1, submited: new Date('2024-01-03') },
        { id: 2, submited: new Date('2024-01-01') },
      ]
      const result = sortByFIFO(submissions)
      expect(result[0].id).toBe(2)
    })
  })

  describe('sortByLIFO', () => {
    it('should sort submissions by newest first', () => {
      const submissions = [
        { id: 1, submited: '2024-01-01' },
        { id: 2, submited: '2024-01-03' },
        { id: 3, submited: '2024-01-02' },
      ]
      const result = sortByLIFO(submissions)
      expect(result[0].id).toBe(2)
      expect(result[1].id).toBe(3)
      expect(result[2].id).toBe(1)
    })

    it('should return empty array for null input', () => {
      expect(sortByLIFO(null)).toEqual([])
    })

    it('should return empty array for undefined input', () => {
      expect(sortByLIFO(undefined)).toEqual([])
    })

    it('should not mutate original array', () => {
      const original = [
        { id: 1, submited: '2024-01-01' },
        { id: 2, submited: '2024-01-03' },
      ]
      const result = sortByLIFO(original)
      expect(original[0].id).toBe(1)
      expect(result[0].id).toBe(2)
    })
  })

  describe('sortByName', () => {
    it('should sort users alphabetically by fullname', () => {
      const users = [
        { fullname: 'Charlie Brown' },
        { fullname: 'Alice Wonder' },
        { fullname: 'Bob Marley' },
      ]
      const result = sortByName(users)
      expect(result[0].fullname).toBe('Alice Wonder')
      expect(result[1].fullname).toBe('Bob Marley')
      expect(result[2].fullname).toBe('Charlie Brown')
    })

    it('should return empty array for null input', () => {
      expect(sortByName(null)).toEqual([])
    })

    it('should return empty array for undefined input', () => {
      expect(sortByName(undefined)).toEqual([])
    })

    it('should not mutate original array', () => {
      const original = [{ fullname: 'Zoe' }, { fullname: 'Anna' }]
      const result = sortByName(original)
      expect(original[0].fullname).toBe('Zoe')
      expect(result[0].fullname).toBe('Anna')
    })

    it('should handle case-insensitive sorting', () => {
      const users = [{ fullname: 'zoe' }, { fullname: 'Anna' }]
      const result = sortByName(users)
      expect(result[0].fullname).toBe('Anna')
    })
  })

  describe('filterByStatus', () => {
    const submissions = [
      { id: 1, status: null, submited: '2024-01-01' },
      { id: 2, status: 1, submited: '2024-01-03' },
      { id: 3, status: 0, submited: '2024-01-02' },
      { id: 4, status: null, submited: '2024-01-02' },
    ]

    const notSubmitted = [{ fullname: 'John' }, { fullname: 'Alice' }]

    it('should filter and sort need_review by FIFO', () => {
      const result = filterByStatus(submissions, 'need_review')
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1) // Oldest null status
      expect(result[1].id).toBe(4)
    })

    it('should filter and sort approved by LIFO', () => {
      const result = filterByStatus(submissions, 'approved')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(2)
    })

    it('should filter and sort declined by LIFO', () => {
      const result = filterByStatus(submissions, 'decline')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(3)
    })

    it('should return all users sorted correctly for "all" filter', () => {
      const result = filterByStatus(submissions, 'all', notSubmitted)
      // Should be: notSubmitted (sorted by name), needReview (FIFO), declined (LIFO), approved (LIFO)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].fullname).toBe('Alice') // First notSubmitted (sorted)
    })

    it('should return empty array for null submissions', () => {
      expect(filterByStatus(null, 'need_review')).toEqual([])
    })

    it('should return empty array for undefined submissions', () => {
      expect(filterByStatus(undefined, 'approved')).toEqual([])
    })

    it('should default to need_review for unknown status', () => {
      const result = filterByStatus(submissions, 'unknown_status')
      expect(result).toHaveLength(2)
      expect(result.every((s) => s.status === null)).toBe(true)
    })
  })

  describe('countByStatus', () => {
    it('should count submissions by status correctly', () => {
      const submissions = [
        { status: null },
        { status: null },
        { status: 1 },
        { status: 1 },
        { status: 1 },
        { status: 0 },
      ]
      const result = countByStatus(submissions)
      expect(result.needReview).toBe(2)
      expect(result.approved).toBe(3)
      expect(result.declined).toBe(1)
    })

    it('should return zero counts for null submissions', () => {
      const result = countByStatus(null)
      expect(result.needReview).toBe(0)
      expect(result.approved).toBe(0)
      expect(result.declined).toBe(0)
    })

    it('should return zero counts for undefined submissions', () => {
      const result = countByStatus(undefined)
      expect(result.needReview).toBe(0)
      expect(result.approved).toBe(0)
      expect(result.declined).toBe(0)
    })

    it('should return zero counts for empty array', () => {
      const result = countByStatus([])
      expect(result.needReview).toBe(0)
      expect(result.approved).toBe(0)
      expect(result.declined).toBe(0)
    })
  })

  describe('processReviewData', () => {
    it('should add incrementNumber to answers and sort by stage', () => {
      const reviewData = [
        {
          stage: 2,
          answers: [
            { question: 'Q1' },
            { question: 'Q2' },
          ],
        },
        {
          stage: 1,
          answers: [{ question: 'Q3' }],
        },
      ]
      const result = processReviewData(reviewData)
      
      expect(result[0].stage).toBe(1) // Sorted
      expect(result[1].stage).toBe(2)
      expect(result[0].answers[0].incrementNumber).toBe(0)
      expect(result[1].answers[0].incrementNumber).toBe(1)
      expect(result[1].answers[1].incrementNumber).toBe(2)
    })

    it('should return empty array for null input', () => {
      expect(processReviewData(null)).toEqual([])
    })

    it('should return empty array for undefined input', () => {
      expect(processReviewData(undefined)).toEqual([])
    })

    it('should handle stages without answers', () => {
      const reviewData = [{ stage: 1 }]
      const result = processReviewData(reviewData)
      expect(result).toHaveLength(1)
    })

    it('should create a sorted copy of review data', () => {
      const original = [
        {
          stage: 2,
          answers: [{ question: 'Q1' }],
        },
        {
          stage: 1,
          answers: [{ question: 'Q2' }],
        },
      ]
      const result = processReviewData(original)
      // Result should be sorted
      expect(result[0].stage).toBe(1)
      expect(result[1].stage).toBe(2)
      // Should create a new array
      expect(result).not.toBe(original)
    })
  })

  describe('countReviewDecisions', () => {
    it('should count accepted and rejected reviews', () => {
      const reviewData = [
        { review_status: 1 },
        { review_status: 1 },
        { review_status: 0 },
        { review_status: 1 },
        { review_status: 0 },
      ]
      const result = countReviewDecisions(reviewData)
      expect(result.accepted).toBe(3)
      expect(result.rejected).toBe(2)
    })

    it('should ignore null status', () => {
      const reviewData = [
        { review_status: 1 },
        { review_status: null },
        { review_status: 0 },
      ]
      const result = countReviewDecisions(reviewData)
      expect(result.accepted).toBe(1)
      expect(result.rejected).toBe(1)
    })

    it('should return zero counts for null input', () => {
      const result = countReviewDecisions(null)
      expect(result.accepted).toBe(0)
      expect(result.rejected).toBe(0)
    })

    it('should return zero counts for undefined input', () => {
      const result = countReviewDecisions(undefined)
      expect(result.accepted).toBe(0)
      expect(result.rejected).toBe(0)
    })

    it('should return zero counts for empty array', () => {
      const result = countReviewDecisions([])
      expect(result.accepted).toBe(0)
      expect(result.rejected).toBe(0)
    })
  })

  describe('combineUserData', () => {
    it('should combine has_submited and not_submited users', () => {
      const data = {
        has_submited: [{ id: 1 }, { id: 2 }],
        not_submited: [{ id: 3 }],
      }
      const result = combineUserData(data)
      expect(result.hasSubmitted).toHaveLength(2)
      expect(result.notSubmitted).toHaveLength(1)
      expect(result.allUsers).toHaveLength(3)
    })

    it('should handle null data', () => {
      const result = combineUserData(null)
      expect(result.allUsers).toEqual([])
      expect(result.hasSubmitted).toEqual([])
      expect(result.notSubmitted).toEqual([])
    })

    it('should handle undefined data', () => {
      const result = combineUserData(undefined)
      expect(result.allUsers).toEqual([])
      expect(result.hasSubmitted).toEqual([])
      expect(result.notSubmitted).toEqual([])
    })

    it('should handle missing has_submited property', () => {
      const data = { not_submited: [{ id: 1 }] }
      const result = combineUserData(data)
      expect(result.hasSubmitted).toEqual([])
      expect(result.notSubmitted).toHaveLength(1)
    })

    it('should handle missing not_submited property', () => {
      const data = { has_submited: [{ id: 1 }] }
      const result = combineUserData(data)
      expect(result.hasSubmitted).toHaveLength(1)
      expect(result.notSubmitted).toEqual([])
    })

    it('should preserve user data correctly', () => {
      const data = {
        has_submited: [{ id: 1, name: 'User 1' }],
        not_submited: [{ id: 2, name: 'User 2' }],
      }
      const result = combineUserData(data)
      expect(result.allUsers[0].name).toBe('User 1')
      expect(result.allUsers[1].name).toBe('User 2')
    })
  })
})
