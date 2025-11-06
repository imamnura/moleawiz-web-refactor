import { useTranslation, Trans } from 'react-i18next'
import { Image } from 'antd'
import { useResponsive } from '@/hooks/useResponsive'
import { useUserProfile } from '../hooks/useUserProfile'
import {
  DesktopContentWrapper,
  HelpTopicCollapse,
} from '../components/HelpContentWrapper'
import MobileContactSection from '../components/MobileContactSection'

// Images
import Login2_en from '@/assets/images/png/help/element/EN_2. Login_2.png'
import Login2_id from '@/assets/images/png/help/element/ID_2. Login_2.png'

/**
 * Login Help Page
 * Provides help and guidance for login-related issues
 */
const LoginHelpPage = () => {
  const { i18n } = useTranslation()
  const { isMobile } = useResponsive()
  const { loading, profile, userData } = useUserProfile()

  const imageWidth = isMobile ? '100%' : 500

  const items = [
    {
      key: '1',
      label: <Trans i18nKey="feature.help_content.login.t_1.title" />,
      content: (
        <div>
          <Trans i18nKey="feature.help_content.login.t_1.desc_1" />
        </div>
      ),
    },
    {
      key: '2',
      label: <Trans i18nKey="feature.help_content.login.t_2.title" />,
      content: (
        <>
          <Trans i18nKey="feature.help_content.login.t_2.desc_1" /> <br />
          <Trans i18nKey="feature.help_content.login.t_2.desc_2" />
          <Image
            src={i18n.language === 'en' ? Login2_en : Login2_id}
            preview={false}
            width={imageWidth}
            className="mt-2.5"
          />
        </>
      ),
    },
    {
      key: '3',
      label: <Trans i18nKey="feature.help_content.login.t_3.title" />,
      content: (
        <>
          <div>
            <Trans i18nKey="feature.help_content.login.t_3.desc_1" />
          </div>
          <br />
          <div>
            <Trans i18nKey="feature.help_content.login.t_3.desc_2" />
          </div>
        </>
      ),
    },
  ]

  return (
    <DesktopContentWrapper
      topicLabel={i18n.language === 'en' ? 'Login' : <i>Login</i>}
      isMobile={isMobile}
    >
      <HelpTopicCollapse items={items} isMobile={isMobile} />

      {isMobile && (
        <MobileContactSection
          userData={userData}
          userProfile={profile}
          loadingProfile={loading}
        />
      )}
    </DesktopContentWrapper>
  )
}

export default LoginHelpPage
