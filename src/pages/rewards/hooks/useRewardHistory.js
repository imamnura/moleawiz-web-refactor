import { useGetRewardHistoryQuery } from '@/services/api/rewardsApi'

/**
 * Custom hook for fetching reward history
 *
 * @returns {Object} History data and states
 * - history: Array of history objects
 * - isLoading: Loading state
 * - isError: Error state
 * - error: Error object
 * - refetch: Function to refetch data
 *
 * Example:
 * const { history, isLoading } = useRewardHistory();
 */
export const useRewardHistory = () => {
  const {
    data: history = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRewardHistoryQuery()

  return {
    history: history || [],
    isLoading,
    isError,
    error,
    refetch,
  }
}

export default useRewardHistory
