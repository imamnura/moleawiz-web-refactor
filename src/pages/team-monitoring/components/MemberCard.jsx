import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

/**
 * Member Card Component
 * Displays team member with ongoing program count
 */
export default function MemberCard({ member, onClick }) {
  const { t } = useTranslation()

  return (
    <div
      onClick={() => onClick && onClick(member)}
      className="cursor-pointer py-3 border-b border-gray-200 last:border-b-0"
    >
      {/* Member Name */}
      <div className="text-base font-medium text-text-title-mobile mb-1">
        {member.fullname}
      </div>

      {/* Ongoing Programs */}
      <div className="text-sm">
        <span className="font-semibold text-[#0066CC]">
          {member.total_ongoing}
        </span>
        <span className="text-[#757575] ml-1">
          {t('feature.feature_tm.ongoing_program')}
        </span>
      </div>
    </div>
  )
}

MemberCard.propTypes = {
  member: PropTypes.shape({
    user_id: PropTypes.number,
    fullname: PropTypes.string.isRequired,
    total_ongoing: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
}
