import { Card, Avatar, Typography } from 'antd'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { formatNumberWithDot, getUserInitial } from '../utils/formatters'

const { Text } = Typography

function RankCard({ user, yourRank }) {
  const { t } = useTranslation()
  const isYou = user.isyou === 1

  const displayName = isYou
    ? t('feature.feature_leaderboards.table.you')
    : `${user.firstname} ${user.lastname}`

  const displayRank = isYou ? yourRank : parseInt(user.rank)

  return (
    <Card
      className="card-leaderboard-rank mb-3 rounded-[10px] shadow-[0px_1px_4px_#0000001A]"
      style={{
        background: isYou ? '#FFF5EF' : '#FFFFFF',
        border: isYou ? '1px solid #F16F24' : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Rank Number */}
        <Text className="w-[35px] text-left text-sm font-normal text-gray-800">
          #{displayRank}
        </Text>

        {/* User Info */}
        <div className="mx-auto ml-2 flex w-full items-center gap-3">
          <Avatar
            size={48}
            src={user.picture}
            className="border-none bg-blue-600"
          >
            {getUserInitial(user.firstname)}
          </Avatar>

          <div className="block w-[73%] text-left">
            <div
              className="break-dots-first-line mb-0.5 overflow-hidden text-ellipsis pr-2 text-xs font-medium leading-[15px] text-gray-800"
              style={{ wordBreak: 'break-all' }}
            >
              {displayName}
            </div>
            <div
              className="break-dots-first-line overflow-hidden text-ellipsis pr-2 text-[10px] font-normal leading-3 text-gray-600"
              style={{ wordBreak: 'break-all' }}
            >
              {user.role}
            </div>
          </div>
        </div>

        {/* Score */}
        <Text className="w-[42px] whitespace-nowrap text-right text-xs font-medium leading-[15px] text-gray-800">
          {formatNumberWithDot(parseInt(user.totalgrade))}
        </Text>
      </div>
    </Card>
  )
}

export function MobileRankList({ data, yourRank }) {
  if (!data || data.length === 0) return null

  return (
    <div className="mx-auto px-[18px] py-5">
      {data.map((item, index) => (
        <RankCard key={index} user={item} yourRank={yourRank} />
      ))}
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

RankCard.propTypes = {
  user: userPropType.isRequired,
  yourRank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

MobileRankList.propTypes = {
  data: PropTypes.arrayOf(userPropType),
  yourRank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
