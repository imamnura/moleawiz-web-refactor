import PropTypes from 'prop-types'
import { ArrowLeftOutlined, WarningFilled } from '@ant-design/icons'
import { Image } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import defaultImage from '../../../assets/images/png/general/img_thumb_default.png'

/**
 * JourneyHeader Component
 *
 * Displays journey header with thumbnail, title, and deadline warning
 *
 * @param {Object} props
 * @param {Object} props.journey - Journey data
 * @param {number} props.daysLeft - Days until deadline (null if no deadline)
 * @param {boolean} props.isCompleted - Whether journey is completed
 * @param {boolean} props.isMobile - Mobile view flag
 */
export default function JourneyHeader({
  journey,
  daysLeft = null,
  isCompleted = false,
  isMobile = false,
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine back navigation
  const handleBack = () => {
    if (location?.state?.from) {
      navigate(location.state.from)
    } else {
      navigate('/journey')
    }
  }

  // Show deadline warning
  const showDeadlineWarning = daysLeft !== null && !isCompleted
  const isOverdue = daysLeft !== null && daysLeft <= 0

  return (
    <div
      className={`
      journey-header
      ${isMobile ? 'p-4' : 'p-6'}
    `}
    >
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
        {/* Thumbnail */}
        <div className={`shrink-0 ${isMobile ? 'w-full' : ''}`}>
          <Image
            width={isMobile ? '100%' : 165}
            height={isMobile ? 160 : 113}
            className="rounded-lg object-cover"
            src={journey.thumbnail}
            preview={false}
            fallback={defaultImage}
            alt="Journey Thumbnail"
          />
        </div>

        {/* Journey Info */}
        <div className="flex-1 min-w-0">
          {/* Program Label */}
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">
            {t('feature.feature_mylj.main_content.program')}
          </p>

          {/* Journey Title */}
          <h1
            className={`
            font-semibold text-gray-900 mb-3
            ${isMobile ? 'text-lg' : 'text-2xl'}
          `}
          >
            {journey.name}
          </h1>

          {/* Deadline Warning Badge */}
          {showDeadlineWarning && (
            <div
              className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-md
              ${isOverdue ? 'bg-red-50' : 'bg-orange-50'}
              ${isMobile ? 'text-xs' : 'text-sm'}
            `}
            >
              <WarningFilled
                className={isOverdue ? 'text-red-500' : 'text-orange-500'}
              />
              <span
                className={`font-medium ${
                  isOverdue ? 'text-red-700' : 'text-orange-700'
                }`}
              >
                {daysLeft > 0
                  ? daysLeft === 1
                    ? `${daysLeft} ${t('feature.home.main_content.day_left')}`
                    : `${daysLeft} ${t('feature.feature_mylj.main_content.days_left_program')}`
                  : t('feature.feature_mylj.anchor.overdue')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

JourneyHeader.propTypes = {
  journey: PropTypes.shape({
    thumbnail: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  daysLeft: PropTypes.number,
  isCompleted: PropTypes.bool,
  isMobile: PropTypes.bool,
}
