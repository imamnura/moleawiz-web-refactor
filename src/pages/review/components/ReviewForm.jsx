import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Row } from 'antd'
import { CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ReviewFormStage from './ReviewFormStage'
import { useReviewSubmission } from '../hooks/useReviewSubmission'
import { useSubmissionReview } from '../hooks/useSubmissionReview'

const { TextArea } = Input

/**
 * ReviewForm - Main review form modal
 * Complex form with dynamic validation, localStorage persistence, multiple stages
 */
const ReviewForm = ({
  open,
  user,
  moduleTitle,
  onSubmit,
  onOpenQuitModal,
  onOpenIncompleteModal,
  onOpenSubmitModal,
  isMobile = false,
}) => {
  const { t } = useTranslation()
  const { moduleId } = useParams()

  const [placeholders, setPlaceholders] = useState([])
  const [requiredFields, setRequiredFields] = useState([])
  const [overallCharCount, setOverallCharCount] = useState(0)

  // Use review submission hook
  const { form, setStatusDecision, loadSavedFormData, saveFormData } =
    useReviewSubmission({
      userId: user?.user_id,
      submissionNumber: user?.last_submission,
      onSuccess: (data) => {
        if (onSubmit) {
          onSubmit(data)
        }
      },
      onError: (error) => {
        console.error('Submit error:', error)
      },
    })

  // Use submission review hook
  const {
    currentReview,
    previousReview,
    isLoading,
    fetchBothSubmissions,
    resetReviewData,
  } = useSubmissionReview()

  // Fetch submission data when modal opens
  useEffect(() => {
    if (open && user && moduleId) {
      fetchBothSubmissions(Number(moduleId), user.user_id)
    }
  }, [open, user, moduleId, fetchBothSubmissions])

  // Load saved form data when modal opens
  useEffect(() => {
    if (open && !isLoading) {
      loadSavedFormData()
    }
  }, [open, isLoading, loadSavedFormData])

  // Initialize placeholders and required fields
  useEffect(() => {
    if (currentReview.length > 0) {
      const newPlaceholders = new Array(currentReview.length).fill(
        t('feature.feature_reviews.popup_review.give_reason_optional')
      )
      const newRequired = new Array(currentReview.length).fill(false)
      setPlaceholders(newPlaceholders)
      setRequiredFields(newRequired)
    }
  }, [currentReview, t])

  // Handle radio change (accept/reject)
  const handleRadioChange = (e, index) => {
    const value = e.target.value
    const newPlaceholders = [...placeholders]
    const newRequired = [...requiredFields]

    if (value === 1) {
      // Accept - optional comment
      newPlaceholders[index] = t(
        'feature.feature_reviews.popup_review.give_reason_optional'
      )
      newRequired[index] = false
    } else {
      // Reject - required comment
      newPlaceholders[index] = t(
        'feature.feature_reviews.popup_review.give_reason_mandatory'
      )
      newRequired[index] = true
    }

    setPlaceholders(newPlaceholders)
    setRequiredFields(newRequired)
  }

  // Handle form values change (save to localStorage)
  const handleValuesChange = (changedValues) => {
    saveFormData(changedValues)
  }

  // Handle form submit
  const onFinish = async (values) => {
    // Count accept/reject for summary
    let acceptCount = 0
    let rejectCount = 0

    for (const key in values) {
      if (key.startsWith('feedback-status-')) {
        if (values[key] === 1) acceptCount++
        if (values[key] === 0) rejectCount++
      }
    }

    // Determine overall decision (approve if all accepted, decline if any rejected)
    const overallDecision = rejectCount > 0 ? 0 : 1
    setStatusDecision(overallDecision)

    // Open submit confirmation modal
    if (onOpenSubmitModal) {
      onOpenSubmitModal({
        acceptCount,
        rejectCount,
        overallDecision,
        formValues: values,
      })
    }
  }

  // Handle form validation failed
  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo)
    if (onOpenIncompleteModal) {
      onOpenIncompleteModal()
    }
  }

  // Handle modal close
  const handleClose = () => {
    if (onOpenQuitModal) {
      onOpenQuitModal()
    }
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      resetReviewData()
      setPlaceholders([])
      setRequiredFields([])
      setOverallCharCount(0)
    }
  }, [open, resetReviewData])

  const isScalingVersion =
    (window?.innerWidth <= 991 && window.innerWidth >= 768) ||
    window?.innerWidth === 581

  return (
    <Modal
      className={`modal-form-review ${isMobile ? 'mobile' : ''}`}
      open={open}
      maskClosable={false}
      closeIcon={
        isMobile ? (
          <div className="btn-back-mobile text-left">
            <ArrowLeftOutlined className="text-gray-900 w-[15px] h-[15px]" />
          </div>
        ) : (
          <div
            className="p-2 bg-white rounded-full border-none"
            id="btn-modal-close-form-review"
          >
            <CloseOutlined className="text-gray-600 text-sm" />
          </div>
        )
      }
      width={
        isMobile ? (isScalingVersion ? `${585 * 0.9}px` : '100%') : '770px'
      }
      onCancel={handleClose}
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
          <div className={isMobile ? 'flex justify-between w-[85%]' : 'block'}>
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

      {/* Form Body */}
      <Form
        className="body-form-review"
        style={{ padding: isMobile ? 0 : '32px 0 32px 32px' }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={handleValuesChange}
      >
        <div
          className={`content-form-review overflow-y-auto overflow-x-hidden h-auto ${
            isMobile ? 'pr-0 max-h-full' : 'pr-8 max-h-[calc(100vh-251px)]'
          }`}
        >
          {/* Review Stages */}
          {currentReview.map((stage, index) => (
            <ReviewFormStage
              key={index}
              stage={stage}
              index={index}
              previousStage={previousReview[index]}
              isLastStage={index === currentReview.length - 1}
              placeholder={placeholders[index]}
              isRequired={requiredFields[index]}
              onRadioChange={handleRadioChange}
              isMobile={isMobile}
            />
          ))}

          {/* Divider */}
          {!isMobile && <div className="border-t border-gray-200 my-6" />}

          {/* Overall Feedback */}
          <div className={`text-sm font-medium ${isMobile ? 'px-[18px]' : ''}`}>
            {t('feature.feature_reviews.popup_review.overall_feedback')}
          </div>

          <Form.Item
            className={`overall-feedback ${isMobile ? 'px-[18px]' : ''}`}
            name={`overall-feedback-${moduleId}-${user?.user_id}`}
          >
            <TextArea
              className={`resize-none mt-2 ${overallCharCount >= 200 ? 'text-red-600' : ''}`}
              maxLength={200}
              showCount
              rows={3}
              style={{
                paddingBottom: isMobile ? 18 : undefined,
              }}
              placeholder={t(
                'feature.feature_reviews.popup_review.overall_feedback_mandatory'
              )}
              onChange={(e) => setOverallCharCount(e.target.value.length)}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item
            className={`text-right m-0 ${isMobile ? 'px-[18px] pb-[18px]' : ''}`}
          >
            {isMobile ? (
              <Row className="justify-between flex-nowrap gap-[4%]">
                <Button
                  className="w-[48%] rounded-md border border-gray-300 text-sm font-medium h-10"
                  onClick={handleClose}
                >
                  {t('feature.feature_reviews.popup_review.cancel')}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-[48%] rounded-md text-sm font-medium h-10"
                >
                  {t('feature.feature_reviews.popup_review.next')}
                </Button>
              </Row>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 text-white border-blue-600 rounded-md text-xs h-[29px] w-[110px] font-medium"
              >
                {t('feature.feature_reviews.popup_review.submit')}
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

ReviewForm.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number,
    fullname: PropTypes.string,
    username: PropTypes.string,
    last_submission: PropTypes.number,
    submited_formatted: PropTypes.string,
  }),
  moduleTitle: PropTypes.string,
  onSubmit: PropTypes.func,
  onOpenQuitModal: PropTypes.func,
  onOpenIncompleteModal: PropTypes.func,
  onOpenSubmitModal: PropTypes.func,
  isMobile: PropTypes.bool,
}

ReviewForm.defaultProps = {
  user: null,
  moduleTitle: '',
  onSubmit: null,
  onOpenQuitModal: null,
  onOpenIncompleteModal: null,
  onOpenSubmitModal: null,
  isMobile: false,
}

export default ReviewForm
