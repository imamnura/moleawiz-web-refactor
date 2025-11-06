/**
 * Utility functions for localStorage management in review forms
 */

/**
 * Get form data from localStorage
 * @param {string} key - Storage key
 * @returns {Object|null} Parsed form data or null
 */
export const getFormData = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

/**
 * Set form data to localStorage
 * @param {string} key - Storage key
 * @param {Object} data - Form data to store
 */
export const setFormData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

/**
 * Clear form data from localStorage
 * @param {string} key - Storage key
 */
export const clearFormData = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Generate localStorage key for review form
 * @param {number} userId - User ID
 * @param {number} submissionNumber - Submission number
 * @param {number} moduleId - Module ID
 * @returns {string} Storage key
 */
export const generateFormKey = (userId, submissionNumber, moduleId) => {
  return `form_${userId}-${submissionNumber}-${moduleId}`
}
