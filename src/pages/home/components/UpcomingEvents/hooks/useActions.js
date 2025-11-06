import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useGetUpcomingEventsQuery } from '@services/api/homeApi'
import { setIsOpenModalUE, setEventDetailData } from '@store/slices/homeSlice'
import {
  formatDateRange,
  formatTimeRange,
  getDaysBetween,
} from '@utils/dateUtils'

const defaultNullValue = '-'

const useActions = () => {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  // const reRenderMenu = useSelector((state) => state.localization.reRenderMenu)

  const locale = i18n.language === 'en' ? 'en' : 'id'

  // Fetch upcoming events
  const {
    data: eventsData = [],
    isLoading,
    // isError,
  } = useGetUpcomingEventsQuery()

  // Process and filter events
  const dataListEventUser = useMemo(() => {
    return eventsData
      .filter((item) => {
        return (
          item.tentative &&
          item.tentative !== 'declined' &&
          item.tentative !== '' &&
          item.tentative !== null
        )
      })
      .map((event) => {
        const date_range = formatDateRange(
          event.start_date,
          event.end_date,
          locale,
          defaultNullValue
        )

        const time_range = formatTimeRange(
          event.start_time,
          event.end_time,
          defaultNullValue
        )

        return {
          ...event,
          date_range,
          time_range,
        }
      })
  }, [eventsData, locale])

  // Handle fetching and showing event detail
  const fetchDetailEventUser = useCallback(
    (eventId) => {
      const event = eventsData.find((e) => e.id === eventId)

      if (event) {
        const eventDetail = {
          ...event,
          date_range: formatDateRange(
            event.start_date,
            event.end_date,
            locale,
            defaultNullValue
          ),
          time_range: formatTimeRange(
            event.start_time,
            event.end_time,
            defaultNullValue
          ),
          date_duration:
            event.start_date && event.end_date
              ? getDaysBetween(event.start_date, event.end_date) + 1
              : defaultNullValue,
        }

        dispatch(
          setEventDetailData({
            id: eventDetail.id,
            title: eventDetail.title,
            desc: eventDetail.description,
            date_range: eventDetail.date_range,
            time_range: eventDetail.time_range,
            location: eventDetail.location,
            speaker: eventDetail.trainer,
            thumbnail: eventDetail.thumbnail,
            is_tentative: eventDetail.tentative === 'tentatively' ? 1 : 0,
          })
        )
        dispatch(setIsOpenModalUE(true))
      }
    },
    [eventsData, locale, dispatch]
  )

  return {
    loading: isLoading,
    dataListEventUser,
    fetchDetailEventUser,
    isEmpty: !isLoading && dataListEventUser.length === 0,
  }
}

export default useActions
