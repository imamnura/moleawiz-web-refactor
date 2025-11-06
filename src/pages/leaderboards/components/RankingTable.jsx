import { Row, Col, Avatar } from 'antd'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { formatNumberWithDot, getUserInitial } from '../utils/formatters'

function RankRow({ user, yourRank, hasTwoColumns }) {
  const { t } = useTranslation()
  const isYou = user.isyou === 1

  const displayName = isYou
    ? t('feature.feature_leaderboards.table.you')
    : `${user.firstname} ${user.lastname}`

  const displayRank = isYou ? yourRank : parseInt(user.rank)

  return (
    <Row
      data-id={user.rank}
      className={`row-rank-leaderboards flex items-center leading-normal ${
        isYou ? 'you-highlight' : ''
      }`}
      style={{
        padding: isYou ? '16px 24px 16px 34px' : '16px 0 16px 10px',
        marginLeft: isYou ? 0 : 24,
        marginRight: isYou ? 0 : 24,
      }}
    >
      {/* Rank Number */}
      <Col
        span={hasTwoColumns ? 2 : 1}
        className="text-left text-xl font-medium text-gray-800"
      >
        {displayRank}
      </Col>

      {/* User Info */}
      <Col span={hasTwoColumns ? 19 : 20}>
        <div className="flex flex-row items-center justify-start">
          <div className="mr-3">
            <Avatar
              size={48}
              src={user.picture}
              className="border-none bg-blue-600"
            >
              {getUserInitial(user.firstname)}
            </Avatar>
          </div>
          <div className="text-left">
            <div className="break-dots-first-line overflow-hidden text-ellipsis text-lg font-medium text-gray-800">
              {displayName}
            </div>
            <div className="text-sm text-gray-600">{user.role}</div>
          </div>
        </div>
      </Col>

      {/* Score */}
      <Col span={3} className="text-right text-xl font-medium text-gray-800">
        {formatNumberWithDot(parseInt(user.totalgrade))}
      </Col>
    </Row>
  )
}

function RankColumn({ data, yourRank, hasTwoColumns }) {
  const { t } = useTranslation()

  if (!data || data.length === 0) return null

  return (
    <div className="rounded-2xl bg-white shadow-[3px_0_16px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <Row className="rounded-t-2xl bg-gray-100 px-6 py-[18px] text-base font-medium leading-normal text-gray-800">
        <Col span={hasTwoColumns ? 2 : 1} className="text-left">
          {t('feature.feature_leaderboards.table.rank')}
        </Col>
        <Col span={hasTwoColumns ? 19 : 20} className="pl-2.5 text-left">
          {t('feature.feature_leaderboards.table.name')}
        </Col>
        <Col span={3} className="text-right">
          {t('feature.feature_leaderboards.table.score')}
        </Col>
      </Row>

      {/* Rows */}
      <div className="row-rank-leaderboards-wrapper p-0">
        {data.map((item, index) => (
          <RankRow
            key={index}
            user={item}
            yourRank={yourRank}
            hasTwoColumns={hasTwoColumns}
          />
        ))}
      </div>
    </div>
  )
}

export function RankingTable({ columnLeft, columnRight, yourRank }) {
  const hasTwoColumns = columnRight && columnRight.length > 0

  if (!columnLeft || columnLeft.length === 0) return null

  return (
    <div className="table-rank-wrapper mb-10">
      <div
        className="column-rank-flex mx-10"
        style={{
          display: hasTwoColumns ? 'flex' : 'block',
        }}
      >
        {/* Left Column */}
        <div
          style={{
            width: hasTwoColumns ? '50%' : 'unset',
            marginRight: hasTwoColumns ? 12 : 0,
          }}
        >
          <RankColumn
            data={columnLeft}
            yourRank={yourRank}
            hasTwoColumns={hasTwoColumns}
          />
        </div>

        {/* Right Column */}
        {hasTwoColumns && (
          <div
            style={{
              width: '50%',
              marginLeft: 12,
            }}
          >
            <RankColumn
              data={columnRight}
              yourRank={yourRank}
              hasTwoColumns={hasTwoColumns}
            />
          </div>
        )}
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

RankRow.propTypes = {
  user: userPropType.isRequired,
  yourRank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hasTwoColumns: PropTypes.bool,
}

RankColumn.propTypes = {
  data: PropTypes.arrayOf(userPropType),
  yourRank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hasTwoColumns: PropTypes.bool,
}

RankingTable.propTypes = {
  columnLeft: PropTypes.arrayOf(userPropType),
  columnRight: PropTypes.arrayOf(userPropType),
  yourRank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
