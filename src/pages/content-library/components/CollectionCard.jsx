/**
 * CollectionCard Component
 * Card for Collection items (Journey/Course/Module)
 */
import PropTypes from 'prop-types'
import { Card, Image, Tag, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@hooks/useIsMobile'
import { checkType, getNavigationPath } from '../utils/collectionUtils'
import { DeleteConfirmModal } from './DeleteConfirmModal'

export const CollectionCard = ({ item, onDelete }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const thumbnail = checkType(item.type, 'image', item, t)
  const typeLabel = checkType(item.type, 'type', item, t)
  const title = checkType(item.type, 'title', item, t)
  const description = checkType(item.type, 'description', item, t)

  const handleCardClick = () => {
    const path = getNavigationPath(
      item.type,
      item.content_library_id,
      item.journey_id,
      item.course_id,
      item.module_id
    )
    navigate(path)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(item)
    setDeleteModalOpen(false)
  }

  const completionBadge = item.is_complete ? (
    <Tag color="success" className="text-xs">
      {t('feature.feature_cl.collection_card.completed')}
    </Tag>
  ) : null

  if (isMobile) {
    return (
      <>
        <article
          onClick={handleCardClick}
          className="flex gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        >
          <Image
            src={thumbnail}
            alt={title}
            preview={false}
            className="w-[124px] h-36 object-cover rounded shrink-0"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <Tag color="blue" className="text-xs">
                {typeLabel}
              </Tag>
              {completionBadge}
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          </div>
        </article>
        <DeleteConfirmModal
          open={deleteModalOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModalOpen(false)}
          itemName={title}
        />
      </>
    )
  }

  return (
    <>
      <article className="collection-card-wrapper">
        <Card
          hoverable
          onClick={handleCardClick}
          className="w-[228px] h-full relative"
          cover={
            <div className="h-[180px] overflow-hidden relative">
              <Image
                src={thumbnail}
                alt={title}
                preview={false}
                className="w-full h-full object-cover"
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                size="small"
              />
            </div>
          }
        >
          <div className="flex flex-col h-full">
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <Tag color="blue" className="text-xs">
                {typeLabel}
              </Tag>
              {completionBadge}
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          </div>
        </Card>
      </article>
      <DeleteConfirmModal
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        itemName={title}
      />
    </>
  )
}

CollectionCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['journey', 'course', 'module']).isRequired,
    name: PropTypes.string,
    fullname: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    content_library_id: PropTypes.number.isRequired,
    journey_id: PropTypes.number.isRequired,
    course_id: PropTypes.number,
    module_id: PropTypes.number,
    is_complete: PropTypes.bool,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
}
