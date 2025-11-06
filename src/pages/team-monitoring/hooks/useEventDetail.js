import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLazyGetTeamEventDetailQuery } from '../../../services/api'
import {
  formatDateRange,
  formatTimeRange,
  calculateEventDuration,
} from '../utils/dateFormatters'
import { categorizeMemberStatus } from '../utils/memberUtils'

/**
 * Hook for event detail with member categorization
 * Returns formatted event detail and categorized members
 */
export default function useEventDetail() {
  const { i18n } = useTranslation()
  const [fetchDetail, { data, isLoading, isError, error }] =
    useLazyGetTeamEventDetailQuery()

  // Format event detail and categorize members
  const eventDetail = useMemo(() => {
    if (!data) return null

    const formatted = {
      ...data,
      date_range: formatDateRange(
        data.start_date,
        data.end_date,
        i18n.language
      ),
      time_range: formatTimeRange(data.start_time, data.end_time),
      date_duration: calculateEventDuration(data.start_date, data.end_date),
    }

    return formatted
  }, [data, i18n.language])

  // Categorize members by status
  const categorizedMembers = useMemo(() => {
    if (!data?.members) {
      return {
        confirmed: [],
        notConfirmed: [],
        declined: [],
      }
    }

    return categorizeMemberStatus(data.members)
  }, [data?.members])

  return {
    eventDetail,
    confirmed: categorizedMembers.confirmed,
    notConfirmed: categorizedMembers.notConfirmed,
    declined: categorizedMembers.declined,
    isLoading,
    isError,
    error,
    fetchDetail,
  }
}
