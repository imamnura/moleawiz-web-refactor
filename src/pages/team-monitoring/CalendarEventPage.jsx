import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CalendarView from './components/CalendarView'

/**
 * Calendar Event Page
 * Full calendar view for team monitoring events
 */
export default function CalendarEventPage() {
  const { t } = useTranslation()
  const { setHomeTitle } = useOutletContext()
  const isMobile = useSelector((state) => state.isMobile)

  // Set page title
  useEffect(() => {
    setHomeTitle(t('feature.feature_tm.calendar'))
  }, [setHomeTitle, t])

  return (
    <section className="w-full" aria-label="Calendar Events">
      <CalendarView isMobile={isMobile} />
    </section>
  )
}
