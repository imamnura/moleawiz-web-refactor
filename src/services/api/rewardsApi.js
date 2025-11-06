import { baseApi } from './baseApi'

/**
 * Rewards API - RTK Query endpoints for rewards management
 *
 * Features:
 * - List available rewards
 * - Get reward details
 * - Redeem rewards with OTP verification
 * - View redeem history
 */
export const rewardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get list of available rewards
     * GET /rewards
     */
    getRewards: builder.query({
      query: () => '/rewards',
      providesTags: ['Rewards'],
      transformResponse: (response) => response.data || [],
    }),

    /**
     * Get reward detail by ID
     * GET /rewards/:id
     */
    getRewardDetail: builder.query({
      query: (rewardId) => `/rewards/${rewardId}`,
      transformResponse: (response) => {
        // API returns array with single object
        return response.data && response.data.length > 0
          ? response.data[0]
          : null
      },
    }),

    /**
     * Check username and request OTP
     * POST /check_username
     * Payload: {
     *   username: string,
     *   check_username_type: 'general',
     *   xlocalization: 'EN',
     *   reward_id: number
     * }
     */
    requestOTP: builder.mutation({
      query: (data) => ({
        url: '/check_username',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => {
        // If empty array, reward is out of stock
        if (Array.isArray(response.data) && response.data.length === 0) {
          return { outOfStock: true }
        }
        return {
          outOfStock: false,
          verificationCodeExpired:
            response.data?.verification_code_expired_datetime,
          verificationCodeSent: response.data?.verification_code_send_datetime,
        }
      },
    }),

    /**
     * Verify OTP code
     * POST /verify-otp
     * Payload: {
     *   username: string,
     *   otp: string,
     *   firebase_token: string,
     *   brand: string,
     *   model: string,
     *   serial_number: string,
     *   platform: string,
     *   version: string
     * }
     */
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: '/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Redeem reward
     * POST /redeem/:rewardId
     */
    redeemReward: builder.mutation({
      query: (rewardId) => ({
        url: `/redeem/${rewardId}`,
        method: 'POST',
      }),
      transformResponse: (response) => {
        // If empty array, reward is out of stock
        if (Array.isArray(response.data) && response.data.length === 0) {
          return { outOfStock: true }
        }
        return {
          outOfStock: false,
          reward: response.data,
        }
      },
      invalidatesTags: ['Rewards', 'RewardHistory', 'UserBalance'],
    }),

    /**
     * Get redeem history
     * GET /rewards/history
     */
    getRewardHistory: builder.query({
      query: () => '/rewards/history',
      providesTags: ['RewardHistory'],
      transformResponse: (response) => response.data || [],
    }),
  }),
})

export const {
  useGetRewardsQuery,
  useGetRewardDetailQuery,
  useLazyGetRewardDetailQuery,
  useRequestOTPMutation,
  useVerifyOTPMutation,
  useRedeemRewardMutation,
  useGetRewardHistoryQuery,
} = rewardsApi

export default rewardsApi
