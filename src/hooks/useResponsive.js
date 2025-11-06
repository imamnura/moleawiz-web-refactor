import { useState, useEffect } from 'react'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'

/**
 * Custom hook for responsive design detection
 * @returns {object} Responsive breakpoint information
 */
export const useResponsive = () => {
  const screens = useBreakpoint()
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Special scaling version detection
  const isScallingVersion = 
    (windowSize.width <= 991 && windowSize.width >= 768) || 
    windowSize.width === 581

  return {
    screens,
    width: windowSize.width,
    height: windowSize.height,
    isMobile: screens.xs || isScallingVersion,
    isTablet: screens.sm || screens.md,
    isDesktop: screens.lg || screens.xl || screens.xxl,
    isScallingVersion,
    // Convenience booleans
    xs: screens.xs,
    sm: screens.sm,
    md: screens.md,
    lg: screens.lg,
    xl: screens.xl,
    xxl: screens.xxl,
  }
}

export default useResponsive
