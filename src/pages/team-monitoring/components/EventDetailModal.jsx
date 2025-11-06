import { useEffect } from 'react'
import { Modal, Row, Col, Divider, Skeleton } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import useEventDetail from '../hooks/useEventDetail'
import ICalendar from '../../../assets/images/custom_svgs/ICalendar'
import IClock from '../../../assets/images/custom_svgs/IClock'
import ILocation from '../../../assets/images/custom_svgs/ILocation'
import IMic from '../../../assets/images/custom_svgs/IMic'
import { getMemberFullName } from '../utils/memberUtils'

/**
 * Event Detail Modal Component
 * Shows event details with categorized members
 */
export default function EventDetailModal({ open, eventId, onClose }) {
  const { t } = useTranslation()
  const {
    eventDetail,
    confirmed,
    notConfirmed,
    declined,
    isLoading,
    fetchDetail,
  } = useEventDetail()

  useEffect(() => {
    if (open && eventId) {
      fetchDetail(eventId)
    }
  }, [open, eventId, fetchDetail])

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      const container = document.getElementById('content-popup-events-calendar')
      if (container) container.scrollTo(0, 0)
    }, 200)
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={564}
      centered
      closeIcon={
        <div className="flex items-center justify-center w-8 h-8 bg-[#F5F5F5] rounded-full">
          <CloseOutlined className="text-[#757575]" />
        </div>
      }
      title={
        isLoading ? (
          <Skeleton.Input active size="small" style={{ width: 200 }} />
        ) : (
          eventDetail?.title
        )
      }
      className="rounded-3xl"
    >
      <div
        id="content-popup-events-calendar"
        className="max-h-[500px] overflow-auto"
      >
        {isLoading ? (
          <div>
            <Skeleton paragraph={{ rows: 4 }} active className="mb-6" />
            <Row gutter={[0, 12]} className="mb-6">
              <Col span={12}>
                <Skeleton.Input active size="small" style={{ width: 150 }} />
              </Col>
              <Col span={12}>
                <Skeleton.Input active size="small" style={{ width: 150 }} />
              </Col>
              <Col span={12}>
                <Skeleton.Input active size="small" style={{ width: 150 }} />
              </Col>
              <Col span={12}>
                <Skeleton.Input active size="small" style={{ width: 150 }} />
              </Col>
            </Row>
          </div>
        ) : eventDetail ? (
          <>
            {/* Description */}
            <p className="text-sm text-[#424242] mb-6 whitespace-pre-wrap">
              {eventDetail.description}
            </p>

            {/* Event Info */}
            <div className="mb-6">
              <Row gutter={[0, 12]}>
                {/* Date */}
                <Col span={12} className="flex items-center gap-2">
                  <ICalendar width={16} height={16} fill="#0066CC" />
                  <span className="text-sm text-[#424242]">
                    {eventDetail.date_range}
                  </span>
                </Col>

                {/* Location */}
                <Col span={12} className="flex items-center gap-2">
                  <ILocation width={16} height={16} fill="#0066CC" />
                  <span className="text-sm text-[#424242]">
                    {eventDetail.location || '-'}
                  </span>
                </Col>

                {/* Time */}
                <Col span={12} className="flex items-center gap-2">
                  <IClock width={16} height={16} fill="#0066CC" />
                  <span className="text-sm text-[#424242]">
                    {eventDetail.time_range}
                  </span>
                </Col>

                {/* Trainer */}
                <Col span={12} className="flex items-center gap-2">
                  <IMic width={16} height={16} fill="#0066CC" />
                  <span className="text-sm text-[#424242]">
                    {eventDetail.trainer || '-'}
                  </span>
                </Col>
              </Row>
            </div>

            {/* Member Lists */}
            <div>
              {/* Confirmed */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-text-title-mobile mb-2">
                  {t('feature.feature_tm.confirmed')} ({confirmed.length})
                </h4>
                {confirmed.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-[#424242]">
                    {confirmed.map((member) => (
                      <li key={member.id}>{getMemberFullName(member)}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Not Confirmed */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-[#F16F24] mb-2">
                  {t('feature.feature_tm.not_confirmed')} ({notConfirmed.length}
                  )
                </h4>
                {notConfirmed.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-[#424242]">
                    {notConfirmed.map((member) => (
                      <li key={member.id}>{getMemberFullName(member)}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Declined */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-[#FF4D4F] mb-2">
                  {t('feature.feature_tm.declined')} ({declined.length})
                </h4>
                {declined.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-[#424242]">
                    {declined.map((member) => (
                      <li key={member.id}>{getMemberFullName(member)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  )
}

EventDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func.isRequired,
}
