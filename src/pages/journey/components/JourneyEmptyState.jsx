import PropTypes from 'prop-types'
import { Empty } from 'antd'
import { useTranslation } from 'react-i18next'

/**
 * Empty state component untuk filtered journey list
 */
export const JourneyEmptyState = ({ filter }) => {
  const { t } = useTranslation()

  const getEmptyText = () => {
    switch (filter) {
      case 'ongoing':
        return 'You have no ongoing programs.'
      case 'new':
        return 'You have no new programs.'
      case 'finish':
        return 'You have not completed any program yet.'
      default:
        return t('No learning journeys available')
    }
  }

  return (
    <div className="w-full flex items-center justify-center py-16">
      <Empty
        description={
          <span className="text-sm text-gray-500">{getEmptyText()}</span>
        }
      />
    </div>
  )
}

JourneyEmptyState.propTypes = {
  filter: PropTypes.string,
}
