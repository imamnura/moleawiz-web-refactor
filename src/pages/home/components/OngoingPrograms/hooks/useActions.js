import { useMemo } from 'react'
import { useGetOngoingProgramsQuery, useGetAllJourneyDataQuery } from '@services/api/homeApi'

const useActions = () => {
  const { data: programsData = [], isLoading: programsLoading } = useGetOngoingProgramsQuery()
  const { data: allJourneyData = [], isLoading: allDataLoading } = useGetAllJourneyDataQuery()

  const isLoading = programsLoading || allDataLoading

  // Filter and compute values
  const { ongoingJourney, totalOngoingJourney, totalOngoingJourneyCompleted } = useMemo(() => {
    // Helper: Calculate percentage of modules completed for a journey
    const countPercentageModules = (idJourney) => {
      const selectedJourney = allJourneyData.find(
        (dataJourney) => idJourney === parseInt(dataJourney.id)
      )

      if (!selectedJourney || !selectedJourney.course) return 0

      let m_completed = 0
      let m_total_module = 0

      selectedJourney.course.forEach((module) => {
        m_completed += module.total_completed || 0
        m_total_module += module.total_module || 0
      })

      return m_total_module > 0 ? (m_completed / m_total_module) * 100 : 0
    }

    // Filter: not new (is_new === 0) and not completed (is_completed !== 1)
    const filtered = programsData.filter(
      (journey) => journey.is_new === 0 && journey.is_completed !== 1
    )

    // Sort by module completion percentage (highest first)
    const sorted = filtered.sort((a, b) => {
      const percentA = countPercentageModules(a.id)
      const percentB = countPercentageModules(b.id)
      return percentB - percentA
    })

    // Count completed journeys
    const completed = programsData.filter(
      (journey) =>
        journey.course_completed + journey.total_course !== 0 &&
        journey.course_completed === journey.total_course
    )

    return {
      ongoingJourney: sorted,
      totalOngoingJourney: programsData.length,
      totalOngoingJourneyCompleted: completed.length,
    }
  }, [programsData, allJourneyData])

  return {
    loading: isLoading,
    totalOngoingJourneyCompleted,
    totalOngoingJourney,
    ongoingJourney,
    isEmpty: !isLoading && ongoingJourney.length === 0,
  }
}

export default useActions