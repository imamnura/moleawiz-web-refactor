import {
  useGetProfileDetailQuery,
  useGetAchievementsQuery,
  useGetCertificatesQuery,
  useGetCompletedJourneyProfileQuery,
  useGetAdditionalCertificatesQuery,
  useChangeProfilePictureMutation,
} from '@services/api'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import {
  sortCertificates,
  filterCompletedJourney,
} from '../utils/dataProcessing'

/**
 * Main hook for profile data
 * Fetches and combines all profile-related data
 */
export function useProfileData() {
  const user = useSelector((state) => state.auth.user)
  const userId = user?.id

  // Fetch all profile data
  const {
    data: profileDetail,
    isLoading: isLoadingDetail,
    error: errorDetail,
  } = useGetProfileDetailQuery(userId, {
    skip: !userId,
  })

  const { data: achievements = [], isLoading: isLoadingAchievements } =
    useGetAchievementsQuery()

  const { data: certificates = [], isLoading: isLoadingCertificates } =
    useGetCertificatesQuery()

  const { data: completedJourneys = [], isLoading: isLoadingJourneys } =
    useGetCompletedJourneyProfileQuery()

  const { data: additionalCertificates = [], isLoading: isLoadingAdditional } =
    useGetAdditionalCertificatesQuery(userId, {
      skip: !userId,
    })

  // Change profile picture mutation
  const [changeProfilePicture, { isLoading: isChangingPicture }] =
    useChangeProfilePictureMutation()

  // Process data
  const processedData = useMemo(() => {
    return {
      profileDetail: profileDetail || {},
      achievements: achievements || [],
      certificates: sortCertificates(certificates),
      completedJourneys: filterCompletedJourney(completedJourneys),
      additionalCertificates: sortCertificates(additionalCertificates),
    }
  }, [
    profileDetail,
    achievements,
    certificates,
    completedJourneys,
    additionalCertificates,
  ])

  // Combined loading state
  const isLoading =
    isLoadingDetail ||
    isLoadingAchievements ||
    isLoadingCertificates ||
    isLoadingJourneys ||
    isLoadingAdditional

  // Handle profile picture change
  const handlePictureChange = async (file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('os', 'web')
    formData.append('image', file)

    try {
      await changeProfilePicture(formData).unwrap()
      return { success: true }
    } catch (error) {
      console.error('Failed to change profile picture:', error)
      return { success: false, error }
    }
  }

  return {
    // Data
    ...processedData,
    user,

    // Loading states
    isLoading,
    isLoadingDetail,
    isLoadingAchievements,
    isLoadingCertificates,
    isLoadingJourneys,
    isLoadingAdditional,
    isChangingPicture,

    // Actions
    handlePictureChange,

    // Error
    errorDetail,
  }
}
