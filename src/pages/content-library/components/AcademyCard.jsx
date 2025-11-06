/**
 * AcademyCard Component
 * Card for Content Library (Academy) items
 */
import PropTypes from 'prop-types'
import { Card, Image, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@hooks/useIsMobile'

export const AcademyCard = ({ academy }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const handleClick = () => {
    navigate(`/content-library/academy/${academy.id}`)
  }

  if (isMobile) {
    return (
      <article
        onClick={handleClick}
        className="flex gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <Image
          src={academy.thumbnail}
          alt={academy.name}
          preview={false}
          className="w-[124px] h-36 object-cover rounded shrink-0"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
            {academy.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {academy.description || '-'}
          </p>
          <p className="text-xs text-gray-500 mt-auto">
            {academy.total_programs}{' '}
            {t('feature.feature_cl.academy_card.programs')}
          </p>
        </div>
      </article>
    )
  }

  return (
    <article className="academy-card-wrapper">
      <Card
        hoverable
        onClick={handleClick}
        className="w-[228px] h-full"
        cover={
          <div className="h-[180px] overflow-hidden">
            <Image
              src={academy.thumbnail}
              alt={academy.name}
              preview={false}
              className="w-full h-full object-cover"
            />
          </div>
        }
      >
        <div className="flex flex-col h-full">
          <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
            {academy.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {academy.description || '-'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {academy.total_programs}{' '}
              {t('feature.feature_cl.academy_card.programs')}
            </span>
            <Button type="primary" size="small">
              {t('feature.feature_cl.academy_card.enter')}
            </Button>
          </div>
        </div>
      </Card>
    </article>
  )
}

AcademyCard.propTypes = {
  academy: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    total_programs: PropTypes.number.isRequired,
  }).isRequired,
}
