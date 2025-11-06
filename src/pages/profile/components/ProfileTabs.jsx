import PropTypes from 'prop-types'
import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { CertificateList } from './CertificateList'
import { ProgramList } from './ProgramList'
import { AchievementList } from './AchievementList'
import { AdditionalCertificateList } from './AdditionalCertificateList'

/**
 * Profile Tabs Component
 * Contains Certificate, Programs, Achievements, and Additional tabs
 */
export function ProfileTabs({
  certificates,
  programs,
  achievements,
  additionalCertificates,
  isLoadingCertificates,
  isLoadingPrograms,
  isLoadingAchievements,
  isLoadingAdditional,
}) {
  const { t } = useTranslation()

  const tabItems = [
    {
      key: '1',
      label: t('feature.feature_profile.sec_tab.certificate'),
      children: (
        <CertificateList
          certificates={certificates}
          isLoading={isLoadingCertificates}
        />
      ),
    },
    {
      key: '2',
      label: t('feature.feature_profile.sec_tab.completed_programs'),
      children: (
        <ProgramList programs={programs} isLoading={isLoadingPrograms} />
      ),
    },
    {
      key: '3',
      label: t('feature.feature_profile.sec_tab.achievements'),
      children: (
        <AchievementList
          achievements={achievements}
          isLoading={isLoadingAchievements}
        />
      ),
    },
    {
      key: '4',
      label: t('feature.feature_profile.sec_tab.additional'),
      children: (
        <AdditionalCertificateList
          certificates={additionalCertificates}
          isLoading={isLoadingAdditional}
        />
      ),
    },
  ]

  return (
    <div className="mt-5 rounded-lg bg-white p-5 shadow-[3px_0_16px_rgba(0,0,0,0.1)]">
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="profile-tabs"
        tabBarStyle={{
          marginBottom: 0,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      />
    </div>
  )
}

ProfileTabs.propTypes = {
  certificates: PropTypes.arrayOf(
    PropTypes.shape({
      id_certif: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name_certif: PropTypes.string,
      file_name: PropTypes.string,
      thumbnail: PropTypes.string,
      journey_name: PropTypes.string,
    })
  ),
  programs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      thumbnail: PropTypes.string,
      completed_date: PropTypes.string,
      point: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      total_course: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
    })
  ),
  achievements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      image: PropTypes.string,
      thumbnail: PropTypes.string,
      module_name: PropTypes.string,
      recived: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  additionalCertificates: PropTypes.arrayOf(
    PropTypes.shape({
      id_certif: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name_certif: PropTypes.string,
      file_name: PropTypes.string,
      thumbnail: PropTypes.string,
      journey_name: PropTypes.string,
    })
  ),
  isLoadingCertificates: PropTypes.bool,
  isLoadingPrograms: PropTypes.bool,
  isLoadingAchievements: PropTypes.bool,
  isLoadingAdditional: PropTypes.bool,
}

ProfileTabs.defaultProps = {
  certificates: [],
  programs: [],
  achievements: [],
  additionalCertificates: [],
  isLoadingCertificates: false,
  isLoadingPrograms: false,
  isLoadingAchievements: false,
  isLoadingAdditional: false,
}
