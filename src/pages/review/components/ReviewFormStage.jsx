import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Radio, Input, Image, Divider, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import defaultImage from '@assets/images/png/general/img_thumb_default.png'
import PreviousAnswerPopover from './PreviousAnswerPopover'
import { convertEnter, convertLink, convertFileLink } from '../utils/formatters'

const { TextArea } = Input

/**
 * ReviewFormStage - Single stage review component
 * Handles question display, answer display, previous answer, and feedback form
 */
const ReviewFormStage = ({
  stage,
  index,
  previousStage,
  isLastStage,
  placeholder,
  isRequired,
  onRadioChange,
  onTextAreaChange,
  isMobile = false,
}) => {
  const { t } = useTranslation()
  const [popoverStates, setPopoverStates] = useState({})
  const [charCount, setCharCount] = useState(0)
  const [openImageModal, setOpenImageModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handlePopoverChange = (answerIndex, open) => {
    setPopoverStates((prev) => ({
      ...prev,
      [answerIndex]: open,
    }))
  }

  const handleImageClick = (url) => {
    if (isMobile) {
      setImageUrl(url)
      setOpenImageModal(true)
    }
  }

  const renderAnswer = (answer) => {
    // Text or HTML answer
    if (answer.answer_type === 1 || answer.answer_type === 3) {
      return (
        <div
          className={`text-sm text-gray-600 whitespace-pre-wrap ${
            isMobile ? 'leading-5' : ''
          }`}
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
            className={`text-sm text-gray-600 whitespace-pre-wrap ${
              isMobile ? 'leading-5' : ''
            }`}
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
        <div
          className={`text-sm text-gray-600 ${isMobile ? 'pl-0 leading-5' : 'pl-4'}`}
        >
          <Image
            className="image-review"
            preview={false}
            width={isMobile ? '100%' : 475}
            height={isMobile ? '100%' : 300}
            fallback={defaultImage}
            src={answer.answer_text}
            style={{
              borderRadius: 8,
              objectFit: 'contain',
              transition: isMobile ? 'none' : undefined,
              pointerEvents: isMobile ? 'auto' : undefined,
              userSelect: isMobile ? 'none' : undefined,
              marginBottom: isMobile ? 18 : 0,
            }}
            onClick={() => handleImageClick(answer.answer_text)}
          />
        </div>
      )
    }

    return null
  }

  const hasPreviousAnswer = previousStage && previousStage.answers

  return (
    <div className={`stage-group-wrapper ${isMobile ? '' : ''}`}>
      {/* Answers */}
      {stage.answers && stage.answers.length > 0
        ? stage.answers.map((answer, answerIndex) => (
            <div
              key={answerIndex}
              className={`${isMobile ? 'px-[18px]' : ''} ${
                answerIndex === 0 && isMobile ? 'pt-[18px]' : ''
              }`}
            >
              <Form.Item className={`mb-${isMobile ? 4 : 8}`}>
                {/* Question */}
                <div
                  dangerouslySetInnerHTML={{ __html: answer.question_text }}
                  className={`font-medium text-sm mb-${isMobile ? 1 : 2} ${
                    isMobile ? 'text-gray-900 leading-5' : ''
                  }`}
                />

                {/* Answer */}
                {renderAnswer(answer)}

                {/* Previous Answer Popover/Collapse */}
                {hasPreviousAnswer && previousStage.answers[answerIndex] && (
                  <PreviousAnswerPopover
                    previousAnswer={previousStage.answers[answerIndex]}
                    isOpen={popoverStates[answer.incrementNumber]}
                    onOpenChange={(open) =>
                      handlePopoverChange(answer.incrementNumber, open)
                    }
                    isMobile={isMobile}
                  />
                )}
              </Form.Item>
            </div>
          ))
        : null}

      {/* Divider for multiple answers */}
      {stage.answers && stage.answers.length > 1 && (
        <div className={isMobile ? 'px-[18px]' : ''}>
          <Divider className={isMobile ? 'mt-0 mb-0' : 'mt-0 mb-5'} />
        </div>
      )}

      {/* Feedback Section */}
      <div
        className={`flex justify-between mb-3 ${isMobile ? 'px-[18px]' : ''} ${
          stage.answers && stage.answers.length > 1
            ? 'mt-5'
            : hasPreviousAnswer
              ? isMobile
                ? 'mt-5'
                : '-mt-2.5'
              : 'mt-0'
        }`}
      >
        {/* Radio Accept/Reject */}
        <Form.Item
          name={`feedback-status-${stage.review_id}-${index}`}
          className="m-0"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}
        >
          <Radio.Group onChange={(e) => onRadioChange(e, index)}>
            <Radio value={1} data-index={index}>
              <span className="font-medium">
                {t('feature.feature_reviews.popup_review.accept')}
              </span>
            </Radio>
            <Radio value={0} data-index={index}>
              <span className="font-medium">
                {t('feature.feature_reviews.popup_review.reject')}
              </span>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      {/* Comment TextArea */}
      <div className={isMobile ? 'px-[18px]' : ''}>
        <Form.Item
          name={`feedback-comment-${stage.review_id}-${index}`}
          className="m-0"
          rules={[
            {
              required: isRequired,
              message: '',
            },
          ]}
        >
          <TextArea
            className={`resize-none ${charCount >= 200 ? 'text-red-600' : ''}`}
            maxLength={200}
            showCount
            rows={3}
            style={{
              paddingBottom: isMobile ? 18 : undefined,
            }}
            placeholder={placeholder}
            onChange={(e) => {
              setCharCount(e.target.value.length)
              if (onTextAreaChange) {
                onTextAreaChange(e, index)
              }
            }}
          />
        </Form.Item>
      </div>

      {/* Divider between stages (mobile) */}
      {isMobile && stage.answers && stage.answers.length > 1 && (
        <Divider className={`mb-${isLastStage ? 4 : 0}`} />
      )}

      {/* Divider between stages (desktop) */}
      {!isMobile &&
        stage.answers &&
        stage.answers.length > 1 &&
        !isLastStage && <Divider className="my-8" />}

      {/* Image Zoom Modal (Mobile) */}
      {isMobile && (
        <Modal
          open={openImageModal}
          onCancel={() => setOpenImageModal(false)}
          footer={null}
          closable={false}
          style={{ maxWidth: '90%' }}
          centered
          transitionName="ant-fade"
          keyboard
          destroyOnClose
          className="modal-zoom-image"
        >
          <div className="absolute -top-[44%] right-0 z-10">
            <CloseOutlined
              onClick={() => setOpenImageModal(false)}
              className="text-lg text-white cursor-pointer rounded-full p-0.5"
            />
          </div>
          <img
            src={imageUrl}
            alt="Modal"
            className="w-full max-h-[60vh] object-cover rounded-xl block"
          />
        </Modal>
      )}
    </div>
  )
}

ReviewFormStage.propTypes = {
  stage: PropTypes.shape({
    review_id: PropTypes.number.isRequired,
    stage: PropTypes.number,
    review_status: PropTypes.oneOf([null, 0, 1]),
    notes: PropTypes.string,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        answer_type: PropTypes.number,
        answer_text: PropTypes.string,
        question_text: PropTypes.string,
        incrementNumber: PropTypes.number,
      })
    ),
  }).isRequired,
  index: PropTypes.number.isRequired,
  previousStage: PropTypes.shape({
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        answer_type: PropTypes.number,
        answer_text: PropTypes.string,
        question_text: PropTypes.string,
      })
    ),
  }),
  isLastStage: PropTypes.bool,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  onRadioChange: PropTypes.func.isRequired,
  onTextAreaChange: PropTypes.func,
  isMobile: PropTypes.bool,
}

ReviewFormStage.defaultProps = {
  previousStage: null,
  isLastStage: false,
  placeholder: '',
  isRequired: false,
  onTextAreaChange: null,
  isMobile: false,
}

export default ReviewFormStage
