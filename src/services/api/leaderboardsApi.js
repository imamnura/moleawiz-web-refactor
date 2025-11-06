import { baseApi } from './baseApi'

export const leaderboardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Leaderboards Data
    getLeaderboards: builder.query({
      query: (journeyId) => ({
        url: '/journey/leaderboard',
        method: 'POST',
        body: {
          journey_id: journeyId,
          platform: 'web',
        },
      }),
      providesTags: (result, error, journeyId) => [
        { type: 'Leaderboards', id: journeyId },
      ],
    }),

    // Get Enrolled Programs
    getEnrolledPrograms: builder.query({
      query: () => '/all-enrolled-program',
      providesTags: ['EnrolledPrograms'],
    }),

    // Get User Profile for Leaderboards
    getLeaderboardProfile: builder.query({
      query: () => '/user/profile/leaderboard',
      providesTags: ['LeaderboardProfile'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetLeaderboardsQuery,
  useGetEnrolledProgramsQuery,
  useGetLeaderboardProfileQuery,
} = leaderboardsApi
