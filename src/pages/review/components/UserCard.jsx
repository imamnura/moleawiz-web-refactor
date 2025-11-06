import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import {
  formatSubmissionDate,
  formatSubmissionNumber,
} from '../utils/formatters'

/**
 * UserCard - Single user submission card
 * Displays user info, submission details, and review status
 */
const UserCard = ({ user, onClick, isMobile = false }) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'id'

  const getStatusBadge = (status) => {
    if (status === null) {
      return (
        <span className="text-xs font-medium text-blue-600">
          {t('feature.feature_reviews.anchor.need_review')}
        </span>
      )
    }
    if (status === 1) {
      return (
        <span className="text-xs font-medium text-green-600">
          {t('feature.feature_reviews.anchor.approved')}
        </span>
      )
    }
    if (status === 0) {
      return (
        <span className="text-xs font-medium text-red-600">
          {t('feature.feature_reviews.anchor.declined')}
        </span>
      )
    }
  }

  const getStatusBgColor = (status) => {
    if (status === null) return 'bg-orange-50'
    if (status === 1) return 'bg-green-50'
    if (status === 0) return 'bg-orange-50'
    return 'bg-gray-50'
  }

  // Don't render if user hasn't submitted
  if (user.status === undefined || user.status === '') {
    return null
  }

  if (isMobile) {
    return (
      <div
        onClick={onClick}
        className="border-t border-gray-200 py-[18px] cursor-pointer relative"
      >
        <div className="flex flex-col w-full">
          <div className="w-[70%] text-left mb-0.5">
            <div className="text-sm font-normal text-gray-900 truncate">
              {user.fullname}
            </div>
          </div>

          <div className="w-full text-left">
            <span className="text-xs text-gray-600">{user.role || '-'}</span>
          </div>

          <div className="w-full text-left">
            <div className="text-xs text-gray-600">
              {t('feature.feature_reviews.anchor.submission')}{' '}
              <span className="font-medium text-gray-900">
                {formatSubmissionNumber(user.last_submission)}
              </span>
              <span className="mx-1">•</span>
              {t('feature.feature_reviews.anchor.submitted_on')}{' '}
              <span className="font-medium text-gray-900">
                {user.submited
                  ? formatSubmissionDate(user.submited, locale)
                  : '-'}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`
            absolute top-[17px] right-0 rounded-md px-1.5 py-1
            ${getStatusBgColor(user.status)}
          `}
        >
          {getStatusBadge(user.status)}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="border-t border-gray-200 first:border-t-0 py-[18px] first:pt-0 last:pb-0 flex items-center w-full cursor-pointer hover:bg-gray-50"
    >
      <div className="w-1/2 text-left">
        <div className="font-medium text-base text-gray-900">
          {user.fullname}
        </div>
        <div className="text-gray-600 text-sm">{user.username}</div>
      </div>

      <div className="w-[30%] text-left">
        <div className="text-sm">
          <span className="text-gray-600">
            {t('feature.feature_reviews.anchor.submission')}
          </span>{' '}
          <span className="font-medium text-gray-900">
            {formatSubmissionNumber(user.last_submission)}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">
            {t('feature.feature_reviews.anchor.submitted_on')}
          </span>{' '}
          <span className="font-medium text-gray-900">
            {user.submited ? formatSubmissionDate(user.submited, locale) : '-'}
          </span>
        </div>
      </div>

      <div className="w-[20%] text-center">{getStatusBadge(user.status)}</div>
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string,
    role: PropTypes.string,
    user_id: PropTypes.number,
    last_submission: PropTypes.number,
    submited: PropTypes.string,
    status: PropTypes.oneOf([null, 0, 1, '']),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
}

UserCard.defaultProps = {
  isMobile: false,
}

export default UserCard
