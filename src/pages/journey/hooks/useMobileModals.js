import { useState, useCallback } from 'react'

/**
 * Hook untuk manage mobile modal states
 * Centralized state management untuk semua mobile modals
 *
 * @returns {Object} Modal states dan handlers
 */
export const useMobileModals = () => {
  const [journeyModalOpen, setJourneyModalOpen] = useState(false)
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [moduleModalOpen, setModuleModalOpen] = useState(false)

  // Journey Modal
  const openJourneyModal = useCallback(() => {
    setJourneyModalOpen(true)
  }, [])

  const closeJourneyModal = useCallback(() => {
    setJourneyModalOpen(false)
  }, [])

  // Course Modal
  const openCourseModal = useCallback(() => {
    setCourseModalOpen(true)
  }, [])

  const closeCourseModal = useCallback(() => {
    setCourseModalOpen(false)
  }, [])

  // Module Modal
  const openModuleModal = useCallback(() => {
    setModuleModalOpen(true)
  }, [])

  const closeModuleModal = useCallback(() => {
    setModuleModalOpen(false)
  }, [])

  // Close all modals
  const closeAllModals = useCallback(() => {
    setJourneyModalOpen(false)
    setCourseModalOpen(false)
    setModuleModalOpen(false)
  }, [])

  return {
    // States
    journeyModalOpen,
    courseModalOpen,
    moduleModalOpen,

    // Journey handlers
    openJourneyModal,
    closeJourneyModal,

    // Course handlers
    openCourseModal,
    closeCourseModal,

    // Module handlers
    openModuleModal,
    closeModuleModal,

    // Utility
    closeAllModals,
  }
}
