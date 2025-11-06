import { DownOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

/**
 * Mobile header for leaderboards with filter controls
 * @param {Object} props
 * @param {string} props.selectedProgram - Currently selected program name
 * @param {string} props.selectedOrg - Currently selected organization level
 * @param {Function} props.onProgramClick - Handler for program selector click
 * @param {Function} props.onOrgClick - Handler for organization selector click
 */
export function MobileLeaderboardsHeader({
  selectedProgram,
  selectedOrg,
  onProgramClick,
  onOrgClick,
}) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-4 h-[118px] bg-linear-to-r from-[#00AED6] to-[#0074B7] px-3 pb-2.5 pt-6">
      {/* Title */}
      <Text className="block text-lg font-medium text-white">
        {t('feature.feature_leaderboards.title')}
      </Text>

      {/* Program Selector */}
      <button
        type="button"
        onClick={onProgramClick}
        className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg bg-white/90 px-3 py-2"
        aria-label="Select program"
      >
        <Text className="max-w-[85%] truncate text-sm font-medium text-gray-800">
          {selectedProgram ||
            t('feature.feature_leaderboards.header.select_program')}
        </Text>
        <DownOutlined className="text-xs text-gray-500" />
      </button>

      {/* Organization Selector */}
      <button
        type="button"
        onClick={onOrgClick}
        className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/20 px-3 py-1"
        aria-label="Select organization level"
      >
        <Text className="text-xs text-white">
          {selectedOrg ||
            t('feature.feature_leaderboards.header.all_organization')}
        </Text>
        <DownOutlined className="text-[10px] text-white" />
      </button>
    </header>
  )
}

MobileLeaderboardsHeader.propTypes = {
  selectedProgram: PropTypes.string,
  selectedOrg: PropTypes.string,
  onProgramClick: PropTypes.func.isRequired,
  onOrgClick: PropTypes.func.isRequired,
}
