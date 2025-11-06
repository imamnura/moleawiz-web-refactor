import { useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useTeamOverview from './hooks/useTeamOverview'
import SelectedProgramTable from './components/SelectedProgramTable'
import Loader from '../../components/Loader'

/**
 * Selected Program Page
 * Shows detailed member list for a selected program/journey
 */
export default function SelectedProgramPage() {
  const { journeyId } = useParams()
  const { setHomeTitle } = useOutletContext()
  const isMobile = useSelector((state) => state.isMobile)

  const { programs, isLoading } = useTeamOverview()

  // Find program name from overview data
  const program = programs.find((p) => p.journey_id === parseInt(journeyId))
  const programName = program?.program_name || ''

  // Set page title
  useEffect(() => {
    if (programName) {
      setHomeTitle(programName)
    }
  }, [programName, setHomeTitle])

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className={isMobile ? 'w-full' : 'w-full'} aria-label={`Program: ${programName}`}>
      <SelectedProgramTable journeyId={journeyId} programName={programName} />
    </section>
  )
}
