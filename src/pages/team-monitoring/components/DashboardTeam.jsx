import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import { Card, Row, Col, Flex, Progress, Button, Image } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useTeamOverview from '../hooks/useTeamOverview'
import Loader from '../../../components/Loader'
import IcTotalMembers from '../../../assets/images/svgs/ic_cardteamprogram_teammonitoring.svg'
import ImgThumbDefault from '../../../assets/images/png/general/img_thumb_default.png'

/**
 * Dashboard Team Component
 * Displays ongoing team programs with cards
 */
export default function DashboardTeam() {
  const { t } = useTranslation()
  const { setHomeTitle } = useOutletContext()
  const isMobile = useSelector((state) => state.isMobile)

  const { programs, isLoading } = useTeamOverview()

  // Calculate progress percentage
  const calculateProgress = (completedUsers, totalUsers) => {
    if (!totalUsers) return 0
    return (completedUsers / totalUsers) * 100
  }

  // Set page title on mount
  useEffect(() => {
    setHomeTitle(t('feature.feature_tm.team_monitoring'))
  }, [setHomeTitle, t])

  if (isLoading) {
    return <Loader />
  }

  return (
    <Card
      className="w-full rounded-3xl"
      styles={{
        body: {
          padding: isMobile ? 16 : 24,
        },
      }}
    >
      <Row className="w-full">
        {/* Header */}
        <div className="text-lg font-semibold text-text-title-mobile mb-5">
          {t('feature.feature_tm.ongoing_team_program')} ({programs.length})
        </div>

        {/* Programs Grid */}
        <div
          className="w-full"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            height: programs.length > 0 ? '467px' : 'auto',
          }}
        >
          {programs.length > 0 ? (
            <Flex wrap="wrap" gap="large">
              {programs.map((program) => (
                <div key={program.program_id || program.journey_id}>
                  <Card
                    className="w-[180px]"
                    styles={{
                      body: {
                        padding: 0,
                      },
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="w-full">
                      <Image
                        preview={false}
                        width={180}
                        height={114}
                        src={program.thumbnail}
                        fallback={ImgThumbDefault}
                        alt="Program thumbnail"
                        className="rounded-t-lg object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      {/* Program Name */}
                      <div className="mb-3 h-10 overflow-hidden">
                        <div
                          className="text-sm font-medium text-text-title-mobile line-clamp-2"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {program.program_name}
                        </div>
                      </div>

                      {/* Members Info */}
                      <div className="flex items-center gap-1 mb-2">
                        <Image
                          preview={false}
                          src={IcTotalMembers}
                          width={16}
                          height={16}
                          alt="members icon"
                        />
                        <span className="text-xs text-[#67686D]">
                          {program.total_completed_user}/{program.total_user}{' '}
                          {t('feature.feature_tm.member_completed')}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <Progress
                          percent={calculateProgress(
                            program.total_completed_user,
                            program.total_user
                          )}
                          strokeColor="#0066CC"
                          showInfo={false}
                          size="small"
                        />
                      </div>

                      {/* View Button */}
                      <Link
                        to={`/team-monitoring/journey/${program.program_id || program.journey_id}`}
                      >
                        <Button
                          type="primary"
                          block
                          className="h-10"
                          style={{
                            background: '#0066CC',
                            borderColor: '#0066CC',
                          }}
                        >
                          {t('feature.feature_tm.view')}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              ))}
            </Flex>
          ) : (
            <div className="text-center text-[#67686D] py-10">
              {t('feature.feature_tm.member_no_program')}
            </div>
          )}
        </div>
      </Row>
    </Card>
  )
}

// No props - uses hooks and context
