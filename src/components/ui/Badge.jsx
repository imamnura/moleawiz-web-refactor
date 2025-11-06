import React from 'react'
import PropTypes from 'prop-types'
import { WarningFilled } from '@ant-design/icons'

/**
 * Reusable Badge Component
 * @param {string} variant - Type of badge: 'new', 'deadline', 'overdue', 'custom'
 * @param {React.ReactNode} children - Badge content
 * @param {string} position - Position: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 * @param {string} className - Additional CSS classes
 */
export const Badge = ({ 
  variant = 'custom',
  children, 
  position = 'top-left',
  className = '' 
}) => {
  const baseClasses = 'absolute z-10 font-bold text-white text-xs px-2.5 py-2 flex items-center gap-1'
  
  const variantClasses = {
    new: 'bg-[#123FA0]',
    deadline: 'bg-[#C2272E]',
    overdue: 'bg-[#C2272E]',
    custom: 'bg-primary'
  }
  
  const positionClasses = {
    'top-left': 'left-0 top-0 rounded-tl-lg rounded-br-lg',
    'top-right': 'right-0 top-0 rounded-tr-lg rounded-bl-lg',
    'bottom-left': 'left-0 bottom-0 rounded-bl-lg rounded-tr-lg',
    'bottom-right': 'right-0 bottom-0 rounded-br-lg rounded-tl-lg'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${positionClasses[position]} ${className}`}>
      {(variant === 'deadline' || variant === 'overdue') && (
        <WarningFilled className="text-white" />
      )}
      {children}
    </div>
  )
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['new', 'deadline', 'overdue', 'custom']),
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  className: PropTypes.string
}

export default Badge
