import { useOutletContext } from 'react-router-dom'
import { useGetProfileDetailQuery } from '@services/api/profileApi'

/**
 * Custom hook for fetching user profile details
 * Used for email contact functionality in help pages
 *
 * Uses RTK Query for efficient caching and state management
 */
export const useUserProfile = () => {
  // Get user data from outlet context
  const outletContext = useOutletContext()
  const userData = outletContext?.[1] || {}

  // Fetch user profile using RTK Query
  const {
    data: userProfile,
    isLoading,
    error,
  } = useGetProfileDetailQuery(userData?.userId, {
    skip: !userData?.userId, // Skip query if no userId
  })

  return {
    loading: isLoading,
    profile: userProfile || null,
    userData,
    error,
  }
}
