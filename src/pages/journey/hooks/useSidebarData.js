import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { learningJourneyAPI } from '../../../services/api/learningJourney'

/**
 * Custom hook for managing Journey sidebar data
 *
 * Fetches courses and modules for a journey and organizes them for sidebar display
 *
 * @param {string} journeyId - Journey ID
 * @returns {Object} Sidebar state and data
 */
export function useJourneySidebarData(journeyId) {
  const [modulesByCourse, setModulesByCourse] = useState({})
  const [supportModulesByCourse, setSupportModulesByCourse] = useState({})
  const [activeCourseId, setActiveCourseId] = useState(null)

  // Fetch courses for this journey
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ['journey-courses', journeyId],
    queryFn: () => learningJourneyAPI.getCourses(journeyId),
    enabled: !!journeyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch modules for active course
  const { data: modulesData, isLoading: isLoadingModules } = useQuery({
    queryKey: ['course-modules', journeyId, activeCourseId],
    queryFn: () => learningJourneyAPI.getModules(journeyId, activeCourseId),
    enabled: !!journeyId && !!activeCourseId,
    staleTime: 5 * 60 * 1000,
  })

  // Update modules map when data arrives
  useEffect(() => {
    if (modulesData && activeCourseId) {
      const { modules = [], support_modules = [] } = modulesData

      setModulesByCourse((prev) => ({
        ...prev,
        [activeCourseId]: modules,
      }))

      setSupportModulesByCourse((prev) => ({
        ...prev,
        [activeCourseId]: support_modules,
      }))
    }
  }, [modulesData, activeCourseId])

  return {
    courses: coursesData?.courses || [],
    modulesByCourse,
    supportModulesByCourse,
    isLoading: isLoadingCourses || isLoadingModules,
    error: coursesError,
    activeCourseId,
    setActiveCourseId,
  }
}

/**
 * Custom hook for managing sidebar navigation state
 *
 * Handles active course/module tracking and scroll behavior
 *
 * @param {string} courseId - Current course ID from URL
 * @param {string} moduleId - Current module ID from URL
 * @returns {Object} Navigation state
 */
export function useSidebarNavigation(courseId, moduleId) {
  const [scrollToModule, setScrollToModule] = useState(null)

  // Auto-scroll to active module when it changes
  useEffect(() => {
    if (moduleId) {
      setScrollToModule(moduleId)

      // Scroll to element after render
      setTimeout(() => {
        const moduleElement = document.querySelector(
          `[data-module-id="${moduleId}"]`
        )
        if (moduleElement) {
          moduleElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }, 300)
    }
  }, [moduleId])

  return {
    activeCourseId: courseId,
    activeModuleId: moduleId,
    scrollToModule,
  }
}
