import { Row, Col, Image } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Banner from '@/assets/images/png/help/img_banner_help_mobile.svg'

/**
 * Mobile Help Header
 * Displays banner and topic selector for mobile view
 */
const MobileHelpHeader = ({ selectedTopic, onTopicClick }) => {
  const { t } = useTranslation()

  return (
    <header
      className="rounded-b-2xl h-[118px] px-[18px] pt-5 w-full sticky top-0 z-4 leading-normal"
      aria-label="Help Page Header"
    >
      {/* Banner Background */}
      <div className="absolute left-0 top-0 w-full" aria-hidden="true">
        <img
          alt=""
          className="w-full h-[118px] object-cover object-left rounded-b-2xl"
          src={Banner}
        />
      </div>

      {/* Content */}
      <Row className="gap-3 flex-col items-start relative z-5">
        {/* Title */}
        <Col>
          <h1 className="text-white font-medium text-lg leading-[21px] text-left m-0">
            {t('feature.feature_help.main_header.assistance_prompt')}
          </h1>
        </Col>

        {/* Topic Selector */}
        <Col className="bg-[#FFFFFF4D] rounded-lg p-2.5 h-9 w-fit">
          <button
            onClick={onTopicClick}
            className="cursor-pointer flex items-center bg-transparent border-0 p-0"
            aria-label={`Select topic, current: ${selectedTopic}`}
            type="button"
          >
            <span className="break-dots-first-line text-left text-sm font-normal text-white mr-2 leading-4 overflow-hidden">
              {selectedTopic}
            </span>
            <DownOutlined className="text-white text-sm" aria-hidden="true" />
          </button>
        </Col>
      </Row>
    </header>
  )
}

MobileHelpHeader.propTypes = {
  selectedTopic: PropTypes.string.isRequired,
  onTopicClick: PropTypes.func.isRequired,
}

export default MobileHelpHeader
