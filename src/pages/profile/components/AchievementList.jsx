import { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { formatProfileDate } from '../utils/formatters'
import badgesDefault from '@assets/images/svgs/ic_badges_certificate.svg'

/**
 * Achievement List Component
 * Displays list of badges/achievements
 */
export function AchievementList({ achievements, isLoading }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'id'
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewBadge = (badge) => {
    setSelectedBadge(badge)
    setShowModal(true)
  }

  if (isLoading) {
    return <div className="p-10 text-center text-gray-600">Loading...</div>
  }

  if (!achievements || achievements.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600">
        {t('feature.feature_profile.sec_tab.no_badges_yet')}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-6 p-10 md:grid-cols-4 lg:grid-cols-6">
        {achievements.map((badge, index) => (
          <div
            key={index}
            className="cursor-pointer text-center transition-transform hover:scale-110"
            onClick={() => handleViewBadge(badge)}
            id={`badge-${index}`}
          >
            <Image
              width={120}
              height={120}
              className="mx-auto"
              src={badge.image || badge.thumbnail}
              preview={false}
              fallback={badgesDefault}
              alt={badge.name}
            />
            <div className="mt-2 text-sm font-medium text-gray-800 line-clamp-2">
              {badge.name}
            </div>
          </div>
        ))}
      </div>

      {/* Badge Detail Modal */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={424}
        centered
        className="badge-modal"
        closeIcon={
          <div className="rounded-full bg-gray-100 p-2">
            <CloseOutlined className="text-sm text-gray-600" />
          </div>
        }
      >
        {selectedBadge && (
          <div className="p-8 text-center">
            <Image
              width={200}
              height={200}
              className="mx-auto"
              src={selectedBadge.image || selectedBadge.thumbnail}
              preview={false}
              fallback={badgesDefault}
              alt={selectedBadge.name}
            />

            <div className="mb-1 mt-3 text-[22px] font-medium text-gray-800">
              {selectedBadge.name}
            </div>

            <div className="mt-4 text-left">
              {/* From Module */}
              {selectedBadge.module_name && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-600">
                    {t('feature.feature_profile.sec_popup_badges.from_module')}
                  </div>
                  <div className="mt-1 text-sm text-gray-800">
                    {selectedBadge.module_name}
                  </div>
                </div>
              )}

              {/* Received Date */}
              {selectedBadge.recived && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-600">
                    {t('feature.feature_profile.sec_popup_badges.received_on')}
                  </div>
                  <div className="mt-1 text-sm text-gray-800">
                    {formatProfileDate(selectedBadge.recived, locale)}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedBadge.description && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    {t('feature.feature_profile.sec_popup_badges.description')}
                  </div>
                  <div className="mt-1 text-sm leading-relaxed text-gray-800">
                    {selectedBadge.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

AchievementList.propTypes = {
  achievements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      image: PropTypes.string,
      thumbnail: PropTypes.string,
      module_name: PropTypes.string,
      recived: PropTypes.string,
      description: PropTypes.string,
      point: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  isLoading: PropTypes.bool,
}

AchievementList.defaultProps = {
  achievements: [],
  isLoading: false,
}
