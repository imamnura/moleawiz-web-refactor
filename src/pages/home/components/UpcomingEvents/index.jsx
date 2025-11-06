import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Card, List } from 'antd'
import { Loader } from '@/components/common/Loader'
import { useTranslation } from 'react-i18next'
import useActions from './hooks/useActions'
import IClock from '@/assets/images/custom_svgs/IClock'
import ILocation from '@/assets/images/custom_svgs/ILocation'

// import defaultImage from '@/assets/images/png/general/img_thumb_default.png'

/**
 * UpcomingEvents component
 * Displays list of upcoming events with date, time, and location
 *
 * @param {Object} props
 * @param {boolean} props.eventsLoading - Loading state
 * @param {Function} props.isEmptySetter - Callback to set empty state
 */
const UpcomingEvents = ({ eventsLoading, isEmptySetter }) => {
  const { t } = useTranslation()

  const { dataListEventUser, fetchDetailEventUser } = useActions(
    eventsLoading,
    isEmptySetter
  )

  const handleOpen = (idEvent) => {
    fetchDetailEventUser(idEvent)
  }

  return (
    <Card
      bodyStyle={{
        padding: '19px 0 20px 20px',
      }}
      className="card"
      bordered={false}
    >
      <Row>
        <Col span={24} className="text-[22px] font-medium text-left mb-[15px]">
          {t('feature.home.events.event_sec.upcoming_event')}
        </Col>
        <Col span={24}>
          <List
            className="limit-list text-start w-100 list-event-home"
            itemLayout="horizontal"
            dataSource={dataListEventUser}
            size="medium"
            renderItem={(item, index) => (
              <List.Item
                key={index}
                data-id={index}
                id="list-data-upcoming-events-home"
                onClick={() => handleOpen(item.id)}
                className="cursor-pointer hover:bg-background-grey transition-colors"
              >
                <List.Item.Meta
                  className="align-items-center"
                  description={
                    <div className="flex flex-col items-start">
                      {/* Date and Tentative Badge */}
                      <div className="mb-[7px] flex items-center">
                        <div className="text-sm font-bold text-primary mr-1.5">
                          {item.date_range}
                        </div>
                        <div
                          className={`
                            ${item.tentative === 'tentatively' ? 'block' : 'hidden'}
                            leading-normal px-2 py-[3px] rounded-full
                            bg-[#F16F24] text-xs font-bold text-white
                          `}
                        >
                          {t('feature.home.events.event_sec.tentative')}
                        </div>
                      </div>

                      {/* Event Title */}
                      <div className="upcoming-events-title break-dots-second-line mb-[11px] text-sm font-medium text-text-title leading-[1.2] overflow-hidden text-ellipsis">
                        {item.title}
                      </div>

                      {/* Time and Location */}
                      <div className="flex flex-row justify-start">
                        {/* Time */}
                        <div className="min-w-[90px] leading-normal mr-6 flex flex-row justify-start items-center">
                          <div className="mr-1.5 flex">
                            <IClock fill="#67686D" width={12} height={12} />
                          </div>
                          <div className="text-xs text-text-desc">
                            {item.time_range}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="leading-normal flex flex-row justify-start items-center">
                          <div className="mr-1.5 flex">
                            <ILocation fill="#67686D" width={12} height={12} />
                          </div>
                          <div className="break-dots-first-line text-xs text-text-desc overflow-hidden text-ellipsis">
                            {item.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  )
}

UpcomingEvents.propTypes = {
  eventsLoading: PropTypes.bool.isRequired,
  isEmptySetter: PropTypes.func.isRequired,
}

export default UpcomingEvents
