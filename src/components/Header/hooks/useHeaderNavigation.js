import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Custom hook for Header page detection and navigation helpers
 * Determines current page context and provides journey/academy info
 * 
 * @param {object} params - Hook parameters
 * @param {array} params.listJourney - List of journeys
 * @param {boolean} params.loadingHeader - Loading state
 * @returns {object} Page context and navigation data
 * 
 * @example
 * const { journeyId, journeyName, pageName, contentLibraryAcademyHeader } = useHeaderNavigation({ listJourney, loadingHeader })
 */
const useHeaderNavigation = ({ listJourney = [], loadingHeader = false }) => {
  const location = useLocation()
  
  const [journeyId, setJourneyId] = useState(null)
  const [journeyName, setJourneyName] = useState(null)
  const [pageName, setPageName] = useState(null)
  const [contentLibraryAcademyHeader, setContentLibraryAcademyHeader] = useState(false)
  const [loading, setLoading] = useState(true)

  /**
   * Extract journey ID from URL
   */
  const extractJourneyId = useCallback(() => {
    const pathParts = location.pathname.split('/')
    const journeyIndex = pathParts.indexOf('journey')
    
    if (journeyIndex !== -1 && pathParts[journeyIndex + 1]) {
      return parseInt(pathParts[journeyIndex + 1], 10)
    }
    
    return null
  }, [location.pathname])

  /**
   * Find journey name by ID
   */
  const findJourneyName = useCallback((id) => {
    if (!listJourney || listJourney.length === 0) return null
    
    const journey = listJourney.find(j => j.id === id)
    return journey?.name || null
  }, [listJourney])

  /**
   * Detect current page context
   */
  useEffect(() => {
    setLoading(loadingHeader)

    const pathname = location.pathname

    // Check if on My Learning Journey with journey ID
    if (pathname.includes('/my-learning-journey/journey/')) {
      const id = extractJourneyId()
      if (id) {
        setJourneyId(id)
        const name = findJourneyName(id)
        setJourneyName(name)
        setPageName(null)
        setContentLibraryAcademyHeader(false)
      }
    }
    // Check if on Content Library academy
    else if (pathname.includes('/content-library/academy')) {
      setJourneyId(null)
      setJourneyName(null)
      setPageName(null)
      setContentLibraryAcademyHeader(true)
    }
    // Check if on Help page
    else if (pathname.includes('/help')) {
      setJourneyId(null)
      setJourneyName(null)
      setPageName('Help Center')
      setContentLibraryAcademyHeader(false)
    }
    // Default state
    else {
      setJourneyId(null)
      setJourneyName(null)
      setPageName(null)
      setContentLibraryAcademyHeader(false)
    }
  }, [location.pathname, loadingHeader, extractJourneyId, findJourneyName])

  return {
    journeyId,
    journeyName,
    pageName,
    contentLibraryAcademyHeader,
    loading,
  }
}

export default useHeaderNavigation
