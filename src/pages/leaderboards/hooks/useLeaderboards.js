import { useGetLeaderboardsQuery } from '@services/api'

/**
 * Fetch leaderboards data with RTK Query
 * @param {number} journeyId - Journey ID to fetch leaderboards for
 * @param {boolean} enabled - Whether to enable the query
 */
export function useLeaderboards(journeyId, enabled = true) {
  return useGetLeaderboardsQuery(journeyId, {
    skip: !enabled || !journeyId,
    refetchOnMountOrArgChange: 300, // 5 minutes
  })
}
