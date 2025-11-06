import { http, HttpResponse } from 'msw'

// Base URL dari environment atau default
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.example.com'

// Mock data
export const mockModules = [
  {
    cmid: 1,
    module_id: 101,
    module_name: 'JavaScript Fundamentals',
    journey_name: 'Web Development',
    thumbnail: 'https://via.placeholder.com/150',
    deadline: '2025-11-30',
    need_review_count: 5,
    can_delete: false,
  },
  {
    cmid: 2,
    module_id: 102,
    module_name: 'React Advanced',
    journey_name: 'Frontend Development',
    thumbnail: null,
    deadline: '2025-11-15',
    need_review_count: 3,
    can_delete: true,
  },
]

export const mockUsers = [
  {
    user_id: 100,
    name: 'John Doe',
    submission_number: 1,
    submission_date: '2025-11-01',
    status: null, // need review
  },
  {
    user_id: 101,
    name: 'Jane Smith',
    submission_number: 2,
    submission_date: '2025-11-02',
    status: 1, // approved
  },
  {
    user_id: 102,
    name: 'Bob Wilson',
    submission_number: 3,
    submission_date: '2025-11-03',
    status: 0, // declined
  },
]

export const mockSubmissionDetail = {
  review: [
    {
      review_id: 1,
      question: 'What is JavaScript?',
      answer_type: 1, // text
      answer: 'JavaScript is a programming language',
      status: null,
      notes: '',
    },
    {
      review_id: 2,
      question: 'Upload a screenshot',
      answer_type: 2, // image
      answer: 'https://via.placeholder.com/300',
      status: null,
      notes: '',
    },
  ],
  feedback: '',
}

export const mockPreviousSubmission = {
  review: [
    {
      review_id: 1,
      question: 'What is JavaScript?',
      answer_type: 1,
      answer: 'Previous answer about JavaScript',
      status: 1,
      notes: 'Good answer',
    },
    {
      review_id: 2,
      question: 'Upload a screenshot',
      answer_type: 2,
      answer: 'https://via.placeholder.com/300/prev',
      status: 0,
      notes: 'Image not clear',
    },
  ],
  feedback: 'Previous overall feedback',
}

// MSW Handlers
export const handlers = [
  // Get modules need review
  http.get(`${BASE_URL}/anchor/modules`, () => {
    return HttpResponse.json(mockModules)
  }),

  // Get user submissions for a module
  http.get(`${BASE_URL}/anchor/modules/:moduleId/journey/:journeyId/users`, ({ params }) => {
    const { moduleId } = params
    
    // Return users for specific module
    if (moduleId === '1') {
      return HttpResponse.json(mockUsers)
    }
    
    return HttpResponse.json([])
  }),

  // Get submission detail
  http.get(`${BASE_URL}/anchor/modules/:moduleId/users/:userId/submission`, ({ request, params }) => {
    const url = new URL(request.url)
    const flag = url.searchParams.get('flag')
    
    // flag = 0: current submission, flag = 1: previous submission
    if (flag === '1') {
      return HttpResponse.json(mockPreviousSubmission)
    }
    
    return HttpResponse.json(mockSubmissionDetail)
  }),

  // Submit review
  http.post(`${BASE_URL}/anchor/review/submit`, async ({ request }) => {
    const body = await request.json()
    
    return HttpResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: body,
    })
  }),

  // Delete module submission
  http.post(`${BASE_URL}/anchor/modules/delete`, async ({ request }) => {
    const body = await request.json()
    
    return HttpResponse.json({
      success: true,
      message: 'Module deleted successfully',
      cmid: body.cmid,
    })
  }),
]

// Error handlers untuk testing error states
export const errorHandlers = [
  http.get(`${BASE_URL}/anchor/modules`, () => {
    return HttpResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }),

  http.get(`${BASE_URL}/anchor/modules/:moduleId/journey/:journeyId/users`, () => {
    return HttpResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }),

  http.post(`${BASE_URL}/anchor/review/submit`, () => {
    return HttpResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }),
]
