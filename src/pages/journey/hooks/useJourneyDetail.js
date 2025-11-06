import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { differenceInDays, parseISO } from 'date-fns'
import { learningJourneyAPI } from '../../../services/api/learningJourney'

/**
 * Custom hook for fetching journey detail data
 *
 * @param {string} journeyId - Journey ID
 * @returns {Object} Journey detail state and data
 */
export function useJourneyDetail(journeyId) {
  // Fetch journey detail
  const {
    data: journeyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['journey-detail', journeyId],
    queryFn: () => learningJourneyAPI.getJourneyDetail(journeyId),
    enabled: !!journeyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Calculate days left until deadline
  const daysLeft = useMemo(() => {
    if (!journeyData?.deadline) return null

    try {
      const deadlineDate = parseISO(journeyData.deadline)
      const today = new Date()
      return differenceInDays(deadlineDate, today)
    } catch (error) {
      console.error('Error parsing deadline:', error)
      return null
    }
  }, [journeyData?.deadline])

  // Get journey completion status
  const isCompleted = useMemo(() => {
    return journeyData?.is_completed === 1
  }, [journeyData?.is_completed])

  // Calculate total courses
  const totalCourses = useMemo(() => {
    return journeyData?.course?.length || 0
  }, [journeyData?.course])

  return {
    journey: journeyData,
    courses: journeyData?.course || [],
    daysLeft,
    isCompleted,
    totalCourses,
    isLoading,
    error,
  }
}
