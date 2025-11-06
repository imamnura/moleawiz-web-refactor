import { useTranslation } from 'react-i18next'
import { Flex } from 'antd'
import PropTypes from 'prop-types'
import ICClock from '../../../assets/images/custom_svgs/IClock'
import ic_membersevent_learningevent from '../../../assets/images/svgs/ic_membersevent_learningevent.svg'

/**
 * Event Card Component
 * Displays event information in list
 */
export default function EventCard({ event, onClick, showBorder = true }) {
  const { t } = useTranslation()

  return (
    <div
      onClick={() => onClick && onClick(event)}
      className={`cursor-pointer py-3 ${showBorder ? 'border-b border-gray-200' : ''}`}
    >
      {/* Event Title & Date Range */}
      <div className="mb-2">
        <div className="text-base font-medium text-text-title-mobile mb-1">
          {event.fullname || event.title}
        </div>
        <div className="text-sm text-[#757575] mb-1">{event.date_range}</div>
        <div className="text-sm font-medium text-[#424242]">{event.title}</div>
      </div>

      {/* Time & Members */}
      <Flex align="center" gap={16} className="text-xs text-[#757575]">
        {/* Time */}
        <Flex align="center" gap={4}>
          <ICClock fill="#757575" width={12} height={12} />
          <span>{event.time_range}</span>
        </Flex>

        {/* Members Count */}
        <Flex align="center" gap={4}>
          <img
            src={ic_membersevent_learningevent}
            alt="Members"
            className="w-3 h-3"
          />
          <span>
            {event.total_users} {t('feature.feature_tm.member')}
          </span>
        </Flex>
      </Flex>
    </div>
  )
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fullname: PropTypes.string,
    title: PropTypes.string.isRequired,
    date_range: PropTypes.string.isRequired,
    time_range: PropTypes.string.isRequired,
    total_users: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  showBorder: PropTypes.bool,
}
