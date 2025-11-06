import { List, Image, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { getHelpTopicItems } from '../data/helpTopics.jsx'
import {
  contactEmail,
  subjectEmail,
  bodyEmail,
} from '@/config/constant/customer_support'
import { getAppName } from '@/utils'
import ic_email_helpcenter from '@/assets/images/svgs/ic_email_helptopics.svg'

/**
 * Help Sidebar Component
 * Displays navigation menu for help topics
 */
const HelpSidebar = ({
  onMenuClick,
  userData,
  userProfile,
  loadingProfile,
}) => {
  const { t, i18n } = useTranslation()

  const topicItems = getHelpTopicItems(t, i18n.language)

  /**
   * Handle email contact
   */
  const handleEmailContact = () => {
    if (loadingProfile) return

    const body = bodyEmail
    const replaceName = body.replace('___', userData?.userName || '')
    const replaceUsername = replaceName.replace(
      '***',
      userProfile?.username || ''
    )
    const bodyEmailCombine = replaceUsername.replace('###', getAppName())
    const replaceSubject = subjectEmail.replace('###', getAppName())

    window.open(
      `mailto:${contactEmail}?subject=${replaceSubject}&body=${bodyEmailCombine}`
    )
  }

  const listData = [
    ...topicItems.map((item) => ({
      type: 'link',
      content: (
        <Link
          to={item.route}
          className="item-list-help"
          data-topic={item.key}
          id={item.id}
          onClick={onMenuClick}
        >
          {item.label}
        </Link>
      ),
    })),
    {
      type: 'contact',
      content: (
        <div className="bg-[#F5F5F5] rounded-lg p-[25px_20px] w-full">
          <div className="flex items-center">
            <div className="text-text-title font-medium mr-2.5">
              {t('feature.feature_help.side_dpd.contact_more_help')}
            </div>
            <a
              onClick={handleEmailContact}
              className="p-0 text-primary flex items-center cursor-pointer"
              id="btn-link-contact-help-center"
            >
              <span className="mr-1.5">
                <Image src={ic_email_helpcenter} preview={false} />
              </span>
              {loadingProfile ? <Skeleton.Input size="small" /> : contactEmail}
            </a>
          </div>
        </div>
      ),
    },
  ]

  return (
    <nav className="w-full h-full flex flex-col" aria-label="Help Topics">
      {/* Header */}
      <header className="w-full px-10 py-5">
        <h2 className="text-[22px] text-text-title leading-tight font-medium m-0">
          {t('feature.feature_help.side_dpd.help_topics')}
        </h2>
      </header>

      {/* Topic List */}
      <div className="w-full h-full overflow-y-auto border border-[#E5E5E6]">
        <List
          className="list-help-topics"
          bordered={false}
          dataSource={listData}
          renderItem={(item) => (
            <List.Item className="px-5 py-5 font-medium">
              {item.content}
            </List.Item>
          )}
        />
      </div>
    </nav>
  )
}

HelpSidebar.propTypes = {
  onMenuClick: PropTypes.func,
  userData: PropTypes.shape({
    userName: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  userProfile: PropTypes.shape({
    username: PropTypes.string,
  }),
  loadingProfile: PropTypes.bool,
}

export default HelpSidebar
