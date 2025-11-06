import PropTypes from 'prop-types'
import { useState, useRef, useEffect } from 'react'
import { RightOutlined } from '@ant-design/icons'

/**
 * CourseDescription Component
 *
 * Displays course description with "Read More" functionality
 *
 * @param {Object} props
 * @param {string} props.description - Course description text
 * @param {boolean} props.isMobile - Mobile view flag
 */
export default function CourseDescription({
  description = '',
  isMobile = false,
}) {
  const [isClamped, setIsClamped] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const textRef = useRef(null)

  // Check if text is clamped
  useEffect(() => {
    if (textRef.current && description) {
      const lineHeight = parseInt(
        window.getComputedStyle(textRef.current).lineHeight
      )
      const maxHeight = lineHeight * 5 // 5 lines for course description
      const isTextClamped = textRef.current.scrollHeight > maxHeight
      setIsClamped(isTextClamped)
    }
  }, [description])

  if (!description || description.trim() === '') {
    return null
  }

  // Format description (preserve line breaks)
  const formattedDescription = description.replace(/(?:\r\n|\r|\n)/g, '\n')

  return (
    <div
      className={`course-description ${isMobile ? 'px-4 py-4' : 'px-6 py-4'}`}
    >
      {/* Description Text */}
      <div
        ref={textRef}
        className={`
          text-gray-700 whitespace-pre-wrap
          ${isMobile ? 'text-sm leading-5' : 'text-base leading-6'}
          ${!isExpanded && isClamped ? 'line-clamp-5' : ''}
        `}
      >
        {formattedDescription}
      </div>

      {/* Read More Button */}
      {isClamped && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
          <RightOutlined
            className={`text-xs transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </button>
      )}
    </div>
  )
}

CourseDescription.propTypes = {
  description: PropTypes.string,
  isMobile: PropTypes.bool,
}
