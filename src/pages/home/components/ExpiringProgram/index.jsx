import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Card, List, Typography, Image } from 'antd'
import { useNavigate } from 'react-router-dom'
import { WarningFilled } from '@ant-design/icons'
import { Loader } from '@/components/common/Loader'
import { useTranslation } from 'react-i18next'
import useActions from './hooks/useActions'
import defaultImage from '@/assets/images/png/general/img_thumb_default.png'

import {
  underFiveDaysLeft,
  aboveFiveDaysLeft,
} from '@/config/constant/color/index'

const { Text } = Typography

/**
 * ExpiringCourses component
 * Displays list of programs that will expire within a month
 *
 * @param {Object} props
 * @param {boolean} props.expiringLoading - Loading state
 * @param {Array} props.listJourneyExpiring - List of expiring journeys
 * @param {Function} props.isEmptySetter - Callback to set empty state
 */
const ExpiringCourses = ({
  expiringLoading,
  listJourneyExpiring,
  isEmptySetter,
}) => {
  const { t } = useTranslation()
  const { loading, expiringJourney } = useActions(
    expiringLoading,
    listJourneyExpiring,
    isEmptySetter
  )

  const navigate = useNavigate()

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
            <Col
              span={24}
              className="fw-medium text-[22px] text-text-title leading-normal pr-4"
            >
              {t('feature.home.main_content.overdue_in_a_month')}
            </Col>
            <Col span={24} className="pr-4">
              <WarningFilled className="text-alert-red" /> &nbsp;
              <Text className="text-sm text-alert-red leading-normal font-medium">
                {t('feature.home.main_content.lets_continue_before_late')}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {loading ? (
            <Loader />
          ) : (
            <List
              className="limit-list text-start w-100 list-expiring"
              itemLayout="horizontal"
              dataSource={expiringJourney}
              size="medium"
              renderItem={(item, index) => (
                <List.Item
                  key={index}
                  data-id={index}
                  id="list-data-expiring-in-month-home"
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
                        alt="Program Expiring"
                      />
                    }
                    title={item.name}
                  />
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{
                      color:
                        item.days_left <= 5
                          ? underFiveDaysLeft
                          : aboveFiveDaysLeft,
                    }}
                  >
                    <div className="text-[22px] leading-normal font-medium">
                      {item.days_left}
                    </div>
                    <div className="text-xs leading-normal">
                      {item.days_left > 1 ? (
                        <>{t('feature.home.main_content.days_left')}</>
                      ) : (
                        <>{t('feature.home.main_content.day_left')}</>
                      )}
                    </div>
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

ExpiringCourses.propTypes = {
  expiringLoading: PropTypes.bool.isRequired,
  listJourneyExpiring: PropTypes.array.isRequired,
  isEmptySetter: PropTypes.func.isRequired,
}

export default ExpiringCourses
