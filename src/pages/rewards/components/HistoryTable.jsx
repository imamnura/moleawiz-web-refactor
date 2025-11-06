import PropTypes from 'prop-types'
import { Table, Image, Flex, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { formatRewardDateTime, formatPoints } from '../utils/formatters'
import { copyToClipboard } from '../utils/clipboard'
import ICPoints from '../../../assets/images/ic-points.svg'
import ICCopy from '../../../assets/images/ic_copy.svg'

/**
 * Desktop table view for reward history
 */
function HistoryTable({ history, isLoading, onCopySuccess }) {
  const { t, i18n } = useTranslation()

  const handleCopy = (code) => {
    const success = copyToClipboard(code, false) // Desktop = false
    if (success && onCopySuccess) {
      onCopySuccess()
    }
  }

  const columns = [
    {
      title: t('table.date_time'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: '25%',
      render: (text, record) => {
        // API might return separate date and time or combined
        const dateTime = record.created_date || text
        const time = record.created_time || ''
        return (
          <span className="text-sm text-[#424242]">
            {formatRewardDateTime(dateTime, time, i18n.language)}
          </span>
        )
      },
    },
    {
      title: t('table.product'),
      dataIndex: 'title',
      key: 'title',
      width: '35%',
      render: (text, record) => (
        <Flex align="center" gap={12}>
          <Image
            preview={false}
            width={40}
            height={40}
            src={record.image}
            fallback={ICPoints}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            alt={text}
          />
          <span className="text-sm text-[#424242] font-medium">{text}</span>
        </Flex>
      ),
    },
    {
      title: t('table.points'),
      dataIndex: 'point',
      key: 'point',
      width: '15%',
      align: 'right',
      render: (points) => (
        <span className="text-sm text-[#424242] font-semibold">
          {formatPoints(points)}
        </span>
      ),
    },
    {
      title: t('table.redeem_code'),
      dataIndex: 'redeem_code',
      key: 'redeem_code',
      width: '25%',
      render: (code) => (
        <Flex align="center" justify="space-between" gap={8}>
          <span className="text-sm text-[#424242] font-mono">{code}</span>
          <button
            type="button"
            onClick={() => handleCopy(code)}
            className="flex items-center justify-center w-8 h-8 bg-[#E6F2FF] border border-[#0066CC] rounded-lg cursor-pointer hover:bg-[#CCE5FF] transition-colors"
            aria-label={t('button.copy_code')}
          >
            <img src={ICCopy} alt="Copy" className="w-4 h-4" />
          </button>
        </Flex>
      ),
    },
  ]

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#F5F5F5',
            headerColor: '#757575',
            rowHoverBg: '#F9FAFB',
          },
        },
      }}
    >
      <Table
        columns={columns}
        dataSource={history}
        loading={isLoading}
        rowKey={(record) => record.id || record.redeem_code}
        pagination={false}
        scroll={{ y: 477 }}
        locale={{
          emptyText: (
            <div className="py-12 text-center">
              <p className="text-base text-[#9E9E9E]">
                {t('rewards.no_history')}
              </p>
            </div>
          ),
        }}
        className="rewards-history-table"
      />
    </ConfigProvider>
  )
}

HistoryTable.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      created_at: PropTypes.string,
      created_date: PropTypes.string,
      created_time: PropTypes.string,
      title: PropTypes.string,
      image: PropTypes.string,
      point: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      redeem_code: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  onCopySuccess: PropTypes.func,
}

HistoryTable.defaultProps = {
  history: [],
  isLoading: false,
  onCopySuccess: null,
}

export default HistoryTable
