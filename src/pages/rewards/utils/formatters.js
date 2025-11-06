import { format, parseISO } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

/**
 * Get date-fns locale object
 */
const getLocale = (locale) => {
  return locale === 'id' ? idLocale : enUS
}

/**
 * Format number with dots as thousand separator
 * @param {number} x - Number to format
 * @returns {string} - Formatted number (e.g., "10.000")
 *
 * Example:
 * formatPoints(10000) // "10.000"
 * formatPoints(500) // "500"
 * formatPoints(null) // ""
 */
export const formatPoints = (x) => {
  if (x !== null && x !== undefined) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  return ''
}

/**
 * Format date for reward history
 * @param {string} date - ISO date string
 * @param {string} locale - 'en' or 'id'
 * @returns {string} - Formatted date (e.g., "25 Dec 2024")
 *
 * Example:
 * formatRewardDate('2024-12-25', 'en') // "25 Dec 2024"
 * formatRewardDate('2024-12-25', 'id') // "25 Des 2024"
 */
export const formatRewardDate = (date, locale = 'en') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = getLocale(locale)
  return format(dateObj, 'dd MMM yyyy', { locale: localeObj })
}

/**
 * Format datetime for reward history
 * @param {string} date - ISO date string
 * @param {string} time - Time string (HH:mm)
 * @param {string} locale - 'en' or 'id'
 * @returns {string} - Formatted datetime (e.g., "25 Dec 2024 14:30")
 *
 * Example:
 * formatRewardDateTime('2024-12-25', '14:30', 'en') // "25 Dec 2024 14:30"
 */
export const formatRewardDateTime = (date, time, locale = 'en') => {
  return `${formatRewardDate(date, locale)} ${time}`
}

/**
 * Convert newlines to \n for pre-wrap display
 * @param {string} text - Text with newlines
 * @returns {string} - Text with \n
 *
 * Example:
 * convertEnter("Line 1\nLine 2") // "Line 1\\nLine 2"
 */
export const convertEnter = (text) => {
  if (!text) return ''
  return text.replace(/(?:\r\n|\r|\n)/g, '\n')
}

/**
 * Calculate points after redeem
 * @param {number} currentBalance - Current points
 * @param {number} redeemPoints - Points to redeem
 * @returns {number} - New balance
 */
export const calculateNewBalance = (currentBalance, redeemPoints) => {
  return parseInt(currentBalance) - parseInt(redeemPoints)
}

/**
 * Check if user has enough points
 * @param {number} currentBalance - Current points
 * @param {number} redeemPoints - Points needed
 * @returns {boolean} - True if enough points
 */
export const hasEnoughPoints = (currentBalance, redeemPoints) => {
  return parseInt(currentBalance) >= parseInt(redeemPoints)
}
