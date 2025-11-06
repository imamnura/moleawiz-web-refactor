import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Col, ConfigProvider } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import useTeamOverview from './hooks/useTeamOverview'
import TeamOverview from './components/TeamOverview'
import LearningStatusSection from './components/LearningStatusSection'
import LearningEventSection from './components/LearningEventSection'
import DashboardTeam from './components/DashboardTeam'
import EmptyState from './components/EmptyState'
import HomeTitle from '../../components/HomeTitle'
import Loader from '../../components/Loader'

/**
 * Team Monitoring Main Page
 * Dashboard with team overview, learning status, and events
 */
export default function TeamMonitoringPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const isMobile = useSelector((state) => state.isMobile)

  const [homeTitle, setHomeTitle] = useState('')
  const [isEmptyDashboard, setIsEmptyDashboard] = useState(false)
  const [isEmptyEvent, setIsEmptyEvent] = useState(false)
  const [isEmptyStatus, setIsEmptyStatus] = useState(false)

  const { teamCount, programs, isLoading } = useTeamOverview()

  // Check if we're on the anchor page (main dashboard)
  const isAnchorPage = () => {
    const pathParts = location.pathname.split('/')
    return pathParts.indexOf('team-monitoring') === pathParts.length - 1
  }

  const isAnchor = isAnchorPage()

  // Check if all sections are empty
  const allEmpty = isEmptyDashboard && isEmptyStatus && isEmptyEvent

  // Set home title
  useEffect(() => {
    if (isAnchor) {
      setHomeTitle(t('feature.feature_tm.team_monitoring'))
    }
  }, [location, isAnchor, t])

  // Update empty dashboard state
  useEffect(() => {
    setIsEmptyDashboard(programs.length === 0 && !isLoading)
  }, [programs, isLoading])

  // Check if page needs no padding (sub-pages)
  const isPageNoPadding =
    location.pathname.includes('/event/detail') ||
    location.pathname.includes('/learning-status/detail') ||
    location.pathname.includes('/journey/') ||
    location.pathname.includes('/team-profile')

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Roboto',
          borderRadiusLG: 24,
        },
        components: {
          Table: {
            rowSelectedHoverBg: 'none',
            rowSelectedBg: 'none',
          },
        },
      }}
    >
      <section className="h-full" aria-label="Team Monitoring Dashboard">
        {allEmpty ? (
          <EmptyState
            message={t('feature.feature_tm.member_no_program')}
            isMobile={isMobile}
          />
        ) : (
          <Row className={isMobile ? 'h-auto' : 'h-full'}>
            {/* Main Content */}
            <Col
              span={isMobile ? 24 : isAnchor ? 17 : 24}
              className="h-full"
              style={{
                padding: isMobile
                  ? isPageNoPadding
                    ? 0
                    : '24px 18px'
                  : '20px 35px 20px 40px',
              }}
            >
              {/* Desktop Header */}
              {!isMobile && (
                <Row align="top" className="mb-5">
                  <Col
                    span={
                      isAnchor
                        ? isEmptyDashboard && isEmptyEvent
                          ? 16
                          : 14
                        : 24
                    }
                  >
                    <HomeTitle textTitle={homeTitle} dynamic={false} />
                  </Col>

                  {/* Team Overview (only on anchor page) */}
                  {isAnchor && !isLoading && (
                    <Col span={isEmptyDashboard && isEmptyEvent ? 8 : 10}>
                      <TeamOverview
                        teamCount={teamCount}
                        isLoading={isLoading}
                      />
                    </Col>
                  )}
                </Row>
              )}

              {/* Outlet for sub-routes */}
              <Row className={isMobile ? '' : isAnchor ? 'pb-5' : ''}>
                {isAnchor ? (
                  <DashboardTeam />
                ) : (
                  <Outlet context={{ setHomeTitle, location }} />
                )}
              </Row>
            </Col>

            {/* Right Sidebar (Learning Status & Events) */}
            {isAnchor && !isLoading && (
              <Col
                span={isMobile ? 24 : 7}
                className="h-full"
                style={{
                  background: isMobile ? 'none' : '#FFFFFF',
                  paddingTop: isMobile ? 0 : 20,
                }}
              >
                {/* Desktop: Match header height */}
                {!isMobile && (
                  <Row align="top" className="mb-5">
                    <div style={{ visibility: 'hidden' }}>
                      <HomeTitle textTitle={homeTitle} dynamic={false} />
                    </div>
                  </Row>
                )}

                {/* Sections */}
                <div
                  className={
                    isMobile ? 'flex flex-col gap-6' : 'pr-5 space-y-5'
                  }
                >
                  {/* Learning Status Section */}
                  {!isEmptyStatus && (
                    <LearningStatusSection
                      isEmptyEvent={isEmptyEvent}
                      setIsEmptyStatus={setIsEmptyStatus}
                      isMobile={isMobile}
                    />
                  )}

                  {/* Learning Event Section */}
                  {!isEmptyEvent && (
                    <LearningEventSection
                      isEmptyStatus={isEmptyStatus}
                      setIsEmptyEvent={setIsEmptyEvent}
                      isMobile={isMobile}
                    />
                  )}
                </div>
              </Col>
            )}
          </Row>
        )}

        {isLoading && <Loader />}
      </section>
    </ConfigProvider>
  )
}
