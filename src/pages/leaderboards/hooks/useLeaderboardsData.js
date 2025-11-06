import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLeaderboards } from './useLeaderboards'
import { useEnrolledPrograms, getDefaultProgram } from './useEnrolledPrograms'
import { processLeaderboardsData } from '../utils/dataProcessing'
import { getCompanyName } from '@/utils'
import { useTranslation } from 'react-i18next'

/**
 * Main hook for leaderboards logic
 */
export function useLeaderboardsData() {
  const { t } = useTranslation()
  const userId = useSelector((state) => state.auth.user?.id)
  const profileUserData = useSelector(
    (state) => state.leaderboard?.profileUserData || {}
  )

  const [filters, setFilters] = useState({
    filtPro: null,
    filtOrg: 'company',
  })

  // Fetch enrolled programs
  const { data: enrolledPrograms = [], isLoading: isLoadingPrograms } =
    useEnrolledPrograms()

  // Set default program on first load
  useEffect(() => {
    if (enrolledPrograms.length > 0 && filters.filtPro === null) {
      const defaultProgram = getDefaultProgram(enrolledPrograms)
      if (defaultProgram) {
        setFilters((prev) => ({
          ...prev,
          filtPro: defaultProgram,
        }))
      }
    }
  }, [enrolledPrograms, filters.filtPro])

  // Fetch leaderboards data
  const { data: leaderboardsData, isLoading: isLoadingLeaderboards } =
    useLeaderboards(filters.filtPro, !!filters.filtPro)

  // Process leaderboards data
  const processedData = useMemo(() => {
    if (!leaderboardsData) {
      return {
        top3: [],
        columnLeft: [],
        columnRight: [],
        yourRank: null,
      }
    }

    return processLeaderboardsData(
      leaderboardsData,
      userId,
      filters,
      profileUserData
    )
  }, [leaderboardsData, userId, filters, profileUserData])

  // Generate organization filter options
  const organizationOptions = useMemo(() => {
    const options = [
      {
        label: `${t('feature.feature_leaderboards.header.company_level')} - ${getCompanyName()}`,
        value: 'company',
      },
    ]

    if (profileUserData.directorate) {
      options.push({
        label: `${t('feature.feature_leaderboards.header.directorate_level')} - ${profileUserData.directorate}`,
        value: 'directorate',
      })
    }

    if (profileUserData.division) {
      options.push({
        label: `${t('feature.feature_leaderboards.header.division_level')} - ${profileUserData.division}`,
        value: 'division',
      })
    }

    if (profileUserData.department) {
      options.push({
        label: `${t('feature.feature_leaderboards.header.department_level')} - ${profileUserData.department}`,
        value: 'department',
      })
    }

    if (profileUserData.group) {
      options.push({
        label: `${t('feature.feature_leaderboards.header.group_level')} - ${profileUserData.group}`,
        value: 'group',
      })
    }

    if (profileUserData.role) {
      options.push({
        label: `${t('feature.feature_leaderboards.header.role')} - ${profileUserData.role}`,
        value: 'role',
      })
    }

    return options
  }, [profileUserData, t])

  // Generate program options for dropdown
  const programOptions = useMemo(() => {
    if (!enrolledPrograms || enrolledPrograms.length === 0) return []

    return enrolledPrograms.map((program, index) => ({
      label: program.journey_name,
      value: parseInt(program.journey_id),
      dataIndex: index,
    }))
  }, [enrolledPrograms])

  const isLoading = isLoadingPrograms || isLoadingLeaderboards
  const hasData = processedData.top3.length > 0
  const hasPrograms = enrolledPrograms.length > 0

  return {
    // Data
    top3: processedData.top3,
    columnLeft: processedData.columnLeft,
    columnRight: processedData.columnRight,
    yourRank: processedData.yourRank,
    enrolledPrograms,
    programOptions,
    organizationOptions,

    // Filters
    filters,
    setFilters,

    // Loading states
    isLoading,
    isLoadingPrograms,
    isLoadingLeaderboards,

    // Status
    hasData,
    hasPrograms,
  }
}
