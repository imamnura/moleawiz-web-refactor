import { Suspense } from 'react'
import { Spin } from 'antd'

/**
 * SuspenseWrapper Component
 *
 * Wraps components with React Suspense and custom fallback
 * Used for lazy loading routes and components
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components to wrap
 * @param {React.ReactNode} props.fallback - Custom loading fallback
 */
export default function SuspenseWrapper({ children, fallback }) {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-screen">
      <Spin size="large" tip="Loading..." />
    </div>
  )

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
}
