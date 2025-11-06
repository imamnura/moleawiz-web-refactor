import { useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Select } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export function LeaderboardsHeader({
  programOptions,
  organizationOptions,
  selectedProgram,
  selectedOrg,
  onProgramChange,
  onOrgChange,
}) {
  const { t } = useTranslation()
  const [filterOpen, setFilterOpen] = useState(false)

  if (!programOptions || programOptions.length === 0) {
    return null
  }

  return (
    <Row
      align="top"
      className="row-header-leaderboards sticky top-0 z-4 h-[88px] rounded-b-2xl px-10 pb-6 pt-9 leading-normal"
    >
      <Col
        span={10}
        text-title="text-title-leaderboards"
        className="flex items-center text-left text-[22px] font-medium text-white"
      >
        {t('feature.feature_leaderboards.header.leaderboards')}
      </Col>

      <Col span={14} className="flex flex-row items-center justify-end">
        {/* Program Selector */}
        <Select
          value={selectedProgram}
          className="dropdown-leaderboards"
          dpd-name="dpd-program-leaderboards"
          showSearch
          size="large"
          style={{
            width: 400,
            borderRadius: 8,
          }}
          popupClassName="dropdown-select-program-leaderboards"
          dropdownStyle={{
            fontSize: 14,
            padding: '5px 0 5px 11px',
          }}
          onChange={onProgramChange}
          options={programOptions}
          filterOption={(input, option) => {
            const inputLower = input.toLowerCase()
            const optLabel = option.label?.props?.children?.toLowerCase() || ''
            return optLabel.indexOf(inputLower) > -1
          }}
        />

        {/* Organization Level Selector */}
        <Select
          value={selectedOrg}
          className="dropdown-leaderboards ml-5"
          dpd-name="dpd-organization-leaderboards"
          size="large"
          style={{
            width: 240,
            borderRadius: 8,
          }}
          popupClassName="dropdown-organization-level-leaderboards"
          dropdownStyle={{
            fontSize: 14,
            padding: '5px 0 5px 11px',
          }}
          onChange={onOrgChange}
          options={organizationOptions}
          onDropdownVisibleChange={(open) => setFilterOpen(open)}
          suffixIcon={
            filterOpen ? (
              <UpOutlined className="pointer-events-none text-sm text-white" />
            ) : (
              <DownOutlined className="pointer-events-none text-sm text-white" />
            )
          }
        />
      </Col>
    </Row>
  )
}

LeaderboardsHeader.propTypes = {
  programOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      dataIndex: PropTypes.number,
    })
  ).isRequired,
  organizationOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedProgram: PropTypes.number,
  selectedOrg: PropTypes.string,
  onProgramChange: PropTypes.func.isRequired,
  onOrgChange: PropTypes.func.isRequired,
}
