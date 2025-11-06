import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Button } from 'antd'
import PropTypes from 'prop-types'
import useTeamEvents from '../hooks/useTeamEvents'
import EventCard from './EventCard'
import EventDetailModal from './EventDetailModal'
import Loader from '../../../components/Loader'

/**
 * Learning Event Section Component
 * Displays upcoming events with clickable cards
 */
export default function LearningEventSection({
  isEmptyStatus,
  setIsEmptyEvent,
  isMobile,
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { events, isLoading } = useTeamEvents()

  // Notify parent about empty state
  useEffect(() => {
    if (!isLoading && setIsEmptyEvent) {
      setIsEmptyEvent(events.length === 0)
    }
  }, [events, isLoading, setIsEmptyEvent])

  const handleEventClick = (event) => {
    setSelectedEventId(event.id)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedEventId(null)
  }

  const handleShowCalendar = () => {
    navigate('/team-monitoring/event/detail')
  }

  if (isLoading) {
    return <Loader />
  }

  if (events.length === 0) {
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-title-mobile m-0">
            {t('feature.feature_tm.learning_event')}
          </h3>
          <Button
            type="primary"
            onClick={handleShowCalendar}
            className="h-10 px-6 text-sm"
            style={{
              background: '#0066CC',
              borderColor: '#0066CC',
            }}
          >
            {t('feature.feature_tm.show_calendar')}
          </Button>
        </div>

        {/* Event List */}
        <div
          className={isEmptyStatus ? 'max-h-[400px]' : 'max-h-[168px]'}
          style={{ overflow: 'auto' }}
        >
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={handleEventClick}
              showBorder={index < events.length - 1}
            />
          ))}
        </div>
      </Card>

      {/* Event Detail Modal */}
      <EventDetailModal
        open={modalOpen}
        eventId={selectedEventId}
        onClose={handleCloseModal}
        isMobile={isMobile}
      />
    </>
  )
}

LearningEventSection.propTypes = {
  isEmptyStatus: PropTypes.bool.isRequired,
  setIsEmptyEvent: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
}
