import PropTypes from 'prop-types'
import { Card, Image, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { formatPoints } from '../utils/formatters'
import TagPoints from '@/assets/images/svgs/ic_tagpoints_reward.svg'
import Package from '@/assets/images/svgs/ic_package_rewards.svg'
import defaultImage from '@/assets/images/png/general/img_thumb_default.png'

/**
 * RewardCard - Single reward card component
 *
 * @param {Object} reward - Reward object
 * @param {Function} onRedeem - Redeem button click handler
 * @param {boolean} isMobile - Mobile version flag
 *
 * Features:
 * - Product image with fallback
 * - Title (2-line ellipsis)
 * - Points needed
 * - Availability count
 * - Redeem button (desktop only)
 * - Click card to redeem (mobile)
 */
const RewardCard = ({ reward, onRedeem, isMobile = false }) => {
  const { t } = useTranslation()

  const handleClick = () => {
    if (isMobile && onRedeem) {
      onRedeem(reward.id)
    }
  }

  return (
    <article>
      <Card
        onClick={handleClick}
        className={isMobile ? 'w-[47%]' : 'w-[228px]'}
        styles={{
          body: {
            padding: 0,
            boxShadow: '3px 0 16px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            width: isMobile ? '100%' : '228px',
            maxWidth: isMobile ? 'auto' : '228px',
            lineHeight: 'normal',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: 0,
          },
        }}
        variant="borderless"
      >
        {/* Product Image */}
        <figure className="img-product m-0">
          <Image
            preview={false}
            width={isMobile ? '100%' : 228}
            height={isMobile ? 115 : 156}
            src={reward.image}
            fallback={defaultImage}
            className="object-cover rounded-t-lg"
            alt={reward.title}
          />
        </figure>

        {/* Card Footer */}
        <div className={`footer-product ${isMobile ? 'p-2' : 'p-3.5'}`}>
          {/* Title */}
          <div
            className={`title-product flex items-center ${
              isMobile ? 'mb-[15px]' : 'mb-[18px]'
            } h-9`}
          >
            <div
              className={`line-clamp-2 text-sm font-medium ${
                isMobile ? 'text-text-title-mobile leading-4' : 'leading-normal'
              }`}
            >
              {reward.title}
            </div>
          </div>

          {/* Points and Availability */}
          <div
            className={`note-product flex ${
              isMobile ? 'flex-col mb-0' : 'flex-row justify-between mb-3.5'
            }`}
          >
            {/* Points Needed */}
            <div
              className={`points-needed flex items-center ${
                isMobile ? 'mb-1' : ''
              }`}
            >
              <img
                src={TagPoints}
                className="w-[18px] h-[18px] mr-1.5"
                alt="Points"
              />
              <div
                className={`text-xs font-medium ${
                  isMobile ? 'text-[#292929] leading-3.5' : ''
                }`}
              >
                {formatPoints(parseInt(reward.point))}{' '}
                {t('feature.feature_rewards.anchor.main_content.points')}
              </div>
            </div>

            {/* Availability */}
            <div className="qty-product flex items-center">
              <img
                src={Package}
                className="w-[18px] h-[18px] mr-1.5"
                alt="Package"
              />
              <div
                className={`text-xs font-medium ${
                  isMobile ? 'text-[#292929] leading-3.5' : ''
                }`}
              >
                {reward.availability}{' '}
                {t('feature.feature_rewards.anchor.main_content.available')}
              </div>
            </div>
          </div>

          {/* Redeem Button (Desktop Only) */}
          {!isMobile && (
            <Button
              onClick={() => onRedeem(reward.id)}
              className="btn-redeem-rewards w-full"
              name="btn-redeem-rewards"
              block
              style={{
                background: '#0066CC',
                color: '#FFFFFF',
                borderColor: '#0066CC',
                borderRadius: '8px',
                fontSize: '12px',
                height: '29px',
              }}
            >
              {t('feature.feature_rewards.anchor.main_content.redeem')}
            </Button>
          )}
        </div>
      </Card>
    </article>
  )
}

RewardCard.propTypes = {
  reward: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    point: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    availability: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  onRedeem: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
}

RewardCard.defaultProps = {
  isMobile: false,
}

export default RewardCard
