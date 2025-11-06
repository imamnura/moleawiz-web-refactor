import { Row, Col, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { PageTitle, Loader } from '@/components/common'
import {
  JourneyCard,
  JourneyFilters,
  JourneyEmptyState,
} from '@/pages/journey/components'
import { useJourneyList } from '@/pages/journey/hooks'
import { useResponsive } from '@/hooks/useResponsive'

/**
 * Learning Journey List Page
 * Menampilkan semua learning journey dengan filter dan search
 */
export const LearningJourneyPage = () => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()

  // Fetch and filter journeys
  const { journeys, isLoading, filter, setFilter, stats } = useJourneyList()

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} min-h-screen bg-gray-50`}>
      {/* Header */}
      <Row align="top" className="mb-6">
        {!isMobile && (
          <Col span={12}>
            <PageTitle
              title={t('feature.feature_mylj.anchor.my_learning_journey')}
              dataAttr="text-title-my-learning-journey"
            />
          </Col>
        )}

        <Col
          span={isMobile ? 24 : 12}
          className={isMobile ? 'text-left' : 'text-right'}
        >
          <JourneyFilters value={filter} onChange={setFilter} stats={stats} />
        </Col>
      </Row>

      {/* Journey List */}
      <Row className="row-section-my-learning-journey">
        {isLoading ? (
          <Loader />
        ) : journeys.length > 0 ? (
          <Flex
            className="h-full w-full"
            wrap="wrap"
            gap={isMobile ? 'small' : 'middle'}
            vertical={isMobile}
          >
            {journeys.map((journey, index) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                isMobile={isMobile}
                index={index}
              />
            ))}
          </Flex>
        ) : (
          <JourneyEmptyState filter={filter} />
        )}
      </Row>
    </div>
  )
}

export default LearningJourneyPage
