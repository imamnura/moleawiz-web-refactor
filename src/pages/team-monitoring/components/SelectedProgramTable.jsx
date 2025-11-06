import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card, Table, Button, Select, Row, Col, Image, Progress } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import useSelectedProgram from '../hooks/useSelectedProgram'
import { generateEmailLink } from '../utils/emailUtils'
import Loader from '../../../components/Loader'
import IEmailActive from '../../../assets/images/svgs/ic_email_helptopics.svg'
import IEmailDisabled from '../../../assets/images/svgs/ic_sendnotifdisabled_teammonitoring.svg'

/**
 * Selected Program Table Component
 * Shows members enrolled in a specific program with selectable rows
 */
export default function SelectedProgramTable({ journeyId, programName }) {
  const { t } = useTranslation()
  const isMobile = useSelector((state) => state.isMobile)

  const [filter, setFilter] = useState('allprogress')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])

  const { members, isLoading } = useSelectedProgram(journeyId, filter)

  // Reset selection when filter or data changes
  useEffect(() => {
    setSelectedRowKeys([])
    setSelectedMembers([])
  }, [filter, members])

  // Filter options
  const filterOptions = [
    {
      value: 'allprogress',
      label: t('feature.feature_tm.all_progress'),
    },
    {
      value: 'ongoing',
      label: t('feature.feature_tm.ongoing'),
    },
    {
      value: 'completed',
      label: t('feature.feature_tm.completed'),
    },
  ]

  // Table columns
  const columns = [
    {
      title: 'No.',
      dataIndex: 'nomor',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: t('feature.feature_tm.team_member'),
      dataIndex: 'fullname',
      render: (text) => text || '-',
    },
    {
      title: t('feature.feature_tm.progress'),
      dataIndex: 'progress',
      width: 120,
      render: (progress) => (
        <Progress
          type="circle"
          strokeColor={progress >= 100 ? '#52C41A' : '#0066CC'}
          percent={progress}
          format={() => `${progress}%`}
          size={39}
        />
      ),
    },
    {
      title: t('feature.feature_tm.role'),
      dataIndex: 'role',
      width: 220,
      render: (text) => text || '-',
    },
    {
      title: t('feature.feature_tm.last_access'),
      dataIndex: 'last_access',
      render: (text) => text || '-',
    },
  ]

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys)
      setSelectedMembers(rows)
    },
    getCheckboxProps: (record) => ({
      disabled: record.progress === 100,
      name: 'select-member-notification-team-monitoring',
    }),
  }

  // Handle filter change
  const handleFilterChange = (value) => {
    setFilter(value)
  }

  // Handle send notification
  const handleSendNotification = () => {
    if (selectedMembers.length > 0) {
      const emailLink = generateEmailLink(selectedMembers, programName)
      window.open(emailLink)
    }
  }

  // Prepare table data with keys
  const tableData = members.map((member, index) => ({
    ...member,
    key: member.user_id || index,
  }))

  return (
    <Card
      className="w-full rounded-3xl"
      styles={{
        body: {
          padding: isMobile ? 16 : 24,
        },
      }}
    >
      {/* Header Row */}
      <Row className="mb-5" align="middle">
        {/* Left: Selected count and send button */}
        <Col span={12} className="flex items-center gap-3">
          <div className="text-sm text-[#67686D]">
            {t('feature.feature_tm.selected_member')}: {selectedRowKeys.length}
          </div>
          <Button
            disabled={selectedRowKeys.length === 0}
            onClick={handleSendNotification}
            className="h-10 px-4 flex items-center gap-2"
            style={{
              borderColor: selectedRowKeys.length > 0 ? '#0066CC' : '#D9D9D9',
              color: selectedRowKeys.length > 0 ? '#0066CC' : '#00000040',
            }}
          >
            <Image
              preview={false}
              src={selectedRowKeys.length > 0 ? IEmailActive : IEmailDisabled}
              width={20}
              height={20}
            />
            <span>{t('feature.feature_tm.send_notification')}</span>
          </Button>
        </Col>

        {/* Right: Filter dropdown */}
        <Col span={12} className="flex justify-end">
          <Select
            value={filter}
            onChange={handleFilterChange}
            onDropdownVisibleChange={(open) => setFilterOpen(open)}
            options={filterOptions}
            size="large"
            className="w-[187px]"
            suffixIcon={
              filterOpen ? (
                <UpOutlined style={{ color: '#67686D' }} />
              ) : (
                <DownOutlined style={{ color: '#67686D' }} />
              )
            }
          />
        </Col>
      </Row>

      {/* Table */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        loading={{
          indicator: <Loader />,
          spinning: isLoading,
        }}
        className="selected-program-table"
      />
    </Card>
  )
}

SelectedProgramTable.propTypes = {
  journeyId: PropTypes.string.isRequired,
  programName: PropTypes.string.isRequired,
}
