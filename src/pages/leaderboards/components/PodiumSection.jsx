import { Card, Avatar, Image } from 'antd'
import PropTypes from 'prop-types'
import { formatNumberWithDot, getUserInitial } from '../utils/formatters'
import { useTranslation } from 'react-i18next'
import Medalion1 from '@assets/images/svgs/ic_medalion1_leaderboards.svg'
import Medalion2 from '@assets/images/svgs/ic_medalion2_leaderboards.svg'
import Medalion3 from '@assets/images/svgs/ic_medalion3_leaderboards.svg'

const { Meta } = Card

const PODIUM_CONFIG = {
  1: {
    medal: Medalion1,
    width: 340,
    avatarSize: 80,
    avatarFontSize: '35px',
    nameFontSize: '22px',
    scoreFontSize: '24px',
    scoreMargin: '-15px',
  },
  2: {
    medal: Medalion2,
    width: 280,
    avatarSize: 72,
    avatarFontSize: '32px',
    nameFontSize: '18px',
    scoreFontSize: '20px',
    scoreMargin: '-15px',
  },
  3: {
    medal: Medalion3,
    width: 280,
    avatarSize: 72,
    avatarFontSize: '32px',
    nameFontSize: '18px',
    scoreFontSize: '20px',
    scoreMargin: '-15px',
  },
}

export function PodiumCard({ user, rank }) {
  const { t } = useTranslation()
  const config = PODIUM_CONFIG[rank]

  if (!user || !config) return null

  const isYou = user.isyou === 1
  const displayName = isYou
    ? t('feature.feature_leaderboards.table.you')
    : `${user.firstname} ${user.lastname}`

  return (
    <Card
      bordered={false}
      className={`shadow-none ${rank === 1 ? 'mx-6' : ''}`}
      style={{
        visibility: 'visible',
        width: config.width,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        background: 'none',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        boxShadow: 'none',
      }}
      bodyStyle={{
        width: config.width,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 0,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
      }}
    >
      <div className="rounded-t-[18px] bg-white px-6 pb-0 pt-6">
        {/* Avatar */}
        <div className="mb-2">
          <Avatar
            size={config.avatarSize}
            src={user.picture}
            className="border-none bg-blue-600"
            style={{ fontSize: config.avatarFontSize }}
          >
            {getUserInitial(user.firstname)}
          </Avatar>
        </div>

        {/* Name */}
        <div
          className="break-dots-first-line mb-1 overflow-hidden text-ellipsis font-medium leading-normal text-blue-600"
          style={{ fontSize: config.nameFontSize }}
        >
          {displayName}
        </div>

        {/* Role */}
        <div
          className="mb-1 text-sm leading-normal text-gray-600"
          style={{ visibility: user.role ? 'visible' : 'hidden' }}
        >
          {user.role || 'empty'}
        </div>

        {/* Score */}
        <div
          className="relative z-3 font-medium"
          style={{
            fontSize: config.scoreFontSize,
            marginBottom: config.scoreMargin,
          }}
        >
          {formatNumberWithDot(user.totalgrade)}
        </div>
      </div>

      {/* Medal */}
      <Meta
        className="bg-transparent"
        description={
          <Image
            className="image-medalion"
            width={config.width}
            preview={false}
            src={config.medal}
            fallback={config.medal}
            alt={`Rank ${rank} Medal`}
          />
        }
      />
    </Card>
  )
}

export function PodiumSection({ top3 }) {
  if (!top3 || top3.length === 0) return null

  return (
    <div className="podium-wrapper mb-8">
      <div className="flex flex-row items-center justify-center">
        {/* Rank 2 */}
        <div className="podium" name="square-podium-2-leaderboards">
          <PodiumCard user={top3[1]} rank={2} />
        </div>

        {/* Rank 1 */}
        <div className="podium" name="square-podium-1-leaderboards">
          <PodiumCard user={top3[0]} rank={1} />
        </div>

        {/* Rank 3 */}
        <div className="podium" name="square-podium-3-leaderboards">
          <PodiumCard user={top3[2]} rank={3} />
        </div>
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

PodiumCard.propTypes = {
  user: userPropType,
  rank: PropTypes.oneOf([1, 2, 3]).isRequired,
}

PodiumSection.propTypes = {
  podiumData: PropTypes.arrayOf(userPropType),
}
