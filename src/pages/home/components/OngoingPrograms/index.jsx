import React from 'react'
import PropTypes from 'prop-types'
import { Progress, Col, Row, Card, List, Image } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Loader } from '@/components/common/Loader'
import { useTranslation } from 'react-i18next'
import useActions from './hooks/useActions'

import defaultImage from '@/assets/images/png/general/img_thumb_default.png'
import { progressBarCircle } from '@/config/constant/color/index'

/**
 * OngoingPrograms component
 * Displays list of ongoing programs with progress
 *
 * @param {Object} props
 * @param {boolean} props.onGoingProgramLoading - Loading state
 * @param {Array} props.listJourneyDataOngoingProgram - List of ongoing programs
 * @param {Function} props.isEmptySetter - Callback to set empty state
 * @param {Array} props.listAllData - All journey data for progress calculation
 */
const OngoingPrograms = ({
  onGoingProgramLoading,
  listJourneyDataOngoingProgram,
  isEmptySetter,
  listAllData,
}) => {
  const { t } = useTranslation()
  const { loading, ongoingJourney } = useActions(
    onGoingProgramLoading,
    listJourneyDataOngoingProgram,
    isEmptySetter,
    listAllData
  )

  const navigate = useNavigate()

  // Calculate percentage based on completed and total modules
  const countPercentageModules = (idJourney) => {
    let m_completed = 0
    let m_total_module = 0

    // Find journey matching the ID
    const selectedJourney = listAllData.find(
      (dataJourney) => idJourney === parseInt(dataJourney.id)
    )

    if (!selectedJourney) return 0

    // Count all completed modules and total modules
    selectedJourney.course.forEach((module) => {
      m_completed += module.total_completed
      m_total_module += module.total_module
    })

    return Math.round((m_completed / m_total_module) * 100)
  }

  const handleNavigation = (id) => {
    navigate('/my-learning-journey/journey/' + id)
  }

  return (
    <Card
      bodyStyle={{
        padding: '20px 0 20px 20px',
      }}
      className="card"
      bordered={false}
    >
      <Row>
        <Col span={24}>
          <Row className="text-start">
            <Col span={24} className="fw-medium text-[22px]">
              {t('feature.home.main_content.ongoing_program')}
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {loading ? (
            <Loader />
          ) : (
            <List
              className="limit-list text-start w-100 list-ongoing-program"
              itemLayout="horizontal"
              dataSource={ongoingJourney}
              size="medium"
              renderItem={(item, index) => (
                <List.Item
                  key={index}
                  data-id={index}
                  id="list-data-ongoing-program-home"
                  onClick={() => handleNavigation(item.id)}
                  className="cursor-pointer hover:bg-background-grey transition-colors"
                >
                  <List.Item.Meta
                    className="align-items-center"
                    avatar={
                      <Image
                        width={39}
                        height={39}
                        preview={false}
                        className="rounded object-cover"
                        src={item.thumbnail}
                        fallback={defaultImage}
                        alt="Program Ongoing"
                      />
                    }
                    title={item.name}
                  />
                  <div
                    className="d-flex flex-column align-items-center"
                    name="progress-bar-module"
                  >
                    <Progress
                      type="circle"
                      strokeColor={progressBarCircle}
                      percent={countPercentageModules(item.id)}
                      size={39}
                    />
                  </div>
                </List.Item>
              )}
            />
          )}
        </Col>
      </Row>
    </Card>
  )
}

OngoingPrograms.propTypes = {
  onGoingProgramLoading: PropTypes.bool.isRequired,
  listJourneyDataOngoingProgram: PropTypes.array.isRequired,
  isEmptySetter: PropTypes.func.isRequired,
  listAllData: PropTypes.array.isRequired,
}

export default OngoingPrograms
