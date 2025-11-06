/**
 * Empty State Utilities
 * Helper functions for empty state messages
 */

/**
 * Get empty state text based on filter
 * @param {string} filter - Current filter ('allcl' | 'programcl' | 'coursecl' | 'modulecl')
 * @param {Function} t - Translation function
 * @returns {object} Empty state configuration { text, message, emptyOnly }
 */
export const getEmptyStateConfig = (filter, t) => {
  const configs = {
    allcl: {
      text: t(
        'feature.feature_cl.empty_state_collection.you_have_no_collection'
      ),
      message: t(
        'feature.feature_cl.empty_state_collection.you_have_no_collection_message'
      ),
      emptyOnly: t(
        'feature.feature_cl.empty_state_collection.you_have_no_collection_only'
      ),
    },
    programcl: {
      text: t('feature.feature_cl.empty_state_filt_program.no_programs_found'),
      message: t(
        'feature.feature_cl.empty_state_filt_program.no_programs_found_message'
      ),
      emptyOnly: t(
        'feature.feature_cl.empty_state_filt_program.no_programs_found_only'
      ),
    },
    coursecl: {
      text: t('feature.feature_cl.empty_state_filt_courses.no_courses_found'),
      message: t(
        'feature.feature_cl.empty_state_filt_courses.no_courses_found_message'
      ),
      emptyOnly: t(
        'feature.feature_cl.empty_state_filt_courses.no_courses_found_only'
      ),
    },
    modulecl: {
      text: t('feature.feature_cl.empty_state_filt_module.no_modules_found'),
      message: t(
        'feature.feature_cl.empty_state_filt_module.no_modules_found_message'
      ),
      emptyOnly: t(
        'feature.feature_cl.empty_state_filt_module.no_modules_found_only'
      ),
    },
  }

  return configs[filter] || configs.allcl
}

/**
 * Get content library empty state text
 * @param {Function} t - Translation function
 * @returns {string} Empty state text
 */
export const getContentLibraryEmptyText = (t) => {
  return t('feature.feature_cl.empty_state_cl.no_content_available_yet')
}
