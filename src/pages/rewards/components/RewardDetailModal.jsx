import PropTypes from 'prop-types'
import { Modal, Row, Col, Image, Button, Divider } from 'antd'
import { WarningFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  formatPoints,
  hasEnoughPoints,
  calculateNewBalance,
} from '../utils/formatters'
import defaultImage from '@/assets/images/png/general/img_thumb_default.png'

/**
 * RewardDetailModal - Modal showing reward details and redemption
 *
 * @param {boolean} open - Modal open state
 * @param {Object} reward - Reward detail object
 * @param {Function} onClose - Close handler
 * @param {Function} onRedeem - Redeem button handler
 * @param {boolean} isLoading - Loading state
 * @param {boolean} isMobile - Mobile version flag
 * @param {boolean} isScalling - Scaling version flag
 *
 * Features:
 * - 2-column layout (desktop), stacked (mobile)
 * - Image zoom on hover (desktop)
 * - Point calculation (current, redeem, new balance)
 * - Disabled redeem if insufficient points
 * - Warning message for insufficient points
 */
const RewardDetailModal = ({
  open,
  reward,
  onClose,
  onRedeem,
  isLoading = false,
  isMobile = false,
  isScalling = false,
}) => {
  const { t } = useTranslation()
  const currBalance = useSelector((state) => state.user?.profile?.points || 0)

  if (!reward) return null

  const enoughPoints = hasEnoughPoints(currBalance, reward.point)
  const newBalance = calculateNewBalance(currBalance, reward.point)

  const modalWidth = isMobile ? (isScalling ? `${480 * 0.9}px` : '90%') : 809

  return (
    <Modal
      centered
      className="modal-detail-rewards"
      closeIcon={false}
      footer={false}
      keyboard
      maskClosable={false}
      onCancel={onClose}
      open={open}
      style={{ borderRadius: 16 }}
      transitionName="ant-fade"
      width={modalWidth}
    >
      <Row className={isMobile ? 'p-0' : 'p-8'}>
        {/* Image Section */}
        <Col
          span={isMobile ? 24 : 'none'}
          className={
            isMobile
              ? 'max-h-[425px] min-h-[405px] h-auto overflow-y-auto whitespace-pre-wrap p-[18px]'
              : 'w-[353px]'
          }
        >
          <Image
            className="image-detail-product"
            preview={false}
            width={isMobile ? '100%' : 353}
            height={isMobile ? 218 : 243}
            src={reward.image}
            fallback={defaultImage}
            style={{ objectFit: 'cover' }}
            alt={reward.title}
          />

          {/* Mobile: Title and Description */}
          {isMobile && (
            <>
              <div className="text-base font-medium mb-3 mt-[18px]">
                {reward.title}
              </div>
              <div className="min-h-[50px] h-auto whitespace-pre-wrap mb-0">
                <div className="text-sm text-[#757575]">
                  {reward.description}
                </div>
              </div>
            </>
          )}
        </Col>

        {/* Details Section */}
        <Col
          span={isMobile ? 24 : 'none'}
          className={isMobile ? 'p-[18px]' : 'w-[353px]'}
        >
          {/* Desktop: Title and Description */}
          {!isMobile && (
            <>
              <div className="text-sm font-medium mb-3.5">{reward.title}</div>
              <div className="min-h-[50px] h-auto whitespace-pre-wrap mb-0">
                <div className="text-xs text-[#757575]">
                  {reward.description}
                </div>
              </div>
            </>
          )}

          {!isMobile && <Divider className="my-5" />}

          {/* Point Calculation */}
          <div
            className={`calculation-point ${
              isMobile ? 'w-full mb-[25px]' : 'w-[200px] ml-auto mr-0 mb-10'
            }`}
          >
            {/* Current Balance */}
            <div className="flex flex-row justify-between">
              <div className="text-xs text-[#757575]">
                {t(
                  'feature.feature_rewards.popup_detail_reward.current_balance'
                )}
              </div>
              <div className="text-sm font-medium">
                {formatPoints(currBalance)}{' '}
                {t('feature.feature_rewards.popup_detail_reward.points')}
              </div>
            </div>

            {/* Redeem With */}
            <div className="flex flex-row justify-between">
              <div className="text-xs text-[#757575]">
                {t('feature.feature_rewards.popup_detail_reward.redeem_with')}
              </div>
              <div className="text-sm font-medium text-[#D32F2F]">
                -{formatPoints(reward.point)}{' '}
                {t('feature.feature_rewards.popup_detail_reward.points')}
              </div>
            </div>

            {/* New Balance or Warning */}
            <div className="flex flex-row justify-between">
              {enoughPoints ? (
                <>
                  <div className="text-xs text-[#757575]">
                    {t(
                      'feature.feature_rewards.popup_detail_reward.new_balance'
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {formatPoints(newBalance)}{' '}
                    {t('feature.feature_rewards.popup_detail_reward.points')}
                  </div>
                </>
              ) : (
                <div className="flex items-center ml-auto mr-0">
                  <WarningFilled className="text-sm text-[#D32F2F]" />
                  <div className="text-sm font-medium text-[#D32F2F] ml-1.5">
                    {t(
                      'feature.feature_rewards.popup_detail_reward.not_enough_points'
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex justify-between ${isMobile ? 'gap-3' : 'gap-0'}`}
          >
            <Button
              onClick={onClose}
              className="btn-cancel-detail-rewards"
              name="btn-cancel-rewards"
              block
              style={{
                background: '#E6F2FF',
                color: '#0066CC',
                borderColor: '#0066CC',
                borderRadius: '8px',
                fontSize: isMobile ? '14px' : '12px',
                height: isMobile ? '40px' : '29px',
                width: isMobile ? '100%' : '171px',
                fontWeight: 500,
              }}
            >
              {t('feature.feature_rewards.popup_detail_reward.cancel')}
            </Button>

            {enoughPoints ? (
              <Button
                onClick={onRedeem}
                className="btn-redeem-detail-rewards"
                name="btn-redeem-detail-rewards"
                block
                disabled={isLoading}
                style={{
                  background: '#0066CC',
                  color: '#FFFFFF',
                  borderColor: 'unset',
                  borderRadius: '8px',
                  fontSize: isMobile ? '14px' : '12px',
                  height: isMobile ? '40px' : '29px',
                  width: isMobile ? '100%' : '171px',
                  fontWeight: 500,
                }}
              >
                {isLoading ? (
                  <span
                    role="status"
                    aria-hidden="true"
                    className="spinner-border spinner-border-sm ms-2"
                  />
                ) : (
                  t('feature.feature_rewards.popup_detail_reward.redeem')
                )}
              </Button>
            ) : (
              <Button
                className="btn-redeem-detail-rewards-disabled"
                block
                disabled
                style={{
                  background: '#0066CC',
                  color: '#FFFFFF',
                  borderColor: 'unset',
                  borderRadius: '8px',
                  fontSize: isMobile ? '14px' : '12px',
                  height: isMobile ? '40px' : '29px',
                  width: isMobile ? '100%' : '171px',
                  fontWeight: 500,
                  opacity: 0.6,
                }}
              >
                {t('feature.feature_rewards.popup_detail_reward.redeem')}
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

RewardDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  reward: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    point: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onClose: PropTypes.func.isRequired,
  onRedeem: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  isScalling: PropTypes.bool,
}

RewardDetailModal.defaultProps = {
  reward: null,
  isLoading: false,
  isMobile: false,
  isScalling: false,
}

export default RewardDetailModal
