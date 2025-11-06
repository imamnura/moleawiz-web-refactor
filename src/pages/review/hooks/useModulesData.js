import { useGetModulesNeedReviewQuery } from '@/services/api/reviewApi'

/**
 * Hook to manage modules that need review
 * Fetches list of modules that have submissions needing review
 */
export const useModulesData = () => {
  const {
    data: modules = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetModulesNeedReviewQuery()

  return {
    modules,
    modulesCount: modules.length,
    isLoading,
    isError,
    error,
    refetchModules: refetch,
  }
}
