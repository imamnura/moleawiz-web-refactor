import PropTypes from 'prop-types'
import { useState } from 'react'
import { Modal, Image, Button } from 'antd'
import { CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import defaultImage from '@assets/images/png/general/img_thumb_default.png'
import ic_accepted_review from '@assets/images/svgs/ic_accepted_review.svg'
import ic_declined_review from '@assets/images/svgs/ic_declined_review.svg'
import ic_accepted_item_review from '@assets/images/svgs/ic_accepted_item_review.svg'
import ic_rejected_item_review from '@assets/images/svgs/ic_rejected_item_review.svg'
import { convertEnter, convertLink, convertFileLink } from '../utils/formatters'

/**
 * ReviewPreview - Preview modal for already reviewed submissions
 * Shows review decisions, comments, and overall feedback
 */
const ReviewPreview = ({
  open,
  user,
  moduleTitle,
  reviewData = [],
  overallFeedback = '',
  reviewCounts = { accepted: 0, rejected: 0 },
  onClose,
  isMobile = false,
}) => {
  const { t } = useTranslation()
  const [openImageModal, setOpenImageModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const isApproved = reviewData.every((stage) => stage.review_status === 1)

  const handleImageClick = (url) => {
    if (isMobile) {
      setImageUrl(url)
      setOpenImageModal(true)
    }
  }

  const renderAnswer = (answer) => {
    if (!answer || !answer.answer_type) return null

    // Text or HTML answer
    if (answer.answer_type === 1 || answer.answer_type === 3) {
      return (
        <div
          className={`text-sm text-gray-600 mb-${isMobile ? 0 : 6} ${
            isMobile ? 'leading-5 w-[90%] pl-[18px]' : 'w-full'
          }`}
          dangerouslySetInnerHTML={{
            __html:
              answer.answer_type === 6
                ? convertFileLink(answer.answer_text, 'file_name')
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
            className={`text-sm text-gray-600 mb-${isMobile ? 0 : 6} ${
              isMobile ? 'leading-5 w-[90%] pl-[18px]' : 'w-full'
            }`}
            dangerouslySetInnerHTML={{
              __html:
                answer.answer_type === 6
                  ? convertFileLink(answer.answer_text, 'file_name')
                  : convertLink(convertEnter(answer.answer_text)),
            }}
          />
        )
      }

      return (
        <div
          className={`text-sm text-gray-600 mb-0 ${isMobile ? 'w-[90%] pl-[18px]' : 'w-full'}`}
        >
          <Image
            className="image-preview-review"
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

  const isScalingVersion =
    (window?.innerWidth <= 991 && window.innerWidth >= 768) ||
    window?.innerWidth === 581

  return (
    <>
      <Modal
        className={`modal-preview-review ${isMobile ? 'mobile' : ''}`}
        open={open}
        maskClosable={false}
        closeIcon={
          isMobile ? (
            <div className="btn-back-mobile text-left flex items-center gap-0 ml-2">
              <ArrowLeftOutlined className="text-gray-900 w-[15px] h-[15px]" />
              <span className="text-base text-gray-900 leading-[19px] font-medium ml-3">
                Reviewed
              </span>
            </div>
          ) : (
            <div
              className="p-2 bg-white rounded-full border-none"
              id="btn-modal-close-preview-review"
            >
              <CloseOutlined className="text-gray-600 text-sm" />
            </div>
          )
        }
        width={
          isMobile ? (isScalingVersion ? `${585 * 0.9}px` : '100%') : '770px'
        }
        onCancel={onClose}
        transitionName="ant-fade"
        keyboard
        centered
        footer={false}
        style={{
          maxWidth: isMobile ? '585px' : undefined,
          borderRadius: isMobile ? '0' : '24px',
          margin: isMobile ? '0' : undefined,
          top: isMobile ? 0 : undefined,
          left: isMobile ? 0 : undefined,
          padding: isMobile ? 0 : undefined,
          height: isMobile ? '100vh' : 'auto',
        }}
      >
        {/* Header */}
        <div
          className={`rounded-t-2xl ${isMobile ? 'rounded-t-none p-0' : 'p-5 pb-5'} bg-blue-50`}
        >
          {!isMobile && (
            <div className="text-base font-medium text-blue-600 mb-2.5">
              {moduleTitle}
            </div>
          )}
          <div
            className={`flex ${isMobile ? 'flex-col p-[18px]' : 'flex-row'} justify-start text-sm`}
          >
            {isMobile && (
              <div className="text-lg leading-[21px] font-medium text-blue-600 mb-3 mt-[34px]">
                {moduleTitle}
              </div>
            )}
            <div className={isMobile ? 'mb-3' : 'mr-21'}>
              <div
                className={`${isMobile ? 'text-base leading-[19px] text-gray-900 mb-0.5' : ''} font-medium`}
              >
                {user?.fullname}
              </div>
              <div
                className={`${isMobile ? 'text-sm leading-4' : ''} text-gray-600`}
              >
                {user?.username}
              </div>
            </div>
            <div
              className={isMobile ? 'flex justify-between w-[85%]' : 'block'}
            >
              <div>
                <span className="text-gray-600">
                  {t('feature.feature_reviews.anchor.submission')}
                </span>{' '}
                <span className="font-medium">#{user?.last_submission}</span>
              </div>
              <div>
                <span className="text-gray-600">
                  {t('feature.feature_reviews.anchor.submitted_on')}
                </span>{' '}
                <span className="font-medium">{user?.submited_formatted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge (Mobile - Above content) */}
        {isMobile && (
          <div
            className={`flex items-center p-3 rounded-lg ${
              isApproved ? 'bg-green-100' : 'bg-orange-100'
            }`}
          >
            <div className="mr-2.5">
              <Image
                preview={false}
                width={37}
                height={37}
                src={isApproved ? ic_accepted_review : ic_declined_review}
                alt="icon grade head"
              />
            </div>
            <div className="flex flex-col justify-center items-start leading-normal">
              <div
                className={`text-sm font-medium mb-1 ${
                  isApproved ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {isApproved
                  ? t('feature.feature_reviews.anchor.approved')
                  : t('feature.feature_reviews.anchor.declined')}
              </div>
              <div className="text-sm text-gray-600">
                {t('feature.feature_reviews.popup_result_review.accepted')}:{' '}
                {reviewCounts.accepted}&nbsp;&nbsp;&nbsp;&nbsp;
                {t(
                  'feature.feature_reviews.popup_result_review.rejected'
                )}: {reviewCounts.rejected}
              </div>
            </div>
          </div>
        )}

        {/* Overall Feedback (Mobile - Above content) */}
        {isMobile && (
          <div className="border-none rounded-lg p-3 mb-1.5">
            <div className="text-sm font-medium">
              {t('feature.feature_reviews.popup_review.overall_feedback')}
            </div>
            <div className="text-gray-600">{overallFeedback || '-'}</div>
          </div>
        )}

        {/* Body */}
        <div className={`${isMobile ? 'p-0' : 'p-8 pt-8 pl-8'}`}>
          <div
            className={`overflow-y-auto overflow-x-hidden h-auto ${
              isMobile ? 'pr-0 max-h-full' : 'pr-8 max-h-[calc(100vh-251px)]'
            }`}
          >
            {/* Status Badge (Desktop) */}
            {!isMobile && (
              <div
                className={`flex items-center p-3 rounded-lg mb-5 ${
                  isApproved ? 'bg-green-100' : 'bg-orange-100'
                }`}
              >
                <div className="mr-2.5">
                  <Image
                    preview={false}
                    width={37}
                    height={37}
                    src={isApproved ? ic_accepted_review : ic_declined_review}
                    alt="icon grade head"
                  />
                </div>
                <div className="flex flex-col justify-center items-start leading-normal">
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isApproved ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {isApproved
                      ? t('feature.feature_reviews.anchor.approved')
                      : t('feature.feature_reviews.anchor.declined')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('feature.feature_reviews.popup_result_review.accepted')}:{' '}
                    {reviewCounts.accepted}&nbsp;&nbsp;&nbsp;&nbsp;
                    {t(
                      'feature.feature_reviews.popup_result_review.rejected'
                    )}: {reviewCounts.rejected}
                  </div>
                </div>
              </div>
            )}

            {/* Overall Feedback (Desktop) */}
            {!isMobile && (
              <div className="border border-gray-300 rounded-lg p-3 mb-6">
                <div className="text-sm font-medium">
                  {t('feature.feature_reviews.popup_review.overall_feedback')}
                </div>
                <div className="text-gray-600">{overallFeedback || '-'}</div>
              </div>
            )}

            {/* Review Stages */}
            {reviewData.map((stage, index) => (
              <div
                key={index}
                className={`stage-group-wrapper-preview relative ${
                  isMobile ? 'pt-[18px]' : 'pt-6'
                }`}
              >
                {/* Answers */}
                {stage.answers &&
                  stage.answers.map((answer, answerIndex) => (
                    <div key={answerIndex}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: answer.question_text,
                        }}
                        className={`font-medium text-sm mb-${isMobile ? 1 : 2} ${
                          isMobile ? 'w-[90%] pl-[18px]' : 'w-full'
                        }`}
                      />
                      {renderAnswer(answer)}
                    </div>
                  ))}

                {/* Comment */}
                {stage.notes && (
                  <>
                    <div
                      className={`flex items-center mb-1 mt-3 ${
                        isMobile ? 'pl-[18px]' : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        Comment:
                      </div>
                    </div>
                    <div
                      className={`flex items-center ${
                        index === reviewData.length - 1
                          ? 'mb-0'
                          : isMobile
                            ? 'mb-4'
                            : 'mb-8'
                      } ${isMobile ? 'w-[90%] pl-[18px]' : 'w-full'}`}
                    >
                      <div className="text-sm text-gray-600">{stage.notes}</div>
                    </div>
                  </>
                )}

                {/* Accept/Reject Icon */}
                <div className="absolute right-0 top-0">
                  <Image
                    preview={false}
                    width={68}
                    height={68}
                    src={
                      stage.review_status === 1
                        ? ic_accepted_item_review
                        : ic_rejected_item_review
                    }
                    alt="icon grade item"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button (Mobile) */}
        {isMobile && (
          <div className="flex justify-center items-center p-[18px]">
            <Button
              type="primary"
              className="w-full rounded-md border border-gray-300 text-sm font-medium h-10"
              onClick={onClose}
            >
              {t('feature.feature_tm.close')}
            </Button>
          </div>
        )}
      </Modal>

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
    </>
  )
}

ReviewPreview.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number,
    fullname: PropTypes.string,
    username: PropTypes.string,
    last_submission: PropTypes.number,
    submited_formatted: PropTypes.string,
  }),
  moduleTitle: PropTypes.string,
  reviewData: PropTypes.arrayOf(
    PropTypes.shape({
      review_id: PropTypes.number,
      stage: PropTypes.number,
      review_status: PropTypes.oneOf([null, 0, 1]),
      notes: PropTypes.string,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          answer_type: PropTypes.number,
          answer_text: PropTypes.string,
          question_text: PropTypes.string,
        })
      ),
    })
  ),
  overallFeedback: PropTypes.string,
  reviewCounts: PropTypes.shape({
    accepted: PropTypes.number,
    rejected: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
}

ReviewPreview.defaultProps = {
  user: null,
  moduleTitle: '',
  reviewData: [],
  overallFeedback: '',
  reviewCounts: { accepted: 0, rejected: 0 },
  isMobile: false,
}

export default ReviewPreview
