/**
 * Journey Helper Utilities
 * Pure functions for journey-related calculations
 */

/**
 * Calculate completion percentage
 * @param {number} completed - Number of completed modules
 * @param {number} total - Total number of modules
 * @returns {number} Percentage (0-100)
 */
export const calculateProgress = (completed, total) => {
  if (!total || total === 0) return 0
  return Math.round((completed / total) * 100)
}

/**
 * Get button configuration based on journey state
 * @param {number} isNew - Is new journey (0 or 1)
 * @param {number} isCompleted - Is completed (0 or 1)
 * @returns {Object} Button configuration {text, variant, bg, color, borderColor}
 */
export const getButtonConfig = (isNew, isCompleted, t) => {
  if (isNew === 0 && isCompleted === 1) {
    return {
      text: t?.('feature.feature_mylj.anchor.restart') || 'Restart',
      variant: 'restart',
      bg: '#18B430',
      color: '#FFFFFF',
      borderColor: 'transparent',
      className: 'btn-restart-my-learning-journey',
    }
  }

  if (isNew === 1 && isCompleted === 0) {
    return {
      text: t?.('feature.feature_mylj.anchor.start') || 'Start',
      variant: 'start',
      bg: '#EEF7FF',
      color: '#123FA0',
      borderColor: '#123FA0',
      className: 'btn-start-my-learning-journey',
    }
  }

  return {
    text: t?.('feature.feature_mylj.anchor.continue') || 'Continue',
    variant: 'continue',
    bg: '#123FA0',
    color: '#FFFFFF',
    borderColor: '#123FA0',
    className: 'btn-continue-my-learning-journey',
  }
}

/**
 * Get progress bar color based on completion
 * @param {number} completed - Completed modules
 * @param {number} total - Total modules
 * @returns {string|null} Color hex or null
 */
export const getProgressColor = (completed, total) => {
  if (completed >= total && total > 0) {
    return '#18B430' // Green for completed
  }
  return null // Use default primary color
}

/**
 * Format days left text
 * @param {number|string} daysLeft - Days remaining or 'overdue'
 * @param {function} t - Translation function
 * @returns {string} Formatted text
 */
export const formatDaysLeft = (daysLeft, t) => {
  if (daysLeft === 'overdue') {
    return t?.('feature.feature_mylj.anchor.overdue') || 'Overdue'
  }

  if (typeof daysLeft === 'number') {
    if (daysLeft > 1) {
      return `${daysLeft} ${t?.('feature.feature_mylj.anchor.days_left') || 'days left'}`
    }
    return `${daysLeft} Day left`
  }

  return ''
}

/**
 * Get empty state message
 * @param {string} filterState - Current filter state
 * @returns {string} Empty state message
 */
export const getEmptyStateMessage = (filterState) => {
  const messages = {
    ongoing: 'You have no ongoing programs.',
    new: 'You have no new programs.',
    finish: 'You have not completed any program yet.',
    all: 'No programs available.',
  }

  return messages[filterState] || messages.all
}

/**
 * Count courses in a journey
 * @param {Object} journey - Journey object with course array
 * @returns {Object} {completed, total}
 */
export const countCourses = (journey) => {
  if (!journey || !journey.course || !Array.isArray(journey.course)) {
    return { completed: 0, total: 0 }
  }

  const completed = journey.course.filter((c) => c.is_completed === 1).length
  const total = journey.course.length

  return { completed, total }
}

/**
 * Format course count text
 * @param {number} count - Number of courses
 * @param {function} t - Translation function
 * @returns {string} Formatted text
 */
export const formatCourseCount = (count, t) => {
  if (count > 1) {
    return `${count} ${t?.('feature.feature_mylj.anchor.courses') || 'Courses'}`
  }
  return `${count} ${t?.('feature.feature_mylj.anchor.course') || 'Course'}`
}
