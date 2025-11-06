import PropTypes from 'prop-types'
import { Modal, Button, Image, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import Outofstock from '@/assets/images/svgs/ic_outofstock_reward.svg'

/**
 * RewardUnavailableModal - Out of stock modal
 *
 * @param {boolean} open - Modal open state
 * @param {Function} onClose - Close handler
 * @param {boolean} isMobile - Mobile version flag
 * @param {boolean} isScalling - Scaling version flag
 *
 * Features:
 * - Out of stock illustration
 * - Informative message
 * - OK button to close
 */
const RewardUnavailableModal = ({
  open,
  onClose,
  isMobile = false,
  isScalling = false,
}) => {
  const { t } = useTranslation()

  const modalWidth = isMobile ? (isScalling ? `${420 * 0.9}px` : '90%') : 420

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            borderRadiusLG: '24px',
          },
        },
        token: {
          fontFamily: 'Roboto',
        },
      }}
    >
      <Modal
        open={open}
        maskClosable={false}
        closeIcon={false}
        width={modalWidth}
        centered
        footer={null}
      >
        <div className="text-center p-8">
          {/* Out of Stock Icon */}
          <Image
            preview={false}
            src={Outofstock}
            width={isMobile ? 76 : 96}
            fallback={Outofstock}
          />

          {/* Title */}
          <div
            className={`${
              isMobile ? 'text-base mt-4 mb-3' : 'text-[22px] mt-0 mb-0'
            } text-text-title-mobile font-medium`}
          >
            {t('feature.feature_rewards.popup_oot.reward_out_of_stock')}
          </div>

          {/* Message */}
          <p className="text-text-title-mobile text-sm">
            {t('feature.feature_rewards.popup_oot.late_claim')}
            <br />
            {t('feature.feature_rewards.popup_oot.someone_already')}
          </p>

          {/* OK Button */}
          <Button
            className="btn btn-sm btn-primary btn-block"
            style={{
              borderRadius: '6px',
              border: 'none',
              fontWeight: '500',
              marginTop: isMobile ? 18 : '30px',
              height: isMobile ? 40 : '48px',
              background: '#0066CC',
              color: '#FFFFFF',
            }}
            name="btn-ok-reward-unavailable"
            onClick={onClose}
          >
            {t('feature.feature_rewards.popup_oot.ok')}
          </Button>
        </div>
      </Modal>
    </ConfigProvider>
  )
}

RewardUnavailableModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  isScalling: PropTypes.bool,
}

RewardUnavailableModal.defaultProps = {
  isMobile: false,
  isScalling: false,
}

export default RewardUnavailableModal
