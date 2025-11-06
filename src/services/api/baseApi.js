import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAccessToken } from '@utils/storage'

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Try to get token from Redux state first
      const stateToken = getState().auth?.token

      // Fallback to localStorage
      const token = stateToken || getAccessToken()

      if (token) {
        // Support both Authorization Bearer and TOKEN header
        headers.set('Authorization', `Bearer ${token}`)
        headers.set('TOKEN', token)
      }

      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: [
    'User',
    'Auth',
    'Journey',
    'Course',
    'Module',
    'Event',
    'Notification',
    'Rating',
    'Badge',
    'Point',
    'ModulesNeedReview',
    'UserSubmissions',
    'Rewards',
    'RewardHistory',
    'UserBalance',
    'TeamOverview',
    'TeamStatus',
    'SelectedProgram',
    'ProgramsDetail',
    'EventsList',
    'EventDetail',
    'CalendarEvents',
    'TeamStatusDetail',
    'Academies',
    'Collections',
    'Leaderboards',
    'EnrolledPrograms',
    'LeaderboardProfile',
  ],
  endpoints: () => ({}),
})
