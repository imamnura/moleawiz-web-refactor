import { useGetTeamOverviewQuery } from '../../../services/api'

/**
 * Hook for team overview data
 * Returns team count and programs list
 */
export default function useTeamOverview() {
  const { data, isLoading, isError, error, refetch } = useGetTeamOverviewQuery()

  return {
    teamCount: data?.teamCount || 0,
    programs: data?.programs || [],
    isLoading,
    isError,
    error,
    refetch,
  }
}
