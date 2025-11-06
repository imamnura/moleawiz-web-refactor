import { useState, useCallback } from 'react'
import { useAutoLoginMutation } from '@services/api/authApi'
import axios from 'axios'
import baseUrl from '@/config/config'

/**
 * Custom hook for auto login with token
 * 
 * @param {object} params - Hook parameters
 * @param {function} params.onSuccess - Success callback
 * @param {function} params.onError - Error callback
 * @returns {object} Auto login state and handlers
 */
const useAutoLoginToken = ({ onSuccess, onError }) => {
  const [error, setError] = useState('')

  // TanStack Query mutation
  const [autoLogin, { isLoading }] = useAutoLoginMutation()

  /**
   * Fetch program ID by UUID
   */
  const fetchProgramId = useCallback(async (programUUID) => {
    try {
      const response = await axios.get(
        `${baseUrl}/program_by_program_uuid/${programUUID}`
      )

      if (response.data && response.data.status === 200) {
        return response.data.data.id
      }
      
      console.error('Failed to fetch program ID')
      return null
    } catch (err) {
      console.error('Error fetching program ID:', err)
      return null
    }
  }, [])

  /**
   * Perform auto login
   */
  const login = useCallback((token) => {
    setError('')

    autoLogin({ 
      data: { token },
      token 
    })
      .unwrap()
      .then((data) => {
        if (data && data.status === 200) {
          if (onSuccess) {
            onSuccess(data.data)
          }
        } else {
          const errorMsg = data?.message || 'Auto login failed'
          
          // Format error message if it contains "attempts."
          if (errorMsg.indexOf('attempts.') > -1) {
            const [part1, part2] = errorMsg.split('.')
            setError(`${part1}.\n${part2}.`)
          } else {
            setError(errorMsg)
          }
          
          if (onError) {
            onError(errorMsg)
          }
        }
      })
      .catch((err) => {
        const errorMsg = err?.message || 'Network error occurred'
        setError(errorMsg)
        
        if (onError) {
          onError(errorMsg)
        }
      })
  }, [autoLogin, onSuccess, onError])

  return {
    loading: isLoading,
    error,
    login,
    fetchProgramId
  }
}

export default useAutoLoginToken
