import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useResponsive } from '@hooks/useResponsive'
import Loader from '@components/common/Loader'

// Components
import { LeaderboardsHeader } from './components/LeaderboardsHeader'
import { MobileLeaderboardsHeader } from './components/MobileLeaderboardsHeader'
import { PodiumSection } from './components/PodiumSection'
import { MobilePodiumSection } from './components/MobilePodiumSection'
import { RankingTable } from './components/RankingTable'
import { MobileRankList } from './components/MobileRankList'
import { EmptyState } from './components/EmptyState'
import {
  ProgramSelectorModal,
  OrganizationSelectorModal,
} from './components/SelectorModals'

// Hooks
import { useLeaderboardsData } from './hooks/useLeaderboardsData'

/**
 * Leaderboards Page - Refactored
 * Display program leaderboards with top 3 podium and ranking table
 * Support filtering by program and organization level
 */
function LeaderboardsPage() {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()

  const {
    // Data
    top3,
    columnLeft,
    columnRight,
    yourRank,
    programOptions,
    organizationOptions,

    // Filters
    filters,
    setFilters,

    // Loading states
    isLoading,
    isLoadingPrograms,

    // Status
    hasData,
    hasPrograms,
  } = useLeaderboardsData()

  // Modal states
  const [showProgramModal, setShowProgramModal] = useState(false)
  const [showOrgModal, setShowOrgModal] = useState(false)

  // Selected program label
  const selectedProgram = programOptions.find(
    (p) => p.value === filters.filtPro
  )
  const selectedProgramLabel = selectedProgram?.label || ''

  // Selected org label
  const selectedOrg = organizationOptions.find(
    (o) => o.value === filters.filtOrg
  )
  const selectedOrgLabel = selectedOrg?.label || ''

  // Handle program change
  const handleProgramChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      filtPro: value,
    }))
    setShowProgramModal(false)
  }

  // Handle organization change
  const handleOrgChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      filtOrg: value,
    }))
    setShowOrgModal(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <section
        className="flex items-center justify-center min-h-screen"
        role="status"
        aria-label="Loading leaderboards"
      >
        <Loader />
      </section>
    )
  }

  // No enrolled programs
  if (!isLoadingPrograms && !hasPrograms) {
    return (
      <section className="p-4 md:p-6">
        <EmptyState />
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header */}
      {isMobile ? (
        <MobileLeaderboardsHeader
          selectedProgram={selectedProgramLabel}
          selectedOrg={selectedOrgLabel}
          onProgramClick={() => setShowProgramModal(true)}
          onOrgClick={() => setShowOrgModal(true)}
        />
      ) : (
        <LeaderboardsHeader
          programOptions={programOptions}
          organizationOptions={organizationOptions}
          selectedProgram={filters.filtPro}
          selectedOrg={filters.filtOrg}
          onProgramChange={handleProgramChange}
          onOrgChange={handleOrgChange}
        />
      )}

      {/* Content */}
      <article className="container mx-auto px-4 py-6 md:py-8">
        {hasData ? (
          <>
            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <section className="mb-8" aria-label="Top 3 Rankings">
                {isMobile ? (
                  <MobilePodiumSection podiumData={top3} />
                ) : (
                  <PodiumSection podiumData={top3} />
                )}
              </section>
            )}

            {/* Ranking Table / List */}
            {(columnLeft.length > 0 || columnRight.length > 0) && (
              <section aria-label="Full Rankings">
                {isMobile ? (
                  <MobileRankList
                    data={[...columnLeft, ...columnRight]}
                    yourRank={yourRank}
                  />
                ) : (
                  <RankingTable
                    columnLeft={columnLeft}
                    columnRight={columnRight}
                    yourRank={yourRank}
                  />
                )}
              </section>
            )}

            {/* Your Rank Display - Mobile Only */}
            {isMobile && yourRank && (
              <aside
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10"
                aria-label="Your current rank"
              >
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {t('feature.feature_leaderboards.your_rank')}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    #{yourRank}
                  </p>
                </div>
              </aside>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </article>

      {/* Modals - Mobile Only */}
      {isMobile && (
        <>
          <ProgramSelectorModal
            visible={showProgramModal}
            options={programOptions}
            selected={filters.filtPro}
            onClose={() => setShowProgramModal(false)}
            onSelect={handleProgramChange}
          />
          <OrganizationSelectorModal
            visible={showOrgModal}
            options={organizationOptions}
            selected={filters.filtOrg}
            onClose={() => setShowOrgModal(false)}
            onSelect={handleOrgChange}
          />
        </>
      )}
    </section>
  )
}

export default LeaderboardsPage
