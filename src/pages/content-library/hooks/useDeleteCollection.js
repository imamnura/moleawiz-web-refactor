/**
 * Custom hook for deleting collection items
 */
import { useDeleteCollectionMutation } from '@services/api'
import { useSnackbar } from '@hooks/useSnackbar'
import { getCollectionTypeLabel } from '../utils/collectionUtils'
import { useTranslation } from 'react-i18next'

/**
 * Hook to delete collection item with success/error feedback
 * @returns {object} { deleteItem, isDeleting }
 */
export const useDeleteCollection = () => {
  const { t } = useTranslation()
  const [deleteCollectionMutation, { isLoading: isDeleting }] =
    useDeleteCollectionMutation()
  const { showSnackbar } = useSnackbar()

  const deleteItem = async (item) => {
    try {
      await deleteCollectionMutation({
        id: item.id,
        type: item.type,
      }).unwrap()

      const typeLabel = getCollectionTypeLabel(item.type, t)
      showSnackbar(
        t('feature.feature_cl.collection_action.successfully_removed', {
          type: typeLabel,
        }),
        'success'
      )
    } catch {
      showSnackbar(
        t('feature.feature_cl.collection_action.failed_to_remove'),
        'error'
      )
    }
  }

  return {
    deleteItem,
    isDeleting,
  }
}
