import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation, useGetPointHistoryQuery } from '@services/api/userApi'
import { removeAccessToken } from '@/utils'

/**
 * Custom hook for Header actions
 * Handles logout and point history fetching
 * 
 * @returns {object} Header action handlers and state
 * 
 * @example
 * const { handleLogout, fetchPointHistory, pointHistoryData } = useHeaderActions()
 */
const useHeaderActions = () => {
  const navigate = useNavigate()
  
  const [pointHistoryData, setPointHistoryData] = useState([])

  // Logout mutation
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()

  // Point history query (manual fetch)
  const { refetch: refetchPointHistory } = useGetPointHistoryQuery(undefined, {
    skip: true, // Don't auto-fetch
  })

  /**
   * Handle user logout
   */
  const handleLogout = useCallback(() => {
    const token = localStorage.getItem('access_token')
    logout(token)
      .unwrap()
      .then(() => {
        // Clear token and redirect to login
        removeAccessToken()
        navigate('/login')
      })
      .catch((error) => {
        console.error('Logout error:', error?.message || 'Unknown error')
        // Still redirect even if logout fails
        removeAccessToken()
        navigate('/login')
      })
  }, [logout, navigate])

  /**
   * Fetch point history data
   */
  const fetchPointHistory = useCallback(async () => {
    try {
      const { data } = await refetchPointHistory()
      if (data) {
        setPointHistoryData(data)
      }
    } catch (error) {
      console.error('Error fetching point history:', error?.message || 'Unknown error')
      setPointHistoryData([])
    }
  }, [refetchPointHistory])

  /**
   * Format date for display
   */
  const dateModuleConvert = useCallback((dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    
    return date.toLocaleDateString('id-ID', options)
  }, [])

  return {
    // Logout
    handleLogout,
    isLoggingOut: logoutMutation.isLoading,
    
    // Point History
    fetchPointHistory,
    pointHistoryData,
    setPointHistoryData,
    isLoadingPointHistory: pointHistoryQuery.isLoading || pointHistoryQuery.isFetching,
    
    // Utilities
    dateModuleConvert,
  }
}

export default useHeaderActions
