import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getFormData,
  setFormData,
  clearFormData,
  generateFormKey,
} from '../../utils/localStorage'

describe('localStorage.js', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {}
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString()
      },
      removeItem: (key) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
    }
  })()

  beforeEach(() => {
    global.localStorage = localStorageMock
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('getFormData', () => {
    it('should retrieve and parse form data from localStorage', () => {
      const testData = { field1: 'value1', field2: 'value2' }
      localStorage.setItem('test-key', JSON.stringify(testData))

      const result = getFormData('test-key')
      expect(result).toEqual(testData)
    })

    it('should return null if key does not exist', () => {
      const result = getFormData('non-existent-key')
      expect(result).toBeNull()
    })

    it('should return null for invalid JSON', () => {
      localStorage.setItem('invalid-json', 'not valid json {')
      const result = getFormData('invalid-json')
      expect(result).toBeNull()
    })

    it('should handle empty string', () => {
      localStorage.setItem('empty-key', '')
      const result = getFormData('empty-key')
      expect(result).toBeNull()
    })

    it('should handle nested objects', () => {
      const testData = {
        user: { id: 1, name: 'John' },
        review: { status: 1, notes: 'Good' },
      }
      localStorage.setItem('nested-key', JSON.stringify(testData))

      const result = getFormData('nested-key')
      expect(result).toEqual(testData)
      expect(result.user.name).toBe('John')
    })

    it('should handle arrays', () => {
      const testData = [1, 2, 3, 4, 5]
      localStorage.setItem('array-key', JSON.stringify(testData))

      const result = getFormData('array-key')
      expect(result).toEqual(testData)
    })
  })

  describe('setFormData', () => {
    it('should save form data to localStorage as JSON', () => {
      const testData = { field1: 'value1', field2: 'value2' }
      setFormData('test-key', testData)

      const stored = localStorage.getItem('test-key')
      expect(JSON.parse(stored)).toEqual(testData)
    })

    it('should overwrite existing data', () => {
      const oldData = { field: 'old' }
      const newData = { field: 'new' }

      setFormData('test-key', oldData)
      setFormData('test-key', newData)

      const result = getFormData('test-key')
      expect(result.field).toBe('new')
    })

    it('should handle nested objects', () => {
      const testData = {
        user: { id: 1 },
        review: { stages: [1, 2, 3] },
      }
      setFormData('nested-key', testData)

      const result = getFormData('nested-key')
      expect(result).toEqual(testData)
    })

    it('should handle arrays', () => {
      const testData = ['item1', 'item2', 'item3']
      setFormData('array-key', testData)

      const result = getFormData('array-key')
      expect(result).toEqual(testData)
    })

    it('should handle empty object', () => {
      setFormData('empty-key', {})
      const result = getFormData('empty-key')
      expect(result).toEqual({})
    })

    it('should handle null values in data', () => {
      const testData = { field1: null, field2: 'value' }
      setFormData('null-key', testData)

      const result = getFormData('null-key')
      expect(result.field1).toBeNull()
      expect(result.field2).toBe('value')
    })
  })

  describe('clearFormData', () => {
    it('should remove data from localStorage', () => {
      const testData = { field: 'value' }
      setFormData('test-key', testData)

      expect(getFormData('test-key')).toEqual(testData)

      clearFormData('test-key')
      expect(getFormData('test-key')).toBeNull()
    })

    it('should not throw error if key does not exist', () => {
      expect(() => clearFormData('non-existent-key')).not.toThrow()
    })

    it('should only remove specified key', () => {
      setFormData('key1', { data: '1' })
      setFormData('key2', { data: '2' })

      clearFormData('key1')

      expect(getFormData('key1')).toBeNull()
      expect(getFormData('key2')).toEqual({ data: '2' })
    })
  })

  describe('generateFormKey', () => {
    it('should generate key in format: form_{userId}-{submissionNumber}-{moduleId}', () => {
      const result = generateFormKey(123, 2, 456)
      expect(result).toBe('form_123-2-456')
    })

    it('should handle different userId values', () => {
      const result1 = generateFormKey(1, 1, 1)
      const result2 = generateFormKey(999, 1, 1)

      expect(result1).toBe('form_1-1-1')
      expect(result2).toBe('form_999-1-1')
    })

    it('should handle different submissionNumber values', () => {
      const result1 = generateFormKey(1, 1, 1)
      const result2 = generateFormKey(1, 5, 1)

      expect(result1).toBe('form_1-1-1')
      expect(result2).toBe('form_1-5-1')
    })

    it('should handle different moduleId values', () => {
      const result1 = generateFormKey(1, 1, 100)
      const result2 = generateFormKey(1, 1, 500)

      expect(result1).toBe('form_1-1-100')
      expect(result2).toBe('form_1-1-500')
    })

    it('should create unique keys for different combinations', () => {
      const key1 = generateFormKey(1, 1, 1)
      const key2 = generateFormKey(1, 1, 2)
      const key3 = generateFormKey(1, 2, 1)
      const key4 = generateFormKey(2, 1, 1)

      expect(key1).not.toBe(key2)
      expect(key1).not.toBe(key3)
      expect(key1).not.toBe(key4)
      expect(key2).not.toBe(key3)
      expect(key2).not.toBe(key4)
      expect(key3).not.toBe(key4)
    })

    it('should handle zero values', () => {
      const result = generateFormKey(0, 0, 0)
      expect(result).toBe('form_0-0-0')
    })
  })

  describe('Integration tests', () => {
    it('should save, retrieve, and clear form data in full workflow', () => {
      const userId = 123
      const submissionNumber = 2
      const moduleId = 456
      const formKey = generateFormKey(userId, submissionNumber, moduleId)

      const formData = {
        'feedback-status-1-0': 1,
        'feedback-comment-1-0': 'Good work',
        'overall-feedback-456-123': 'Overall excellent',
      }

      // Save
      setFormData(formKey, formData)

      // Retrieve
      const retrieved = getFormData(formKey)
      expect(retrieved).toEqual(formData)

      // Clear
      clearFormData(formKey)
      expect(getFormData(formKey)).toBeNull()
    })

    it('should handle multiple forms for different users', () => {
      const form1Key = generateFormKey(1, 1, 100)
      const form2Key = generateFormKey(2, 1, 100)

      const formData1 = { field: 'user1 data' }
      const formData2 = { field: 'user2 data' }

      setFormData(form1Key, formData1)
      setFormData(form2Key, formData2)

      expect(getFormData(form1Key).field).toBe('user1 data')
      expect(getFormData(form2Key).field).toBe('user2 data')

      clearFormData(form1Key)
      expect(getFormData(form1Key)).toBeNull()
      expect(getFormData(form2Key).field).toBe('user2 data')
    })
  })
})
