import React from 'react'
import PropTypes from 'prop-types'
import { Radio, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'

/**
 * FilterRadio Component for Learning Journey
 * @param {function} onChange - Callback when filter changes
 * @param {string} defaultValue - Default selected filter
 * @param {boolean} isMobile - Mobile version flag
 */
export const FilterRadio = ({ 
  onChange, 
  defaultValue = 'all',
  isMobile = false 
}) => {
  const { t } = useTranslation()

  const filterOptions = [
    {
      key: 1,
      text: t('feature.feature_mylj.anchor.all'),
      id: 'radio-btn-all-my-learning-journey',
      value: 'all',
    },
    {
      key: 2,
      text: t('feature.feature_mylj.anchor.ongoing'),
      id: 'radio-btn-on-going-my-learning-journey',
      value: 'ongoing',
    },
    {
      key: 3,
      text: t('feature.feature_mylj.anchor.new'),
      id: 'radio-btn-new-my-learning-journey',
      value: 'new',
    },
    {
      key: 4,
      text: t('feature.feature_mylj.anchor.completed'),
      id: 'radio-btn-finish-my-learning-journey',
      value: 'finish',
    },
  ]

  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            buttonCheckedBg: '#123FA0',
            radioSize: 24,
            buttonColor: '#123FA0',
          },
        },
        token: {
          fontFamily: 'Roboto',
          colorPrimaryHover: '#FFFFFF',
          colorPrimaryActive: '#FFFFFF',
        },
      }}
    >
      <div className="flex items-center gap-2">
        {!isMobile && (
          <span className="text-sm font-medium text-text-title mr-2">
            {t('feature.feature_mylj.anchor.filter')}
          </span>
        )}
        <Radio.Group
          defaultValue={defaultValue}
          buttonStyle="outline"
          size="middle"
          onChange={(e) => onChange(e.target.value)}
          className={isMobile ? 'flex flex-wrap gap-2' : ''}
        >
          {filterOptions.map((item) => (
            <Radio.Button
              key={item.key}
              value={item.value}
              className={
                isMobile
                  ? 'text-xs rounded-full border-primary min-w-fit'
                  : 'text-center min-w-[92px] border-primary rounded-full ml-2.5'
              }
            >
              <span id={item.id}>{item.text}</span>
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    </ConfigProvider>
  )
}

FilterRadio.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  isMobile: PropTypes.bool
}

export default FilterRadio
