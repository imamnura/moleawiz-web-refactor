import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '../../../../services/api/baseApi'
import authReducer from '../../../../store/slices/authSlice'
import homeReducer from '../../../../store/slices/homeSlice'

/**
 * Create a test store for integration testing
 * This provides a real Redux store with RTK Query
 */
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      home: homeReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware),
    preloadedState,
    devTools: false,
  })
}

/**
 * Create a minimal store for simpler tests
 */
export function createMinimalStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware),
    devTools: false,
  })
}
