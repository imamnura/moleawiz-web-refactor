import { baseApi } from './baseApi'

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get User Profile Detail
    getProfileDetail: builder.query({
      query: (userId) => `/user/${userId}/profile`,
      providesTags: ['ProfileDetail'],
    }),

    // Get Achievements/Badges
    getAchievements: builder.query({
      query: () => '/user/achievements',
      providesTags: ['Achievements'],
    }),

    // Get Certificates
    getCertificates: builder.query({
      query: () => '/user/certificates',
      providesTags: ['Certificates'],
      transformResponse: (response) => {
        // Flatten certificates array from response
        return [].concat(
          ...response.map(({ certificates }) => certificates || [])
        )
      },
    }),

    // Get Completed Journey for Profile
    getCompletedJourneyProfile: builder.query({
      query: () => '/journey/completed/profile',
      providesTags: ['CompletedJourney'],
    }),

    // Get Additional Certificates
    getAdditionalCertificates: builder.query({
      query: (userId) => `/user/${userId}/additional-certificates`,
      providesTags: ['AdditionalCertificates'],
    }),

    // Change Profile Picture
    changeProfilePicture: builder.mutation({
      query: (formData) => ({
        url: '/user/profile/picture',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['ProfileDetail', 'User'],
    }),

    // Export Profile (GET with token)
    exportProfile: builder.query({
      query: ({ token, lang }) => ({
        url: `/profile/export?token=${token}&lang=${lang}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetProfileDetailQuery,
  useGetAchievementsQuery,
  useGetCertificatesQuery,
  useGetCompletedJourneyProfileQuery,
  useGetAdditionalCertificatesQuery,
  useChangeProfilePictureMutation,
  useLazyExportProfileQuery,
} = profileApi
