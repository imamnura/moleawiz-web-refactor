import { Spin, Empty, Divider } from 'antd'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CourseHeader from './components/CourseHeader'
import CourseDescription from './components/CourseDescription'
import ModuleItem from './components/ModuleItem'
import { useCourseDetail } from './hooks/useCourseDetail'
import useResponsive from '../../hooks/useResponsive'

/**
 * CourseDetailPage Component
 *
 * Main course detail page showing course info and module list
 * Replaces SubPages/Course/index.jsx
 */
export default function CourseDetailPage() {
  const { t } = useTranslation()
  const { journeyId, courseId } = useParams()
  const { isMobile } = useResponsive()

  const { course, modules, supportModules, isLoading, error } = useCourseDetail(
    journeyId,
    courseId
  )

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
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty description="Course not found" />
      </div>
    )
  }

  // Get course index from URL or data
  const courseIndex = course.sort || 0

  return (
    <div
      className={`
      course-detail-page bg-white
      ${isMobile ? '' : 'min-h-screen'}
    `}
    >
      {/* Course Header with Thumbnail & Title */}
      <CourseHeader
        course={course}
        courseIndex={courseIndex}
        journeyId={journeyId}
        isMobile={isMobile}
      />

      {/* Course Description */}
      {course.description && (
        <>
          <CourseDescription
            description={course.description}
            isMobile={isMobile}
          />
          <Divider className="my-0" />
        </>
      )}

      {/* Module List */}
      <div className={`${isMobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
        <h2
          className={`
          font-semibold text-gray-900 mb-4
          ${isMobile ? 'text-base' : 'text-lg'}
        `}
        >
          {t('feature.feature_mylj.side_dpd.essential_modules_completed')} (
          {modules.length})
        </h2>

        {modules.length === 0 ? (
          <Empty
            description={t('feature.feature_mylj.side_dpd.no_modules')}
            className="my-8"
          />
        ) : (
          <div className="space-y-2">
            {modules.map((module) => (
              <ModuleItem
                key={module.id}
                module={module}
                journeyId={journeyId}
                courseId={courseId}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}

        {/* Supporting Modules */}
        {supportModules.length > 0 && (
          <>
            <Divider />
            <h3
              className={`
              font-semibold text-gray-900 mb-4
              ${isMobile ? 'text-sm' : 'text-base'}
            `}
            >
              {t('feature.feature_mylj.side_dpd.supporting_modules')} (
              {supportModules.length})
            </h3>

            <div className="space-y-2">
              {supportModules.map((module) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  journeyId={journeyId}
                  courseId={courseId}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
