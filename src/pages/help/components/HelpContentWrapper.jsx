import { Collapse, ConfigProvider, Image } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Banner from '@/assets/images/png/help/img_banner_help.png'

/**
 * Desktop Help Content Wrapper
 * Wraps topic content with banner and title for desktop view
 */
const DesktopContentWrapper = ({ topicLabel, children, isMobile }) => {
  const { t } = useTranslation()

  if (isMobile) {
    return (
      <>
        {/* Mobile Background Extension */}
        <div
          className="w-full h-12 -mt-3.5 rounded-b-2xl bg-background-header"
          aria-hidden="true"
        />

        {/* Content */}
        <article className="px-[18px] py-6 relative -mt-[57px]">
          {children}
        </article>
      </>
    )
  }

  return (
    <article className="relative h-full">
      {/* Banner */}
      <header className="h-[130px] rounded-b-2xl">
        <div className="text-white text-center relative rounded-b-2xl grid grid-cols-1">
          <h3 className="m-0 h-full text-black leading-40 text-center row-start-1 col-start-1 sr-only">
            Help Center Banner
          </h3>
          <img
            alt=""
            className="w-full h-[130px] object-cover object-right row-start-1 col-start-1 rounded-b-2xl"
            src={Banner}
            aria-hidden="true"
          />
        </div>
      </header>

      {/* Content */}
      <section className="px-[42px] pb-[25px] -top-[130px] relative">
        {/* Title Section */}
        <div className="h-[95px] py-5 pl-[11%]">
          <h2 className="text-white font-medium text-[22px] mb-1.5 mt-0">
            {t('feature.feature_help.main_header.assistance_prompt')}
          </h2>
          <p className="text-white font-semibold text-sm m-0">
            {t('feature.feature_help.main_header.showing')}{' '}
            <span className="text-text-title bg-white px-1.5 py-[3px] rounded-sm">
              {topicLabel}
            </span>{' '}
            {t('feature.feature_help.main_header.showing_topic')}
          </p>
        </div>

        {/* Topic Content */}
        {children}
      </section>
    </article>
  )
}

DesktopContentWrapper.propTypes = {
  topicLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  children: PropTypes.node.isRequired,
  isMobile: PropTypes.bool.isRequired,
}

/**
 * Help Topic Collapse Component
 * Reusable collapsible content component for help topics
 */
const HelpTopicCollapse = ({ items, isMobile }) => {
  const listCollapseStyling = isMobile
    ? {
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '15px',
      }
    : {
        fontWeight: '500',
      }

  const textStyling = isMobile ? 'text-xs' : 'text-sm'

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerBg: '#FFF',
            headerPadding: '20px',
            contentBg: '#FFF',
            contentPadding: '0 20px 20px 20px',
          },
        },
        token: {
          fontFamily: 'Roboto',
        },
      }}
    >
      <Collapse
        className="align-items-center collapsed-learning-journey border border-[#E5E5E6]"
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <span className="bg-[#E5E5E6] rounded-full p-1.5">
            {isActive ? <UpOutlined /> : <DownOutlined />}
          </span>
        )}
        bordered={false}
        accordion={true}
        destroyInactivePanel={true}
        items={items.map((item, index) => ({
          key: item.key || String(index + 1),
          label: (
            <div
              style={listCollapseStyling}
              id="list-collapse-help"
              index={String(index)}
            >
              {item.label}
            </div>
          ),
          children: (
            <div className={`text-text-desc ${textStyling}`}>
              {item.content}
            </div>
          ),
        }))}
      />
    </ConfigProvider>
  )
}

HelpTopicCollapse.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    })
  ).isRequired,
  isMobile: PropTypes.bool.isRequired,
}

export { DesktopContentWrapper, HelpTopicCollapse }
