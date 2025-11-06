import { useOutletContext } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { Image } from 'antd'
import { HelpPublicContentWrapper } from '../components/HelpPublicContentWrapper'
import FaQ1_en from '@assets/images/png/help/element/EN_1. Frequently Asked Question_1.png'
import FaQ3_en from '@assets/images/png/help/element/EN_1. Frequently Asked Question_3.png'
import FaQ4_en from '@assets/images/png/help/element/EN_1. Frequently Asked Question_4.png'
import FaQ1_id from '@assets/images/png/help/element/ID_1. Pertanyaan yang Sering Diajukan_1.png'
import FaQ3_id from '@assets/images/png/help/element/ID_1. Pertanyaan yang Sering Diajukan_3.png'
import FaQ4_id from '@assets/images/png/help/element/ID_1. Pertanyaan yang Sering Diajukan_4.png'

export default function FAQPage() {
  const { t, i18n } = useTranslation()
  const { isMobile, isScaling } = useOutletContext()

  const listCollapseStyling =
    isMobile || isScaling ? 'text-xs font-medium leading-[15px]' : 'font-medium'

  const contentTextSize = isMobile || isScaling ? 'text-xs' : 'text-sm'

  const items = [
    {
      key: '1',
      label: (
        <div className={listCollapseStyling} id="list-collapse-help" index="0">
          <Trans i18nKey="feature.help_content.faq.t_1.title" />
        </div>
      ),
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          <Trans i18nKey="feature.help_content.faq.t_1.desc_1" /> <br />
          <Trans i18nKey="feature.help_content.faq.t_1.desc_2" />
          <Image
            src={i18n.language === 'en' ? FaQ1_en : FaQ1_id}
            preview={false}
            width={isMobile || isScaling ? '100%' : 500}
            className="mt-2.5"
          />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className={listCollapseStyling} id="list-collapse-help" index="1">
          {t('feature.help_content.faq.t_2.title')}
        </div>
      ),
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          {t('feature.help_content.faq.t_2.desc_1')}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div className={listCollapseStyling} id="list-collapse-help" index="2">
          <Trans i18nKey="feature.help_content.faq.t_3.title" />
        </div>
      ),
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
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
            width={isMobile || isScaling ? '100%' : 500}
            className="mt-2.5"
          />
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <div className={listCollapseStyling} id="list-collapse-help" index="3">
          <Trans i18nKey="feature.help_content.faq.t_4.title" />
        </div>
      ),
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
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
            width={isMobile || isScaling ? '100%' : 500}
            className="mt-2.5"
          />
        </div>
      ),
    },
    {
      key: '5',
      label: (
        <div className={listCollapseStyling} id="list-collapse-help" index="4">
          <Trans i18nKey="feature.help_content.faq.t_5.title" />
        </div>
      ),
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          <div>
            <Trans i18nKey="feature.help_content.faq.t_5.desc_1" />
          </div>
        </div>
      ),
    },
  ]

  return (
    <HelpPublicContentWrapper
      topicTitle={t('feature.feature_help.side_dpd.frequently_asked_questions')}
      items={items}
      isMobile={isMobile}
      isScaling={isScaling}
    />
  )
}
