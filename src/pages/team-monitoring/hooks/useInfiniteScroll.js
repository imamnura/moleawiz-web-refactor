import { useState, useCallback } from 'react'

/**
 * Hook for infinite scroll pagination
 * Returns paginated data and load more function
 *
 * @param {Array} data - Full data array
 * @param {number} pageSize - Items per page (default: 12)
 */
export default function useInfiniteScroll(data = [], pageSize = 12) {
  const [displayCount, setDisplayCount] = useState(pageSize)

  // Get displayed items
  const displayedItems = data.slice(0, displayCount)

  // Check if has more items
  const hasMore = displayCount < data.length

  // Load more items
  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + pageSize)
  }, [pageSize])

  // Reset pagination
  const reset = useCallback(() => {
    setDisplayCount(pageSize)
  }, [pageSize])

  return {
    displayedItems,
    hasMore,
    loadMore,
    reset,
    displayCount,
    totalCount: data.length,
  }
}
