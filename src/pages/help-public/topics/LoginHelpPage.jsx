import { useOutletContext } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { Image } from 'antd'
import { HelpPublicContentWrapper } from '../components/HelpPublicContentWrapper'
import Login2_en from '@assets/images/png/help/element/EN_2. Login_2.png'
import Login2_id from '@assets/images/png/help/element/ID_2. Login_2.png'

export default function LoginHelpPage() {
  const { i18n } = useTranslation()
  const { isMobile, isScaling } = useOutletContext()

  const listCollapseStyling =
    isMobile || isScaling ? 'text-xs font-medium leading-[15px]' : 'font-medium'

  const contentTextSize = isMobile || isScaling ? 'text-xs' : 'text-sm'

  const items = [
    {
      key: '1',
      label: (
        <div className={listCollapseStyling} id="list-collapse-help" index="0">
          <Trans i18nKey="feature.help_content.login.t_1.title" />
        </div>
      ),
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          <Trans i18nKey="feature.help_content.login.t_1.desc_1" />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className={listCollapseStyling} id="list-collapse-help" index="1">
          <Trans i18nKey="feature.help_content.login.t_2.title" />
        </div>
      ),
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          <Trans i18nKey="feature.help_content.login.t_2.desc_1" /> <br />
          <Trans i18nKey="feature.help_content.login.t_2.desc_2" />
          <Image
            src={i18n.language === 'en' ? Login2_en : Login2_id}
            preview={false}
            width={isMobile || isScaling ? '100%' : 500}
            className="mt-2.5"
          />
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div className={listCollapseStyling} id="list-collapse-help" index="2">
          <Trans i18nKey="feature.help_content.login.t_3.title" />
        </div>
      ),
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          <div>
            <Trans i18nKey="feature.help_content.login.t_3.desc_1" />
          </div>
          <br />
          <div>
            <Trans i18nKey="feature.help_content.login.t_3.desc_2" />
          </div>
        </div>
      ),
    },
  ]

  const topicTitle = i18n.language === 'en' ? 'Login' : <i>Login</i>

  return (
    <HelpPublicContentWrapper
      topicTitle={topicTitle}
      items={items}
      isMobile={isMobile}
      isScaling={isScaling}
    />
  )
}
