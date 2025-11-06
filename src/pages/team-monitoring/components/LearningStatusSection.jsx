import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Skeleton } from 'antd'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import useTeamStatus from '../hooks/useTeamStatus'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import MemberCard from './MemberCard'
import MemberProgramsModal from './MemberProgramsModal'
import Loader from '../../../components/Loader'

/**
 * Learning Status Section Component
 * Displays team members with ongoing programs
 * Supports infinite scroll
 */
export default function LearningStatusSection({
  isEmptyEvent,
  setIsEmptyStatus,
  isMobile,
}) {
  const { t } = useTranslation()
  const [selectedMember, setSelectedMember] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { teams, isLoading } = useTeamStatus()

  // Notify parent about empty state
  useEffect(() => {
    if (!isLoading && setIsEmptyStatus) {
      setIsEmptyStatus(teams.length === 0)
    }
  }, [teams, isLoading, setIsEmptyStatus])
  const { displayedItems, hasMore, loadMore } = useInfiniteScroll(teams, 12)

  const handleMemberClick = (member) => {
    setSelectedMember(member)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedMember(null)
  }

  if (isLoading) {
    return <Loader />
  }

  if (teams.length === 0) {
    return null
  }

  return (
    <>
      <Card
        className="w-full rounded-3xl"
        styles={{
          body: {
            padding: isMobile ? 16 : 24,
          },
        }}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-title-mobile m-0">
            {t('feature.feature_tm.learning_status')}
          </h3>
        </div>

        {/* Scrollable List */}
        <div
          id="scrollable-learning-status"
          className={isEmptyEvent ? 'max-h-[400px]' : 'max-h-[168px]'}
          style={{ overflow: 'auto' }}
        >
          <InfiniteScroll
            dataLength={displayedItems.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <Skeleton paragraph={{ rows: 1 }} active className="py-2" />
            }
            scrollableTarget="scrollable-learning-status"
          >
            {displayedItems.map((member, index) => (
              <MemberCard
                key={member.user_id || index}
                member={member}
                onClick={handleMemberClick}
              />
            ))}
          </InfiniteScroll>
        </div>
      </Card>

      {/* Member Programs Modal */}
      <MemberProgramsModal
        open={modalOpen}
        member={selectedMember}
        onClose={handleCloseModal}
        isMobile={isMobile}
      />
    </>
  )
}

LearningStatusSection.propTypes = {
  isEmptyEvent: PropTypes.bool.isRequired,
  setIsEmptyStatus: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
}
