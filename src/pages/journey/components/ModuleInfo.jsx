import PropTypes from 'prop-types'
import { Alert } from 'antd'
import { WarningFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import InfoPointsIcon from '../../../assets/images/svgs/ic_infopoints_moduledesc.svg'
import BadgeLockIcon from '../../../assets/images/svgs/ic_badgelock_moduledesc.svg'

/**
 * ModuleInfo Component
 *
 * Displays module metadata and info points
 *
 * @param {Object} props
 * @param {Object} props.module - Module data
 * @param {boolean} props.isMobile - Mobile view flag
 */
export default function ModuleInfo({ module, isMobile = false }) {
  const { t } = useTranslation()

  const hasInfoPoints = module.infopoint && module.infopoint.length > 0
  const hasBadges = module.badges && module.badges.length > 0
  const attemptLimit =
    module.attempt_limit === 0
      ? t('feature.feature_mylj.main_content.unlimited')
      : module.attempt_limit

  return (
    <div className={`module-info ${isMobile ? 'px-4 py-4' : 'px-6 py-4'}`}>
      {/* Module Type & Grading Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">
            {t('feature.feature_mylj.main_content.module_type')}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {module.type || '-'}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">
            {t('feature.feature_mylj.main_content.grading_method')}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {module.grading_method || '-'}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">
            {t('feature.feature_mylj.main_content.attempt_limit')}
          </p>
          <p className="text-sm font-medium text-gray-900">{attemptLimit}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">
            {t('feature.feature_mylj.main_content.number_of_attempts')}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {module.total_attempt || 0}
          </p>
        </div>
      </div>

      {/* Points Collection Info */}
      {module.attempt_collect_point > 0 && (
        <Alert
          message={
            <span className="text-xs">
              {t(
                'feature.feature_mylj.main_content.you_can_only_collect_points'
              )}{' '}
              <strong>{module.attempt_collect_point}</strong>{' '}
              {t('feature.feature_mylj.main_content.desc_attempt')}
            </span>
          }
          type="info"
          showIcon
          className="mb-4"
        />
      )}

      {/* Info Points */}
      {hasInfoPoints && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <img src={InfoPointsIcon} alt="Info Points" className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-gray-900">
              Learning Points
            </h3>
          </div>

          <div className="space-y-2">
            {module.infopoint.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-blue-500 mt-1">•</span>
                <span className="flex-1">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {hasBadges && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={BadgeLockIcon} alt="Badges" className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-gray-900">
              {t(
                'feature.feature_mylj.main_content.complete_module_to_get_badge'
              )}
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {module.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center p-3 border border-gray-200 rounded-lg"
              >
                <img
                  src={badge.image}
                  alt={badge.name}
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs text-center text-gray-700">
                  {badge.name}
                </p>
                {badge.earned_on && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('feature.feature_mylj.main_content.earned_on')}:{' '}
                    {badge.earned_on}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

ModuleInfo.propTypes = {
  module: PropTypes.shape({
    type: PropTypes.string,
    grading_method: PropTypes.string,
    attempt_limit: PropTypes.number,
    total_attempt: PropTypes.number,
    attempt_collect_point: PropTypes.number,
    infopoint: PropTypes.arrayOf(PropTypes.string),
    badges: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        image: PropTypes.string,
        earned_on: PropTypes.string,
      })
    ),
  }).isRequired,
  isMobile: PropTypes.bool,
}
