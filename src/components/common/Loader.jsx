import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import PropTypes from 'prop-types'
import { ColorPrimary } from '@/config/constant/color'

/**
 * Reusable Loader Component
 * @param {boolean} fullScreen - Display loader in full screen mode
 * @param {number} size - Icon size in pixels
 * @param {string} color - Loader color
 */
export const Loader = ({ 
  fullScreen = true, 
  size = 48, 
  color = ColorPrimary 
}) => {
  const loaderStyle = fullScreen
    ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
        position: 'fixed',
      }
    : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }

  return (
    <div style={loaderStyle}>
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: size,
              color: color,
            }}
            spin
          />
        }
      />
    </div>
  )
}

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
}

export default Loader
