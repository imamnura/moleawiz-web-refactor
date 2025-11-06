import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HelpPublicContentWrapper } from '../components/HelpPublicContentWrapper'
import { useEmailContact } from '../hooks/useEmailContact'

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()
  const { isMobile, isScaling } = useOutletContext()
  const { contactEmail } = useEmailContact()

  const listCollapseStyling =
    isMobile || isScaling ? 'text-xs font-medium leading-[15px]' : 'font-medium'

  const contentTextSize = isMobile || isScaling ? 'text-xs' : 'text-sm'

  const items = [
    {
      key: '1',
      label: <div className={listCollapseStyling}>General</div>,
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          <div>
            digima ASIA ("digima", "we", "us") respect your privacy and want you
            to understand how we collect, use, and share your data. This Privacy
            Policy covers our data collection practices and describes your
            rights to access, correct, or restrict our use of your personal
            data.
          </div>
          <div className="mt-4">
            Unless we link to a different policy or state otherwise, this
            Privacy Policy applies when you visit or use the digima website,
            applications, digital learning platforms, systems or related
            services (the "Services").
          </div>
          <div className="mt-4">
            <b>
              By using the Services, you agree to the terms of this Privacy
              Policy. You shouldn't use the Services if you don't agree with
              this Privacy Policy or any other agreement that governs your use
              of the Services.
            </b>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: <div className={listCollapseStyling}>What Data We Get</div>,
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          We collect certain data from you directly, like information you enter
          yourself, data about your participation in journey, courses, modules,
          games dan any other activities, including data from third-party
          platforms you connect with digima. We also collect some data
          automatically, like information about your device and what parts of
          our Services you interact with or spend time using.
        </div>
      ),
    },
    {
      key: '3',
      label: <div className={listCollapseStyling}>Data You Provide to Us</div>,
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          <div>
            We may collect different data from or about you depend on how you
            use the Services. Below are some examples to help you better
            understand the data we collect.
          </div>
          <div className="mt-2.5">
            When you create an account, get registered into the Services and use
            the Services, including through a third-party platform, we collect
            any data you provide directly, including:
          </div>
          <ol className="ml-4 p-0 mt-2.5 space-y-2.5">
            <li
              className={`font-bold ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
            >
              <div>Account Data</div>
              <div
                className={`font-normal ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
              >
                In order to use certain features (like enrolling in a journey or
                leaderboard), you need to create a user account. When you create
                or update your account, we collect and store the data you
                provide, like your employee number, email address, password,
                gender, and date of birth, and assign you a unique identifying
                number.
              </div>
            </li>
            <li
              className={`font-bold ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
            >
              <div>Profile Data</div>
              <div
                className={`font-normal ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
              >
                You can also choose to provide profile information like a photo,
                description, link, social media profiles, or other data. Your
                Profile Data might be viewable by others.
              </div>
            </li>
            <li
              className={`font-bold ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
            >
              <div>Shared Content</div>
              <div
                className={`font-normal ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
              >
                Parts of the Services let you interact with other users or share
                content accordingly, including by posting reviews on a module,
                asking or answering questions, sending messages to others, or
                posting photos or other work you upload. Such shared content may
                be viewable by others depending on where it is posted.
              </div>
            </li>
            <li
              className={`font-bold ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
            >
              <div>Learning Data</div>
              <div
                className={`font-normal ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
              >
                When you enroll in, get enrolled and take journey/course/module,
                we collect certain data including which journeys, courses,
                modules, assignments and quizzes you've started and completed;
                your exchanges with others; and essays, answers to questions,
                and other items submitted to satisfy learning requirements.
              </div>
            </li>
            <li
              className={`font-bold ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
            >
              <div>Payment Data</div>
              <div
                className={`font-normal ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
              >
                If you make purchases, we collect certain data about your
                purchase (such as your name and zip code) as necessary to
                process your order. You must provide certain payment and billing
                data directly to our payment processing partners, including your
                name, credit card information, billing address, and zip code.
                For security, digima does not collect or store sensitive
                cardholder data, such as full credit card numbers or card
                authentication data.
              </div>
            </li>
            <li
              className={`font-bold ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
            >
              <div>Data About Your Accounts on Other Services</div>
              <div
                className={`font-normal ${contentTextSize} ${isMobile || isScaling ? 'leading-[15px]' : ''}`}
              >
                We may obtain certain information through your social media or
                other online accounts if they are connected to your digima
                account. If you login to digima via another third-party platform
                or service, we ask for your permission to access certain
                information about that other account.
              </div>
            </li>
          </ol>
        </div>
      ),
    },
    {
      key: '4',
      label: <div className={listCollapseStyling}>Security</div>,
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          <div>
            We use appropriate security based on the type and sensitivity of
            data being stored. As with any internet-enabled system, there is
            always a risk of unauthorized access, so it's important to protect
            your password and to contact us if you suspect any unauthorized
            access to your account.
          </div>
          <div className="mt-2.5">
            digima takes appropriate security measures to protect against
            unauthorized access, alteration, disclosure, or destruction of your
            personal data that we collect and store. Your password is an
            important part of our security system, and it is your responsibility
            to protect it. You should not share your password with any third
            party, and if you believe your password or account has been
            compromised, you should change it immediately and contact
            support@digimasia.com with any concerns.
          </div>
        </div>
      ),
    },
    {
      key: '5',
      label: <div className={listCollapseStyling}>Questions</div>,
      children: (
        <div className={`${contentTextSize} text-gray-600`}>
          If you have any questions, concerns, or disputes regarding our Privacy
          Policy, please feel free to contact us at <b>{contactEmail}</b>.
        </div>
      ),
    },
  ]

  return (
    <HelpPublicContentWrapper
      topicTitle={t('feature.feature_help.side_dpd.privacy_policy')}
      items={items}
      isMobile={isMobile}
      isScaling={isScaling}
    />
  )
}
