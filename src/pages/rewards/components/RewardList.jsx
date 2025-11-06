import PropTypes from 'prop-types'
import { Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { Loader } from '@/components/Loader'
import RewardCard from './RewardCard'
import EmptyRewards from '@/assets/images/svgs/ic_empty_rewards.svg'

/**
 * RewardList - Grid of reward cards
 *
 * @param {Array} rewards - Array of reward objects
 * @param {Function} onRedeemClick - Redeem click handler
 * @param {boolean} isLoading - Loading state
 * @param {boolean} isMobile - Mobile version flag
 *
 * Features:
 * - Responsive grid layout
 * - Loading state
 * - Empty state with illustration
 * - Desktop: flex start alignment
 * - Mobile: flex center alignment
 */
const RewardList = ({
  rewards,
  onRedeemClick,
  isLoading,
  isMobile = false,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <Loader />
  }

  if (!rewards || rewards.length === 0) {
    return (
      <aside className="flex flex-col items-center justify-center w-full h-full" role="status" aria-live="polite">
        <div className="mb-[23px]">
          <img
            src={EmptyRewards}
            className="w-[159px] h-[135px]"
            alt="No rewards available"
          />
        </div>
        <div className="text-sm font-medium text-[#757575] leading-normal">
          {t('feature.feature_rewards.emtpy_state.rewards_not_available')}
        </div>
      </aside>
    )
  }

  return (
    <div
      className="h-full w-full"
      role="list"
      aria-label="Reward items"
    >
      <Flex
        wrap="wrap"
        gap="middle"
        justify={isMobile ? 'center' : 'start'}
      >
        {rewards.map((reward, index) => (
          <div key={reward.id || index} role="listitem">
            <RewardCard
              reward={reward}
              onRedeem={onRedeemClick}
              isMobile={isMobile}
            />
          </div>
        ))}
      </Flex>
    </div>
  )
}

RewardList.propTypes = {
  rewards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
      point: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      availability: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
  onRedeemClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
}

RewardList.defaultProps = {
  rewards: [],
  isLoading: false,
  isMobile: false,
}

export default RewardList
