import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import {
  learningJourneyService,
  queryKeys,
} from '@/services/api/learningJourney'

/**
 * Hook untuk mengambil dan memfilter daftar learning journey
 * @param {Object} options - Query options
 * @returns {Object} Query result dengan filtered data
 */
export const useJourneyList = (options = {}) => {
  const [filter, setFilter] = useState('all') // 'all' | 'ongoing' | 'new' | 'finish'

  // Fetch all journeys
  const query = useQuery({
    queryKey: queryKeys.journeyList(),
    queryFn: learningJourneyService.getJourneyList,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })

  // Filter journeys based on selected filter
  const filteredJourneys = useMemo(() => {
    if (!query.data?.data) return []

    const journeys = query.data.data

    switch (filter) {
      case 'ongoing':
        // Journey yang sudah dimulai tapi belum selesai (is_new = 0, is_completed = 0)
        return journeys.filter(
          (journey) => journey.is_new === 0 && journey.is_completed === 0
        )

      case 'new':
        // Journey yang belum dimulai (is_new = 1)
        return journeys.filter((journey) => journey.is_new === 1)

      case 'finish':
        // Journey yang sudah selesai (is_completed = 1)
        return journeys.filter((journey) => journey.is_completed === 1)

      case 'all':
      default:
        return journeys
    }
  }, [query.data, filter])

  // Calculate stats
  const stats = useMemo(() => {
    if (!query.data?.data) {
      return {
        total: 0,
        completed: 0,
        ongoing: 0,
        new: 0,
      }
    }

    const journeys = query.data.data

    return {
      total: journeys.length,
      completed: journeys.filter((j) => j.is_completed === 1).length,
      ongoing: journeys.filter((j) => j.is_new === 0 && j.is_completed === 0)
        .length,
      new: journeys.filter((j) => j.is_new === 1).length,
    }
  }, [query.data])

  return {
    ...query,
    journeys: filteredJourneys,
    filter,
    setFilter,
    stats,
  }
}
