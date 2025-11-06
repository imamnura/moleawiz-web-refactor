/**
 * Collection Utils Tests
 * Unit tests for collection utility functions
 */
import { describe, it, expect, vi } from 'vitest'
import {
  checkType,
  getNavigationPath,
  mapFilterToAPI,
  getCollectionTypeLabel,
  getCollectionItemName,
} from '../collectionUtils'

describe('collectionUtils', () => {
  const mockT = vi.fn((key) => {
    const translations = {
      'feature.feature_cl.main_collection_card.program_cap': 'PROGRAM',
      'feature.feature_cl.main_collection_card.course_cap': 'COURSE',
      'feature.feature_cl.main_collection_card.module_cap': 'MODULE',
      'feature.feature_cl.collection_action.module_snack': 'Module',
      'feature.feature_cl.collection_action.course_snack': 'Course',
      'feature.feature_cl.collection_action.program_snack': 'Program',
    }
    return translations[key] || key
  })

  describe('checkType', () => {
    it('should return correct journey image', () => {
      const data = { thumbnail: '/journey.jpg' }
      expect(checkType('journey', 'image', data, mockT)).toBe('/journey.jpg')
    })

    it('should return correct journey type label', () => {
      const data = {}
      expect(checkType('journey', 'type', data, mockT)).toBe('PROGRAM')
    })

    it('should return correct journey title', () => {
      const data = { name: 'Journey Title' }
      expect(checkType('journey', 'title', data, mockT)).toBe('Journey Title')
    })

    it('should return journey description or dash', () => {
      const dataWithDesc = { description: 'Test description' }
      expect(checkType('journey', 'description', dataWithDesc, mockT)).toBe(
        'Test description'
      )

      const dataEmpty = { description: '' }
      expect(checkType('journey', 'description', dataEmpty, mockT)).toBe('-')

      const dataNull = { description: null }
      expect(checkType('journey', 'description', dataNull, mockT)).toBe('-')
    })

    it('should return correct course data', () => {
      const data = {
        thumbnail: '/course.jpg',
        name: 'Course Title',
        description: 'Course desc',
      }
      expect(checkType('course', 'image', data, mockT)).toBe('/course.jpg')
      expect(checkType('course', 'type', data, mockT)).toBe('COURSE')
      expect(checkType('course', 'title', data, mockT)).toBe('Course Title')
      expect(checkType('course', 'description', data, mockT)).toBe(
        'Course desc'
      )
    })

    it('should return correct module data', () => {
      const data = {
        thumbnail: '/module.jpg',
        fullname: 'Module Full Name',
        description: 'Module desc',
      }
      expect(checkType('module', 'image', data, mockT)).toBe('/module.jpg')
      expect(checkType('module', 'type', data, mockT)).toBe('MODULE')
      expect(checkType('module', 'title', data, mockT)).toBe('Module Full Name')
      expect(checkType('module', 'description', data, mockT)).toBe(
        'Module desc'
      )
    })

    it('should return empty string for unknown type or element', () => {
      expect(checkType('unknown', 'image', {}, mockT)).toBe('')
      expect(checkType('journey', 'unknown', {}, mockT)).toBe('')
    })
  })

  describe('getNavigationPath', () => {
    it('should return journey path', () => {
      const path = getNavigationPath('journey', 1, 2)
      expect(path).toBe('/content-library/academy/1/journey/2')
    })

    it('should return course path', () => {
      const path = getNavigationPath('course', 1, 2, 3)
      expect(path).toBe('/content-library/academy/1/journey/2/course/3')
    })

    it('should return module path', () => {
      const path = getNavigationPath('module', 1, 2, 3, 4)
      expect(path).toBe(
        '/content-library/academy/1/journey/2/course/3/module/4'
      )
    })

    it('should return root path for unknown type', () => {
      const path = getNavigationPath('unknown', 1, 2)
      expect(path).toBe('/')
    })
  })

  describe('mapFilterToAPI', () => {
    it('should map allcl to all', () => {
      expect(mapFilterToAPI('allcl')).toBe('all')
    })

    it('should map programcl to journey', () => {
      expect(mapFilterToAPI('programcl')).toBe('journey')
    })

    it('should map coursecl to course', () => {
      expect(mapFilterToAPI('coursecl')).toBe('course')
    })

    it('should map modulecl to module', () => {
      expect(mapFilterToAPI('modulecl')).toBe('module')
    })

    it('should return all for unknown filter', () => {
      expect(mapFilterToAPI('unknown')).toBe('all')
    })
  })

  describe('getCollectionTypeLabel', () => {
    it('should return correct label for module', () => {
      expect(getCollectionTypeLabel('module', mockT)).toBe('Module')
    })

    it('should return correct label for course', () => {
      expect(getCollectionTypeLabel('course', mockT)).toBe('Course')
    })

    it('should return correct label for journey', () => {
      expect(getCollectionTypeLabel('journey', mockT)).toBe('Program')
    })

    it('should return type itself for unknown type', () => {
      expect(getCollectionTypeLabel('unknown', mockT)).toBe('unknown')
    })
  })

  describe('getCollectionItemName', () => {
    it('should return fullname for module', () => {
      const item = {
        type: 'module',
        fullname: 'Module Full Name',
        name: 'Module',
      }
      expect(getCollectionItemName(item)).toBe('Module Full Name')
    })

    it('should return name for course', () => {
      const item = { type: 'course', name: 'Course Name' }
      expect(getCollectionItemName(item)).toBe('Course Name')
    })

    it('should return name for journey', () => {
      const item = { type: 'journey', name: 'Journey Name' }
      expect(getCollectionItemName(item)).toBe('Journey Name')
    })
  })
})
