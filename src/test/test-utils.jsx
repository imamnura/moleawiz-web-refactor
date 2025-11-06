/**
 * Test Utilities
 * Helper functions for testing React components
 */

import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { I18nextProvider } from 'react-i18next'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@store/slices/authSlice'
import homeReducer from '@store/slices/homeSlice'
import onboardingReducer from '@/redux/features/main/onboardingSlice'
import virtualAssistReducer from '@/redux/features/main/virtualAssistSlice'
import { baseApi } from '@services/api/baseApi'
import i18n from '../localize/i18n'

/**
 * Create a new query client for testing
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

/**
 * Create a mock store for testing
 */
export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      home: homeReducer,
      onboarding: onboardingReducer,
      virtualAssist: virtualAssistReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState: initialState,
  })
}

/**
 * Render component with all providers
 */
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <ConfigProvider>{children}</ConfigProvider>
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

/**
 * Render component with only Router
 */
export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
  })
}

// Re-export testing library utilities
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
