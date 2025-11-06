import { Spin } from 'antd'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'

/**
 * GlobalLoading Component
 *
 * Shows loading indicator when any query/mutation is in progress
 * Uses TanStack Query's useIsFetching and useIsMutating hooks
 */
export default function GlobalLoading() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  const isLoading = isFetching > 0 || isMutating > 0

  if (!isLoading) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
        <Spin size="small" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  )
}
