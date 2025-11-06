import { baseApi } from './baseApi'

/**
 * Team Monitoring API
 *
 * Handles all Team Monitoring related endpoints:
 * - Team overview (count, programs)
 * - Learning status (team members with ongoing programs)
 * - Learning events (upcoming events)
 * - Selected program members
 * - Calendar events
 * - Event details
 */

export const teamMonitoringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get team overview (count + programs list)
    getTeamOverview: builder.query({
      query: () => '/overview',
      transformResponse: (response) => ({
        teamCount: response.count_team || 0,
        programs: response.programs || [],
      }),
      providesTags: ['TeamOverview'],
    }),

    // Get team learning status (members with ongoing program count)
    getTeamStatus: builder.query({
      query: () => '/team-status',
      transformResponse: (response) => ({
        teams: response.teams || [],
        totalOngoing: response.total_ongoing || 0,
      }),
      providesTags: ['TeamStatus'],
    }),

    // Get selected program members
    getSelectedProgram: builder.query({
      query: ({ journeyId, status }) => {
        let params = `?journey_id=${journeyId}`
        if (status && status !== 'allprogress') {
          params += `&status=${status}`
        }
        return `/selected-programs${params}`
      },
      transformResponse: (response) => response || [],
      providesTags: (result, error, { journeyId }) => [
        { type: 'SelectedProgram', id: journeyId },
      ],
    }),

    // Get all programs detail for member (for Learning Status modal)
    getAllProgramsDetail: builder.query({
      query: () => '/selected-programs',
      transformResponse: (response) => response || [],
      providesTags: ['ProgramsDetail'],
    }),

    // Get list of events
    getEventsList: builder.query({
      query: () => '/list-event',
      transformResponse: (response) => response || [],
      providesTags: ['EventsList'],
    }),

    // Get event detail
    getEventDetail: builder.query({
      query: (eventId) => `/event-detail/${eventId}`,
      transformResponse: (response) => response || null,
      providesTags: (result, error, eventId) => [
        { type: 'EventDetail', id: eventId },
      ],
    }),

    // Get calendar events (with date range)
    getCalendarEvents: builder.query({
      query: ({ startDate, endDate }) =>
        `/calendar-events?start=${startDate}&end=${endDate}`,
      transformResponse: (response) => response || [],
      providesTags: ['CalendarEvents'],
    }),

    // Get team learning status detail (with filter & search)
    getTeamStatusDetail: builder.query({
      query: ({ filter, search }) => {
        let params = []
        if (filter) params.push(`filter=${filter}`)
        if (search) params.push(`search=${search}`)
        const queryString = params.length > 0 ? `?${params.join('&')}` : ''
        return `/team-learning-status-detail${queryString}`
      },
      transformResponse: (response) => response || [],
      providesTags: ['TeamStatusDetail'],
    }),
  }),
})

export const {
  useGetTeamOverviewQuery,
  useGetTeamStatusQuery: useGetTeamLearningStatusQuery,
  useGetSelectedProgramQuery,
  useGetAllProgramsDetailQuery,
  useLazyGetAllProgramsDetailQuery,
  useGetEventsListQuery,
  useGetEventDetailQuery: useGetTeamEventDetailQuery,
  useLazyGetEventDetailQuery: useLazyGetTeamEventDetailQuery,
  useGetCalendarEventsQuery,
  useGetTeamStatusDetailQuery,
} = teamMonitoringApi
