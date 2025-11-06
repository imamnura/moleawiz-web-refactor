import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Radio } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Loader } from '@components/common/Loader'
import UserCard from './UserCard'

/**
 * UserList - List of user submissions with filter
 * Displays users with their submission status
 * Filter: Need Review, Declined, Approved, All
 */
const UserList = ({
  users = [],
  statusCounts = { needReview: 0, approved: 0, declined: 0 },
  filterStatus = 'need_review',
  onFilterChange,
  onUserClick,
  emptyMessage = '',
  isLoading,
  isMobile = false,
}) => {
  const { t } = useTranslation()
  const [hasScroll, setHasScroll] = useState(false)

  // Check if container has scroll
  useEffect(() => {
    const container = document.getElementById('user-list-container')
    if (container) {
      setHasScroll(container.scrollHeight > container.clientHeight)
    }
  }, [users, filterStatus])

  const radioData = [
    {
      key: 1,
      text: (
        <>
          <span>{t('feature.feature_reviews.anchor.need_review')}</span>{' '}
          <span>
            (
            {isLoading ? (
              <LoadingOutlined className="m-0" spin />
            ) : (
              statusCounts.needReview
            )}
            )
          </span>
        </>
      ),
      id: 'radio-btn-need-review-review',
      value: 'need_review',
    },
    {
      key: 2,
      text: (
        <>
          <span>{t('feature.feature_reviews.anchor.declined')}</span>{' '}
          <span>
            (
            {isLoading ? (
              <LoadingOutlined className="m-0" spin />
            ) : (
              statusCounts.declined
            )}
            )
          </span>
        </>
      ),
      id: 'radio-btn-decline-review',
      value: 'decline',
    },
    {
      key: 3,
      text: (
        <>
          <span>{t('feature.feature_reviews.anchor.approved')}</span>{' '}
          <span>
            (
            {isLoading ? (
              <LoadingOutlined className="m-0" spin />
            ) : (
              statusCounts.approved
            )}
            )
          </span>
        </>
      ),
      id: 'radio-btn-approved-review',
      value: 'approved',
    },
    {
      key: 4,
      text: (
        <>
          <span>{t('feature.feature_reviews.anchor.all')}</span>{' '}
          <span>
            (
            {isLoading ? (
              <LoadingOutlined className="m-0" spin />
            ) : (
              statusCounts.needReview +
              statusCounts.approved +
              statusCounts.declined
            )}
            )
          </span>
        </>
      ),
      id: 'radio-btn-all-review',
      value: 'all',
    },
  ]

  if (isMobile) {
    return (
      <>
        {/* Filter Radio Buttons */}
        <div className="mb-0 bg-white shadow-sm relative z-10">
          <div className="font-medium">
            <Radio.Group
              className="radio-button-review mobile"
              value={filterStatus}
              defaultValue="need_review"
              buttonStyle="outline"
              size="middle"
              onChange={(e) => onFilterChange(e.target.value)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                overflowY: 'hidden',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              {radioData.map((item) => (
                <Radio.Button
                  key={item.key}
                  value={item.value}
                  className="text-center text-gray-900 border-none bg-transparent p-0 rounded-none"
                >
                  <span id={item.id}>{item.text}</span>
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </div>

        {/* User List */}
        <Card
          className="card-list-user-reviewed mobile"
          bodyStyle={{
            padding: emptyMessage ? '0px' : '18px 0',
            background: emptyMessage ? 'none' : 'white',
            boxShadow: emptyMessage
              ? 'none'
              : '0px 2px 4px rgba(0, 0, 0, 0.06)',
            borderRadius: '6px',
          }}
          style={{
            height: '100%',
            padding: '18px',
            background: 'transparent',
            border: 'none',
          }}
        >
          <div className="h-auto px-[18px]">
            {isLoading ? (
              <Loader />
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <UserCard
                  key={index}
                  user={user}
                  onClick={() => onUserClick(user)}
                  isMobile={isMobile}
                />
              ))
            ) : null}
          </div>
        </Card>

        {/* Empty State */}
        {emptyMessage && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center text-center text-sm font-medium text-gray-600">
            {t(`feature.feature_reviews.empty_state.${emptyMessage}`)}
          </div>
        )}
      </>
    )
  }

  return (
    <Card
      className="card-list-user-reviewed h-[calc(100vh-158px)]"
      bodyStyle={{
        padding: '25px 0 24px 20px',
      }}
    >
      {/* Filter Radio Buttons */}
      <div
        className={`flex flex-col items-end mb-6 ${hasScroll ? 'pr-[25px]' : 'pr-5'}`}
      >
        <div className="font-medium">
          <span className="mr-2.5 text-xs text-gray-900">
            {t('feature.feature_reviews.anchor.filter')}
          </span>
          <Radio.Group
            className="radio-button-review"
            value={filterStatus}
            defaultValue="need_review"
            buttonStyle="outline"
            size="middle"
            onChange={(e) => onFilterChange(e.target.value)}
          >
            {radioData.map((item, index) => (
              <Radio.Button
                key={item.key}
                value={item.value}
                className={`
                  text-center min-w-[110px] border-blue-600 rounded-full text-blue-600
                  ${index < radioData.length - 1 ? 'mr-2.5' : ''}
                `}
              >
                <span id={item.id}>{item.text}</span>
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      </div>

      {/* User List */}
      <div
        id="user-list-container"
        className="h-auto max-h-[calc(100vh-263px)] overflow-y-auto overflow-x-hidden pr-5"
      >
        {isLoading ? (
          <Loader />
        ) : users.length > 0 ? (
          users.map((user, index) => (
            <UserCard
              key={index}
              user={user}
              onClick={() => onUserClick(user)}
              isMobile={isMobile}
            />
          ))
        ) : (
          <div className="text-sm font-medium text-gray-600">
            {emptyMessage &&
              t(`feature.feature_reviews.empty_state.${emptyMessage}`)}
          </div>
        )}
      </div>
    </Card>
  )
}

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      fullname: PropTypes.string.isRequired,
      username: PropTypes.string,
      role: PropTypes.string,
      user_id: PropTypes.number,
      last_submission: PropTypes.number,
      submited: PropTypes.string,
      status: PropTypes.oneOf([null, 0, 1, '']),
    })
  ),
  statusCounts: PropTypes.shape({
    needReview: PropTypes.number,
    approved: PropTypes.number,
    declined: PropTypes.number,
  }),
  filterStatus: PropTypes.oneOf(['need_review', 'decline', 'approved', 'all']),
  onFilterChange: PropTypes.func.isRequired,
  onUserClick: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
}

UserList.defaultProps = {
  users: [],
  statusCounts: { needReview: 0, approved: 0, declined: 0 },
  filterStatus: 'need_review',
  emptyMessage: '',
  isLoading: false,
  isMobile: false,
}

export default UserList
