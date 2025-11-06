import PropTypes from 'prop-types'
import { Image } from 'antd'
import { useTranslation } from 'react-i18next'
import defaultImage from '@assets/images/png/general/img_thumb_default.png'
import ICDeleteModule from '@assets/images/svgs/ic_delete_module_review.svg'
import { formatModuleDate, canDeleteModule } from '../utils/formatters'

/**
 * ModuleCard - Single module card component
 * Displays module info with thumbnail, name, program, deadline, and need review count
 */
const ModuleCard = ({
  module,
  onClick,
  onDelete,
  isActive,
  isMobile = false,
}) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'id'

  const handleDelete = (e) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(module)
    }
  }

  if (isMobile) {
    return (
      <div onClick={onClick} className="w-full cursor-pointer">
        <div className="rounded-lg shadow-sm bg-white overflow-hidden">
          <div className="flex gap-0">
            <div className="shrink-0">
              <Image
                preview={false}
                width={101}
                height={116}
                className="object-cover rounded-lg"
                src={module.thumbnail}
                fallback={defaultImage}
                alt="Thumbnail Review"
              />
            </div>
            <div className="flex-1 p-3">
              <div className="h-[38px] text-sm font-medium text-gray-900 leading-4 overflow-hidden text-ellipsis line-clamp-2 mb-2">
                {module.module_name}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center">
                  <span className="text-gray-600 min-w-[75px]">
                    {t('feature.feature_reviews.anchor.program')}
                  </span>
                  <span>:&nbsp;</span>
                  <span className="font-medium text-black truncate">
                    {module.journey_name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 min-w-[75px]">
                    {t('feature.feature_reviews.anchor.deadline')}
                  </span>
                  <span>:&nbsp;</span>
                  <span className="font-medium text-black">
                    {formatModuleDate(module.deadline, locale)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 min-w-[75px]">
                    {t('feature.feature_reviews.anchor.need_review')}
                  </span>
                  <span>:&nbsp;</span>
                  <span className="font-medium text-black">
                    {module.need_review}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative pb-5 last:pb-0">
      <div
        onClick={onClick}
        className={`
          flex gap-3 cursor-pointer rounded-lg p-0 border-b border-gray-200 pb-5 last:border-b-0
          ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}
        `}
      >
        <div className="shrink-0">
          <Image
            preview={false}
            width={131}
            height={91}
            className="object-cover rounded-lg"
            src={module.thumbnail}
            fallback={defaultImage}
            alt="Thumbnail Module Review"
          />
        </div>
        <div className="flex-1">
          <div className="text-base font-medium text-gray-900 mb-1.5 truncate">
            {module.module_name}
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="text-left">
                <td className="w-[85px] text-gray-600">
                  {t('feature.feature_reviews.anchor.program')}
                </td>
                <td className="px-1">:</td>
                <td className="font-medium text-gray-900 truncate max-w-[20vw]">
                  {module.journey_name}
                </td>
              </tr>
              <tr className="text-left">
                <td className="text-gray-600">
                  {t('feature.feature_reviews.anchor.deadline')}
                </td>
                <td className="px-1">:</td>
                <td className="font-medium text-gray-900">
                  {formatModuleDate(module.deadline, locale)}
                </td>
              </tr>
              <tr className="text-left">
                <td className="text-gray-600">
                  {t('feature.feature_reviews.anchor.need_review')}
                </td>
                <td className="px-1">:</td>
                <td className="font-medium text-gray-900">
                  {module.need_review}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {canDeleteModule(module) && (
        <div
          className="absolute top-0 right-0 cursor-pointer"
          onClick={handleDelete}
        >
          <Image
            preview={false}
            width={24}
            height={24}
            src={ICDeleteModule}
            fallback={ICDeleteModule}
            alt="Delete Module"
          />
        </div>
      )}
    </div>
  )
}

ModuleCard.propTypes = {
  module: PropTypes.shape({
    module_id: PropTypes.number.isRequired,
    journey_id: PropTypes.number.isRequired,
    module_name: PropTypes.string.isRequired,
    journey_name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    deadline: PropTypes.string,
    need_review: PropTypes.number,
    has_all_users_first_submission: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isActive: PropTypes.bool,
  isMobile: PropTypes.bool,
}

ModuleCard.defaultProps = {
  onDelete: null,
  isActive: false,
  isMobile: false,
}

export default ModuleCard
