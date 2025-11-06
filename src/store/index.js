import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@services/api/baseApi'
import authReducer from './slices/authSlice'
import homeReducer from './slices/homeSlice'
import onboardingReducer from '@/redux/features/main/onboardingSlice'
import virtualAssistReducer from '@/redux/features/main/virtualAssistSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    home: homeReducer,
    onboarding: onboardingReducer,
    virtualAssist: virtualAssistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
})

export default store
