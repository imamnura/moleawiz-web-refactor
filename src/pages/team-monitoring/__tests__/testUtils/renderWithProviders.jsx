import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { createTestStore } from './store'
import { vi } from 'vitest'

/**
 * Custom render function that wraps component with Redux Provider and Router
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.preloadedState - Initial Redux state
 * @param {Object} options.store - Redux store instance
 * @param {Object} options.outletContext - Context value for useOutletContext
 * @returns {Object} - Render result with store
 */
export function renderWithProviders(ui, options = {}) {
  const {
    preloadedState = {},
    store = createTestStore(preloadedState),
    outletContext = null,
  } = options

  function Wrapper({ children }) {
    if (outletContext) {
      // Wrap with Route that provides outlet context
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route element={<OutletProvider context={outletContext} />}>
                <Route path="/" element={children} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      )
    }

    // Simple wrapper without outlet context
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) }
}

/**
 * Parent route component that provides outlet context
 */
function OutletProvider({ context }) {
  return <Outlet context={context} />
}

/**
 * Create mock outlet context for nested routes
 */
export function createMockOutletContext(overrides = {}) {
  return {
    setHomeTitle: vi.fn(),
    isMobile: false,
    ...overrides,
  }
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
