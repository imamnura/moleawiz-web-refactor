import { Image, List } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ic_email_helpcenter from '@assets/images/svgs/ic_email_helptopics.svg'
import { helpPublicTopics } from '../data/helpPublicTopics'
import { useEmailContact } from '../hooks/useEmailContact'

export function HelpPublicSidebar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { contactEmail, handleEmailClick } = useEmailContact()

  const getTopicLabel = (topic) => {
    if (topic.key === 'login') {
      return i18n.language === 'en' ? 'Login' : <i>Login</i>
    }
    return topic.label
  }

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  const menuItems = helpPublicTopics.map((topic) => ({
    key: topic.key,
    path: topic.path,
    label: getTopicLabel(topic),
    isActive: isActive(topic.path),
  }))

  return (
    <nav className="flex h-full flex-col bg-white" aria-label="Help Topics">
      {/* Header */}
      <header className="border-b border-gray-200 px-10 py-5">
        <h2 className="m-0 text-[22px] font-medium leading-tight text-gray-800">
          {t('feature.feature_help.side_dpd.help_topics')}
        </h2>
      </header>

      {/* Menu List */}
      <div className="h-full overflow-y-auto border border-gray-200">
        <List
          className="list-help-topics"
          bordered={false}
          dataSource={menuItems}
          renderItem={(item) => (
            <List.Item className="p-0! hover:bg-gray-50">
              <Link
                to={item.path}
                className={`item-list-help block w-full px-5 py-5 font-medium no-underline transition-colors ${
                  item.isActive
                    ? 'title-active bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                id={`btn-list-${item.key}-help-center`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </List.Item>
          )}
        />
      </div>

      {/* Email Contact Section */}
      <section
        className="mt-auto rounded-lg bg-blue-50 p-6"
        aria-label="Contact Support"
      >
        <h3 className="mb-2 text-sm font-medium text-gray-800">
          {t('feature.feature_help.side_dpd.contact_more_help')}
        </h3>
        <a
          onClick={handleEmailClick}
          className="flex cursor-pointer items-center text-sm text-blue-600 no-underline hover:text-blue-700"
          id="btn-link-contact-help-center"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleEmailClick()}
          aria-label={`Contact support via email: ${contactEmail}`}
        >
          <span className="mr-2" aria-hidden="true">
            <Image src={ic_email_helpcenter} preview={false} alt="" />
          </span>
          {contactEmail}
        </a>
      </section>
    </nav>
  )
}
