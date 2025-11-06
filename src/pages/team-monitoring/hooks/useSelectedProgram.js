import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetSelectedProgramQuery } from '../../../services/api'
import { formatLastAccess, calculateDaysLeft } from '../utils/dateFormatters'
import { sortProgramMembers } from '../utils/sortingUtils'

/**
 * Hook for selected program members
 * Returns sorted and formatted program members
 */
export default function useSelectedProgram(journeyId, status = 'allprogress') {
  const { i18n } = useTranslation()
  const { data, isLoading, isError, error, refetch } =
    useGetSelectedProgramQuery({ journeyId, status }, { skip: !journeyId })

  // Format and sort members
  const members = useMemo(() => {
    if (!data || data.length === 0) return []

    // Format dates and calculate days left
    const formatted = data.map((member) => ({
      ...member,
      last_access: formatLastAccess(member.last_access, i18n.language),
      days_left: calculateDaysLeft(member.end_date),
    }))

    // Sort: incomplete first (by progress), then complete (alphabetically)
    return sortProgramMembers(formatted)
  }, [data, i18n.language])

  return {
    members,
    isLoading,
    isError,
    error,
    refetch,
  }
}
