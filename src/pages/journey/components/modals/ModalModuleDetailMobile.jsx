import PropTypes from 'prop-types'
import { Drawer, Button, Image, Divider, Tag, Space } from 'antd'
import {
  CloseOutlined,
  PlayCircleFilled,
  CheckCircleFilled,
  LockFilled,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDuration } from '@/utils/dateUtils'
import defaultImage from '@/assets/images/png/general/img_thumb_default.png'

/**
 * Mobile Drawer untuk Module Detail
 * Full screen drawer dengan informasi module dan action buttons
 */
export const ModalModuleDetailMobile = ({
  open,
  onClose,
  module,
  journeyId,
  courseId,
  moduleId,
  onStart,
  onContinue,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!module) return null

  const isCompleted = module.is_complete === 1
  const isLocked = module.isopen === 0
  const isStarted = module.is_complete === 0 && module.isopen === 1

  const handleAction = () => {
    onClose()

    if (isCompleted && onContinue) {
      onContinue()
    } else if (isStarted && onContinue) {
      onContinue()
    } else if (!isLocked && onStart) {
      onStart()
    }
  }

  const getActionButton = () => {
    if (isLocked) {
      return {
        text: t('Locked'),
        icon: <LockFilled />,
        disabled: true,
        type: 'default',
      }
    }

    if (isCompleted) {
      return {
        text: t('Review Module'),
        icon: <CheckCircleFilled />,
        disabled: false,
        type: 'default',
      }
    }

    if (isStarted) {
      return {
        text: t('feature.feature_mylj.anchor.continue'),
        icon: <PlayCircleFilled />,
        disabled: false,
        type: 'primary',
      }
    }

    return {
      text: t('feature.feature_mylj.anchor.start'),
      icon: <PlayCircleFilled />,
      disabled: false,
      type: 'primary',
    }
  }

  const actionButton = getActionButton()

  return (
    <Drawer
      title={null}
      placement="bottom"
      closable={false}
      open={open}
      onClose={onClose}
      height="90%"
      className="module-detail-mobile-drawer"
      styles={{
        body: { padding: '20px 16px' },
      }}
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">
            {t('feature.feature_mylj.main_content.list_module')}{' '}
            {module.summary &&
            module.summary.indexOf('<p') === -1 &&
            module.summary !== ''
              ? parseInt(module.summary)
              : ''}
          </p>
          <h2 className="text-base font-semibold text-gray-900 line-clamp-2">
            {module.fullname}
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
        {/* Status Badge */}
        <div className="mb-4">
          {isCompleted && (
            <Tag color="success" className="text-xs">
              <CheckCircleFilled className="mr-1" />
              {t('Completed')}
            </Tag>
          )}
          {isLocked && (
            <Tag color="default" className="text-xs">
              <LockFilled className="mr-1" />
              {t('Locked')}
            </Tag>
          )}
          {isStarted && (
            <Tag color="processing" className="text-xs">
              <PlayCircleFilled className="mr-1" />
              {t('In Progress')}
            </Tag>
          )}
        </div>

        {/* Thumbnail (if available) */}
        {module.thumbnail && (
          <div className="relative mb-4">
            <Image
              width="100%"
              height={200}
              className="rounded-lg object-cover"
              src={module.thumbnail}
              fallback={defaultImage}
              alt={module.fullname}
              preview={false}
            />
          </div>
        )}

        {/* Module Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
          {module.category && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{t('Category')}</span>
              <span className="font-medium text-gray-900">
                {module.category}
              </span>
            </div>
          )}

          {module.duration && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{t('Duration')}</span>
              <span className="font-medium text-gray-900">
                {formatDuration(module.duration)}
              </span>
            </div>
          )}

          {module.type && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{t('Type')}</span>
              <span className="font-medium text-gray-900 capitalize">
                {module.type}
              </span>
            </div>
          )}
        </div>

        <Divider className="my-4" />

        {/* Description */}
        {module.intro && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {t('Description')}
            </h3>
            <div
              className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: module.intro }}
            />
          </div>
        )}

        {/* Additional Content/Summary */}
        {module.content && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {t('Content Overview')}
            </h3>
            <div
              className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: module.content }}
            />
          </div>
        )}

        {/* Learning Objectives (if available) */}
        {module.objectives && module.objectives.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {t('Learning Objectives')}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {module.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Space direction="vertical" className="w-full" size="middle">
          {/* Main Action Button */}
          <Button
            type={actionButton.type}
            block
            size="large"
            icon={actionButton.icon}
            onClick={handleAction}
            disabled={actionButton.disabled}
            className="h-12 text-base font-medium"
          >
            {actionButton.text}
          </Button>

          {/* View in Full Page (Optional) */}
          {!isLocked && (
            <Button
              type="text"
              block
              onClick={() => {
                onClose()
                navigate(
                  `/journey/${journeyId}/course/${courseId}/module/${moduleId}`
                )
              }}
              className="text-sm text-gray-600"
            >
              {t('View Full Details')}
            </Button>
          )}
        </Space>
      </div>
    </Drawer>
  )
}

ModalModuleDetailMobile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  module: PropTypes.shape({
    fullname: PropTypes.string,
    summary: PropTypes.string,
    thumbnail: PropTypes.string,
    category: PropTypes.string,
    duration: PropTypes.number,
    type: PropTypes.string,
    intro: PropTypes.string,
    content: PropTypes.string,
    objectives: PropTypes.arrayOf(PropTypes.string),
    is_complete: PropTypes.number,
    isopen: PropTypes.number,
  }),
  journeyId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
  onStart: PropTypes.func,
  onContinue: PropTypes.func,
}

export default ModalModuleDetailMobile
