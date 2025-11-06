import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Import styles
import './styles/tailwind.css'

// Import i18n
import './localize/i18n'

// Import store, router, and query client
import { store } from '@store'
import { router } from '@router'
import { queryClient } from '@config/queryClient'
import { ErrorBoundary, GlobalLoading } from '@components/common'

// Ant Design theme configuration
const antTheme = {
  token: {
    colorPrimary: '#FF6B00',
    colorSuccess: '#00C48C',
    colorWarning: '#FFA940',
    colorError: '#DC2626',
    fontFamily: 'Roboto, sans-serif',
    borderRadius: 8,
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={antTheme}>
            <GlobalLoading />
            <RouterProvider router={router} />
          </ConfigProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
)
