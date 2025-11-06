import React, { useEffect } from 'react'
import { ConfigProvider } from 'antd'
import PropTypes from 'prop-types'
import { colorTextTitle, backgroundCard } from '@/config/constant/color'

/**
 * Reusable Snackbar/Toast Component
 * @param {string} message - Message to display
 * @param {boolean} isOpen - Control snackbar visibility
 * @param {function} onClose - Callback when snackbar closes
 * @param {boolean} isMobile - Mobile version flag
 * @param {number} duration - Display duration in ms
 */
const Snackbar = ({ 
  message, 
  isOpen, 
  onClose, 
  isMobile = false,
  duration = 3000 
}) => {
  const snackbarId = isMobile ? 'snackbar-general-mobile' : 'snackbar-general'

  useEffect(() => {
    if (!isOpen) return

    const snackbarElement = document.getElementById(snackbarId)
    if (!snackbarElement) return

    // Show snackbar
    snackbarElement.className = 'show'

    // Auto hide after duration
    const timer = setTimeout(() => {
      snackbarElement.className = snackbarElement.className.replace('show', '')
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [isOpen, snackbarId, duration, onClose])

  const snackbarStyle = {
    background: colorTextTitle,
    borderRadius: isMobile ? 10 : 4,
    width: 'fit-content',
    color: backgroundCard,
    padding: isMobile ? '8px 12px' : '16px 16px 14px 16px',
    fontSize: '14px',
    maxWidth: isMobile ? '279px' : '100%',
    opacity: isMobile ? 0.7 : 1,
  }

  return (
    <div id={snackbarId}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Roboto',
          },
        }}
      >
        <div style={snackbarStyle}>
          {message}
        </div>
      </ConfigProvider>
    </div>
  )
}

Snackbar.propTypes = {
  message: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  duration: PropTypes.number,
}

export default Snackbar
