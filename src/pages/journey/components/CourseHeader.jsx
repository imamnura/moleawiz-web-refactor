import PropTypes from 'prop-types'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import defaultImage from '../../../assets/images/png/general/img_thumb_default.png'

/**
 * CourseHeader Component
 *
 * Displays course header with thumbnail and title
 *
 * @param {Object} props
 * @param {Object} props.course - Course data
 * @param {number} props.courseIndex - Course number
 * @param {string} props.journeyId - Parent journey ID
 * @param {boolean} props.isMobile - Mobile view flag
 */
export default function CourseHeader({
  course,
  courseIndex,
  journeyId,
  isMobile = false,
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(`/journey/${journeyId}`)
  }

  return (
    <div className={`course-header ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeftOutlined className="text-lg" />
        <span className="text-sm font-medium">{t('common.back')}</span>
      </button>

      {/* Header Content */}
      <div
        className={`
        flex gap-6
        ${isMobile ? 'flex-col' : 'flex-row items-start'}
      `}
      >
        {/* Thumbnail (Desktop only or mobile with different layout) */}
        {!isMobile && (
          <div className="shrink-0">
            <Image
              width={209}
              height={143}
              className="rounded-lg object-cover"
              src={course.thumbnail}
              preview={false}
              fallback={defaultImage}
              alt="Course Thumbnail"
            />
          </div>
        )}

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          {/* Course Label */}
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">
            {t('feature.feature_mylj.main_content.course_cap')}{' '}
            {courseIndex + 1}
          </p>

          {/* Course Title */}
          <h1
            className={`
            font-semibold text-gray-900 mb-4
            ${isMobile ? 'text-lg' : 'text-2xl'}
          `}
          >
            {course.name}
          </h1>

          {/* Mobile Thumbnail */}
          {isMobile && course.thumbnail && (
            <Image
              width="100%"
              height={160}
              className="rounded-lg object-cover mb-4"
              src={course.thumbnail}
              preview={false}
              fallback={defaultImage}
              alt="Course Thumbnail"
            />
          )}
        </div>
      </div>
    </div>
  )
}

CourseHeader.propTypes = {
  course: PropTypes.shape({
    thumbnail: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  courseIndex: PropTypes.number.isRequired,
  journeyId: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
}
