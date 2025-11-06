/**
 * Collection Utilities
 * Helper functions for collection data processing
 */

/**
 * Check type and return appropriate data based on element
 * @param {string} type - 'journey' | 'course' | 'module'
 * @param {string} element - 'image' | 'type' | 'title' | 'description'
 * @param {object} data - Collection data object
 * @param {Function} t - Translation function
 * @returns {string} Appropriate data based on type and element
 */
export const checkType = (type, element, data, t) => {
  if (type === 'journey') {
    if (element === 'image') return data.thumbnail
    if (element === 'type')
      return (
        t?.('feature.feature_cl.main_collection_card.program_cap') || 'PROGRAM'
      )
    if (element === 'title') return data.name
    if (element === 'description') {
      return data.description !== null && data.description !== ''
        ? data.description
        : '-'
    }
  }

  if (type === 'course') {
    if (element === 'image') return data.thumbnail
    if (element === 'type')
      return (
        t?.('feature.feature_cl.main_collection_card.course_cap') || 'COURSE'
      )
    if (element === 'title') return data.name
    if (element === 'description') {
      return data.description !== null && data.description !== ''
        ? data.description
        : '-'
    }
  }

  if (type === 'module') {
    if (element === 'image') return data.thumbnail
    if (element === 'type')
      return (
        t?.('feature.feature_cl.main_collection_card.module_cap') || 'MODULE'
      )
    if (element === 'title') return data.fullname
    if (element === 'description') {
      return data.description !== null && data.description !== ''
        ? data.description
        : '-'
    }
  }

  return ''
}

/**
 * Get navigation path based on collection type
 * @param {string} type - 'journey' | 'course' | 'module'
 * @param {number} academyId - Academy/Content Library ID
 * @param {number} journeyId - Journey ID
 * @param {number} courseId - Course ID (optional)
 * @param {number} moduleId - Module ID (optional)
 * @returns {string} Navigation path
 */
export const getNavigationPath = (
  type,
  academyId,
  journeyId,
  courseId = null,
  moduleId = null
) => {
  if (type === 'journey') {
    return `/content-library/academy/${academyId}/journey/${journeyId}`
  }

  if (type === 'course') {
    return `/content-library/academy/${academyId}/journey/${journeyId}/course/${courseId}`
  }

  if (type === 'module') {
    return `/content-library/academy/${academyId}/journey/${journeyId}/course/${courseId}/module/${moduleId}`
  }

  return '/'
}

/**
 * Map filter value to API filter parameter
 * @param {string} filter - UI filter value ('allcl' | 'programcl' | 'coursecl' | 'modulecl')
 * @returns {string} API filter value ('all' | 'journey' | 'course' | 'module')
 */
export const mapFilterToAPI = (filter) => {
  const mapping = {
    allcl: 'all',
    programcl: 'journey',
    coursecl: 'course',
    modulecl: 'module',
  }
  return mapping[filter] || 'all'
}

/**
 * Get collection type label key for snackbar message
 * @param {string} type - Collection type
 * @param {Function} t - Translation function
 * @returns {string} Translated type label
 */
export const getCollectionTypeLabel = (type, t) => {
  const labels = {
    module: t('feature.feature_cl.collection_action.module_snack'),
    course: t('feature.feature_cl.collection_action.course_snack'),
    journey: t('feature.feature_cl.collection_action.program_snack'),
  }
  return labels[type] || type
}

/**
 * Get collection item name based on type
 * @param {object} item - Collection item
 * @returns {string} Item name
 */
export const getCollectionItemName = (item) => {
  return item.type === 'module' ? item.fullname : item.name
}
