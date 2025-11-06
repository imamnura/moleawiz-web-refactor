import { baseApi } from './baseApi'

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get User Profile
    getUserProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),

    // Get All Journey Data
    getAllJourneyData: builder.query({
      query: () => '/journey/all',
      providesTags: ['Journey'],
      transformResponse: (response) => {
        // Transform response to include computed fields
        return response.map((journey) => ({
          ...journey,
          courses: journey.course?.map((course) => ({
            ...course,
            is_completed: course.total_completed === course.total_module ? 1 : 0,
            progress_percentage: Math.round(
              (course.total_completed / course.total_module) * 100
            ),
          })) || [],
        }))
      },
    }),

    // Get Ongoing Courses
    getOngoingCourses: builder.query({
      query: () => '/courses/ongoing',
      providesTags: ['Course'],
    }),

    // Get New Programs/Journeys
    getNewPrograms: builder.query({
      query: () => '/journeys/new',
      providesTags: ['Journey'],
    }),

    // Get Expiring Programs
    getExpiringPrograms: builder.query({
      query: () => '/journeys/expiring',
      providesTags: ['Journey'],
    }),

    // Get Ongoing Programs
    getOngoingPrograms: builder.query({
      query: () => '/journeys/ongoing',
      providesTags: ['Journey'],
    }),

    // Get Upcoming Events
    getUpcomingEvents: builder.query({
      query: () => '/events/upcoming',
      providesTags: ['Event'],
    }),

    // Get Event Detail
    getEventDetail: builder.query({
      query: (eventId) => `/events/${eventId}`,
      providesTags: (result, error, eventId) => [
        { type: 'Event', id: eventId },
      ],
    }),

    // Get Notifications
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),

    // Mark Notification as Read
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Check Rating for Module
    checkRating: builder.query({
      query: (moduleId) => `/modules/${moduleId}/check-rating`,
      providesTags: (result, error, moduleId) => [
        { type: 'Rating', id: moduleId },
      ],
    }),

    // Check Badges
    checkBadges: builder.query({
      query: () => '/badges/check',
      providesTags: ['Badge'],
    }),

    // Claim Point
    claimPoint: builder.mutation({
      query: (data) => ({
        url: '/points/claim',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Point', 'User'],
    }),

    // Complete Module
    completeModule: builder.mutation({
      query: (moduleId) => ({
        url: `/modules/${moduleId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['Module', 'Course', 'Journey'],
    }),

    // Get Point History
    getPointHistory: builder.query({
      query: () => '/points/history',
      providesTags: ['Point'],
    }),

    // Get Team Status
    getTeamStatus: builder.query({
      query: () => '/team/status',
      providesTags: ['User'],
    }),

    // Get Module Reviewed Status
    getModuleReviewed: builder.query({
      query: (moduleId) => `/modules/${moduleId}/reviewed`,
      providesTags: (result, error, moduleId) => [
        { type: 'Rating', id: moduleId },
      ],
    }),

    // Submit Module Review
    submitModuleReview: builder.mutation({
      query: ({ moduleId, ...reviewData }) => ({
        url: `/modules/${moduleId}/review`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { moduleId }) => [
        { type: 'Rating', id: moduleId },
        'Module',
      ],
    }),
  }),
})

export const {
  useGetUserProfileQuery,
  useGetAllJourneyDataQuery,
  useGetOngoingCoursesQuery,
  useGetNewProgramsQuery,
  useGetExpiringProgramsQuery,
  useGetOngoingProgramsQuery,
  useGetUpcomingEventsQuery,
  useGetEventDetailQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useCheckRatingQuery,
  useCheckBadgesQuery,
  useClaimPointMutation,
  useCompleteModuleMutation,
  useGetPointHistoryQuery,
  useGetTeamStatusQuery,
  useGetModuleReviewedQuery,
  useSubmitModuleReviewMutation,
} = homeApi
