import PropTypes from 'prop-types'
import { RightOutlined, CheckCircleFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/**
 * CourseListItem Component
 *
 * Displays individual course in journey detail page
 *
 * @param {Object} props
 * @param {Object} props.course - Course data
 * @param {string} props.journeyId - Parent journey ID
 * @param {number} props.courseIndex - Course index (for numbering)
 * @param {boolean} props.isMobile - Mobile view flag
 */
export default function CourseListItem({
  course,
  journeyId,
  courseIndex,
  isMobile = false,
}) {
  const { t } = useTranslation()

  const isCompleted = course.total_completed === course.total_module
  const progressPercentage = Math.round(
    (course.total_completed / course.total_module) * 100
  )

  return (
    <Link to={`/journey/${journeyId}/course/${course.id}`} className="block">
      <div
        className={`
        group
        border border-gray-200 rounded-lg p-4
        hover:border-blue-400 hover:shadow-md
        transition-all duration-200
        ${isMobile ? '' : 'hover:scale-[1.01]'}
      `}
      >
        {/* Course Number Label */}
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
          {t('feature.feature_mylj.main_content.course_cap')} {courseIndex + 1}
        </p>

        {/* Course Name */}
        <h3
          className={`
          font-semibold text-gray-900 mb-3 line-clamp-2
          group-hover:text-blue-600 transition-colors
          ${isMobile ? 'text-sm' : 'text-base'}
        `}
        >
          {course.name}
        </h3>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">
              {t('feature.feature_mylj.side_dpd.perc_completed')}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`
                h-full rounded-full transition-all duration-300
                ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}
              `}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Module Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {isCompleted && <CheckCircleFilled className="text-green-500" />}
            <span>
              <span className="font-medium text-gray-700">
                {course.total_completed}
              </span>
              /{course.total_module}{' '}
              {t('feature.feature_mylj.side_dpd.essential_modules_completed')}
            </span>
          </div>

          <RightOutlined className="text-gray-400 text-xs group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  )
}

CourseListItem.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    total_completed: PropTypes.number,
    total_module: PropTypes.number,
  }).isRequired,
  journeyId: PropTypes.string.isRequired,
  courseIndex: PropTypes.number.isRequired,
  isMobile: PropTypes.bool,
}
