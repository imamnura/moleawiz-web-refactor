import { baseApi } from './baseApi'

/**
 * Notification API endpoints
 * Handles user notifications for different types
 */
export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications by type
    getNotifications: builder.query({
      query: (type) => ({
        url: `/notification/get_data?type=${type}`,
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      providesTags: (result, error, type) => [
        { type: 'Notification', id: type },
      ],
      transformResponse: (response) => response.data || response || [],
    }),

    // Mark notification as read
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notification/${notificationId}/read`,
        method: 'POST',
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      invalidatesTags: ['Notification'],
    }),

    // Delete notification
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/notification/${notificationId}`,
        method: 'DELETE',
        headers: {
          TOKEN: localStorage.getItem('access_token'),
        },
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} = notificationApi
