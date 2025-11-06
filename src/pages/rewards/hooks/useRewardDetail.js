import { useState, useEffect } from 'react'
import { useLazyGetRewardDetailQuery } from '@/services/api/rewardsApi'
import { convertEnter } from '../utils/formatters'

/**
 * Custom hook for fetching reward detail
 *
 * @returns {Object} Reward detail data and functions
 * - rewardDetail: Reward detail object
 * - isLoading: Loading state
 * - isError: Error state
 * - error: Error object
 * - fetchDetail: Function to fetch detail by ID
 * - resetDetail: Function to reset detail state
 *
 * Example:
 * const { rewardDetail, isLoading, fetchDetail } = useRewardDetail();
 *
 * fetchDetail(rewardId);
 */
export const useRewardDetail = () => {
  const [trigger, { data: rewardDetail, isLoading, isError, error }] =
    useLazyGetRewardDetailQuery()

  const [processedDetail, setProcessedDetail] = useState(null)

  // Process description (convert newlines)
  useEffect(() => {
    if (rewardDetail) {
      setProcessedDetail({
        ...rewardDetail,
        description: convertEnter(rewardDetail.description || ''),
      })
    }
  }, [rewardDetail])

  const fetchDetail = async (rewardId) => {
    try {
      await trigger(rewardId).unwrap()
    } catch (err) {
      console.error('Error fetching reward detail:', err)
    }
  }

  const resetDetail = () => {
    setProcessedDetail(null)
  }

  return {
    rewardDetail: processedDetail,
    rawDetail: rewardDetail,
    isLoading,
    isError,
    error,
    fetchDetail,
    resetDetail,
  }
}

export default useRewardDetail
