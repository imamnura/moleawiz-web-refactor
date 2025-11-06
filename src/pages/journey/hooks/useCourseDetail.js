import { useQuery } from '@tanstack/react-query'
import { learningJourneyAPI } from '../../../services/api/learningJourney'

/**
 * Custom hook for fetching course detail data
 *
 * @param {string} journeyId - Journey ID
 * @param {string} courseId - Course ID
 * @returns {Object} Course detail state and data
 */
export function useCourseDetail(journeyId, courseId) {
  // Fetch course detail
  const {
    data: courseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['course-detail', journeyId, courseId],
    queryFn: () => learningJourneyAPI.getCourseDetail(journeyId, courseId),
    enabled: !!journeyId && !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch modules for this course
  const { data: modulesData, isLoading: isLoadingModules } = useQuery({
    queryKey: ['course-modules', journeyId, courseId],
    queryFn: () => learningJourneyAPI.getModules(journeyId, courseId),
    enabled: !!journeyId && !!courseId,
    staleTime: 5 * 60 * 1000,
  })

  return {
    course: courseData,
    modules: modulesData?.modules || [],
    supportModules: modulesData?.support_modules || [],
    isLoading: isLoading || isLoadingModules,
    error,
  }
}
