import { useMemo } from 'react'
import { useGetNewProgramsQuery } from '@services/api/homeApi'
import { compareAsc } from 'date-fns'
import { parseDate } from '@utils/dateUtils'

const useActions = () => {
  const {
    data: programsData = [],
    isLoading,
    // isError,
  } = useGetNewProgramsQuery()

  // Filter and sort new journeys
  const newJourneys = useMemo(() => {
    // Filter journeys where no module has been entered yet
    const filtered = programsData.filter((journey) => journey.is_new === 1)

    // Sort by enrollment date (ascending - oldest first)
    return filtered.sort((a, b) => {
      if (!a.enrollment_date || !b.enrollment_date) return 0

      try {
        const dateA = parseDate(a.enrollment_date)
        const dateB = parseDate(b.enrollment_date)
        return compareAsc(dateA, dateB)
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        return 0
      }
    })
  }, [programsData])

  return {
    loading: isLoading,
    newJourneys,
    isEmpty: !isLoading && newJourneys.length === 0,
  }
}

export default useActions
