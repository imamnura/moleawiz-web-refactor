import React from 'react'
import PropTypes from 'prop-types'
import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'

/**
 * Home Title Component
 * Displays personalized greeting to user
 *
 * @param {object} props - Component props
 * @param {string} props.userName - User's name
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isMobileVersion - Mobile flag
 * @returns {JSX.Element}
 */
const HomeTitleText = ({ userName, isLoading, isMobileVersion }) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <Skeleton.Input active />
        <span className="sr-only">Loading user name...</span>
      </div>
    )
  }

  if (isMobileVersion) {
    return (
      <h1 className="text-lg font-medium text-text-title mb-1">
        <span className="block mb-1">
          {t('feature.home.main_content.hi')}{' '}
          <span className="text-primary">{userName}</span>.{' '}
        </span>
        <span className="block text-sm font-medium text-text-title">
          {t('feature.home.main_content.lets_go')}
        </span>
      </h1>
    )
  }

  return (
    <h1 className="text-xl font-medium text-text-title">
      {t('feature.home.main_content.hi')}{' '}
      <span className="text-primary">{userName}</span>.{' '}
      {t('feature.home.main_content.lets_go')}
    </h1>
  )
}

HomeTitleText.propTypes = {
  userName: PropTypes.string,
  isLoading: PropTypes.bool,
  isMobileVersion: PropTypes.bool,
}

HomeTitleText.defaultProps = {
  userName: '',
  isLoading: false,
  isMobileVersion: false,
}

export default HomeTitleText
