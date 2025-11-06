import { baseApi } from './baseApi'

/**
 * Auth API endpoints
 * Handles authentication, password management, and OTP verification
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Check username and request OTP
    checkUsername: builder.mutation({
      query: (data) => ({
        url: '/check_username',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { username }) => [
        { type: 'Auth', id: `username-${username}` },
      ],
    }),

    // Verify OTP code
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: '/otp_verification',
        method: 'POST',
        body: data,
      }),
    }),

    // Login with Auth0
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    // Auto Login (SSO Callback)
    autoLogin: builder.mutation({
      query: ({ data, token }) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    // Logout
    logout: builder.mutation({
      query: (token) => ({
        url: '/user/logout',
        method: 'GET',
        headers: {
          TOKEN: token,
        },
      }),
      invalidatesTags: ['User', 'Auth', 'Journey', 'Notification'],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          // Clear all cache on logout
          dispatch(baseApi.util.resetApiState())
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          // Ignore error
        }
      },
    }),

    // Get Current User
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Change Password
    changePassword: builder.mutation({
      query: ({ data, token }) => ({
        url: '/user/password',
        method: 'POST',
        body: data,
        headers: {
          TOKEN: token,
        },
      }),
      invalidatesTags: ['User'],
    }),

    // Forgot Password (Reset password flow)
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/recover_password_email',
        method: 'POST',
        body: data,
      }),
    }),

    // Send Temporary Password
    sendTempPassword: builder.mutation({
      query: (data) => ({
        url: '/recover_password_email',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify Token
    verifyToken: builder.mutation({
      query: (token) => ({
        url: '/auth/verify-token',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
})

export const {
  useCheckUsernameMutation,
  useVerifyOTPMutation,
  useLoginMutation,
  useAutoLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendTempPasswordMutation,
  useVerifyTokenMutation,
} = authApi
