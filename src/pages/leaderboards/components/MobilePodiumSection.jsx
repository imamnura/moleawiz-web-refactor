import { Card, Avatar, Image } from 'antd'
import PropTypes from 'prop-types'
import { formatNumberWithDot, getUserInitial } from '../utils/formatters'
import { useTranslation } from 'react-i18next'
import Medalion1Mobile from '@assets/images/svgs/ic_medalion1_leaderboards_mobile.svg'
import Medalion2Mobile from '@assets/images/svgs/ic_medalion2_leaderboards_mobile.svg'
import Medalion3Mobile from '@assets/images/svgs/ic_medalion3_leaderboards_mobile.svg'

const { Meta } = Card

const MOBILE_PODIUM_CONFIG = {
  1: {
    medal: Medalion1Mobile,
    avatarSize: 54,
    height: 125,
    nameFontSize: '12px',
    scoreFontSize: '14px',
    marginTop: 0,
  },
  2: {
    medal: Medalion2Mobile,
    avatarSize: 46,
    height: 119,
    nameFontSize: '12px',
    scoreFontSize: '12px',
    marginTop: '19px',
  },
  3: {
    medal: Medalion3Mobile,
    avatarSize: 46,
    height: 119,
    nameFontSize: '12px',
    scoreFontSize: '12px',
    marginTop: '19px',
  },
}

export function MobilePodiumCard({ user, rank }) {
  const { t } = useTranslation()
  const config = MOBILE_PODIUM_CONFIG[rank]

  if (!user || !config) return null

  const isYou = user.isyou === 1
  const displayName = isYou
    ? t('feature.feature_leaderboards.table.you')
    : `${user.firstname} ${user.lastname}`

  return (
    <div
      className="podium aspect-3/4 max-w-[120px] min-w-20 flex-1"
      name={`square-podium-${rank}-leaderboards`}
      style={{ marginTop: config.marginTop }}
    >
      <Card
        bordered={false}
        className="relative w-full rounded-t-[14px] rounded-b-none bg-white shadow-none"
        style={{
          height: config.height,
        }}
        bodyStyle={{
          width: '100%',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          padding: 0,
          borderTopRightRadius: 14,
          borderTopLeftRadius: 14,
          height: config.height,
        }}
      >
        <div className="rounded-t-[14px] bg-white px-2 pb-0 pt-2">
          {/* Avatar */}
          <div className="mb-1">
            <Avatar
              size={config.avatarSize}
              src={user.picture}
              className="border-none bg-blue-600 text-xs"
            >
              {getUserInitial(user.firstname)}
            </Avatar>
          </div>

          {/* Name */}
          <div
            className="break-dots-first-line mb-0.5 overflow-hidden text-ellipsis text-center font-medium leading-[19px] text-blue-600"
            style={{
              fontSize: config.nameFontSize,
              wordBreak: 'break-all',
            }}
          >
            {displayName}
          </div>

          {/* Role */}
          <div
            className="break-dots-first-line mb-0.5 overflow-hidden text-ellipsis text-[10px] leading-[11px] text-gray-600"
            style={{
              visibility: user.role ? 'visible' : 'hidden',
              wordBreak: 'break-all',
            }}
          >
            {user.role || 'empty'}
          </div>

          {/* Score */}
          <div
            className="relative z-3 mb-0 font-medium"
            style={{ fontSize: config.scoreFontSize, lineHeight: '19px' }}
          >
            {formatNumberWithDot(user.totalgrade)}
          </div>
        </div>

        {/* Medal */}
        <Meta
          className="absolute -mt-2 w-full bg-transparent"
          description={
            <Image
              className="image-medalion"
              width="100%"
              height="100%"
              preview={false}
              src={config.medal}
              fallback={config.medal}
              alt={`Rank ${rank} Medal`}
            />
          }
        />
      </Card>
    </div>
  )
}

export function MobilePodiumSection({ top3 }) {
  if (!top3 || top3.length === 0) return null

  return (
    <div className="podium-wrapper mb-5 -mt-[72px]">
      <div className="mx-auto flex w-full max-w-[calc(100%-36px)] flex-row flex-nowrap items-center justify-center gap-3">
        {/* Rank 2 */}
        <MobilePodiumCard user={top3[1]} rank={2} />

        {/* Rank 1 */}
        <MobilePodiumCard user={top3[0]} rank={1} />

        {/* Rank 3 */}
        <MobilePodiumCard user={top3[2]} rank={3} />
      </div>
    </div>
  )
}

const userPropType = PropTypes.shape({
  userid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  picture: PropTypes.string,
  role: PropTypes.string,
  totalgrade: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isyou: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
})

MobilePodiumCard.propTypes = {
  user: userPropType,
  rank: PropTypes.oneOf([1, 2, 3]).isRequired,
}

MobilePodiumSection.propTypes = {
  podiumData: PropTypes.arrayOf(userPropType),
}
