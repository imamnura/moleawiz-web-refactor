import PropTypes from 'prop-types'
import { Collapse, Tooltip, Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import ModuleItem from './ModuleItem'

const { Panel } = Collapse

/**
 * CourseItem Component
 *
 * Collapsible course item in sidebar with module list
 *
 * @param {Object} props
 * @param {Object} props.course - Course data
 * @param {string} props.course.id - Course ID
 * @param {string} props.course.name - Course name
 * @param {number} props.course.total_completed - Completed modules count
 * @param {number} props.course.total_module - Total modules count
 * @param {Array} props.modules - List of modules in this course
 * @param {Array} props.supportModules - Supporting modules (optional)
 * @param {string} props.journeyId - Parent journey ID
 * @param {boolean} props.isActive - Whether this course is currently expanded
 * @param {boolean} props.isMobile - Mobile view flag
 * @param {boolean} props.isLoading - Loading state for modules
 */
export default function CourseItem({
  course,
  modules = [],
  supportModules = [],
  journeyId,
  isActive = false,
  isMobile = false,
  isLoading = false,
  courseIndex,
}) {
  const { t } = useTranslation()
  const location = useLocation()

  const isCourseActive = location.pathname.includes(`/course/${course.id}`)

  // Sort modules: numbered first (by number), then non-numbered
  const sortedModules = [...modules].sort((a, b) => {
    const aHasNumber =
      a.summary && !a.summary.includes('<p') && a.summary !== ''
    const bHasNumber =
      b.summary && !b.summary.includes('<p') && b.summary !== ''

    if (aHasNumber && bHasNumber) {
      return parseInt(a.summary) - parseInt(b.summary)
    }
    if (aHasNumber) return -1
    if (bHasNumber) return 1
    return 0
  })

  // Render module list or loading skeleton
  const renderModuleList = () => {
    if (isLoading) {
      return (
        <div className="px-3 py-2 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton.Avatar active size={24} />
              <Skeleton.Input active style={{ width: 200, height: 20 }} />
            </div>
          ))}
        </div>
      )
    }

    if (sortedModules.length === 0) {
      return (
        <div className="px-3 py-4 text-center text-gray-400 text-xs">
          {t('feature.feature_mylj.side_dpd.no_modules')}
        </div>
      )
    }

    return (
      <div className="space-y-1 pb-2">
        {sortedModules.map((module) => (
          <ModuleItem
            key={module.id}
            module={module}
            journeyId={journeyId}
            courseId={course.id}
            isMobile={isMobile}
          />
        ))}

        {/* Support Modules */}
        {supportModules.length > 0 && (
          <>
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-t border-gray-200 mt-2">
              {t('feature.feature_mylj.side_dpd.supporting_modules')}
            </div>
            {supportModules.map((module) => (
              <ModuleItem
                key={module.id}
                module={module}
                journeyId={journeyId}
                courseId={course.id}
                isMobile={isMobile}
              />
            ))}
          </>
        )}
      </div>
    )
  }

  // Course header with progress
  const CourseHeader = () => (
    <div className="w-full">
      {isMobile && (
        <p className="text-[10px] text-gray-500 mb-0 font-normal">
          {t('feature.feature_mylj.main_content.course_cap')} {courseIndex + 1}
        </p>
      )}

      <Tooltip
        title={course.name}
        mouseEnterDelay={1}
        arrow={false}
        placement="topLeft"
      >
        <div
          className={`
          text-sm font-medium truncate mb-1
          ${isCourseActive ? 'text-blue-600' : 'text-gray-800'}
        `}
        >
          {course.name}
        </div>
      </Tooltip>

      <div className="text-xs text-gray-500">
        <span className="font-medium text-gray-700">
          {course.total_completed}
        </span>
        /{course.total_module}{' '}
        {t('feature.feature_mylj.side_dpd.essential_modules_completed')}
      </div>
    </div>
  )

  return (
    <div
      className={`
      course-item
      ${isCourseActive ? 'course-active' : ''}
    `}
    >
      <CourseHeader />
      {isActive && renderModuleList()}
    </div>
  )
}

CourseItem.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    total_completed: PropTypes.number,
    total_module: PropTypes.number,
  }).isRequired,
  modules: PropTypes.array,
  supportModules: PropTypes.array,
  journeyId: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isMobile: PropTypes.bool,
  isLoading: PropTypes.bool,
  courseIndex: PropTypes.number,
}
