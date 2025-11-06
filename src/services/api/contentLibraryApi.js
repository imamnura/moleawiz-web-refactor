import { baseApi } from './baseApi'

/**
 * Content Library API
 * Handles endpoints for academies and collections
 */
export const contentLibraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all academies (Content Library tab)
     * GET /content-library
     */
    getAcademies: builder.query({
      query: () => '/content-library',
      providesTags: ['Academies'],
      transformResponse: (response) => response || [],
    }),

    /**
     * Get user's collections with optional filter
     * GET /collection?filter=all|journey|course|module
     */
    getCollections: builder.query({
      query: (filter = 'all') => ({
        url: '/collection',
        params: { filter },
      }),
      providesTags: (result, error, filter) => [
        { type: 'Collections', id: filter },
        'Collections',
      ],
      transformResponse: (response) => response || [],
    }),

    /**
     * Delete item from collection
     * DELETE /collection/:id?type=journey|course|module
     */
    deleteCollection: builder.mutation({
      query: ({ id, type }) => ({
        url: `/collection/${id}`,
        method: 'DELETE',
        params: { type },
      }),
      invalidatesTags: ['Collections'],
      // Optimistic update
      async onQueryStarted({ id, type }, { dispatch, queryFulfilled }) {
        // Update all collection caches
        const patches = []
        const filters = ['all', 'journey', 'course', 'module']

        filters.forEach((filter) => {
          const patchResult = dispatch(
            contentLibraryApi.util.updateQueryData(
              'getCollections',
              filter,
              (draft) => {
                const index = draft.findIndex(
                  (item) => item.id === id && item.type === type
                )
                if (index !== -1) {
                  draft.splice(index, 1)
                }
              }
            )
          )
          patches.push(patchResult)
        })

        try {
          await queryFulfilled
        } catch {
          // Revert optimistic updates on error
          patches.forEach((patch) => patch.undo())
        }
      },
    }),
  }),
})

export const {
  useGetAcademiesQuery,
  useGetCollectionsQuery,
  useDeleteCollectionMutation,
} = contentLibraryApi
