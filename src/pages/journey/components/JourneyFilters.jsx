import PropTypes from 'prop-types'
import { Radio } from 'antd'
import { useTranslation } from 'react-i18next'

/**
 * Filter component untuk Learning Journey list
 * Tabs: All, Ongoing, New, Completed
 */
export const JourneyFilters = ({ value, onChange, stats }) => {
  const { t } = useTranslation()

  const filters = [
    {
      key: 'all',
      label: t('feature.feature_mylj.anchor.all'),
      value: 'all',
      id: 'radio-btn-all-my-learning-journey',
      count: stats?.total || 0,
    },
    {
      key: 'ongoing',
      label: t('feature.feature_mylj.anchor.ongoing'),
      value: 'ongoing',
      id: 'radio-btn-on-going-my-learning-journey',
      count: stats?.ongoing || 0,
    },
    {
      key: 'new',
      label: t('feature.feature_mylj.anchor.new'),
      value: 'new',
      id: 'radio-btn-new-my-learning-journey',
      count: stats?.new || 0,
    },
    {
      key: 'finish',
      label: t('feature.feature_mylj.anchor.completed'),
      value: 'finish',
      id: 'radio-btn-finish-my-learning-journey',
      count: stats?.completed || 0,
    },
  ]

  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:inline text-sm font-medium text-gray-700">
        {t('feature.feature_mylj.anchor.filter')}
      </span>

      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        buttonStyle="outline"
        size="middle"
        className="journey-filters"
      >
        {filters.map((filter) => (
          <Radio.Button
            key={filter.key}
            value={filter.value}
            id={filter.id}
            className="min-w-20 text-center"
          >
            <span className="text-xs md:text-sm">
              {filter.label}
              {filter.count > 0 && (
                <span className="ml-1 text-xs opacity-60">
                  ({filter.count})
                </span>
              )}
            </span>
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  )
}

JourneyFilters.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number,
    ongoing: PropTypes.number,
    new: PropTypes.number,
    completed: PropTypes.number,
  }),
}
