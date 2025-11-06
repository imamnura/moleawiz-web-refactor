import { parseISO, compareDesc } from 'date-fns'

/**
 * Sort certificates by received date (newest first)
 * @param {Array} certificates - Array of certificate objects
 * @returns {Array} Sorted certificates
 */
export function sortCertificates(certificates) {
  if (!certificates || certificates.length === 0) return []

  return [...certificates].sort((a, b) => {
    const dateA =
      typeof (a.recived || a.received) === 'string'
        ? parseISO(a.recived || a.received)
        : a.recived || a.received
    const dateB =
      typeof (b.recived || b.received) === 'string'
        ? parseISO(b.recived || b.received)
        : b.recived || b.received
    return compareDesc(dateA, dateB)
  })
}

/**
 * Filter and sort completed journey
 * @param {Array} journeys - Array of journey objects
 * @returns {Array} Filtered and sorted journeys
 */
export function filterCompletedJourney(journeys) {
  if (!journeys || journeys.length === 0) return []

  return journeys
    .filter((item) => item.is_new === 0 && item.is_completed === 1)
    .sort((a, b) => {
      const dateA =
        typeof a.completed_date === 'string'
          ? parseISO(a.completed_date)
          : a.completed_date
      const dateB =
        typeof b.completed_date === 'string'
          ? parseISO(b.completed_date)
          : b.completed_date
      return compareDesc(dateA, dateB)
    })
}

/**
 * Group certificates by journey
 * @param {Array} certificates - Array of certificate objects
 * @returns {Object} Certificates grouped by journey_id
 */
export function groupCertificatesByJourney(certificates) {
  if (!certificates || certificates.length === 0) return {}

  return certificates.reduce((acc, cert) => {
    const journeyId = cert.journey_id
    if (!acc[journeyId]) {
      acc[journeyId] = []
    }
    acc[journeyId].push(cert)
    return acc
  }, {})
}

/**
 * Calculate total points from achievements
 * @param {Array} achievements - Array of achievement objects
 * @returns {number} Total points
 */
export function calculateTotalPoints(achievements) {
  if (!achievements || achievements.length === 0) return 0

  return achievements.reduce((total, achievement) => {
    return total + (parseInt(achievement.point) || 0)
  }, 0)
}

/**
 * Filter achievements by type
 * @param {Array} achievements - Array of achievement objects
 * @param {string} type - Type to filter by
 * @returns {Array} Filtered achievements
 */
export function filterAchievementsByType(achievements, type) {
  if (!achievements || achievements.length === 0) return []

  return achievements.filter((achievement) => achievement.type === type)
}
