import PropTypes from 'prop-types'
import { Drawer, Button, Image, Divider, Progress } from 'antd'
import { CloseOutlined, CheckCircleFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import defaultImage from '@/assets/images/png/general/img_thumb_default.png'

/**
 * Mobile Drawer untuk Course Detail
 * Full screen drawer dengan informasi course dan list modules
 */
export const ModalCourseDetailMobile = ({
  open,
  onClose,
  course,
  journeyId,
  courseId,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!course) return null

  const progress =
    course.total_module > 0
      ? Math.round((course.total_completed / course.total_module) * 100)
      : 0

  const handleViewModules = () => {
    onClose()
    navigate(`/journey/${journeyId}/course/${courseId}`)
  }

  return (
    <Drawer
      title={null}
      placement="bottom"
      closable={false}
      open={open}
      onClose={onClose}
      height="90%"
      className="course-detail-mobile-drawer"
      styles={{
        body: { padding: '20px 16px' },
      }}
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">
            {t('feature.feature_mylj.main_content.course_cap')}
          </p>
          <h2 className="text-base font-semibold text-gray-900 line-clamp-2">
            {course.name}
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
          {/* Completed Badge */}
          {course.is_completed === 1 && (
            <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <CheckCircleFilled />
              <span>{t('Completed')}</span>
            </div>
          )}

          <Image
            width="100%"
            height={200}
            className="rounded-lg object-cover"
            src={course.thumbnail}
            fallback={defaultImage}
            alt={course.name}
            preview={false}
          />
        </div>

        {/* Progress Section */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">
              {t('feature.feature_mylj.side_dpd.essential_modules_completed')}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {course.total_completed}/{course.total_module}
            </span>
          </div>
          <Progress
            percent={progress}
            strokeColor={course.is_completed === 1 ? '#52c41a' : '#1890ff'}
            showInfo={false}
            size="small"
          />
        </div>

        <Divider className="my-4" />

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            {t('Description')}
          </h3>
          <div
            className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: course.description || '-' }}
          />
        </div>

        {/* Module Summary (if available) */}
        {course.summary && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {t('Summary')}
            </h3>
            <div
              className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: course.summary }}
            />
          </div>
        )}

        {/* Module Stats */}
        {course.total_module > 0 && (
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{t('Essential Modules')}</span>
              <span className="font-medium text-gray-900">
                {course.total_module}
              </span>
            </div>
            {course.total_module_support > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {t('feature.feature_mylj.anchor.supporting_modules')}
                </span>
                <span className="font-medium text-gray-900">
                  {course.total_module_support}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Action Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button
          type="primary"
          block
          size="large"
          onClick={handleViewModules}
          className="h-12 text-base font-medium"
        >
          {course.is_completed === 1
            ? t('View Modules')
            : course.isopen === 1
              ? t('feature.feature_mylj.anchor.continue')
              : t('feature.feature_mylj.anchor.start')}
        </Button>
      </div>
    </Drawer>
  )
}

ModalCourseDetailMobile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    thumbnail: PropTypes.string,
    description: PropTypes.string,
    summary: PropTypes.string,
    is_completed: PropTypes.number,
    isopen: PropTypes.number,
    total_module: PropTypes.number,
    total_completed: PropTypes.number,
    total_module_support: PropTypes.number,
  }),
  journeyId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
}

export default ModalCourseDetailMobile
