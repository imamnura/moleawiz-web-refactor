import { useState, useCallback, useMemo } from 'react'

/**
 * Custom hook untuk pagination
 * @param {array} data - Data array to paginate
 * @param {number} initialPageSize - Items per page
 * @returns {object} Pagination state and handlers
 */
export const usePagination = (data = [], initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / pageSize)
  }, [data.length, pageSize])

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, pageSize])

  // Navigation handlers
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(pageNumber)
  }, [totalPages])

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }, [])

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages)
  }, [totalPages])

  // Change page size
  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page
  }, [])

  // Reset pagination
  const reset = useCallback(() => {
    setCurrentPage(1)
    setPageSize(initialPageSize)
  }, [initialPageSize])

  return {
    currentPage,
    pageSize,
    totalPages,
    currentData,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    totalItems: data.length,
  }
}

export default usePagination
