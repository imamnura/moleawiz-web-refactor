/**
 * Format number with dot separator (Indonesian format)
 * @param {number|string} value - Number to format
 * @returns {string} Formatted number string
 * @example formatNumberWithDot(1000) // "1.000"
 */
export function formatNumberWithDot(value) {
  if (value === null || value === undefined) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Get user's initial from firstname
 * @param {string} firstname - User's first name
 * @returns {string} First character uppercase
 */
export function getUserInitial(firstname) {
  if (!firstname) return ''
  return Array.from(firstname)[0].toUpperCase()
}

/**
 * Get full name from user object
 * @param {Object} user - User object
 * @returns {string} Full name
 */
export function getFullName(user) {
  if (!user) return ''
  return `${user.firstname || ''} ${user.lastname || ''}`.trim()
}
