/**
 * Custom hook for fetching collections with filter
 */
import { useGetCollectionsQuery } from '@services/api'
import { mapFilterToAPI } from '../utils/collectionUtils'

/**
 * Hook to fetch and manage collections
 * @param {string} filter - Filter value ('allcl' | 'programcl' | 'coursecl' | 'modulecl')
 * @returns {object} { collections, isLoading, error, totalCount }
 */
export const useCollections = (filter = 'allcl') => {
  const apiFilter = mapFilterToAPI(filter)
  const {
    data: collections = [],
    isLoading,
    error,
  } = useGetCollectionsQuery(apiFilter)

  return {
    collections,
    isLoading,
    error,
    totalCount: collections.length,
  }
}
