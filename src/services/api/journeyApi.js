import { baseApi } from './baseApi'

/**
 * Journey API endpoints
 * Handles learning journeys, courses, and module completion
 */
export const journeyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all journey data for user
    getAllJourneyData: builder.query({
      query: () => ({
        url: '/journey',
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      providesTags: ['Journey'],
      transformResponse: (response) => {
        const data = response.data || response
        
        // Transform response to include computed fields
        return Array.isArray(data)
          ? data.map((journey) => ({
              ...journey,
              courses: journey.course?.map((course) => ({
                ...course,
                is_completed: course.total_completed === course.total_module ? 1 : 0,
                progress_percentage: Math.round(
                  (course.total_completed / course.total_module) * 100
                ),
              })) || [],
            }))
          : []
      },
    }),

    // Mark module as completed
    completeModule: builder.mutation({
      query: (data) => ({
        url: '/journey/completion',
        method: 'POST',
        body: { data },
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      invalidatesTags: ['Journey', 'Module', 'Course'],
    }),

    // Check if module has rating
    checkRating: builder.query({
      query: (moduleId) => ({
        url: `/check_rating/${moduleId}`,
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      providesTags: (result, error, moduleId) => [
        { type: 'Rating', id: moduleId },
      ],
      transformResponse: (response) => response.data || response,
    }),

    // Check if user got badges
    checkBadges: builder.mutation({
      query: (data) => ({
        url: '/achievement/check_badge',
        method: 'POST',
        body: { data },
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      transformResponse: (response) => response.data || response || [],
    }),

    // Get module reviewed list
    getModuleReviewed: builder.query({
      query: () => ({
        url: '/review/list_module',
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      providesTags: ['Review'],
      transformResponse: (response) => response.data || response || [],
    }),
  }),
})

export const {
  useGetAllJourneyDataQuery,
  useCompleteModuleMutation,
  useCheckRatingQuery,
  useCheckBadgesMutation,
  useGetModuleReviewedQuery,
} = journeyApi
