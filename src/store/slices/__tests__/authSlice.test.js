/**
 * Auth Slice Tests
 * Unit tests for Redux auth slice
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import authReducer, {
  setCredentials,
  setUser,
  logout,
  setLoading,
  setError,
  clearError,
  selectCurrentUser,
  selectCurrentToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '@store/slices/authSlice'

// Mock storage utilities
vi.mock('@utils/storage', () => ({
  getAccessToken: vi.fn(() => null),
  setAccessToken: vi.fn(),
  setAccessTokenAuth0: vi.fn(),
  setFullname: vi.fn(),
  clearAuthStorage: vi.fn(),
  setEncryptedStorage: vi.fn(),
  getEncryptedStorage: vi.fn(() => null),
}))

describe('Auth Slice', () => {
  let initialState

  beforeEach(() => {
    initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  })

  describe('Reducers', () => {
    it('should return the initial state', () => {
      const state = authReducer(undefined, { type: 'unknown' })

      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle setCredentials', () => {
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' }
      const token = 'test-token'

      const state = authReducer(initialState, setCredentials({ user, token }))

      expect(state.user).toEqual(user)
      expect(state.token).toBe(token)
      expect(state.isAuthenticated).toBe(true)
    })

    it('should handle setCredentials with Auth0 flag', () => {
      const user = { id: 1, name: 'John Doe' }
      const token = 'auth0-token'

      const state = authReducer(
        initialState,
        setCredentials({ user, token, isAuth0: true })
      )

      expect(state.user).toEqual(user)
      expect(state.token).toBe(token)
      expect(state.isAuthenticated).toBe(true)
    })

    it('should handle setUser', () => {
      const user = { id: 1, name: 'Jane Doe', email: 'jane@example.com' }

      const state = authReducer(initialState, setUser(user))

      expect(state.user).toEqual(user)
    })

    it('should handle logout', () => {
      const authenticatedState = {
        user: { id: 1, name: 'John Doe' },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

      const state = authReducer(authenticatedState, logout())

      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should handle setLoading', () => {
      const state = authReducer(initialState, setLoading(true))

      expect(state.isLoading).toBe(true)

      const state2 = authReducer(state, setLoading(false))

      expect(state2.isLoading).toBe(false)
    })

    it('should handle setError', () => {
      const errorMessage = 'Login failed'

      const state = authReducer(initialState, setError(errorMessage))

      expect(state.error).toBe(errorMessage)
    })

    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      }

      const state = authReducer(stateWithError, clearError())

      expect(state.error).toBeNull()
    })
  })

  describe('Selectors', () => {
    const mockState = {
      auth: {
        user: { id: 1, name: 'Test User' },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: 'test error',
      },
    }

    it('should select current user', () => {
      const user = selectCurrentUser(mockState)

      expect(user).toEqual({ id: 1, name: 'Test User' })
    })

    it('should select current token', () => {
      const token = selectCurrentToken(mockState)

      expect(token).toBe('test-token')
    })

    it('should select isAuthenticated', () => {
      const isAuth = selectIsAuthenticated(mockState)

      expect(isAuth).toBe(true)
    })

    it('should select auth loading state', () => {
      const isLoading = selectAuthLoading(mockState)

      expect(isLoading).toBe(false)
    })

    it('should select auth error', () => {
      const error = selectAuthError(mockState)

      expect(error).toBe('test error')
    })
  })

  describe('State transitions', () => {
    it('should handle complete login flow', () => {
      // Start with initial state
      let state = initialState

      // Set loading
      state = authReducer(state, setLoading(true))
      expect(state.isLoading).toBe(true)

      // Set credentials (login success)
      const user = { id: 1, name: 'John Doe' }
      const token = 'success-token'
      state = authReducer(state, setCredentials({ user, token }))

      expect(state.user).toEqual(user)
      expect(state.token).toBe(token)
      expect(state.isAuthenticated).toBe(true)

      // Clear loading
      state = authReducer(state, setLoading(false))
      expect(state.isLoading).toBe(false)
    })

    it('should handle failed login flow', () => {
      let state = initialState

      // Set loading
      state = authReducer(state, setLoading(true))

      // Set error (login failed)
      const errorMessage = 'Invalid credentials'
      state = authReducer(state, setError(errorMessage))

      expect(state.error).toBe(errorMessage)
      expect(state.isAuthenticated).toBe(false)

      // Clear loading
      state = authReducer(state, setLoading(false))
      expect(state.isLoading).toBe(false)

      // Clear error
      state = authReducer(state, clearError())
      expect(state.error).toBeNull()
    })

    it('should handle logout after authenticated', () => {
      // Start authenticated
      let state = {
        user: { id: 1, name: 'John Doe' },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

      // Logout
      state = authReducer(state, logout())

      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })
})
