import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import LearningPointsIcon from '../../../assets/images/svgs/ic_learningpoints_programdesc.svg'
import CoursesIcon from '../../../assets/images/svgs/ic_courses_programdesc.svg'

/**
 * JourneyStats Component
 *
 * Displays journey statistics (points earned, total courses)
 *
 * @param {Object} props
 * @param {number} props.points - Learning points earned
 * @param {number} props.totalCourses - Total number of courses
 * @param {boolean} props.isMobile - Mobile view flag
 */
export default function JourneyStats({
  points = 0,
  totalCourses = 0,
  isMobile = false,
}) {
  const { t } = useTranslation()

  const pointsLabel =
    parseInt(points) === 1
      ? t('feature.feature_mylj.main_content.point_earned')
      : t('feature.feature_mylj.main_content.points_earned')

  const coursesLabel =
    totalCourses === 1
      ? t('feature.feature_mylj.side_dpd.side_dpd_course')
      : t('feature.feature_mylj.side_dpd.side_dpd_courses')

  return (
    <div
      className={`
      flex items-center gap-6 py-4 border-t border-b border-gray-200
      ${isMobile ? 'justify-around' : ''}
    `}
    >
      {/* Learning Points */}
      <div className="flex items-center gap-2">
        <img
          src={LearningPointsIcon}
          alt="Learning Points"
          className="w-4 h-4"
        />
        <span
          className={`
          font-medium text-gray-700
          ${isMobile ? 'text-sm' : 'text-base'}
        `}
        >
          {points} {pointsLabel}
        </span>
      </div>

      {/* Total Courses */}
      {totalCourses > 0 && (
        <>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2">
            <img src={CoursesIcon} alt="Courses" className="w-4 h-4" />
            <span
              className={`
              font-medium text-gray-700
              ${isMobile ? 'text-sm' : 'text-base'}
            `}
            >
              {totalCourses} {coursesLabel}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

JourneyStats.propTypes = {
  points: PropTypes.number,
  totalCourses: PropTypes.number,
  isMobile: PropTypes.bool,
}
