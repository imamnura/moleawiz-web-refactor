import { useMemo } from 'react'
import { useGetOngoingCoursesQuery } from '@services/api/homeApi'
import { getDaysLeft, isExpired } from '@utils/dateUtils'

const useActions = () => {
  const { data: coursesData = [], isLoading } = useGetOngoingCoursesQuery()

  // Filter and compute values
  const { onGoingCourse, totalCourse, totalCourseCompleted } = useMemo(() => {
    // Filter ongoing courses (not completed and status is on-going)
    const filteringCourse = coursesData.filter(
      (course) => course.is_completed === 0 && course.status === 'on-going'
    )

    // Get all completed courses
    const courseCompleted = coursesData.filter(
      (course) => course.is_completed === 1
    )

    // Add computed fields to ongoing courses
    const enrichedCourses = filteringCourse.map((course) => ({
      ...course,
      percent:
        course.progress_percentage ||
        Math.round((course.total_completed / course.total_module) * 100),
      days_left: course.end_date ? getDaysLeft(course.end_date) : null,
      is_expired: course.end_date ? isExpired(course.end_date) : false,
    }))

    return {
      onGoingCourse: enrichedCourses,
      totalCourse: coursesData.length,
      totalCourseCompleted: courseCompleted.length,
    }
  }, [coursesData])

  return {
    loading: isLoading,
    totalCourse,
    totalCourseCompleted,
    onGoingCourse,
    isEmpty: !isLoading && onGoingCourse.length === 0,
  }
}

export default useActions
