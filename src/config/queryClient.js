import { QueryClient } from '@tanstack/react-query'

/**
 * Configure QueryClient for TanStack Query
 * 
 * Default configuration:
 * - Cache time: 5 minutes
 * - Stale time: 1 minute
 * - Retry: 1 time on failure
 * - refetchOnWindowFocus: false (disable auto refetch on window focus)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data becomes stale (1 minute)
      staleTime: 1000 * 60,
      
      // Time before cached data is garbage collected (5 minutes)
      cacheTime: 1000 * 60 * 5,
      
      // Retry failed requests once
      retry: 1,
      
      // Don't refetch on window focus (common for auth apps)
      refetchOnWindowFocus: false,
      
      // Don't refetch on mount if data exists
      refetchOnMount: false,
      
      // Don't refetch on reconnect
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
})

/**
 * Query Keys - Centralized query key management
 * Helps with cache invalidation and prevents typos
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'],
    user: () => [...queryKeys.auth.all, 'user'],
    checkUsername: (username) => [...queryKeys.auth.all, 'check-username', username],
  },
  
  // User queries
  user: {
    all: ['user'],
    profile: () => [...queryKeys.user.all, 'profile'],
    settings: () => [...queryKeys.user.all, 'settings'],
    pointHistory: () => [...queryKeys.user.all, 'point-history'],
  },
  
  // Journey queries
  journey: {
    all: () => ['journey'],
    list: () => [...queryKeys.journey.all(), 'list'],
    detail: (id) => [...queryKeys.journey.all(), 'detail', id],
    courses: (journeyId) => [...queryKeys.journey.all(), 'courses', journeyId],
  },
  
  // Notifications queries
  notifications: {
    all: () => ['notifications'],
    byType: (type) => [...queryKeys.notifications.all(), 'type', type],
  },
  
  // Rating queries
  rating: {
    all: () => ['rating'],
    check: (moduleId) => [...queryKeys.rating.all(), 'check', moduleId],
  },
  
  // Team queries
  team: {
    all: () => ['team'],
    status: (isMobile) => [...queryKeys.team.all(), 'status', isMobile ? 'mobile' : 'desktop'],
  },
  
  // Review queries
  review: {
    all: () => ['review'],
    modules: () => [...queryKeys.review.all(), 'modules'],
  },
  
  // Content queries
  content: {
    all: ['content'],
    list: (filters) => [...queryKeys.content.all, 'list', filters],
    detail: (id) => [...queryKeys.content.all, 'detail', id],
  },
}

export default queryClient
