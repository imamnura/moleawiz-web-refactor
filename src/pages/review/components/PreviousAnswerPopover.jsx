import PropTypes from 'prop-types'
import { Popover, Collapse, Image } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PreviousPopoverReview from '@assets/images/custom_svgs/PreviousPopoverReview'
import defaultImage from '@assets/images/png/general/img_thumb_default.png'
import { convertEnter, convertLink, convertFileLink } from '../utils/formatters'

/**
 * PreviousAnswerPopover - Display previous submission answer
 * Desktop: Popover, Mobile: Collapse
 */
const PreviousAnswerPopover = ({
  previousAnswer,
  isOpen,
  onOpenChange,
  isMobile = false,
}) => {
  const { t } = useTranslation()

  if (!previousAnswer) return null

  const renderContent = (answer) => {
    if (!answer || !answer.answer_type) return null

    // Text or HTML answer
    if (answer.answer_type === 1 || answer.answer_type === 3) {
      return (
        <div
          className={`text-sm text-gray-600 ${isMobile ? 'max-w-full' : 'max-w-[265px]'}`}
          dangerouslySetInnerHTML={{
            __html:
              answer.answer_type === 6
                ? convertFileLink(answer.answer_text, 'file_answer')
                : convertLink(convertEnter(answer.answer_text)),
          }}
        />
      )
    }

    // Image answer
    if (answer.answer_type === 2) {
      if (answer.answer_text === '-') {
        return (
          <div
            className={`text-sm text-gray-600 ${isMobile ? 'max-w-full' : 'max-w-[265px]'}`}
            dangerouslySetInnerHTML={{
              __html:
                answer.answer_type === 6
                  ? convertFileLink(answer.answer_text, 'file_answer')
                  : convertLink(convertEnter(answer.answer_text)),
            }}
          />
        )
      }

      return (
        <Image
          preview={false}
          width={isMobile ? '100%' : 461}
          height={isMobile ? '100%' : 290}
          fallback={defaultImage}
          src={answer.answer_text}
          className="rounded-lg object-contain"
        />
      )
    }

    return null
  }

  const content = renderContent(previousAnswer)

  if (isMobile) {
    return (
      <Collapse
        items={[
          {
            key: '1',
            label: (
              <span className="text-blue-600 text-sm font-normal flex items-center gap-2">
                <PreviousPopoverReview fill="#0066CC" />
                {t('feature.feature_reviews.popup_review.see_previous_answer')}
              </span>
            ),
            children: (
              <div className="text-gray-600 text-sm font-normal leading-5 mb-0">
                {content}
              </div>
            ),
          },
        ]}
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <UpOutlined className="text-blue-600" />
          ) : (
            <DownOutlined className="text-blue-600" />
          )
        }
        accordion
        className="bg-gray-100 border-none mt-3 w-full rounded-lg review-collapse"
      />
    )
  }

  return (
    <div className="flex justify-end mb-0 mt-3">
      <Popover
        content={content}
        trigger="click"
        placement="right"
        open={isOpen}
        onOpenChange={onOpenChange}
      >
        <div className="flex items-center cursor-pointer">
          <div className="mr-1.5">
            <PreviousPopoverReview fill={isOpen ? '#0066CC' : '#1F1F1F'} />
          </div>
          <div
            className={`text-sm font-medium ${isOpen ? 'text-blue-600' : 'text-gray-900'}`}
          >
            {isOpen
              ? t('feature.feature_reviews.popup_review.close_previous_answer')
              : t('feature.feature_reviews.popup_review.see_previous_answer')}
          </div>
        </div>
      </Popover>
    </div>
  )
}

PreviousAnswerPopover.propTypes = {
  previousAnswer: PropTypes.shape({
    answer_type: PropTypes.number,
    answer_text: PropTypes.string,
    question_text: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  isMobile: PropTypes.bool,
}

PreviousAnswerPopover.defaultProps = {
  previousAnswer: null,
  isOpen: false,
  onOpenChange: null,
  isMobile: false,
}

export default PreviousAnswerPopover
