/**
 * TabToTap Component
 * A simple scroll-to-top button component
 */

import { useEffect, useState } from 'react'
import { FloatButton } from 'antd'
import { VerticalAlignTopOutlined } from '@ant-design/icons'

/**
 * TabToTap - Floating button to scroll to top of page
 * Shows when user scrolls down, hides near top of page
 */
const TabToTap = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop
      setVisible(scrolled > 300)
    }

    window.addEventListener('scroll', toggleVisible)
    return () => window.removeEventListener('scroll', toggleVisible)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!visible) return null

  return (
    <FloatButton
      icon={<VerticalAlignTopOutlined />}
      onClick={scrollToTop}
      tooltip="Back to top"
    />
  )
}

export default TabToTap
