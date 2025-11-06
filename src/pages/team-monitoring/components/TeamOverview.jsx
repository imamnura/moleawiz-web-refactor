import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Image } from 'antd'
import PropTypes from 'prop-types'
import IcTeamMember from '../../../assets/images/svgs/ic_team_teammonitoring.svg'

/**
 * Team Overview Component
 * Displays team count and "Show Team Profile" button
 */
export default function TeamOverview({ teamCount, isLoading }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleShowProfile = () => {
    navigate('/team-monitoring/team-profile')
  }

  if (isLoading) {
    return <div className="h-8 bg-gray-200 rounded animate-pulse" />
  }

  return (
    <Flex justify="space-between" align="center" gap={16}>
      {/* Team Count */}
      <Flex align="center" gap={8}>
        <Image
          preview={false}
          src={IcTeamMember}
          width={32}
          height={32}
          alt="Team"
        />
        <span className="text-sm font-medium text-[#424242]">
          {teamCount} {t('feature.feature_tm.member')}
        </span>
      </Flex>

      {/* Show Team Profile Button */}
      <Button
        type="primary"
        onClick={handleShowProfile}
        className="h-10 px-6 text-sm font-medium"
        style={{
          background: '#0066CC',
          borderColor: '#0066CC',
        }}
      >
        {t('feature.feature_tm.show_team_profile')}
      </Button>
    </Flex>
  )
}

TeamOverview.propTypes = {
  teamCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
}
