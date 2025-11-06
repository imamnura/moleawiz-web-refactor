import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { useOutletContext, useLocation } from 'react-router-dom'
import { Loader } from '@/components/common/Loader'
import HomeTitle from '@/components/common/HomeTitle'
import FilterRadio from '@/components/ui/FilterRadio'
import JourneyCard from './components/JourneyCard'
import { useJourneyFilters } from './hooks/useJourneyFilters'
import { getEmptyStateMessage } from '@/utils/journeyHelpers'
import { useResponsive } from '@/hooks/useResponsive'

/**
 * Learning Journey Page
 * Displays user's learning journeys with filtering capabilities
 * Supports both desktop and mobile responsive layouts
 */
const LearningJourneyPage = () => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const location = useLocation()

  // Get context from main layout (for compatibility with old outlet structure)
  const [
    loading,
    _userData,
    _totalJourney,
    _totalJourneyCompleted,
    _allJourneyData,
    listJourney,
    _listCourse,
    mainState,
  ] = useOutletContext()

  // State management
  const [filterState, setFilterState] = useState('all')
  const [displayedJourneys, setDisplayedJourneys] = useState([])
  const [renderPageSearch, setRenderPageSearch] = useState(false)
  const [loadingRender, setLoadingRender] = useState(false)

  // Custom hook for journey filtering
  const { isLoading, allJourneys, filterByCategory } = useJourneyFilters(
    listJourney,
    loading
  )

  // Check if search query exists
  const queryParams = new URLSearchParams(location.search)
  const hasSearchQuery = queryParams.has('search')

  // Handle filter change
  const handleFilterChange = (category) => {
    setFilterState(category)
    const filtered = filterByCategory(category)
    setDisplayedJourneys(filtered)
  }

  // Initialize journeys on load
  useEffect(() => {
    if (!isLoading) {
      setDisplayedJourneys(allJourneys)
    }
  }, [allJourneys, isLoading])

  // Refetch journeys after playing module
  useEffect(() => {
    if (mainState?.reFetchJourney) {
      mainState.setTrigerFetch(true)
    }
  }, [mainState])

  // Handle search page rendering
  useEffect(() => {
    setRenderPageSearch(hasSearchQuery)
    setLoadingRender(true)

    const timer = setTimeout(() => {
      setLoadingRender(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [hasSearchQuery])

  // Empty state component
  const EmptyState = () => (
    <div
      className={`
      text-center font-medium text-text-desc
      ${isMobile ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full' : ''}
    `}
    >
      {getEmptyStateMessage(filterState)}
    </div>
  )

  // Loading state
  if (isLoading || loadingRender) {
    return <Loader />
  }

  // Search page render (mobile)
  if (isMobile && renderPageSearch) {
    return <Loader />
  }

  return (
    <div className={isMobile ? 'p-5' : 'px-10 py-5'}>
      {/* Header Section */}
      <Row align="top" className="mb-5">
        {/* Title (Desktop Only) */}
        {!isMobile && (
          <Col span={12}>
            <HomeTitle
              textTitle={t('feature.feature_mylj.anchor.my_learning_journey')}
              attrTextTitle="text-title-my-learning-journey"
              dynamic={false}
            />
          </Col>
        )}

        {/* Filter Section */}
        <Col
          span={isMobile ? 24 : 12}
          className={isMobile ? 'text-left' : 'text-right'}
        >
          <FilterRadio
            onChange={handleFilterChange}
            defaultValue="all"
            isMobile={isMobile}
          />
        </Col>
      </Row>

      {/* Journey Cards Grid */}
      <Row className="row-section-my-learning-journey">
        <div className="flex flex-wrap gap-4 w-full h-full">
          {displayedJourneys && displayedJourneys.length > 0 ? (
            displayedJourneys.map((journey, index) => (
              <JourneyCard
                key={journey.id || index}
                journey={journey}
                isMobile={isMobile}
                index={index}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </Row>
    </div>
  )
}

export default LearningJourneyPage
