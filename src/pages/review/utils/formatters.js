import { format, parseISO, isAfter } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

/**
 * Get date-fns locale object
 */
const getLocale = (locale) => {
  return locale === 'id' ? idLocale : enUS
}

/**
 * Format date for module review display
 * @param {string} date - Date string to format
 * @param {string} locale - Language locale ('en' or 'id')
 * @returns {string} Formatted date (e.g., "25 Oct 2024")
 */
export const formatModuleDate = (date, locale = 'en') => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = getLocale(locale)
  return format(dateObj, 'dd MMM yyyy', { locale: localeObj })
}

/**
 * Format date and time for submission display
 * @param {string} date - Date string to format
 * @param {string} locale - Language locale ('en' or 'id')
 * @returns {string} Formatted date with time (e.g., "25 Oct 2024  14:30")
 */
export const formatSubmissionDate = (date, locale = 'en') => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = getLocale(locale)
  const dateStr = format(dateObj, 'dd MMM yyyy', { locale: localeObj })
  const timeStr = format(dateObj, 'HH:mm')
  return `${dateStr}  ${timeStr}`
}

/**
 * Convert newline characters to <br> tags for HTML display
 * @param {string} text - Text with newline characters
 * @returns {string} Text with \n replaced by <br>
 */
export const convertEnter = (text) => {
  if (!text) return ''
  return text.replace(/(?:\r\n|\r|\n)/g, '\n')
}

/**
 * Convert URLs in text to clickable links
 * @param {string} text - Text containing URLs
 * @returns {string} HTML string with clickable links
 */
export const convertLink = (text) => {
  if (!text) return ''
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, (url) => {
    return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`
  })
}

/**
 * Convert file URLs to download links with custom filename
 * @param {string} url - File URL
 * @param {string} fileName - Display name for the file
 * @returns {string} HTML string with download link
 */
export const convertFileLink = (url, fileName) => {
  if (!url) return ''
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const lastName = url.substring(url.lastIndexOf('/') + 1)
  const displayName = fileName || lastName
  return url.replace(urlRegex, (fileUrl) => {
    return `<a target="_blank" rel="noopener noreferrer" href="${fileUrl}">${displayName}</a>`
  })
}

/**
 * Get submission number display
 * @param {number|null} submissionNumber - Submission number
 * @returns {string} Formatted submission number (e.g., "#3" or "-")
 */
export const formatSubmissionNumber = (submissionNumber) => {
  if (submissionNumber === null || submissionNumber === undefined) return '-'
  return `#${submissionNumber}`
}

/**
 * Check if module can be deleted (all users submitted & deadline passed)
 * @param {Object} module - Module data
 * @returns {boolean} True if module can be deleted
 */
export const canDeleteModule = (module) => {
  if (!module) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endDate =
    typeof module.deadline === 'string'
      ? parseISO(module.deadline)
      : module.deadline

  // Can delete if all users submitted first submission AND deadline passed
  return module.has_all_users_first_submission === 1 && isAfter(today, endDate)
}
