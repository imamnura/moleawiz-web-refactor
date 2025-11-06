import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'

/**
 * Learning Journey API Service
 *
 * Handles all API calls related to Learning Journey feature
 * Supports: Journey list, Course details, Module details, SCORM playback
 */

const getAuthHeaders = () => ({
  TOKEN: localStorage.getItem('access_token'),
  'Content-Type': 'application/json',
})

/**
 * Get all journeys for current user
 */
export const getAllJourneys = async () => {
  const response = await axios.get(`${API_BASE_URL}/journey`, {
    headers: getAuthHeaders(),
  })
  return response.data
}

/**
 * Get courses for a specific journey
 * @param {string} journeyId - Journey ID
 */
export const getCourses = async (journeyId) => {
  const response = await axios.get(
    `${API_BASE_URL}/journey/${journeyId}/courses`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

/**
 * Get modules for a specific course
 * @param {string} journeyId - Journey ID
 * @param {string} courseId - Course ID
 */
export const getModules = async (journeyId, courseId) => {
  const response = await axios.get(
    `${API_BASE_URL}/journey/${journeyId}/course/${courseId}/modules`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

/**
 * Get journey detail
 * @param {string} journeyId - Journey ID
 */
export const getJourneyDetail = async (journeyId) => {
  const response = await axios.get(`${API_BASE_URL}/journey/${journeyId}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}

/**
 * Get course detail
 * @param {string} journeyId - Journey ID
 * @param {string} courseId - Course ID
 */
export const getCourseDetail = async (journeyId, courseId) => {
  const response = await axios.get(
    `${API_BASE_URL}/journey/${journeyId}/course/${courseId}`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

/**
 * Get module detail
 * @param {string} journeyId - Journey ID
 * @param {string} courseId - Course ID
 * @param {string} moduleId - Module ID
 */
export const getModuleDetail = async (journeyId, courseId, moduleId) => {
  const response = await axios.get(
    `${API_BASE_URL}/journey/${journeyId}/course/${courseId}/module/${moduleId}`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

/**
 * Mark module as started
 * @param {Object} data - Module start data
 */
export const startModule = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/journey/start`,
    { data },
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

/**
 * Mark module as completed
 * @param {Object} data - Module completion data
 */
export const completeModule = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/journey/completion`,
    { data },
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

/**
 * Update module progress
 * @param {string} moduleId - Module ID
 * @param {number} progress - Progress percentage (0-100)
 */
export const updateModuleProgress = async (moduleId, progress) => {
  const response = await axios.post(
    `${API_BASE_URL}/journey/progress`,
    { module_id: moduleId, progress },
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

/**
 * Get SCORM content URL
 * @param {string} moduleId - Module ID
 */
export const getSCORMContent = async (moduleId) => {
  const response = await axios.get(
    `${API_BASE_URL}/journey/scorm/${moduleId}`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

/**
 * Check if module has rating
 * @param {string} moduleId - Module ID
 */
export const checkRating = async (moduleId) => {
  const response = await axios.get(`${API_BASE_URL}/check_rating/${moduleId}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}

/**
 * Check if user earned badges
 * @param {Object} data - Badge check data
 */
export const checkBadges = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/achievement/check_badge`,
    { data },
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

// Export as single object
export const learningJourneyService = {
  getAllJourneys,
  getJourneyList: getAllJourneys, // Alias for consistency
  getCourses,
  getModules,
  getJourneyDetail,
  getCourseDetail,
  getModuleDetail,
  startModule,
  completeModule,
  updateModuleProgress,
  getSCORMContent,
  checkRating,
  checkBadges,
}

// Query keys for TanStack Query
export const queryKeys = {
  all: ['learning-journey'],
  journeyList: () => [...queryKeys.all, 'list'],
  journeyDetail: (journeyId) => [...queryKeys.all, 'detail', journeyId],
  courses: (journeyId) => [...queryKeys.all, 'courses', journeyId],
  courseDetail: (journeyId, courseId) => [
    ...queryKeys.all,
    'course',
    journeyId,
    courseId,
  ],
  modules: (journeyId, courseId) => [
    ...queryKeys.all,
    'modules',
    journeyId,
    courseId,
  ],
  moduleDetail: (journeyId, courseId, moduleId) => [
    ...queryKeys.all,
    'module',
    journeyId,
    courseId,
    moduleId,
  ],
  scorm: (moduleId) => [...queryKeys.all, 'scorm', moduleId],
}

// Legacy export for backward compatibility
export const learningJourneyAPI = learningJourneyService
