import { useMemo } from 'react'
import { useGetExpiringProgramsQuery } from '@services/api/homeApi'
import { getDaysLeft, isWithinDays } from '@utils/dateUtils'

const useActions = () => {
  const { data: programsData = [], isLoading } = useGetExpiringProgramsQuery()

  // Filter and sort expiring journeys
  const expiringJourney = useMemo(() => {
    // Filter: not completed journeys only
    const notCompleted = programsData.filter(
      (journey) => journey.is_completed === 0
    )

    // Filter: within 30 days from now
    const validateRange = notCompleted
      .map((journeyItem) => {
        const endDate = journeyItem.end_date_format_date || journeyItem.end_date

        // Skip if no valid end date or expired
        if (!endDate || endDate === '' || endDate === 'Expired') {
          return null
        }

        try {
          // Check if end date is within the next 30 days (0-29 days from today)
          if (isWithinDays(endDate, 30)) {
            const daysLeft = getDaysLeft(endDate)

            // Only include if days left is positive (not expired)
            if (daysLeft >= 0) {
              return {
                ...journeyItem,
                days_left: daysLeft,
              }
            }
          }
        } catch (error) {
          console.error('Error parsing date:', endDate, error)
        }

        return null
      })
      .filter((item) => item !== null)
      .sort((a, b) => a.days_left - b.days_left) // Sort by closest to expiry

    return validateRange
  }, [programsData])

  return {
    loading: isLoading,
    expiringJourney,
    isEmpty: !isLoading && expiringJourney.length === 0,
  }
}

export default useActions
