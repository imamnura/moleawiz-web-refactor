import PropTypes from 'prop-types'
import { Modal, Button, Row } from 'antd'
import { useTranslation } from 'react-i18next'

/**
 * ReviewModals - Collection of confirmation modals for review flow
 * Includes: Quit, Incomplete, Submit Confirmation, Delete Module modals
 */

// Modal: Confirm quit review form (lose unsaved data)
export const ModalCloseFormReview = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Modal
      className="modal-confirm-close-review"
      open={open}
      maskClosable={false}
      closeIcon={false}
      width={424}
      transitionName="ant-fade"
      keyboard
      centered
      footer={
        <Row className="justify-between px-8 pb-8">
          <Button
            key="no-close"
            className="w-[170px] rounded-md border border-blue-600 font-medium h-12"
            onClick={onClose}
          >
            {t('feature.feature_reviews.popup_quit.no')}
          </Button>
          <Button
            key="yes-close"
            type="primary"
            className="w-[170px] rounded-md font-medium h-12"
            onClick={onConfirm}
          >
            {t('feature.feature_reviews.popup_quit.yes')}
          </Button>
        </Row>
      }
    >
      <div className="text-center mb-7 pt-7 px-8">
        <p className="text-gray-900 font-medium text-[22px] m-0 leading-normal">
          {t('feature.feature_reviews.popup_quit.title')}
        </p>
        <div className="mt-2">
          <span className="text-gray-700 text-base">
            {t('feature.feature_reviews.popup_quit.description')}
          </span>
        </div>
      </div>
    </Modal>
  )
}

ModalCloseFormReview.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

// Modal: Incomplete review form validation
export const ModalIncompleteReview = ({ open, onClose }) => {
  const { t } = useTranslation()

  return (
    <Modal
      className="modal-incomplete-review"
      open={open}
      maskClosable={false}
      closeIcon={false}
      width={424}
      transitionName="ant-fade"
      keyboard
      centered
      footer={
        <Row className="justify-center px-8 pb-8">
          <Button
            key="ok"
            type="primary"
            className="w-[170px] rounded-md font-medium h-12"
            onClick={onClose}
          >
            {t('feature.feature_reviews.popup_incomplete.ok')}
          </Button>
        </Row>
      }
    >
      <div className="text-center mb-7 pt-7 px-8">
        <p className="text-gray-900 font-medium text-[22px] m-0 leading-normal">
          {t('feature.feature_reviews.popup_incomplete.title')}
        </p>
        <div className="mt-2">
          <span className="text-gray-700 text-base">
            {t('feature.feature_reviews.popup_incomplete.description')}
          </span>
        </div>
      </div>
    </Modal>
  )
}

ModalIncompleteReview.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

// Modal: Confirm submit review
export const ModalConfirmSubmitReview = ({
  open,
  onClose,
  onConfirm,
  acceptCount = 0,
  rejectCount = 0,
  isApproved = true,
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      className="modal-confirm-submit-review"
      open={open}
      maskClosable={false}
      closeIcon={false}
      width={424}
      transitionName="ant-fade"
      keyboard
      centered
      footer={
        <Row className="justify-between px-8 pb-8">
          <Button
            key="cancel"
            className="w-[170px] rounded-md border border-blue-600 font-medium h-12"
            onClick={onClose}
          >
            {t('feature.feature_reviews.popup_confirm.cancel')}
          </Button>
          <Button
            key="submit"
            type="primary"
            className="w-[170px] rounded-md font-medium h-12"
            onClick={onConfirm}
          >
            {t('feature.feature_reviews.popup_confirm.submit')}
          </Button>
        </Row>
      }
    >
      <div className="text-center mb-7 pt-7 px-8">
        <p className="text-gray-900 font-medium text-[22px] m-0 leading-normal">
          {t('feature.feature_reviews.popup_confirm.title')}
        </p>
        <div className="mt-2">
          <span className="text-gray-700 text-base">
            {t('feature.feature_reviews.popup_confirm.description')}
          </span>
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-600">
            {t('feature.feature_reviews.popup_result_review.accepted')}:{' '}
            {acceptCount}
          </div>
          <div className="text-sm text-gray-600">
            {t('feature.feature_reviews.popup_result_review.rejected')}:{' '}
            {rejectCount}
          </div>
          <div className="text-base font-medium mt-2">
            <span className={isApproved ? 'text-green-600' : 'text-red-600'}>
              {isApproved
                ? t('feature.feature_reviews.anchor.approved')
                : t('feature.feature_reviews.anchor.declined')}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

ModalConfirmSubmitReview.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  acceptCount: PropTypes.number,
  rejectCount: PropTypes.number,
  isApproved: PropTypes.bool,
}

ModalConfirmSubmitReview.defaultProps = {
  acceptCount: 0,
  rejectCount: 0,
  isApproved: true,
}

// Modal: Confirm delete module submission
export const ModalDeleteModule = ({
  open,
  onClose,
  onConfirm,
  moduleName = '',
}) => {
  return (
    <Modal
      className="modal-confirm-delete-review"
      open={open}
      maskClosable={false}
      closeIcon={false}
      width={424}
      transitionName="ant-fade"
      keyboard
      centered
      footer={
        <Row className="justify-between px-8 pb-8">
          <Button
            key="no-close"
            className="w-[170px] rounded-md border border-blue-600 font-medium h-12"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            key="yes-close"
            type="primary"
            className="w-[170px] rounded-md font-medium h-12"
            onClick={onConfirm}
          >
            Yes
          </Button>
        </Row>
      }
    >
      <div className="text-center mb-7 pt-7 px-8">
        <p className="text-gray-900 font-medium text-[22px] m-0 leading-normal">
          Delete module submission "{moduleName}"?
        </p>
        <div className="mt-2">
          <span className="text-gray-700 text-base">
            Once deleted, you will no longer have <br /> access to its review
            history.
          </span>
        </div>
      </div>
    </Modal>
  )
}

ModalDeleteModule.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  moduleName: PropTypes.string,
}

ModalDeleteModule.defaultProps = {
  moduleName: '',
}

const ReviewModals = {
  ModalCloseFormReview,
  ModalIncompleteReview,
  ModalConfirmSubmitReview,
  ModalDeleteModule,
}

export default ReviewModals
