/**
 * Empty State Utils Tests
 * Unit tests for empty state utility functions
 */
import { describe, it, expect, vi } from 'vitest'
import {
  getEmptyStateConfig,
  getContentLibraryEmptyText,
} from '../emptyStateUtils'

describe('emptyStateUtils', () => {
  const mockT = vi.fn((key) => {
    const translations = {
      'feature.feature_cl.empty_state_collection.you_have_no_collection':
        'You have no collection',
      'feature.feature_cl.empty_state_collection.you_have_no_collection_message':
        'Start adding items to your collection',
      'feature.feature_cl.empty_state_collection.you_have_no_collection_only':
        'No collection',
      'feature.feature_cl.empty_state_filt_program.no_programs_found':
        'No programs found',
      'feature.feature_cl.empty_state_filt_program.no_programs_found_message':
        'Try a different filter',
      'feature.feature_cl.empty_state_filt_program.no_programs_found_only':
        'No programs',
      'feature.feature_cl.empty_state_filt_courses.no_courses_found':
        'No courses found',
      'feature.feature_cl.empty_state_filt_courses.no_courses_found_message':
        'Try a different filter',
      'feature.feature_cl.empty_state_filt_courses.no_courses_found_only':
        'No courses',
      'feature.feature_cl.empty_state_filt_module.no_modules_found':
        'No modules found',
      'feature.feature_cl.empty_state_filt_module.no_modules_found_message':
        'Try a different filter',
      'feature.feature_cl.empty_state_filt_module.no_modules_found_only':
        'No modules',
      'feature.feature_cl.empty_state_cl.no_content_available_yet':
        'No content available yet',
    }
    return translations[key] || key
  })

  describe('getEmptyStateConfig', () => {
    it('should return config for allcl filter', () => {
      const config = getEmptyStateConfig('allcl', mockT)
      expect(config).toEqual({
        text: 'You have no collection',
        message: 'Start adding items to your collection',
        emptyOnly: 'No collection',
      })
    })

    it('should return config for programcl filter', () => {
      const config = getEmptyStateConfig('programcl', mockT)
      expect(config).toEqual({
        text: 'No programs found',
        message: 'Try a different filter',
        emptyOnly: 'No programs',
      })
    })

    it('should return config for coursecl filter', () => {
      const config = getEmptyStateConfig('coursecl', mockT)
      expect(config).toEqual({
        text: 'No courses found',
        message: 'Try a different filter',
        emptyOnly: 'No courses',
      })
    })

    it('should return config for modulecl filter', () => {
      const config = getEmptyStateConfig('modulecl', mockT)
      expect(config).toEqual({
        text: 'No modules found',
        message: 'Try a different filter',
        emptyOnly: 'No modules',
      })
    })

    it('should return allcl config for unknown filter', () => {
      const config = getEmptyStateConfig('unknown', mockT)
      expect(config).toEqual({
        text: 'You have no collection',
        message: 'Start adding items to your collection',
        emptyOnly: 'No collection',
      })
    })
  })

  describe('getContentLibraryEmptyText', () => {
    it('should return content library empty text', () => {
      const text = getContentLibraryEmptyText(mockT)
      expect(text).toBe('No content available yet')
    })
  })
})
