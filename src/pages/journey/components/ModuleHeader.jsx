import PropTypes from 'prop-types'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LearningPointsIcon from '../../../assets/images/svgs/ic_learningpoints_programdesc.svg'

/**
 * ModuleHeader Component
 *
 * Displays module header with title and learning points
 *
 * @param {Object} props
 * @param {Object} props.module - Module data
 * @param {number} props.moduleIndex - Module number/index
 * @param {string} props.journeyId - Parent journey ID
 * @param {string} props.courseId - Parent course ID
 * @param {number} props.learningPoints - Points earned for this module
 * @param {boolean} props.isMobile - Mobile view flag
 */
export default function ModuleHeader({
  module,
  moduleIndex,
  journeyId,
  courseId,
  learningPoints = 0,
  isMobile = false,
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(`/journey/${journeyId}/course/${courseId}`)
  }

  return (
    <div className={`module-header ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeftOutlined className="text-lg" />
        <span className="text-sm font-medium">{t('common.back')}</span>
      </button>

      {/* Module Info */}
      <div>
        {/* Module Label */}
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
          {t('feature.feature_mylj.main_content.module_cap')} {moduleIndex}
        </p>

        {/* Module Title */}
        <h1
          className={`
          font-semibold text-gray-900 mb-3
          ${isMobile ? 'text-lg' : 'text-2xl'}
        `}
        >
          {module.fullname}
        </h1>

        {/* Learning Points */}
        {learningPoints > 0 && (
          <div className="flex items-center gap-2">
            <img
              src={LearningPointsIcon}
              alt="Learning Points"
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              {learningPoints}{' '}
              {t('feature.feature_mylj.main_content.points_earned')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

ModuleHeader.propTypes = {
  module: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
  }).isRequired,
  moduleIndex: PropTypes.number,
  journeyId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  learningPoints: PropTypes.number,
  isMobile: PropTypes.bool,
}
