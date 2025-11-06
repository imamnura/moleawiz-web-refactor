import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningJourneyAPI } from '../../../services/api/learningJourney';
import { decryptData, getLocalStorage } from '../../../utils';

/**
 * Custom hook for fetching module detail data
 * 
 * @param {string} journeyId - Journey ID
 * @param {string} courseId - Course ID
 * @param {string} moduleId - Module ID
 * @returns {Object} Module detail state and data
 */
export function useModuleDetail(journeyId, courseId, moduleId) {
  // Fetch module detail
  const { 
    data: moduleData, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['module-detail', journeyId, courseId, moduleId],
    queryFn: () => learningJourneyAPI.getModuleDetail(journeyId, courseId, moduleId),
    enabled: !!journeyId && !!courseId && !!moduleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return {
    module: moduleData,
    isLoading,
    error,
  };
}

/**
 * Custom hook for module progress and actions
 * 
 * @param {string} moduleId - Module ID
 * @returns {Object} Progress state and mutation functions
 */
export function useModuleProgress(journeyId, courseId, moduleId) {
  const queryClient = useQueryClient();
  
  // Start module mutation
  const startModuleMutation = useMutation({
    mutationFn: (data) => learningJourneyAPI.startModule(data),
    onSuccess: () => {
      // Invalidate module detail to refresh data
      queryClient.invalidateQueries(['module-detail', journeyId, courseId, moduleId]);
      queryClient.invalidateQueries(['course-modules', journeyId, courseId]);
    },
  });
  
  // Complete module mutation
  const completeModuleMutation = useMutation({
    mutationFn: (data) => learningJourneyAPI.completeModule(data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries(['module-detail', journeyId, courseId, moduleId]);
      queryClient.invalidateQueries(['course-modules', journeyId, courseId]);
      queryClient.invalidateQueries(['course-detail', journeyId, courseId]);
      queryClient.invalidateQueries(['journey-detail', journeyId]);
    },
  });
  
  // Re-sync SCORM data mutation
  const resyncScormMutation = useMutation({
    mutationFn: async ({ scormKey }) => {
      // Get SCORM data from localStorage
      const rawDataDecrypt = decryptData(getLocalStorage(scormKey));
      
      let validData = null;
      
      // Validate data structure
      if (
        rawDataDecrypt &&
        typeof rawDataDecrypt === 'object' &&
        rawDataDecrypt.key === 'data_scorm_web' &&
        rawDataDecrypt.value !== null
      ) {
        validData = rawDataDecrypt;
      }
      
      const emptyDataScorm = {
        key: 'data_scorm_web',
        value: '[]'
      };
      
      // Send SCORM data to server
      const result = await learningJourneyAPI.completeModule(
        validData !== null ? rawDataDecrypt : emptyDataScorm
      );
      
      // Clear localStorage after successful sync
      if (result) {
        localStorage.removeItem(scormKey);
      }
      
      return result;
    },
    onSuccess: () => {
      // Refresh module data
      queryClient.invalidateQueries(['module-detail', journeyId, courseId, moduleId]);
      queryClient.invalidateQueries(['course-modules', journeyId, courseId]);
    },
  });
  
  return {
    startModule: startModuleMutation.mutate,
    completeModule: completeModuleMutation.mutate,
    resyncScorm: resyncScormMutation.mutate,
    isStarting: startModuleMutation.isPending,
    isCompleting: completeModuleMutation.isPending,
    isResyncing: resyncScormMutation.isPending,
  };
}
