import { Image, Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import ic_email_helpcenter from '@/assets/images/svgs/ic_email_helptopics.svg'
import {
  contactEmail,
  subjectEmail,
  bodyEmail,
} from '@/config/constant/customer_support'
import { getAppName } from '@/utils'

/**
 * Mobile Contact Section
 * Displays email contact button for mobile view
 */
const MobileContactSection = ({ userData, userProfile, loadingProfile }) => {
  const { t } = useTranslation()

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

  return (
    <section
      className="p-[18px] w-full rounded-lg bg-[#F5F5F5]"
      aria-label="Contact Support"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-text-title font-medium text-xs m-0">
          {t('feature.feature_help.side_dpd.contact_more_help')}
        </h3>
        <a
          onClick={handleEmailContact}
          className="p-0 text-primary flex items-center font-medium text-xs cursor-pointer"
          id="btn-link-contact-help-center"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleEmailContact()}
          aria-label={`Contact support via email: ${contactEmail}`}
        >
          <span className="mr-1.5" aria-hidden="true">
            <Image src={ic_email_helpcenter} preview={false} alt="" />
          </span>
          {loadingProfile ? <Skeleton.Input size="small" /> : contactEmail}
        </a>
      </div>
    </section>
  )
}

MobileContactSection.propTypes = {
  userData: PropTypes.shape({
    userName: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  userProfile: PropTypes.shape({
    username: PropTypes.string,
  }),
  loadingProfile: PropTypes.bool,
}

export default MobileContactSection
