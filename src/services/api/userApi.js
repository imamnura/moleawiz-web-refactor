import { baseApi } from './baseApi'

/**
 * User API endpoints
 * Handles user profile, points, team status, and achievements
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getUserProfile: builder.query({
      query: () => ({
        url: '/profile',
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      providesTags: ['User'],
      transformResponse: (response) => response.data || response,
    }),

    // Get point history
    getPointHistory: builder.query({
      query: () => ({
        url: '/point-history',
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      providesTags: ['Point'],
      transformResponse: (response) => response.data || response || [],
    }),

    // Get team monitoring status
    getTeamStatus: builder.query({
      query: (isMobileVersion = false) => ({
        url: isMobileVersion
          ? '/team/monitoring/detail'
          : '/team/monitoring/team_status',
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      providesTags: ['Team'],
      transformResponse: (response) => response.data || response,
    }),

    // Claim achievement points
    claimPoint: builder.mutation({
      query: ({ userId, moduleId }) => ({
        url: `/achievement/${userId}/${moduleId}`,
        method: 'GET',
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      invalidatesTags: ['User', 'Point'],
      transformResponse: (response) => response.data || response || [],
    }),
  }),
})

export const {
  useGetUserProfileQuery,
  useGetPointHistoryQuery,
  useGetTeamStatusQuery,
  useClaimPointMutation,
} = userApi
