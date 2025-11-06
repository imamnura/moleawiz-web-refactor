/**
 * useDeleteCollection Hook Tests
 * Unit tests for useDeleteCollection custom hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDeleteCollection } from '../useDeleteCollection'

// Mock dependencies
vi.mock('@services/api', () => ({
  useDeleteCollectionMutation: vi.fn(),
}))

vi.mock('@hooks/useSnackbar', () => ({
  useSnackbar: vi.fn(() => ({
    showSnackbar: vi.fn(),
  })),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const translations = {
        'feature.feature_cl.collection_action.successfully_removed': `Successfully removed ${options?.type}`,
        'feature.feature_cl.collection_action.failed_to_remove':
          'Failed to remove item',
      }
      return translations[key] || key
    },
  }),
}))

vi.mock('../../utils/collectionUtils', () => ({
  getCollectionTypeLabel: vi.fn((type) => {
    const labels = { module: 'Module', course: 'Course', journey: 'Program' }
    return labels[type] || type
  }),
}))

describe('useDeleteCollection', () => {
  const mockUnwrap = vi.fn()
  const mockDeleteMutation = vi.fn(() => ({ unwrap: mockUnwrap }))
  const mockShowSnackbar = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()

    const { useDeleteCollectionMutation } = await import('@services/api')
    useDeleteCollectionMutation.mockReturnValue([
      mockDeleteMutation,
      { isLoading: false },
    ])

    const { useSnackbar } = await import('@hooks/useSnackbar')
    useSnackbar.mockReturnValue({ showSnackbar: mockShowSnackbar })
  })

  it('should delete item successfully', async () => {
    mockUnwrap.mockResolvedValue({})

    const { result } = renderHook(() => useDeleteCollection())

    const item = { id: 1, type: 'journey' }
    await result.current.deleteItem(item)

    await waitFor(() => {
      expect(mockDeleteMutation).toHaveBeenCalledWith({
        id: 1,
        type: 'journey',
      })
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        'Successfully removed Program',
        'success'
      )
    })
  })

  it('should handle deletion error', async () => {
    mockUnwrap.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useDeleteCollection())

    const item = { id: 1, type: 'course' }
    await result.current.deleteItem(item)

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        'Failed to remove item',
        'error'
      )
    })
  })

  it('should return isDeleting state', async () => {
    const { useDeleteCollectionMutation } = await import('@services/api')
    useDeleteCollectionMutation.mockReturnValue([
      mockDeleteMutation,
      { isLoading: true },
    ])

    const { result } = renderHook(() => useDeleteCollection())

    expect(result.current.isDeleting).toBe(true)
  })

  it('should get correct type label for module', async () => {
    const { getCollectionTypeLabel } = await import(
      '../../utils/collectionUtils'
    )
    mockUnwrap.mockResolvedValue({})

    const { result } = renderHook(() => useDeleteCollection())

    const item = { id: 3, type: 'module' }
    await result.current.deleteItem(item)

    await waitFor(() => {
      expect(getCollectionTypeLabel).toHaveBeenCalledWith(
        'module',
        expect.any(Function)
      )
    })
  })

  it('should call mutation with correct parameters for different types', async () => {
    mockUnwrap.mockResolvedValue({})

    const { result } = renderHook(() => useDeleteCollection())

    // Test journey
    await result.current.deleteItem({ id: 1, type: 'journey' })
    expect(mockDeleteMutation).toHaveBeenCalledWith({ id: 1, type: 'journey' })

    // Test course
    await result.current.deleteItem({ id: 2, type: 'course' })
    expect(mockDeleteMutation).toHaveBeenCalledWith({ id: 2, type: 'course' })

    // Test module
    await result.current.deleteItem({ id: 3, type: 'module' })
    expect(mockDeleteMutation).toHaveBeenCalledWith({ id: 3, type: 'module' })
  })
})
