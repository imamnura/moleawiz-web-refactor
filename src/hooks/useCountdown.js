import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

/**
 * Custom hook for countdown timer functionality
 * Useful for OTP expiration, session timeouts, etc.
 * 
 * @param {string} expiredDate - ISO date string when countdown expires
 * @param {string} sendDate - ISO date string when countdown started
 * @param {function} onExpire - Callback when countdown reaches zero
 * @returns {object} Countdown state and controls
 * 
 * @example
 * const countdown = useCountdown(
 *   '2024-10-30T12:00:00',
 *   '2024-10-30T11:55:00',
 *   () => console.log('Expired!')
 * )
 * 
 * return <div>{countdown.minutes}:{countdown.seconds}</div>
 */
const useCountdown = (expiredDate, sendDate, onExpire) => {
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isExpired, setIsExpired] = useState(false)

  // Calculate initial time remaining
  const calculateTimeRemaining = useCallback(() => {
    if (!expiredDate || !sendDate) return 0

    const now = Date.now()
    const end = new Date(expiredDate).getTime()
    const start = new Date(sendDate).getTime()
    
    // Use the difference between expire and send time
    const total = end - start
    const remaining = end - now

    return remaining > 0 ? remaining : 0
  }, [expiredDate, sendDate])

  // Format time remaining into minutes and seconds
  const formatTime = useCallback((milliseconds) => {
    if (!milliseconds) {
      return { minutes: 0, seconds: 0, formatted: '00:00' }
    }

    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    return { minutes, seconds, formatted }
  }, [])

  // Reset countdown with new dates
  const reset = useCallback((newExpiredDate, newSendDate) => {
    setIsExpired(false)
    const remaining = calculateTimeRemaining()
    setTimeRemaining(remaining)
  }, [calculateTimeRemaining])

  // Initialize countdown
  useEffect(() => {
    const remaining = calculateTimeRemaining()
    setTimeRemaining(remaining)

    if (remaining === 0) {
      setIsExpired(true)
      if (onExpire) {
        onExpire()
      }
    }
  }, [expiredDate, sendDate, calculateTimeRemaining, onExpire])

  // Countdown interval
  useEffect(() => {
    if (isExpired || !timeRemaining) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          setIsExpired(true)
          if (onExpire) {
            onExpire()
          }
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isExpired, timeRemaining, onExpire])

  const { minutes, seconds, formatted } = formatTime(timeRemaining)

  return {
    minutes,
    seconds,
    formatted,
    isExpired,
    timeRemaining,
    reset,
  }
}

useCountdown.propTypes = {
  expiredDate: PropTypes.string,
  sendDate: PropTypes.string,
  onExpire: PropTypes.func,
}

export default useCountdown
