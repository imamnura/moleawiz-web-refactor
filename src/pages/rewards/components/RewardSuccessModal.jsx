import PropTypes from 'prop-types'
import { Modal, Button, Image, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { copyToClipboard } from '../utils/clipboard'
import ICLightBehind from '@/assets/images/svgs/ic_lightrotatebadges_popuprewardrating.svg'
import ICCopy from '@/assets/images/svgs/ic_copy_rewards.svg'
import ICPoints from '@/assets/images/svgs/ic_learningpoints_programdesc.svg'
import imageHeaderEN from '@/assets/images/png/components/img_header_reward_EN.png'
import imageHeaderID from '@/assets/images/png/components/img_header_reward_ID.png'

/**
 * RewardSuccessModal - Success modal after redeeming reward
 *
 * @param {boolean} open - Modal open state
 * @param {Object} reward - Redeemed reward object (id, title, image, redeem_code)
 * @param {Function} onClose - Close handler
 * @param {Function} onCopySuccess - Copy success callback
 * @param {boolean} isMobile - Mobile version flag
 * @param {boolean} isScalling - Scaling version flag
 *
 * Features:
 * - Animated header (EN/ID localized)
 * - Rotating light background
 * - Product image display
 * - Redeem code with copy button
 * - Navigate to history
 * - Responsive layout
 */
const RewardSuccessModal = ({
  open,
  reward,
  onClose,
  onCopySuccess,
  isMobile = false,
  isScalling = false,
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  if (!reward) return null

  const handleCopy = async () => {
    const success = await copyToClipboard(reward.redeem_code, isMobile)
    if (success && onCopySuccess) {
      onCopySuccess()
    }
  }

  const handleViewHistory = () => {
    onClose()
    navigate('/rewards/history')
  }

  const modalWidth = isMobile ? (isScalling ? `${420 * 0.9}px` : '90%') : 422

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadiusLG: 16,
        },
      }}
    >
      <Modal
        open={open}
        maskClosable={false}
        closeIcon={null}
        transitionName="ant-fade"
        width={modalWidth}
        centered
        footer={null}
      >
        <div className="body-modal-earn-rewards rounded-2xl">
          {/* Header Image */}
          <div>
            <Image
              preview={false}
              className="rounded-t-2xl relative z-99"
              src={i18n.language === 'en' ? imageHeaderEN : imageHeaderID}
            />
          </div>

          {/* Product Image with Rotating Light */}
          <div className="popup-earn-product-rewards flex justify-center mb-[22px]">
            <div className="w-[307px] text-center -mt-10">
              <Image
                className="light-behind"
                preview={false}
                width={270}
                height={270}
                src={ICLightBehind}
                fallback={ICLightBehind}
                alt="Light"
              />
              <Image
                className="popup-earn-product-rewards-get absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                preview={false}
                width={120}
                height={120}
                src={reward.image}
                fallback={ICPoints}
                style={{ objectFit: 'cover' }}
                alt={reward.title}
              />
            </div>
          </div>

          {/* Redeem Code Section */}
          <div className="text-center pb-5 z-99 relative">
            <div className="text-xs font-medium text-[#424242]">
              {t('feature.feature_rewards.popup_earn_rewards.save_code')}
            </div>

            {/* Code with Copy Button */}
            <div className="flex justify-center items-center mb-[30px]">
              <div
                className={`${
                  isMobile ? 'text-2xl' : 'text-[32px]'
                } font-bold text-[#424242] mr-1.5`}
              >
                {isMobile ? `#${reward.redeem_code}` : reward.redeem_code}

                {/* Hidden input for copy */}
                <div className="hidden">
                  <input
                    type="text"
                    value={reward.redeem_code}
                    readOnly
                    id="code-redeem"
                  />
                </div>
              </div>

              {/* Copy Button */}
              <div>
                <div
                  className="copy-icon-wrapper p-[0_6px_2px_6px] bg-[#E6F2FF] border border-[#0066CC] rounded-md cursor-pointer"
                  onClick={handleCopy}
                >
                  <Image
                    className="copy-icon"
                    name="btn-copy-code-rewards"
                    width={12}
                    height={12}
                    preview={false}
                    src={ICCopy}
                    alt="icon copy"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between px-[18px]">
              <Button
                className="btn-history-modal-earn-rewards"
                name="btn-history-modal-earn-rewards"
                onClick={handleViewHistory}
                block
                style={{
                  background: '#E6F2FF',
                  color: '#0066CC',
                  borderColor: '#0066CC',
                  borderRadius: 6,
                  fontSize: 14,
                  height: isMobile ? 40 : 48,
                  width: 184,
                  fontWeight: 500,
                }}
              >
                {t('feature.feature_rewards.popup_earn_rewards.history')}
              </Button>

              <Button
                onClick={onClose}
                className="btn-close-modal-earn-rewards"
                name="btn-close-modal-earn-rewards"
                block
                style={{
                  background: '#0066CC',
                  color: '#FFFFFF',
                  borderColor: '#0066CC',
                  borderRadius: 6,
                  fontSize: 14,
                  height: isMobile ? 40 : 48,
                  width: 184,
                  fontWeight: 500,
                  marginLeft: 12,
                }}
              >
                {t('feature.feature_rewards.popup_earn_rewards.close')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  )
}

RewardSuccessModal.propTypes = {
  open: PropTypes.bool.isRequired,
  reward: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    image: PropTypes.string,
    redeem_code: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onCopySuccess: PropTypes.func,
  isMobile: PropTypes.bool,
  isScalling: PropTypes.bool,
}

RewardSuccessModal.defaultProps = {
  reward: null,
  onCopySuccess: null,
  isMobile: false,
  isScalling: false,
}

export default RewardSuccessModal
