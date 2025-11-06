import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Typography } from 'antd'
import PropTypes from 'prop-types'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useGetCalendarEventsQuery } from '../../../services/api/teamMonitoringApi'
import EventDetailModal from './EventDetailModal'
import Loader from '../../../components/Loader'

const { Text } = Typography

/**
 * Calendar View Component
 * FullCalendar integration for team monitoring events
 */
export default function CalendarView({ isMobile }) {
  const { t, i18n } = useTranslation()
  const calendarRef = useRef()
  const [dateRange, setDateRange] = useState(null)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const locale = i18n.language === 'en' ? 'en' : 'id'

  // Fetch calendar events for current month range
  const { data: events = [], isLoading } = useGetCalendarEventsQuery(
    {
      startDate: dateRange?.startStr,
      endDate: dateRange?.endStr,
    },
    {
      skip: !dateRange,
    }
  )

  // Handle today button click
  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.today()
    }
  }

  // Handle event click
  const handleEventClick = (info) => {
    setSelectedEventId(info.event.id)
    setModalOpen(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedEventId(null)
  }

  // Handle month change
  const handleDatesSet = (dateInfo) => {
    setDateRange({
      startStr: dateInfo.startStr,
      endStr: dateInfo.endStr,
    })
  }

  // Render event content with tooltip
  const renderEventContent = (eventInfo) => {
    return (
      <Text
        ellipsis={{
          tooltip: {
            title: eventInfo.event.title,
            placement: 'topLeft',
            arrow: false,
          },
        }}
        style={{ width: '100%' }}
      >
        {eventInfo.event.title}
      </Text>
    )
  }

  if (isLoading && !events.length) {
    return <Loader />
  }

  return (
    <>
      <Card
        className="w-full rounded-3xl calendar-card-teammonitoring"
        styles={{
          body: {
            padding: isMobile ? 16 : 24,
          },
        }}
      >
        <FullCalendar
          ref={calendarRef}
          locale={locale}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          firstDay={1}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          customButtons={{
            today: {
              text: t('feature.feature_tm.today'),
              click: handleToday,
            },
          }}
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          events={events}
          editable={false}
          selectable={false}
          selectMirror={true}
          dayMaxEvents={true}
          eventDidMount={(info) => {
            // Event styling
            info.el.style.borderBottomWidth = '2px'
            info.el.style.borderRadius = '3px'
          }}
          eventContent={renderEventContent}
          height="auto"
        />
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

CalendarView.propTypes = {
  isMobile: PropTypes.bool.isRequired,
}
