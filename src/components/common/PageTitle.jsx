import React from 'react'
import { Col } from 'antd'
import PropTypes from 'prop-types'
import { textTitleHome } from '@/config/constant/color'

/**
 * Reusable Page Title Component
 * @param {string} title - Title text to display
 * @param {string} attr - Custom attribute for title
 * @param {boolean} dynamic - Enable dynamic font sizing
 * @param {boolean} isMobile - Mobile version flag
 */
const PageTitle = ({ 
  title, 
  attr = 'default-title', 
  dynamic = false, 
  isMobile = false,
  span = 18,
  style = {}
}) => {
  const fontSize = dynamic && !title 
    ? 'inherit' 
    : isMobile 
      ? '18px' 
      : '22px'

  const titleStyle = {
    fontSize,
    textAlign: 'left',
    fontWeight: '500',
    color: textTitleHome,
    lineHeight: isMobile ? '100%' : 'unset',
    ...style
  }

  return (
    <>
      <Col span={span}>
        <div
          className="general-title"
          text-title={attr}
          style={titleStyle}
        >
          {title}
        </div>
      </Col>
      {span < 24 && <Col span={24 - span}></Col>}
    </>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  attr: PropTypes.string,
  dynamic: PropTypes.bool,
  isMobile: PropTypes.bool,
  span: PropTypes.number,
  style: PropTypes.object,
}

export default PageTitle
