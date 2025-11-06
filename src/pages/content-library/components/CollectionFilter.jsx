/**
 * CollectionFilter Component
 * Radio filter for Collection tab (All/Program/Course/Module)
 */
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import { useTranslation } from 'react-i18next'

export const CollectionFilter = ({ value, onChange, isMobile = false }) => {
  const { t } = useTranslation()

  const options = [
    { label: t('feature.feature_cl.filter.all'), value: 'allcl' },
    { label: t('feature.feature_cl.filter.program'), value: 'programcl' },
    { label: t('feature.feature_cl.filter.course'), value: 'coursecl' },
    { label: t('feature.feature_cl.filter.module'), value: 'modulecl' },
  ]

  if (isMobile) {
    return (
      <div className="w-full overflow-x-auto mb-4">
        <Radio.Group
          value={value}
          onChange={(e) => onChange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          className="flex gap-2 min-w-max"
        >
          {options.map((option) => (
            <Radio.Button
              key={option.value}
              value={option.value}
              className="px-4"
            >
              {option.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    )
  }

  return (
    <div className="absolute top-0 right-0">
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        optionType="button"
        buttonStyle="solid"
      >
        {options.map((option) => (
          <Radio.Button key={option.value} value={option.value}>
            {option.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  )
}

CollectionFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
}
