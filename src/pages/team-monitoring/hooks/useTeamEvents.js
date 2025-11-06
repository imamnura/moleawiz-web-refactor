import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetEventsListQuery } from '../../../services/api'
import { formatDateRange, formatTimeRange } from '../utils/dateFormatters'

/**
 * Hook for team events list
 * Returns formatted events with date and time ranges
 */
export default function useTeamEvents() {
  const { i18n } = useTranslation()
  const { data, isLoading, isError, error, refetch } = useGetEventsListQuery()

  // Format date and time ranges for each event
  const formattedEvents = useMemo(() => {
    if (!data || data.length === 0) return []

    return data.map((event) => ({
      ...event,
      date_range: formatDateRange(
        event.start_date,
        event.end_date,
        i18n.language
      ),
      time_range: formatTimeRange(event.start_time, event.end_time),
    }))
  }, [data, i18n.language])

  return {
    events: formattedEvents,
    isLoading,
    isError,
    error,
    refetch,
  }
}
