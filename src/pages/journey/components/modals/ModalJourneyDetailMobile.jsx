import PropTypes from 'prop-types'
import { Drawer, Button, Image, Divider } from 'antd'
import { CloseOutlined, WarningFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import defaultImage from '@/assets/images/png/general/img_thumb_default.png'
import iCourses from '@/assets/images/svgs/ic_courses_programdesc.svg'

/**
 * Mobile Drawer untuk Journey Detail
 * Full screen drawer dari bottom dengan informasi journey lengkap
 */
export const ModalJourneyDetailMobile = ({
  open,
  onClose,
  journey,
  journeyId,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!journey) return null

  const progress =
    journey.total_module > 0
      ? Math.round((journey.module_completed / journey.total_module) * 100)
      : 0

  const handleViewCourses = () => {
    onClose()
    navigate(`/journey/${journeyId}`)
  }

  return (
    <Drawer
      title={null}
      placement="bottom"
      closable={false}
      open={open}
      onClose={onClose}
      height="90%"
      className="journey-detail-mobile-drawer"
      styles={{
        body: { padding: '20px 16px' },
      }}
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">
            {t('feature.feature_mylj.anchor.my_learning_journey')}
          </p>
          <h2 className="text-base font-semibold text-gray-900 line-clamp-2">
            {journey.name}
          </h2>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="shrink-0 ml-2"
        />
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[calc(90vh-120px)] pb-6">
        {/* Thumbnail */}
        <div className="relative mb-4">
          {/* Days Left Badge */}
          {journey.days_left && journey.is_completed !== 1 && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <WarningFilled />
              <span>
                {journey.days_left === 'overdue'
                  ? t('feature.feature_mylj.anchor.overdue')
                  : journey.days_left > 1
                    ? `${journey.days_left} ${t('feature.feature_mylj.anchor.days_left')}`
                    : `${journey.days_left} Day left`}
              </span>
            </div>
          )}

          <Image
            width="100%"
            height={200}
            className="rounded-lg object-cover"
            src={journey.thumbnail}
            fallback={defaultImage}
            alt={journey.name}
            preview={false}
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Image preview={false} width={20} src={iCourses} alt="courses" />
            <span className="text-sm font-medium text-gray-700">
              {journey.total_course || 0}{' '}
              {(journey.total_course || 0) > 1
                ? t('feature.feature_mylj.anchor.courses')
                : t('feature.feature_mylj.anchor.course')}
            </span>
          </div>

          {journey.is_new !== 1 && (
            <span className="text-sm font-semibold text-blue-600">
              {progress}% {t('feature.feature_mylj.anchor.completed_label')}
            </span>
          )}
        </div>

        <Divider className="my-4" />

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            {t('Description')}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {journey.description || '-'}
          </p>
        </div>

        {/* Additional Info */}
        {journey.total_module > 0 && (
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{t('Total Modules')}</span>
              <span className="font-medium text-gray-900">
                {journey.total_module}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{t('Completed Modules')}</span>
              <span className="font-medium text-gray-900">
                {journey.module_completed}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button
          type="primary"
          block
          size="large"
          onClick={handleViewCourses}
          className="h-12 text-base font-medium"
        >
          {journey.is_new === 1
            ? t('feature.feature_mylj.anchor.start')
            : t('View Courses')}
        </Button>
      </div>
    </Drawer>
  )
}

ModalJourneyDetailMobile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  journey: PropTypes.shape({
    name: PropTypes.string,
    thumbnail: PropTypes.string,
    description: PropTypes.string,
    days_left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_completed: PropTypes.number,
    is_new: PropTypes.number,
    total_course: PropTypes.number,
    total_module: PropTypes.number,
    module_completed: PropTypes.number,
  }),
  journeyId: PropTypes.string.isRequired,
}

export default ModalJourneyDetailMobile
