import { useState, useCallback, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { learningJourneyService } from '@/services/api/learningJourney'
import {
  setEncryptedStorage,
  getEncryptedStorage,
  removeLocalStorage,
} from '@/utils/storage'

/**
 * Hook untuk manage SCORM player state dan API communication
 *
 * @param {Object} options - Configuration options
 * @param {string} options.moduleId - Module ID
 * @param {Object} options.savedData - Previously saved SCORM data
 * @param {Function} options.onComplete - Callback when module completed
 * @returns {Object} SCORM player state and handlers
 */
export const useSCORMPlayer = ({ moduleId, savedData, onComplete }) => {
  const [scormData, setScormData] = useState(savedData || {})
  const [isInitialized, setIsInitialized] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const syncTimerRef = useRef(null)

  const storageKey = `scorm-${moduleId}`

  // Mutation for sending SCORM data to server
  const { mutate: sendSCORMData, isPending: isSending } = useMutation({
    mutationFn: (data) =>
      learningJourneyService.updateModuleProgress(moduleId, data),
    onSuccess: () => {
      console.log('[SCORM Player] Data sent successfully')
      // Clear local storage after successful sync
      removeLocalStorage(storageKey)
    },
    onError: (error) => {
      console.error('[SCORM Player] Failed to send data:', error)
      // Keep data in local storage for retry
    },
  })

  // Load saved data from localStorage on mount
  useEffect(() => {
    const localData = getEncryptedStorage(storageKey)
    if (localData && localData.value) {
      try {
        const parsed = JSON.parse(localData.value)
        setScormData(parsed)
        console.log('[SCORM Player] Loaded data from storage:', parsed)
      } catch (error) {
        console.error('[SCORM Player] Failed to parse saved data:', error)
      }
    }
  }, [storageKey])

  // Auto-sync timer
  useEffect(() => {
    if (isInitialized && !isCompleted) {
      // Sync data every 30 seconds
      syncTimerRef.current = setInterval(() => {
        console.log('[SCORM Player] Auto-sync triggered')
        syncData()
      }, 30000)

      return () => {
        if (syncTimerRef.current) {
          clearInterval(syncTimerRef.current)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isCompleted])

  /**
   * Handle LMSInitialize
   */
  const handleInitialize = useCallback(() => {
    console.log('[SCORM Hook] LMSInitialize called')
    setIsInitialized(true)
    setSessionStartTime(new Date())
  }, [])

  /**
   * Handle LMSFinish
   */
  const handleFinish = useCallback(
    (data) => {
      console.log('[SCORM Hook] LMSFinish called with data:', data)

      // Update session time
      if (sessionStartTime) {
        const sessionTime = calculateSessionTime(sessionStartTime)
        data['cmi.core.session_time'] = sessionTime
      }

      setScormData(data)
      setIsCompleted(true)
      setIsInitialized(false)

      // Save to localStorage
      setEncryptedStorage(storageKey, {
        key: 'data_scorm_web',
        value: JSON.stringify(data),
        timestamp: new Date().toISOString(),
      })

      // Send to server
      sendSCORMData({
        scorm_data: data,
        lesson_status: data['cmi.core.lesson_status'],
        score: data['cmi.core.score.raw'],
        session_time: data['cmi.core.session_time'],
        suspend_data: data['cmi.suspend_data'],
      })

      // Check if completed
      const lessonStatus = data['cmi.core.lesson_status']
      if (lessonStatus === 'completed' || lessonStatus === 'passed') {
        if (onComplete) {
          onComplete(data)
        }
      }
    },
    [sessionStartTime, storageKey, sendSCORMData, onComplete]
  )

  /**
   * Handle LMSSetValue
   */
  const handleSetValue = useCallback((element, value) => {
    console.log('[SCORM Hook] LMSSetValue:', element, '=', value)

    setScormData((prev) => ({
      ...prev,
      [element]: value,
    }))
  }, [])

  /**
   * Handle LMSCommit
   */
  const handleCommit = useCallback(
    (data) => {
      console.log('[SCORM Hook] LMSCommit called')

      setScormData(data)

      // Save to localStorage
      setEncryptedStorage(storageKey, {
        key: 'data_scorm_web',
        value: JSON.stringify(data),
        timestamp: new Date().toISOString(),
      })
    },
    [storageKey]
  )

  /**
   * Sync data to localStorage and optionally to server
   */
  const syncData = useCallback(() => {
    if (!window.API) return

    const currentData = window.API.getData()

    // Update session time
    if (sessionStartTime) {
      const sessionTime = calculateSessionTime(sessionStartTime)
      currentData['cmi.core.session_time'] = sessionTime
    }

    setScormData(currentData)

    // Save to localStorage
    setEncryptedStorage(storageKey, {
      key: 'data_scorm_web',
      value: JSON.stringify(currentData),
      timestamp: new Date().toISOString(),
    })

    console.log('[SCORM Hook] Data synced to localStorage')
  }, [sessionStartTime, storageKey])

  /**
   * Manually send data to server
   */
  const resyncData = useCallback(() => {
    const localData = getEncryptedStorage(storageKey)

    if (localData && localData.value) {
      try {
        const parsed = JSON.parse(localData.value)

        sendSCORMData({
          scorm_data: parsed,
          lesson_status: parsed['cmi.core.lesson_status'],
          score: parsed['cmi.core.score.raw'],
          session_time: parsed['cmi.core.session_time'],
          suspend_data: parsed['cmi.suspend_data'],
        })

        console.log('[SCORM Hook] Manual re-sync triggered')
      } catch (error) {
        console.error('[SCORM Hook] Failed to re-sync:', error)
      }
    }
  }, [storageKey, sendSCORMData])

  /**
   * Clear all SCORM data
   */
  const clearData = useCallback(() => {
    removeLocalStorage(storageKey)
    setScormData({})
    setIsInitialized(false)
    setIsCompleted(false)
    console.log('[SCORM Hook] Data cleared')
  }, [storageKey])

  /**
   * Get current progress info
   */
  const getProgress = useCallback(() => {
    return {
      lessonStatus: scormData['cmi.core.lesson_status'] || 'not attempted',
      score: scormData['cmi.core.score.raw'] || '',
      sessionTime: scormData['cmi.core.session_time'] || '0000:00:00.00',
      suspendData: scormData['cmi.suspend_data'] || '',
      isCompleted:
        scormData['cmi.core.lesson_status'] === 'completed' ||
        scormData['cmi.core.lesson_status'] === 'passed',
    }
  }, [scormData])

  return {
    scormData,
    isInitialized,
    isCompleted,
    isSending,
    handleInitialize,
    handleFinish,
    handleSetValue,
    handleCommit,
    syncData,
    resyncData,
    clearData,
    getProgress,
  }
}

/**
 * Calculate session time in SCORM format (HHHH:MM:SS.SS)
 * @param {Date} startTime - Session start time
 * @returns {string} Session time in SCORM format
 */
function calculateSessionTime(startTime) {
  const now = new Date()
  const diff = now - startTime // milliseconds

  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  const centiseconds = Math.floor((diff % 1000) / 10)

  return `${String(hours).padStart(4, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
}

export default useSCORMPlayer
