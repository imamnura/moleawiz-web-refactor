import { useTranslation, Trans } from 'react-i18next'
import { Image } from 'antd'
import { useResponsive } from '@/hooks/useResponsive'
import { useUserProfile } from '../hooks/useUserProfile'
import {
  DesktopContentWrapper,
  HelpTopicCollapse,
} from '../components/HelpContentWrapper'
import MobileContactSection from '../components/MobileContactSection'

// Images - EN
import FaQ1_en from '@/assets/images/png/help/element/EN_1. Frequently Asked Question_1.png'
import FaQ3_en from '@/assets/images/png/help/element/EN_1. Frequently Asked Question_3.png'
import FaQ4_en from '@/assets/images/png/help/element/EN_1. Frequently Asked Question_4.png'

// Images - ID
import FaQ1_id from '@/assets/images/png/help/element/ID_1. Pertanyaan yang Sering Diajukan_1.png'
import FaQ3_id from '@/assets/images/png/help/element/ID_1. Pertanyaan yang Sering Diajukan_3.png'
import FaQ4_id from '@/assets/images/png/help/element/ID_1. Pertanyaan yang Sering Diajukan_4.png'

/**
 * FAQ (Frequently Asked Questions) Page
 * Displays common questions and answers about the platform
 */
const FAQPage = () => {
  const { t, i18n } = useTranslation()
  const { isMobile } = useResponsive()
  const { loading, profile, userData } = useUserProfile()

  const imageWidth = isMobile ? '100%' : 500

  const items = [
    {
      key: '1',
      label: <Trans i18nKey="feature.help_content.faq.t_1.title" />,
      content: (
        <>
          <Trans i18nKey="feature.help_content.faq.t_1.desc_1" /> <br />
          <Trans i18nKey="feature.help_content.faq.t_1.desc_2" />
          <Image
            src={i18n.language === 'en' ? FaQ1_en : FaQ1_id}
            preview={false}
            width={imageWidth}
            className="mt-2.5"
          />
        </>
      ),
    },
    {
      key: '2',
      label: t('feature.help_content.faq.t_2.title'),
      content: <div>{t('feature.help_content.faq.t_2.desc_1')}</div>,
    },
    {
      key: '3',
      label: <Trans i18nKey="feature.help_content.faq.t_3.title" />,
      content: (
        <>
          <div>
            <Trans i18nKey="feature.help_content.faq.t_3.desc_1" />
          </div>
          <div>
            <Trans i18nKey="feature.help_content.faq.t_3.desc_2" />
          </div>
          <br />
          <div>
            <Trans i18nKey="feature.help_content.faq.t_3.desc_3" />
          </div>
          <Image
            src={i18n.language === 'en' ? FaQ3_en : FaQ3_id}
            preview={false}
            width={imageWidth}
            className="mt-2.5"
          />
        </>
      ),
    },
    {
      key: '4',
      label: <Trans i18nKey="feature.help_content.faq.t_4.title" />,
      content: (
        <>
          <div>
            <Trans i18nKey="feature.help_content.faq.t_4.desc_1" />
          </div>
          <div>
            <Trans i18nKey="feature.help_content.faq.t_4.desc_2" />
          </div>
          <div>
            <Trans i18nKey="feature.help_content.faq.t_4.desc_3" />
          </div>
          <br />
          <div>
            <Trans i18nKey="feature.help_content.faq.t_4.desc_4" />
          </div>
          <Image
            src={i18n.language === 'en' ? FaQ4_en : FaQ4_id}
            preview={false}
            width={imageWidth}
            className="mt-2.5"
          />
        </>
      ),
    },
    {
      key: '5',
      label: <Trans i18nKey="feature.help_content.faq.t_5.title" />,
      content: (
        <div>
          <Trans i18nKey="feature.help_content.faq.t_5.desc_1" />
        </div>
      ),
    },
  ]

  return (
    <DesktopContentWrapper
      topicLabel={t('feature.feature_help.side_dpd.frequently_asked_questions')}
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

export default FAQPage
