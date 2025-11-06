import { useState, useEffect, useMemo } from 'react'
import { useLazyGetSubmissionDetailQuery } from '@/services/api/reviewApi'
import {
  processReviewData,
  countReviewDecisions,
} from '../utils/dataProcessing'

/**
 * Hook to manage submission review data
 * Fetches current and previous submission details
 * Handles loading, processing, and counting review decisions
 */
export const useSubmissionReview = () => {
  const [currentReview, setCurrentReview] = useState([])
  const [previousReview, setPreviousReview] = useState([])
  const [overallFeedback, setOverallFeedback] = useState('')

  const [
    fetchCurrent,
    {
      data: currentData,
      isLoading: isLoadingCurrent,
      isFetching: isFetchingCurrent,
    },
  ] = useLazyGetSubmissionDetailQuery()

  const [
    fetchPrevious,
    {
      data: previousData,
      isLoading: isLoadingPrevious,
      isFetching: isFetchingPrevious,
    },
  ] = useLazyGetSubmissionDetailQuery()

  // Process current review data
  useEffect(() => {
    if (currentData?.review) {
      const processed = processReviewData(currentData.review)
      setCurrentReview(processed)
      setOverallFeedback(currentData.feedback || '')
    }
  }, [currentData])

  // Process previous review data
  useEffect(() => {
    if (previousData?.review) {
      const processed = processReviewData(previousData.review)
      setPreviousReview(processed)
    }
  }, [previousData])

  // Count accept/reject decisions
  const reviewCounts = useMemo(() => {
    return countReviewDecisions(currentReview)
  }, [currentReview])

  /**
   * Fetch current submission for review
   * @param {number} moduleId
   * @param {number} userId
   */
  const fetchCurrentSubmission = async (moduleId, userId) => {
    try {
      await fetchCurrent({ moduleId, userId, flag: 0 })
    } catch (error) {
      console.error('Error fetching current submission:', error)
    }
  }

  /**
   * Fetch previous submission for comparison
   * @param {number} moduleId
   * @param {number} userId
   */
  const fetchPreviousSubmission = async (moduleId, userId) => {
    try {
      await fetchPrevious({ moduleId, userId, flag: 1 })
    } catch (error) {
      console.error('Error fetching previous submission:', error)
    }
  }

  /**
   * Fetch both current and previous submissions
   * @param {number} moduleId
   * @param {number} userId
   */
  const fetchBothSubmissions = async (moduleId, userId) => {
    await fetchCurrentSubmission(moduleId, userId)
    await fetchPreviousSubmission(moduleId, userId)
  }

  /**
   * Reset review data
   */
  const resetReviewData = () => {
    setCurrentReview([])
    setPreviousReview([])
    setOverallFeedback('')
  }

  return {
    currentReview,
    previousReview,
    overallFeedback,
    reviewCounts,
    isLoading: isLoadingCurrent || isLoadingPrevious,
    isFetching: isFetchingCurrent || isFetchingPrevious,
    fetchCurrentSubmission,
    fetchPreviousSubmission,
    fetchBothSubmissions,
    resetReviewData,
  }
}
