import { format, parseISO } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

/**
 * Get date-fns locale object
 */
const getLocale = (locale) => {
  return locale === 'id' ? idLocale : enUS
}

/**
 * Format date for profile display
 * @param {string} date - Date string
 * @param {string} locale - Locale ('en' or 'id')
 * @param {string} formatStr - Format string (default: 'dd MMMM yyyy')
 * @returns {string} Formatted date
 */
export function formatProfileDate(
  date,
  locale = 'id',
  formatStr = 'dd MMMM yyyy'
) {
  if (!date) return '-'

  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = getLocale(locale)
  return format(dateObj, formatStr, { locale: localeObj })
}

/**
 * Get user initial from firstname
 * @param {string} firstname - User's first name
 * @returns {string} First letter uppercased
 */
export function getUserInitial(firstname) {
  if (!firstname) return '?'
  return Array.from(firstname)[0].toUpperCase()
}

/**
 * Get full name from user object
 * @param {object} user - User object with firstname and lastname
 * @returns {string} Full name
 */
export function getFullName(user) {
  if (!user) return ''

  const { firstname, lastname } = user

  if (firstname && lastname) {
    return `${firstname} ${lastname}`
  }

  return firstname || lastname || ''
}

/**
 * Format empty value with fallback
 * @param {any} value - Value to check
 * @param {string} fallback - Fallback value (default: '-')
 * @returns {string} Value or fallback
 */
export function formatEmptyValue(value, fallback = '-') {
  if (value === null || value === undefined || value === '') {
    return fallback
  }
  return value
}
