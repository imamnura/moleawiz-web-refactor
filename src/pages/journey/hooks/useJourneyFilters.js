import { useMemo } from 'react'
import {
  parseISO,
  differenceInDays,
  isAfter,
  isBefore,
  addDays,
} from 'date-fns'

/**
 * Custom hook for filtering and sorting journey data
 * @param {Array} journeyData - Raw journey data
 * @param {boolean} isLoading - Loading state
 * @returns {Object} Filtered journeys and filter function
 */
export const useJourneyFilters = (journeyData = [], isLoading = false) => {
  // Process and enrich journey data with badges and countdown
  const processedJourneys = useMemo(() => {
    if (!journeyData || journeyData.length === 0) return []

    return journeyData.map((journey) => {
      const enrichedJourney = { ...journey }

      // Add "NEW" badge if no course has been started
      if (journey.is_new === 1) {
        enrichedJourney.badge_new = true
      }

      // Calculate days left if end_date exists
      if (
        journey.end_date_format_date &&
        journey.end_date_format_date !== 'Expired' &&
        journey.end_date_format_date !== ''
      ) {
        const today = new Date()
        const endDate = parseISO(journey.end_date_format_date)
        const futureThreshold = addDays(today, 30)

        // Calculate days remaining
        const daysRemaining = differenceInDays(endDate, today)

        // Store range for sorting
        enrichedJourney.range_days = daysRemaining

        // Determine days_left status
        if (isAfter(today, endDate)) {
          // Overdue
          enrichedJourney.days_left = 'overdue'
        } else if (isBefore(endDate, futureThreshold)) {
          // Within 30 days
          enrichedJourney.days_left = daysRemaining
        } else {
          // More than 30 days away
          enrichedJourney.days_left = null
        }
      }

      return enrichedJourney
    })
  }, [journeyData])

  // Sort journeys by priority: overdue > days_left (asc) > no deadline
  const sortJourneys = (journeys) => {
    const overdue = journeys
      .filter((j) => j.days_left === 'overdue')
      .sort((a, b) => (a.range_days || 0) - (b.range_days || 0))

    const withDeadline = journeys
      .filter(
        (j) =>
          j.days_left !== null &&
          j.days_left !== '' &&
          j.days_left !== undefined &&
          j.days_left !== 'overdue'
      )
      .sort((a, b) => a.days_left - b.days_left)

    const noDeadline = journeys
      .filter(
        (j) =>
          j.days_left === null ||
          j.days_left === '' ||
          j.days_left === undefined
      )
      .sort((a, b) => (a.range_days || 0) - (b.range_days || 0))

    return [...overdue, ...withDeadline, ...noDeadline]
  }

  // Categorize journeys
  const categorizedJourneys = useMemo(() => {
    const ongoing = processedJourneys.filter(
      (j) => j.is_new === 0 && j.is_completed === 0
    )

    const newJourneys = processedJourneys.filter(
      (j) => j.is_new === 1 && j.is_completed === 0
    )

    const completed = processedJourneys
      .filter((j) => j.is_new === 0 && j.is_completed === 1)
      .sort((a, b) => {
        if (!a.completed_date || !b.completed_date) return 0
        return (
          parseISO(b.completed_date).getTime() -
          parseISO(a.completed_date).getTime()
        )
      })

    return {
      all: [
        ...sortJourneys(ongoing),
        ...sortJourneys(newJourneys),
        ...completed,
      ],
      ongoing: sortJourneys(ongoing),
      new: sortJourneys(newJourneys),
      finish: completed,
    }
  }, [processedJourneys])

  /**
   * Filter journeys by category
   * @param {string} category - 'all' | 'ongoing' | 'new' | 'finish'
   * @returns {Array} Filtered journeys
   */
  const filterByCategory = (category = 'all') => {
    return categorizedJourneys[category] || categorizedJourneys.all
  }

  return {
    isLoading,
    allJourneys: categorizedJourneys.all,
    filterByCategory,
    categories: categorizedJourneys,
  }
}

export default useJourneyFilters
