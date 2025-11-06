import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'antd'
import { useSubmitReviewMutation } from '@/services/api/reviewApi'
import {
  getFormData,
  setFormData,
  clearFormData,
  generateFormKey,
} from '../utils/localStorage'

/**
 * Hook to manage review form submission
 * Handles form state, localStorage persistence, and submission
 */
export const useReviewSubmission = ({
  userId,
  submissionNumber,
  onSuccess,
  onError,
}) => {
  const { moduleId } = useParams()
  const [form] = Form.useForm()
  const [statusDecision, setStatusDecision] = useState(null)

  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation()

  const formKey = generateFormKey(userId, submissionNumber, Number(moduleId))

  /**
   * Load saved form data from localStorage
   */
  const loadSavedFormData = () => {
    const savedData = getFormData(formKey)
    if (savedData) {
      form.setFieldsValue(savedData)
    }
  }

  /**
   * Save form data to localStorage
   * @param {Object} changedValues - Changed form values
   */
  const saveFormData = (changedValues) => {
    const allValues = form.getFieldsValue()
    const combined = { ...allValues, ...changedValues }
    setFormData(formKey, combined)
  }

  /**
   * Clear saved form data from localStorage
   */
  const clearSavedFormData = () => {
    clearFormData(formKey)
    form.resetFields()
  }

  /**
   * Handle form submission
   * @param {Object} values - Form values
   */
  const handleSubmit = async (values) => {
    try {
      // Build review payload
      const output = {
        feedback: '',
        user_id: null,
        cmid: null,
        review: [],
        action_status: statusDecision, // 0 = decline, 1 = approve
      }

      const reviewMap = {}

      // Process all form values
      for (const key in values) {
        const value = values[key]

        // Overall Feedback
        if (key.startsWith('overall-feedback-')) {
          const match = key.match(/^overall-feedback-(\d+)-(\d+)$/)
          if (match) {
            output.cmid = parseInt(match[1])
            output.user_id = parseInt(match[2])
            output.feedback =
              value !== undefined && value !== null ? value : ' '
          }
        }

        // Feedback Status (accept/reject)
        else if (key.startsWith('feedback-status-')) {
          const match = key.match(/^feedback-status-(\d+)-(\d+)$/)
          if (match) {
            const review_id = parseInt(match[1])
            if (!reviewMap[review_id]) reviewMap[review_id] = {}
            reviewMap[review_id].review_id = review_id
            reviewMap[review_id].status = value
          }
        }

        // Feedback Comment
        else if (key.startsWith('feedback-comment-')) {
          const match = key.match(/^feedback-comment-(\d+)-(\d+)$/)
          if (match) {
            const review_id = parseInt(match[1])
            if (!reviewMap[review_id]) reviewMap[review_id] = {}
            reviewMap[review_id].review_id = review_id
            reviewMap[review_id].notes =
              value !== undefined && value !== null ? value : ''
          }
        }
      }

      // Convert reviewMap object to array
      output.review = Object.values(reviewMap)

      // Submit review
      await submitReview(output).unwrap()

      // Clear saved form data
      clearSavedFormData()

      // Call success callback
      if (onSuccess) {
        onSuccess(output)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      if (onError) {
        onError(error)
      }
    }
  }

  /**
   * Handle form validation failure
   * @param {Object} errorInfo - Validation error info
   */
  const handleValidationFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo)
  }

  return {
    form,
    statusDecision,
    setStatusDecision,
    isSubmitting,
    loadSavedFormData,
    saveFormData,
    clearSavedFormData,
    handleSubmit,
    handleValidationFailed,
  }
}
