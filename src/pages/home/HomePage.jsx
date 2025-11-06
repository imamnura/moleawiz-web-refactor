import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Spin } from 'antd'
// import { useTranslation } from 'react-i18next'

import {
  useGetUserProfileQuery,
  useGetAllJourneyDataQuery,
} from '@services/api/homeApi'
import { setJourneyData } from '@store/slices/homeSlice'

// Home Components
import HomeTitleText from './components/HomeTitleText'
import Banner from './components/Banner'
import OngoingCourse from './components/OngoingCourse'
import NewPrograms from './components/NewPrograms'
import ExpiringProgram from './components/ExpiringProgram'
import OngoingPrograms from './components/OngoingPrograms'
import UpcomingEvents from './components/UpcomingEvents'

const HomePage = () => {
  // const { t } = useTranslation()
  const dispatch = useDispatch()

  const { data: userProfile, isLoading: profileLoading } =
    useGetUserProfileQuery()
  const { data: journeyData, isLoading: journeyLoading } =
    useGetAllJourneyDataQuery()

  useEffect(() => {
    if (journeyData) {
      dispatch(setJourneyData(journeyData))
    }
  }, [journeyData, dispatch])

  const isLoading = profileLoading || journeyLoading

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        role="status"
        aria-live="polite"
      >
        <Spin size="large" />
        <span className="sr-only">Loading home page...</span>
      </div>
    )
  }

  return (
    <main
      className="min-h-screen bg-background-main p-5"
      role="main"
      aria-label="Home"
    >
      {/* Title Section */}
      <header className="mb-6">
        <HomeTitleText userName={userProfile?.name} />
      </header>

      {/* Banner Section */}
      <section className="mb-6" aria-label="Welcome Banner">
        <Banner
          isOneCol={null}
          journeyLength={journeyData?.length || 0}
          isMobileVersion={false}
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <section className="space-y-6" aria-label="Current Learning">
          <OngoingCourse
            onGoingCourseLoading={false}
            listCourseOngoing={[]}
            listJourneyOGC={[]}
            isEmptySetter={() => {}}
          />
          <NewPrograms
            newProgramsLoading={false}
            listJourneyDataNewPrograms={[]}
            isEmptySetter={() => {}}
          />
        </section>

        {/* Right Column */}
        <section className="space-y-6" aria-label="Programs and Events">
          <ExpiringProgram
            expiringLoading={false}
            listJourneyExpiring={[]}
            isEmptySetter={() => {}}
          />
          <OngoingPrograms
            onGoingProgramLoading={false}
            listJourneyDataOngoingProgram={[]}
            isEmptySetter={() => {}}
            listAllData={journeyData || []}
          />
          <UpcomingEvents eventsLoading={false} isEmptySetter={() => {}} />
        </section>
      </div>
    </main>
  )
}

export default HomePage
