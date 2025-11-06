/**
 * Calculate time remaining until expiration
 * @param {string} expiredDate - Expiration datetime
 * @returns {number} - Milliseconds until expiration
 *
 * Example:
 * const timeRemaining = getTimeRemaining('2024-12-25T15:00:00');
 * // Returns milliseconds until expiration
 */
export const getTimeRemaining = (expiredDate) => {
  const expiredTime = new Date(expiredDate).getTime()
  const currentTime = Date.now()

  const timeRemaining = expiredTime - currentTime
  return Math.max(0, timeRemaining)
}

/**
 * Format countdown time
 * @param {number} minutes - Minutes remaining
 * @param {number} seconds - Seconds remaining
 * @returns {string} - Formatted time (MM:SS)
 *
 * Example:
 * formatCountdown(5, 30) // "05:30"
 * formatCountdown(0, 5) // "00:05"
 */
export const formatCountdown = (minutes, seconds) => {
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
  return `${formattedMinutes}:${formattedSeconds}`
}

/**
 * Check if OTP is expired
 * @param {string} expiredDate - Expiration datetime
 * @returns {boolean} - True if expired
 */
export const isOTPExpired = (expiredDate) => {
  const expiredTime = new Date(expiredDate).getTime()
  const currentTime = Date.now()
  return currentTime >= expiredTime
}

/**
 * Validate OTP input
 * @param {string} otp - OTP code
 * @returns {boolean} - True if valid
 *
 * Rules:
 * - Must be a number
 * - Must be 6 digits
 * - No special characters
 */
export const validateOTP = (otp) => {
  if (!otp) return false
  const otpRegex = /^\d{6}$/
  return otpRegex.test(otp)
}

/**
 * Filter invalid characters from OTP input
 * @param {string} value - Input value
 * @returns {string} - Filtered value (numbers only)
 */
export const filterOTPInput = (value) => {
  return value.replace(/[^0-9]/g, '')
}
