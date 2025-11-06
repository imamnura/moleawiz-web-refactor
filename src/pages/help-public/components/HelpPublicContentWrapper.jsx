import { ConfigProvider, Collapse, Image, Skeleton } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Banner from '@assets/images/png/help/img_banner_help.png'
import ic_email_helpcenter from '@assets/images/svgs/ic_email_helptopics.svg'
import { useEmailContact } from '../hooks/useEmailContact'

export function HelpPublicContentWrapper({
  topicTitle,
  items,
  isMobile,
  isScaling,
  showBanner = true,
}) {
  const { t } = useTranslation()
  const { contactEmail, handleEmailClick, loading } = useEmailContact()

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerBg: '#FAFAFA',
            headerPadding: '20px',
            contentBg: '#FFFFFF',
            contentPadding: '0 20px 20px 20px',
          },
        },
        token: {
          fontFamily: 'Roboto',
        },
      }}
    >
      <div className="relative h-full">
        {/* Desktop Banner */}
        {!(isMobile || isScaling) && showBanner && (
          <header className="h-[130px] rounded-b-2xl">
            <div className="relative grid grid-cols-1 rounded-b-2xl text-center text-white">
              <img
                alt=""
                className="col-start-1 row-start-1 h-[130px] w-full rounded-b-2xl object-cover object-right"
                src={Banner}
                aria-hidden="true"
              />
            </div>
          </header>
        )}

        {/* Mobile Header Spacer */}
        {(isMobile || isScaling) && (
          <div
            className="-mt-3.5 h-12 w-full rounded-b-2xl bg-blue-600"
            aria-hidden="true"
          ></div>
        )}

        {/* Content Container */}
        <article
          className={
            isMobile || isScaling
              ? 'list-collapse-mobile relative mt-[-57px] px-[18px] py-6'
              : 'list-collapse relative top-[-130px] px-[42px] pb-[25px]'
          }
        >
          {/* Desktop Topic Title */}
          {!(isMobile || isScaling) && showBanner && (
            <div className="h-[95px] px-[11%] py-5">
              <h2 className="mb-1 mt-0 text-[22px] font-medium text-white">
                {t('feature.feature_help.main_header.assistance_prompt')}
              </h2>
              <p className="m-0 text-sm font-semibold text-white">
                {t('feature.feature_help.main_header.showing')}{' '}
                <span className="rounded-sm bg-white px-1 py-0.5 text-gray-800">
                  {topicTitle}
                </span>{' '}
                {t('feature.feature_help.main_header.showing_topic')}
              </p>
            </div>
          )}

          {/* Collapse Component */}
          <Collapse
            className="align-items-center collapsed-learning-journey border border-gray-200"
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <span className="rounded-full bg-gray-200 p-1.5">
                {isActive ? <UpOutlined /> : <DownOutlined />}
              </span>
            )}
            bordered={false}
            accordion={true}
            destroyInactivePanel={true}
            items={items}
          />

          {/* Mobile Email Contact Section */}
          {(isMobile || isScaling) && (
            <section
              className="mt-4 w-full rounded-lg bg-blue-50 p-[18px]"
              aria-label="Contact Support"
            >
              <div className="flex items-center justify-between">
                <h3 className="m-0 text-xs font-medium text-gray-800">
                  {t('feature.feature_help.side_dpd.contact_more_help')}
                </h3>
                <a
                  onClick={loading ? undefined : handleEmailClick}
                  className="flex cursor-pointer items-center text-xs font-medium text-blue-600 no-underline hover:text-blue-700"
                  id="btn-link-contact-help-center"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !loading && handleEmailClick()
                  }
                  aria-label={`Contact support via email: ${contactEmail}`}
                >
                  <span className="mr-1.5" aria-hidden="true">
                    <Image src={ic_email_helpcenter} preview={false} alt="" />
                  </span>
                  {loading ? <Skeleton.Input size="small" /> : contactEmail}
                </a>
              </div>
            </section>
          )}
        </article>
      </div>
    </ConfigProvider>
  )
}

HelpPublicContentWrapper.propTypes = {
  topicTitle: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    })
  ).isRequired,
  isMobile: PropTypes.bool.isRequired,
  isScaling: PropTypes.bool.isRequired,
  showBanner: PropTypes.bool,
}
