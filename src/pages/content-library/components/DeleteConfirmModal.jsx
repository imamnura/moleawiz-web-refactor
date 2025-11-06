/**
 * DeleteConfirmModal Component
 * Confirmation modal for deleting collection items
 */
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'

export const DeleteConfirmModal = ({ open, onConfirm, onCancel, itemName }) => {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={t('feature.feature_cl.delete_modal.confirm')}
      cancelText={t('feature.feature_cl.delete_modal.cancel')}
      okButtonProps={{ danger: true }}
      centered
    >
      <div className="py-4">
        <p className="text-base font-semibold mb-2">
          {t('feature.feature_cl.delete_modal.title')}
        </p>
        <p className="text-sm text-gray-600">
          {t('feature.feature_cl.delete_modal.message', { name: itemName })}
        </p>
      </div>
    </Modal>
  )
}

DeleteConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
}
