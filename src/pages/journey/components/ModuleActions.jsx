import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Alert } from 'antd'
import { LockOutlined, SyncOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

/**
 * ModuleActions Component
 *
 * Displays action buttons for module (Enter/Re-sync)
 * Shows warnings for locked or attempt-limited modules
 *
 * @param {Object} props
 * @param {Object} props.module - Module data
 * @param {string} props.journeyId - Parent journey ID
 * @param {string} props.courseId - Parent course ID
 * @param {boolean} props.isMobile - Mobile view flag
 * @param {Function} props.onResync - Callback for re-sync action
 */
export default function ModuleActions({
  module,
  journeyId,
  courseId,
  isMobile = false,
  onResync,
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [buttonState, setButtonState] = useState({
    text: '',
    disabled: false,
    isResync: false,
    showWarning: false,
    warningMessage: '',
  })

  // Determine button state based on module status
  useEffect(() => {
    if (!module.id) return

    // Check if module is locked
    if (module.isopen === 0) {
      setButtonState({
        text: 'Locked',
        disabled: true,
        isResync: false,
        showWarning: true,
        warningMessage: t(
          'feature.feature_mylj.main_content.complete_previous_module_message'
        ),
      })
      return
    }

    // Check for pending SCORM data (needs re-sync)
    const scormKey = `scorm-${module.id}`
    const hasPendingScorm = localStorage.getItem(scormKey) !== null

    if (hasPendingScorm) {
      setButtonState({
        text: 'Re-sync',
        disabled: false,
        isResync: true,
        showWarning: false,
        warningMessage: '',
      })
      return
    }

    // Check attempt limits
    const attemptLimit = module.attempt_limit
    const totalAttempt = module.total_attempt || 0

    // Unlimited attempts
    if (attemptLimit === 0) {
      setButtonState({
        text: t('feature.feature_mylj.main_content.enter'),
        disabled: false,
        isResync: false,
        showWarning: false,
        warningMessage: '',
      })
      return
    }

    // Has attempts left
    if (totalAttempt < attemptLimit) {
      setButtonState({
        text: t('feature.feature_mylj.main_content.enter'),
        disabled: false,
        isResync: false,
        showWarning: false,
        warningMessage: '',
      })
      return
    }

    // No attempts left
    setButtonState({
      text: t('feature.feature_mylj.main_content.enter'),
      disabled: true,
      isResync: false,
      showWarning: true,
      warningMessage: t(
        'feature.feature_mylj.main_content.module_locked_message'
      ),
    })
  }, [module, t])

  const handleAction = () => {
    if (buttonState.isResync) {
      // Handle re-sync
      if (onResync) {
        onResync(module.id)
      }
    } else {
      // Navigate to SCORM player
      navigate(
        `/journey/${journeyId}/course/${courseId}/module/${module.id}/play`
      )
    }
  }

  // Don't show button if module has no cmid
  if (!module.cmid) {
    return null
  }

  return (
    <div
      className={`
      module-actions border-t border-gray-200
      ${isMobile ? 'p-4 fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10' : 'p-6'}
    `}
    >
      {/* Warning Alert */}
      {buttonState.showWarning && buttonState.warningMessage && (
        <Alert
          message={
            <div className="text-sm">
              {buttonState.warningMessage}
              {buttonState.disabled && (
                <>
                  <br />
                  <span className="font-medium">
                    {t('feature.feature_mylj.main_content.ask_to_unlock')}
                  </span>
                </>
              )}
            </div>
          }
          type="warning"
          showIcon
          icon={<LockOutlined />}
          className="mb-4"
        />
      )}

      {/* Action Button */}
      <Button
        type="primary"
        size={isMobile ? 'large' : 'middle'}
        disabled={buttonState.disabled}
        onClick={handleAction}
        icon={buttonState.isResync ? <SyncOutlined /> : null}
        className={`
          ${isMobile ? 'w-full' : 'min-w-[200px]'}
          ${buttonState.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          backgroundColor: buttonState.disabled ? '#b7b7b7' : '#123fa0',
          borderColor: buttonState.disabled ? '#b7b7b7' : '#123fa0',
        }}
      >
        {buttonState.text}
      </Button>

      {/* Attempt Info */}
      {!buttonState.disabled && module.attempt_limit > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {t('feature.feature_mylj.main_content.number_of_attempts')}:{' '}
          <span className="font-medium text-gray-700">
            {module.total_attempt || 0}/{module.attempt_limit}
          </span>
        </p>
      )}
    </div>
  )
}

ModuleActions.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cmid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isopen: PropTypes.number,
    attempt_limit: PropTypes.number,
    total_attempt: PropTypes.number,
  }).isRequired,
  journeyId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  onResync: PropTypes.func,
}
