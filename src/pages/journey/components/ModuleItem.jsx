import PropTypes from 'prop-types'
import { CheckOutlined, LockFilled } from '@ant-design/icons'
import { Badge } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

/**
 * ModuleItem Component
 *
 * Displays individual module in the sidebar with status indicators
 *
 * @param {Object} props
 * @param {Object} props.module - Module data
 * @param {string} props.module.id - Module ID
 * @param {string} props.module.fullname - Module name
 * @param {string} props.module.summary - Module number/order
 * @param {number} props.module.is_complete - Completion status (0 or 1)
 * @param {number} props.module.isopen - Locked status (0 or 1)
 * @param {string} props.module.category - Module category
 * @param {string} props.journeyId - Parent journey ID
 * @param {string} props.courseId - Parent course ID
 * @param {boolean} props.isMobile - Mobile view flag
 */
export default function ModuleItem({
  module,
  journeyId,
  courseId,
  isMobile = false,
}) {
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = location.pathname.includes(`/module/${module.id}`)
  const isCompleted = module.is_complete === 1
  const isLocked = module.isopen === 0 && !isCompleted
  const isUnlocked = module.isopen === 1 && !isCompleted

  // Parse module number from summary
  const moduleNumber =
    module.summary && !module.summary.includes('<p') && module.summary !== ''
      ? parseInt(module.summary)
      : null

  // Status styling
  const getStatusStyle = () => {
    if (isCompleted) return 'module-completed'
    if (isUnlocked) return 'module-unlocked'
    if (isLocked) return 'module-locked'
    return ''
  }

  // Status icon
  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckOutlined className="text-green-600 text-xs" />
    }
    if (isLocked) {
      return <LockFilled className="text-gray-400 text-xs" />
    }
    return null
  }

  const moduleLink = `/journey/${journeyId}/course/${courseId}/module/${module.id}`

  return (
    <Link
      to={isLocked ? '#' : moduleLink}
      className={`
        block px-3 py-2.5 rounded-lg transition-all duration-200
        ${isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}
        ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${getStatusStyle()}
      `}
      onClick={(e) => isLocked && e.preventDefault()}
    >
      <div className="flex items-start gap-2">
        {/* Module Number */}
        <div
          className={`
          shrink-0 text-xs font-medium text-gray-600
          ${isMobile ? 'w-16' : 'w-[60px]'}
        `}
        >
          {t('feature.feature_mylj.main_content.list_module')} {moduleNumber}
        </div>

        {/* Module Name */}
        <div className="flex-1 min-w-0">
          <div
            className={`
            text-xs font-normal truncate
            ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'}
            ${isLocked ? 'text-gray-400' : ''}
          `}
          >
            {module.fullname}
          </div>

          {/* Category Badge */}
          {module.category && (
            <Badge
              count={module.category}
              style={{
                backgroundColor: '#E8F4FF',
                color: '#1890ff',
                fontSize: '10px',
                height: '18px',
                lineHeight: '18px',
                marginTop: '4px',
              }}
            />
          )}
        </div>

        {/* Status Icon */}
        <div className="shrink-0">{getStatusIcon()}</div>
      </div>
    </Link>
  )
}

ModuleItem.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fullname: PropTypes.string.isRequired,
    summary: PropTypes.string,
    is_complete: PropTypes.number,
    isopen: PropTypes.number,
    category: PropTypes.string,
  }).isRequired,
  journeyId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
}
