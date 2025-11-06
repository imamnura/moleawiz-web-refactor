import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserSubmissionsQuery } from '@/services/api/reviewApi'
import {
  filterByStatus,
  countByStatus,
  combineUserData,
} from '../utils/dataProcessing'

/**
 * Hook to manage user submissions for a module
 * Handles filtering by status (need review, approved, declined, all)
 */
export const useUserSubmissions = () => {
  const { moduleId, journeyId } = useParams()
  const [filterStatus, setFilterStatus] = useState('need_review')

  const { data, isLoading, isError, error, refetch } =
    useGetUserSubmissionsQuery(
      { moduleId: Number(moduleId), journeyId: Number(journeyId) },
      { skip: !moduleId || !journeyId }
    )

  // Combine has_submitted and not_submitted users
  const { allUsers, hasSubmitted, notSubmitted } = useMemo(() => {
    return combineUserData(data)
  }, [data])

  // Count by status
  const statusCounts = useMemo(() => {
    return countByStatus(hasSubmitted)
  }, [hasSubmitted])

  // Filter and sort users based on selected filter
  const filteredUsers = useMemo(() => {
    return filterByStatus(hasSubmitted, filterStatus, notSubmitted)
  }, [hasSubmitted, filterStatus, notSubmitted])

  // Get empty state message based on filter
  const getEmptyMessage = () => {
    if (filterStatus === 'need_review' && statusCounts.needReview === 0) {
      return 'no_submissions_need_review'
    }
    if (filterStatus === 'approved' && statusCounts.approved === 0) {
      return 'no_submissions_approved'
    }
    if (filterStatus === 'decline' && statusCounts.declined === 0) {
      return 'no_submissions_declined'
    }
    if (
      filterStatus === 'all' &&
      statusCounts.needReview === 0 &&
      statusCounts.approved === 0 &&
      statusCounts.declined === 0
    ) {
      return 'no_submissions_all'
    }
    return ''
  }

  return {
    users: filteredUsers,
    allUsers,
    hasSubmitted,
    notSubmitted,
    filterStatus,
    setFilterStatus,
    statusCounts,
    emptyMessage: getEmptyMessage(),
    isLoading,
    isError,
    error,
    refetchUsers: refetch,
    moduleId: Number(moduleId),
    journeyId: Number(journeyId),
  }
}
