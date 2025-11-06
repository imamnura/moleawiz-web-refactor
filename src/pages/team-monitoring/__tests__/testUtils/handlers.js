import { http, HttpResponse } from 'msw'

// Match the baseApi baseUrl configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * Mock API handlers for team monitoring endpoints
 */
export const handlers = [
  // GET /overview
  http.get(`${API_BASE_URL}/overview`, () => {
    return HttpResponse.json({
      count_team: 25,
      programs: [
        {
          program_id: 1,
          journey_id: null,
          program_name: 'React Advanced Training',
          thumbnail: '/images/react-training.jpg',
          total_user: 10,
          total_completed_user: 5,
        },
        {
          program_id: 2,
          journey_id: null,
          program_name: 'Node.js Fundamentals',
          thumbnail: '/images/node-training.jpg',
          total_user: 15,
          total_completed_user: 3,
        },
      ],
    })
  }),

  // GET /calendar-events
  http.get(`${API_BASE_URL}/calendar-events`, ({ request }) => {
    const url = new URL(request.url)
    const startDate = url.searchParams.get('start')
    const endDate = url.searchParams.get('end')

    return HttpResponse.json([
      {
        id: '1',
        title: 'Team Standup',
        start: '2024-01-15T09:00:00',
        end: '2024-01-15T09:30:00',
        date_range: '15 Jan 2024',
        time_range: '09:00 - 09:30',
        total_users: 12,
      },
      {
        id: '2',
        title: 'Sprint Planning',
        start: '2024-01-16T10:00:00',
        end: '2024-01-16T11:00:00',
        date_range: '16 Jan 2024',
        time_range: '10:00 - 11:00',
        total_users: 8,
      },
    ])
  }),

  // GET /event-detail/:id
  http.get(`${API_BASE_URL}/event-detail/:id`, ({ params }) => {
    const { id } = params

    return HttpResponse.json({
      id,
      title: 'Team Standup',
      description: 'Daily team standup meeting',
      date_range: '15 Jan 2024',
      time_range: '09:00 - 09:30',
      location: 'Meeting Room A',
      trainer: 'John Doe',
      members: [
        {
          id: 1,
          firstname: 'Alice',
          lastname: 'Johnson',
          fullname: 'Alice Johnson',
          response_status: 'accepted',
        },
        {
          id: 2,
          firstname: 'Bob',
          lastname: 'Smith',
          fullname: 'Bob Smith',
          response_status: 'tentative',
        },
        {
          id: 3,
          firstname: 'Charlie',
          lastname: 'Brown',
          fullname: 'Charlie Brown',
          response_status: 'declined',
        },
      ],
    })
  }),

  // GET /team-status
  http.get(`${API_BASE_URL}/team-status`, () => {
    return HttpResponse.json({
      teams: [
        {
          user_id: 1,
          fullname: 'Alice Johnson',
          total_ongoing: 3,
        },
        {
          user_id: 2,
          fullname: 'Bob Smith',
          total_ongoing: 5,
        },
        {
          user_id: 3,
          fullname: 'Charlie Brown',
          total_ongoing: 2,
        },
      ],
      total_ongoing: 10,
    })
  }),

  // GET /list-event
  http.get(`${API_BASE_URL}/list-event`, () => {
    return HttpResponse.json([
      {
        id: 1,
        fullname: 'Alice Johnson',
        title: 'Complete React Module',
        date_range: '10-12 Jan 2024',
        time_range: '09:00 - 17:00',
        total_users: 8,
      },
      {
        id: 2,
        fullname: 'Bob Smith',
        title: 'Node.js Workshop',
        date_range: '15-16 Jan 2024',
        time_range: '14:00 - 16:00',
        total_users: 12,
      },
    ])
  }),

  // GET /selected-programs (for member programs modal)
  http.get(`${API_BASE_URL}/selected-programs`, () => {
    return HttpResponse.json([
      {
        user_id: 1,
        journeys: [
          {
            name: 'React Basics',
            progress: 45,
            is_completed: 0,
          },
          {
            name: 'Advanced React',
            progress: 20,
            is_completed: 0,
          },
          {
            name: 'Testing React',
            progress: 100,
            is_completed: 1,
          },
        ],
      },
      {
        user_id: 2,
        journeys: [
          {
            name: 'Node.js Intro',
            progress: 65,
            is_completed: 0,
          },
        ],
      },
    ])
  }),
]

/**
 * Error handlers for testing error states
 */
export const errorHandlers = [
  http.get(`${API_BASE_URL}/overview`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }),

  http.get(`${API_BASE_URL}/calendar-events`, () => {
    return HttpResponse.json({ error: 'Not Found' }, { status: 404 })
  }),
]

/**
 * Empty data handlers for testing empty states
 */
export const emptyHandlers = [
  http.get(`${API_BASE_URL}/overview`, () => {
    return HttpResponse.json({
      count_team: 0,
      programs: [],
    })
  }),

  http.get(`${API_BASE_URL}/team-status`, () => {
    return HttpResponse.json({
      teams: [],
      total_ongoing: 0,
    })
  }),

  http.get(`${API_BASE_URL}/list-event`, () => {
    return HttpResponse.json([])
  }),
]

