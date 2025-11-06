import React from 'react'
import { ConfigProvider, Button, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { 
  textTitleHeader, 
  colorButtonLogOut, 
  colorTextTitleMobile 
} from '@/config/constant/color'
import { useResponsive } from '@/hooks/useResponsive'

/**
 * Reusable Confirmation Modal Component
 * @param {boolean} isOpen - Modal visibility state
 * @param {function} onClose - Close modal callback
 * @param {function} onConfirm - Confirm action callback
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 */
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message,
  confirmText,
  cancelText,
  width = 424
}) => {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()

  const defaultConfirmText = confirmText || t('feature.feature_cl.collection_action.yes')
  const defaultCancelText = cancelText || t('feature.feature_cl.collection_action.no')

  const modalConfig = {
    components: {
      Modal: {
        borderRadiusLG: '16px',
        borderRadiusSM: '16px',
        borderRadiusXS: '16px',
      },
    },
    token: {
      borderRadiusLG: 28,
      fontFamily: 'Roboto',
      motionDurationMid: '0.2s',
    },
  }

  const buttonStyle = {
    width: isMobile ? '48%' : '170px',
    borderRadius: '6px',
    border: `1px solid ${colorButtonLogOut}`,
    fontSize: '14px',
    fontWeight: '500',
    height: isMobile ? '40px' : '48px',
  }

  return (
    <ConfigProvider theme={modalConfig}>
      <Modal
        className="modal-confirm-general"
        open={isOpen}
        maskClosable={false}
        closeIcon={false}
        width={width}
        style={{ maxWidth: isMobile ? '90%' : `${width}px` }}
        onCancel={onClose}
        transitionName="ant-fade"
        keyboard
        centered
        footer={
          <div style={{ padding: isMobile ? '0px 20px 20px 20px' : '0 32px 32px' }}>
            <Row
              style={{
                justifyContent: 'space-between',
                flexWrap: isMobile && 'nowrap',
                gap: isMobile && '4%',
              }}
            >
              <Button
                key="cancel"
                className="btn btn-sm btn-secondary"
                style={buttonStyle}
                onClick={onClose}
              >
                {defaultCancelText}
              </Button>
              <Button
                key="confirm"
                className="btn btn-sm btn-secondary"
                style={buttonStyle}
                onClick={onConfirm}
              >
                {defaultConfirmText}
              </Button>
            </Row>
          </div>
        }
      >
        <div style={{ padding: isMobile ? '20px 20px 0 20px' : '31px 32px 0', margin: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '23px' }}>
            <p
              style={{
                color: isMobile ? colorTextTitleMobile : textTitleHeader,
                fontWeight: '500',
                fontSize: isMobile ? 16 : 22,
                margin: 0,
              }}
            >
              {message}
            </p>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  )
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  width: PropTypes.number,
}

export default ConfirmationModal
