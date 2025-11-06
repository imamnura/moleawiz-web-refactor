import PropTypes from 'prop-types'
import { Image, Divider, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { formatRewardDateTime, formatPoints } from '../utils/formatters'
import { copyToClipboard } from '../utils/clipboard'
import ICPoints from '../../../assets/images/ic-points.svg'
import ICCopy from '../../../assets/images/ic_copy.svg'
import EmptyHistory from '../../../assets/images/history-empty.svg'
import Loader from '../../../components/Loader'

/**
 * Mobile card list view for reward history
 */
function HistoryList({ history, isLoading, onCopySuccess }) {
  const { t, i18n } = useTranslation()

  const handleCopy = (code) => {
    const success = copyToClipboard(code, true) // Mobile = true
    if (success && onCopySuccess) {
      onCopySuccess()
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (!history || history.length === 0) {
    return (
      <aside
        className="flex flex-col items-center justify-center py-12 px-4"
        role="status"
        aria-live="polite"
      >
        <Image
          preview={false}
          width={120}
          height={120}
          src={EmptyHistory}
          alt="No history available"
          className="mb-4"
        />
        <p className="text-base text-[#9E9E9E] text-center">
          {t('rewards.no_history')}
        </p>
      </aside>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-4" role="list" aria-label="Reward history items">
      {history.map((item) => {
        const dateTime = item.created_date || item.created_at
        const time = item.created_time || ''

        return (
          <article
            key={item.id || item.redeem_code}
            className="bg-white rounded-lg p-4 shadow-sm border border-[#E0E0E0]"
            role="listitem"
          >
            {/* Product Info */}
            <Flex align="center" gap={12} className="mb-3">
              <Image
                preview={false}
                width={48}
                height={48}
                src={item.image}
                fallback={ICPoints}
                style={{ objectFit: 'cover', borderRadius: 4 }}
                alt={item.title}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-title-mobile truncate mb-1">
                  {item.title}
                </p>
                <Flex align="center" justify="space-between" gap={8}>
                  <span className="text-xs text-[#757575]">
                    {formatRewardDateTime(dateTime, time, i18n.language)}
                  </span>
                  <span className="text-sm font-semibold text-[#0066CC]">
                    {formatPoints(item.point)}
                  </span>
                </Flex>
              </div>
            </Flex>

            <Divider className="my-3" />

            {/* Redeem Code */}
            <Flex align="center" justify="space-between" gap={8}>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#757575] mb-1">
                  {t('table.redeem_code')}
                </p>
                <p className="text-sm text-[#424242] font-mono truncate">
                  {item.redeem_code}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(item.redeem_code)}
                className="flex items-center justify-center w-10 h-10 bg-[#E6F2FF] border border-[#0066CC] rounded-lg cursor-pointer active:bg-[#CCE5FF] transition-colors shrink-0"
                aria-label={t('button.copy_code')}
              >
                <img src={ICCopy} alt="Copy" className="w-5 h-5" />
              </button>
            </Flex>
          </article>
        )
      })}
    </div>
  )
}

HistoryList.propTypes = {
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

HistoryList.defaultProps = {
  history: [],
  isLoading: false,
  onCopySuccess: null,
}

export default HistoryList
