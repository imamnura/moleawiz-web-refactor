import { useState } from 'react'
import { Row, Col } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Banner from '@assets/images/png/help/img_banner_help.png'
import BannerMobile from '@assets/images/png/help/img_banner_help_mobile.svg'
import { TopicSelectModal } from './TopicSelectModal'

export function HelpPublicMobileHeader({ isMobile, isScaling, currentTopic }) {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 z-4 h-[118px] w-full rounded-b-2xl p-0 leading-normal"
        aria-label="Help Page Header"
      >
        {/* Background Image */}
        <div className="absolute left-0 top-0 w-full" aria-hidden="true">
          <img
            alt=""
            className="h-[118px] w-full rounded-b-2xl object-cover object-left"
            src={isMobile || isScaling ? BannerMobile : Banner}
          />
        </div>

        {/* Content Overlay */}
        <Row
          className="relative flex flex-col items-start gap-3 px-[18px] pt-5"
          direction="vertical"
        >
          <Col>
            <h1 className="m-0 text-left text-lg font-medium leading-[21px] text-white">
              {t('feature.feature_help.main_header.assistance_prompt')}
            </h1>
          </Col>
          <Col>
            <button
              onClick={() => setModalVisible(true)}
              className="flex h-9 w-fit cursor-pointer items-center rounded-lg border-0 bg-white/30 px-2.5 py-2.5"
              type="button"
              aria-label={`Select topic, current: ${currentTopic}`}
            >
              <span className="break-dots-first-line mr-2 overflow-hidden text-sm font-normal leading-4 text-white">
                {currentTopic}
              </span>
              <DownOutlined className="text-sm text-white" aria-hidden="true" />
            </button>
          </Col>
        </Row>
      </header>

      <TopicSelectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isMobile={isMobile}
        isScaling={isScaling}
        currentTopic={currentTopic}
      />
    </>
  )
}

HelpPublicMobileHeader.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isScaling: PropTypes.bool.isRequired,
  currentTopic: PropTypes.string.isRequired,
}
