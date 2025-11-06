import { useTranslation } from 'react-i18next'
import Loader from '@components/common/Loader'
import { UserProfileCard } from './components/UserProfileCard'
import { ProfileTabs } from './components/ProfileTabs'
import { useProfileData } from './hooks/useProfileData'
import { useExportProfile } from './hooks/useExportProfile'

/**
 * Profile Page - Refactored
 * Display user profile with avatar, info, and tabs for certificates/programs/achievements
 */
function ProfilePage() {
  const { t } = useTranslation()

  // Fetch profile data
  const {
    user,
    profileDetail,
    certificates,
    completedJourneys,
    achievements,
    additionalCertificates,
    isLoading,
    isLoadingCertificates,
    isLoadingJourneys,
    isLoadingAchievements,
    isLoadingAdditional,
    isChangingPicture,
    handlePictureChange,
  } = useProfileData()

  // Export profile functionality
  const { handleExport, isExporting } = useExportProfile()

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Page Title */}
      <div className="mb-5">
        <h1 className="text-[22px] font-medium text-gray-800">
          {t('feature.feature_profile.header.profile')}
        </h1>
      </div>

      {/* User Profile Card */}
      <UserProfileCard
        user={user}
        profileDetail={profileDetail}
        onPictureChange={handlePictureChange}
        onExport={handleExport}
        isExporting={isExporting}
        isChangingPicture={isChangingPicture}
      />

      {/* Profile Tabs */}
      <ProfileTabs
        certificates={certificates}
        programs={completedJourneys}
        achievements={achievements}
        additionalCertificates={additionalCertificates}
        isLoadingCertificates={isLoadingCertificates}
        isLoadingPrograms={isLoadingJourneys}
        isLoadingAchievements={isLoadingAchievements}
        isLoadingAdditional={isLoadingAdditional}
      />
    </div>
  )
}

export default ProfilePage
