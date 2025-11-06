import {
  format,
  isSameDay,
  isSameMonth,
  isSameYear,
  parseISO,
  differenceInDays,
} from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

/**
 * Get date-fns locale object
 */
const getLocale = (locale) => {
  return locale === 'id' ? idLocale : enUS
}

/**
 * Format date range with smart formatting
 * Same day: "20 March 2024"
 * Same month/year: "20 - 25 March 2024"
 * Different month: "20 March - 5 April 2024"
 * Different year: "20 March 2024 - 5 January 2025"
 */
export const formatDateRange = (startDate, endDate, locale = 'en') => {
  if (!startDate || !endDate) return '-'

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  const localeObj = getLocale(locale)

  // Same day
  if (isSameDay(start, end)) {
    return format(start, 'dd MMMM yyyy', { locale: localeObj })
  }

  // Same month and year
  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return `${format(start, 'dd', { locale: localeObj })} - ${format(end, 'dd MMMM yyyy', { locale: localeObj })}`
  }

  // Same year, different month
  if (isSameYear(start, end)) {
    return `${format(start, 'dd MMMM', { locale: localeObj })} - ${format(end, 'dd MMMM yyyy', { locale: localeObj })}`
  }

  // Different year
  return `${format(start, 'dd MMMM yyyy', { locale: localeObj })} - ${format(end, 'dd MMMM yyyy', { locale: localeObj })}`
}

/**
 * Format time range
 * "14:00 - 16:00"
 */
export const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '-'

  // Parse time strings (HH:mm:ss or HH:mm)
  const parseTime = (timeStr) => {
    if (typeof timeStr === 'string') {
      const parts = timeStr.split(':')
      const date = new Date()
      date.setHours(parseInt(parts[0], 10))
      date.setMinutes(parseInt(parts[1], 10))
      date.setSeconds(parts[2] ? parseInt(parts[2], 10) : 0)
      return date
    }
    return timeStr
  }

  const start = parseTime(startTime)
  const end = parseTime(endTime)

  return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
}

/**
 * Format last access date
 * "20 Mar 2024"
 */
export const formatLastAccess = (date, locale = 'en') => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = getLocale(locale)
  return format(dateObj, 'dd MMM yyyy', { locale: localeObj })
}

/**
 * Calculate days left until end date
 * Returns number of days, "Overdue", or "-"
 * Only shows if within 30 days
 */
export const calculateDaysLeft = (endDate) => {
  if (!endDate) return '-'

  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysLeft = differenceInDays(end, today)

  // If past end date
  if (daysLeft < 0) {
    return 'Overdue'
  }

  // Only show if within 30 days
  if (daysLeft <= 30) {
    return daysLeft
  }

  return '-'
}

/**
 * Calculate event duration in days
 */
export const calculateEventDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate

  return differenceInDays(end, start) + 1 // +1 to include both start and end day
}

/**
 * Check if date is today
 */
export const isToday = (date) => {
  if (!date) return false
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isSameDay(dateObj, new Date())
}

/**
 * Format date for calendar
 * "2024-03-20"
 */
export const formatCalendarDate = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy-MM-dd')
}
