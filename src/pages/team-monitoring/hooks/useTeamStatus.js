import { useMemo } from 'react'
import { useGetTeamLearningStatusQuery } from '../../../services/api'
import { sortTeamsByOngoing } from '../utils/sortingUtils'

/**
 * Hook for team learning status with infinite scroll
 * Returns team members with ongoing program counts
 */
export default function useTeamStatus() {
  const { data, isLoading, isError, error, refetch } =
    useGetTeamLearningStatusQuery()

  // Sort teams by total_ongoing (descending)
  const sortedTeams = useMemo(() => {
    if (!data?.teams) return []
    return sortTeamsByOngoing(data.teams)
  }, [data?.teams])

  return {
    teams: sortedTeams,
    totalOngoing: data?.totalOngoing || 0,
    isLoading,
    isError,
    error,
    refetch,
  }
}
