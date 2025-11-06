import { Spin, Empty } from 'antd'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import JourneyHeader from './components/JourneyHeader'
import JourneyStats from './components/JourneyStats'
import JourneyDescription from './components/JourneyDescription'
import CourseListItem from './components/CourseListItem'
import { useJourneyDetail } from './hooks/useJourneyDetail'
import useResponsive from '../../hooks/useResponsive'

/**
 * JourneyDetailPage Component
 *
 * Main journey detail page showing journey info and course list
 * Replaces SubPages/Journey/index.jsx
 */
export default function JourneyDetailPage() {
  const { t } = useTranslation()
  const { journeyId } = useParams()
  const { isMobile } = useResponsive()

  const {
    journey,
    courses,
    daysLeft,
    isCompleted,
    totalCourses,
    isLoading,
    error,
  } = useJourneyDetail(journeyId)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip={t('common.loading')} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">{t('common.error')}</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  // No data state
  if (!journey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty description="Journey not found" />
      </div>
    )
  }

  return (
    <div
      className={`
      journey-detail-page bg-white
      ${isMobile ? '' : 'min-h-screen'}
    `}
    >
      {/* Journey Header with Thumbnail & Title */}
      <JourneyHeader
        journey={journey}
        daysLeft={daysLeft}
        isCompleted={isCompleted}
        isMobile={isMobile}
      />

      <div className={`${isMobile ? 'px-4' : 'px-6'} pb-6`}>
        {/* Journey Stats (Points, Courses) */}
        <JourneyStats
          points={journey.point || 0}
          totalCourses={totalCourses}
          isMobile={isMobile}
        />

        {/* Journey Description */}
        {journey.description && (
          <JourneyDescription
            description={journey.description}
            isMobile={isMobile}
          />
        )}

        {/* Course List */}
        <div className="mt-6">
          <h2
            className={`
            font-semibold text-gray-900 mb-4
            ${isMobile ? 'text-base' : 'text-lg'}
          `}
          >
            {t('feature.feature_mylj.side_dpd.side_dpd_courses')} (
            {courses.length})
          </h2>

          {courses.length === 0 ? (
            <Empty
              description={t('feature.feature_mylj.side_dpd.no_courses')}
              className="my-8"
            />
          ) : (
            <div
              className={`
              grid gap-4
              ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}
            `}
            >
              {courses.map((course, index) => (
                <CourseListItem
                  key={course.id}
                  course={course}
                  journeyId={journeyId}
                  courseIndex={index}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
