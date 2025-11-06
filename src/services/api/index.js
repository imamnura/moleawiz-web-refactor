/**
 * Central export for all API services
 * Import from this file to access any API hook
 */

// Base API
export { baseApi } from './baseApi'

// Auth API
export {
  authApi,
  useCheckUsernameMutation,
  useVerifyOTPMutation,
  useLoginMutation,
  useAutoLoginMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useSendTempPasswordMutation,
  useLogoutMutation,
} from './authApi'

// User API
export {
  userApi,
  useGetUserProfileQuery,
  useGetPointHistoryQuery,
  useGetTeamStatusQuery,
  useClaimPointMutation,
} from './userApi'

// Journey API
export {
  journeyApi,
  useGetAllJourneyDataQuery,
  useCompleteModuleMutation,
  useCheckRatingQuery,
  useCheckBadgesMutation,
  useGetModuleReviewedQuery,
} from './journeyApi'

// Notification API
export {
  notificationApi,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from './notificationApi'

// Home API
export {
  homeApi,
  useGetOngoingCoursesQuery,
  useGetNewProgramsQuery,
  useGetExpiringProgramsQuery,
  useGetOngoingProgramsQuery,
  useGetUpcomingEventsQuery,
  useGetEventDetailQuery,
  useSubmitModuleReviewMutation,
} from './homeApi'

// Leaderboards API
export {
  leaderboardsApi,
  useGetLeaderboardsQuery,
  useGetEnrolledProgramsQuery,
  useGetLeaderboardProfileQuery,
} from './leaderboardsApi'

// Profile API
export {
  profileApi,
  useGetProfileDetailQuery,
  useGetAchievementsQuery,
  useGetCertificatesQuery,
  useGetCompletedJourneyProfileQuery,
  useGetAdditionalCertificatesQuery,
  useChangeProfilePictureMutation,
  useLazyExportProfileQuery,
} from './profileApi'

// Review API
export {
  reviewApi,
  useGetModulesNeedReviewQuery,
  useGetUserSubmissionsQuery,
  useGetSubmissionDetailQuery,
  useLazyGetSubmissionDetailQuery,
  useSubmitReviewMutation,
  useDeleteModuleSubmissionMutation,
} from './reviewApi'

// Rewards API
export {
  rewardsApi,
  useGetRewardsQuery,
  useGetRewardDetailQuery,
  useLazyGetRewardDetailQuery,
  useRequestOTPMutation,
  useVerifyOTPMutation as useVerifyRewardOTPMutation,
  useRedeemRewardMutation,
  useGetRewardHistoryQuery,
} from './rewardsApi'

// Content Library API
export {
  contentLibraryApi,
  useGetAcademiesQuery,
  useGetCollectionsQuery,
  useDeleteCollectionMutation,
} from './contentLibraryApi'
export {
  teamMonitoringApi,
  useGetTeamOverviewQuery,
  useGetTeamLearningStatusQuery,
  useGetSelectedProgramQuery,
  useGetAllProgramsDetailQuery,
  useLazyGetAllProgramsDetailQuery,
  useGetEventsListQuery,
  useGetTeamEventDetailQuery,
  useLazyGetTeamEventDetailQuery,
  useGetCalendarEventsQuery,
  useGetTeamStatusDetailQuery,
} from './teamMonitoringApi'
