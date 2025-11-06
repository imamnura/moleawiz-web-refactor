import { useGetRewardsQuery } from '@/services/api/rewardsApi'

/**
 * Custom hook for fetching rewards list
 *
 * @returns {Object} Rewards data and states
 * - rewards: Array of reward objects
 * - isLoading: Loading state
 * - isError: Error state
 * - error: Error object
 * - refetch: Function to refetch data
 *
 * Example:
 * const { rewards, isLoading, refetch } = useRewards();
 */
export const useRewards = () => {
  const {
    data: rewards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRewardsQuery()

  // Filter only available rewards (availability > 0)
  const availableRewards = (rewards || []).filter(
    (reward) => reward.availability > 0
  )

  return {
    rewards: availableRewards,
    allRewards: rewards || [],
    isLoading,
    isError,
    error,
    refetch,
  }
}

export default useRewards
