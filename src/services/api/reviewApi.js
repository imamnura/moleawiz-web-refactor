import { baseApi } from './baseApi'

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all modules that need review (for anchor/reviewer)
    getModulesNeedReview: builder.query({
      query: () => '/anchor/modules',
      providesTags: ['ModulesNeedReview'],
    }),

    // Get list of users and their submissions for a specific module
    getUserSubmissions: builder.query({
      query: ({ moduleId, journeyId }) => ({
        url: `/anchor/modules/${moduleId}/journey/${journeyId}/users`,
        method: 'GET',
      }),
      providesTags: (result, error, { moduleId }) => [
        { type: 'UserSubmissions', id: moduleId },
      ],
    }),

    // Get submission detail for review (current submission)
    getSubmissionDetail: builder.query({
      query: ({ moduleId, userId, flag = 0 }) => ({
        url: `/anchor/modules/${moduleId}/users/${userId}/submission`,
        method: 'GET',
        params: { flag }, // 0 = current/last, 1 = previous
      }),
    }),

    // Submit review for a user's submission
    submitReview: builder.mutation({
      query: (data) => ({
        url: '/anchor/review/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { cmid }) => [
        'ModulesNeedReview',
        { type: 'UserSubmissions', id: cmid },
      ],
    }),

    // Delete a module submission (only allowed after deadline and all users submitted)
    deleteModuleSubmission: builder.mutation({
      query: ({ cmid }) => ({
        url: '/anchor/modules/delete',
        method: 'POST',
        body: { cmid },
      }),
      invalidatesTags: ['ModulesNeedReview'],
    }),
  }),
})

export const {
  useGetModulesNeedReviewQuery,
  useGetUserSubmissionsQuery,
  useGetSubmissionDetailQuery,
  useLazyGetSubmissionDetailQuery,
  useSubmitReviewMutation,
  useDeleteModuleSubmissionMutation,
} = reviewApi
