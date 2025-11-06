/**
 * Custom hook for fetching academies (Content Library)
 */
import { useGetAcademiesQuery } from '@services/api'

/**
 * Hook to fetch and manage academies
 * @returns {object} { academies, isLoading, error }
 */
export const useAcademies = () => {
  const { data: academies = [], isLoading, error } = useGetAcademiesQuery()

  return {
    academies,
    isLoading,
    error,
  }
}
