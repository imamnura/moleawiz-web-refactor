import {
  format,
  formatDistance,
  // formatRelative,
  parseISO,
  isValid,
  addDays,
  subDays,
  differenceInDays,
  differenceInHours,
  // differenceInMinutes,
  // startOfDay,
  // endOfDay,
  // isAfter,
  isBefore,
  // isSameDay,
} from 'date-fns'
import { id as localeID, enUS as localeEN } from 'date-fns/locale'

/**
 * Get locale object for date-fns based on language code
 * @param {string} lang - Language code ('en' or 'id')
 * @returns {Object} date-fns locale object
 */
export const getLocale = (lang = 'id') => {
  return lang === 'en' ? localeEN : localeID
}

/**
 * Format date to specific pattern
 * @param {Date|string} date - Date to format
 * @param {string} pattern - Format pattern (e.g., 'dd MMM yyyy')
 * @param {string} lang - Language code
 * @returns {string} Formatted date
 */
export const formatDate = (date, pattern = 'dd MMM yyyy', lang = 'id') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''

  return format(dateObj, pattern, { locale: getLocale(lang) })
}

/**
 * Format date with time
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string} e.g., "30 Oct 2025, 14:30"
 */
export const formatDateTime = (date, lang = 'id') => {
  return formatDate(date, 'dd MMM yyyy, HH:mm', lang)
}

/**
 * Format date for display in cards
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string} e.g., "30 Oktober 2025"
 */
export const formatCardDate = (date, lang = 'id') => {
  return formatDate(date, 'dd MMMM yyyy', lang)
}

/**
 * Format date in short format
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string} e.g., "30/10/2025"
 */
export const formatShortDate = (date, lang = 'id') => {
  return formatDate(date, 'dd/MM/yyyy', lang)
}

/**
 * Get relative time from now
 * @param {Date|string} date
 * @param {string} lang
 * @returns {string} e.g., "2 days ago"
 */
export const getRelativeTime = (date, lang = 'id') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''

  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: getLocale(lang),
  })
}

/**
 * Get days left until date
 * @param {Date|string} date
 * @returns {number} Days remaining (negative if past)
 */
export const getDaysLeft = (date) => {
  if (!date) return 0
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return 0

  return differenceInDays(dateObj, new Date())
}

/**
 * Get hours left until date
 * @param {Date|string} date
 * @returns {number} Hours remaining
 */
export const getHoursLeft = (date) => {
  if (!date) return 0
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return 0

  return differenceInHours(dateObj, new Date())
}

/**
 * Check if date is expired
 * @param {Date|string} date
 * @returns {boolean} True if date is in the past
 */
export const isExpired = (date) => {
  if (!date) return false
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return false

  return isBefore(dateObj, new Date())
}

/**
 * Check if date is within X days
 * @param {Date|string} date
 * @param {number} days
 * @returns {boolean}
 */
export const isWithinDays = (date, days) => {
  const daysLeft = getDaysLeft(date)
  return daysLeft >= 0 && daysLeft <= days
}

/**
 * Format date range
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @param {string} lang
 * @returns {string} e.g., "30 Oct - 5 Nov 2025"
 */
export const formatDateRange = (startDate, endDate, lang = 'id') => {
  if (!startDate || !endDate) return ''

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate

  if (!isValid(start) || !isValid(end)) return ''

  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${format(start, 'd', { locale: getLocale(lang) })} - ${formatDate(end, 'd MMM yyyy', lang)}`
  } else if (sameYear) {
    return `${formatDate(start, 'd MMM', lang)} - ${formatDate(end, 'd MMM yyyy', lang)}`
  } else {
    return `${formatDate(start, 'd MMM yyyy', lang)} - ${formatDate(end, 'd MMM yyyy', lang)}`
  }
}

/**
 * Format time range (e.g., "09:00 - 17:00")
 * @param {string} startTime - Start time string (HH:mm:ss or HH:mm)
 * @param {string} endTime - End time string (HH:mm:ss or HH:mm)
 * @param {string} fallback - Fallback value if invalid
 * @returns {string}
 */
export const formatTimeRange = (startTime, endTime, fallback = '-') => {
  if (!startTime || !endTime || startTime === '' || endTime === '') {
    return fallback
  }

  try {
    // Extract HH:mm from time strings (handles HH:mm:ss format too)
    const startParts = startTime.split(':')
    const endParts = endTime.split(':')

    if (startParts.length < 2 || endParts.length < 2) {
      return fallback
    }

    const startFormatted = `${startParts[0]}:${startParts[1]}`
    const endFormatted = `${endParts[0]}:${endParts[1]}`

    return `${startFormatted} - ${endFormatted}`
  } catch (error) {
    console.error('Error formatting time range:', error)
    return fallback
  }
}

/**
 * Parse ISO string to Date
 * @param {string} dateString
 * @returns {Date|null}
 */
export const parseDate = (dateString) => {
  if (!dateString) return null
  const date = parseISO(dateString)
  return isValid(date) ? date : null
}

/**
 * Add days to date
 * @param {Date|string} date
 * @param {number} days
 * @returns {Date}
 */
export const addDaysToDate = (date, days) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return addDays(dateObj, days)
}

/**
 * Subtract days from date
 * @param {Date|string} date
 * @param {number} days
 * @returns {Date}
 */
export const subtractDaysFromDate = (date, days) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return subDays(dateObj, days)
}

/**
 * Get number of days between two dates
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {number}
 */
export const getDaysBetween = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate

  if (!isValid(start) || !isValid(end)) return 0

  return Math.abs(differenceInDays(end, start))
}

/**
 * Format duration in minutes to human readable format
 * @param {number} minutes - Duration in minutes
 * @param {string} lang - Language code
 * @returns {string} e.g., "2 jam 30 menit" or "2 hours 30 minutes"
 */
export const formatDuration = (minutes, lang = 'id') => {
  if (!minutes || minutes <= 0) return '-'

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (lang === 'id') {
    if (hours > 0 && mins > 0) {
      return `${hours} jam ${mins} menit`
    } else if (hours > 0) {
      return `${hours} jam`
    } else {
      return `${mins} menit`
    }
  } else {
    if (hours > 0 && mins > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`
    } else {
      return `${mins} minute${mins > 1 ? 's' : ''}`
    }
  }
}

export default {
  formatDate,
  formatDateTime,
  formatCardDate,
  formatShortDate,
  getRelativeTime,
  getDaysLeft,
  getHoursLeft,
  isExpired,
  isWithinDays,
  formatDateRange,
  formatTimeRange,
  parseDate,
  addDaysToDate,
  subtractDaysFromDate,
  getDaysBetween,
  formatDuration,
  getLocale,
}
