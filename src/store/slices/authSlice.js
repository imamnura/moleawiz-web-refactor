import { createSlice } from '@reduxjs/toolkit'
import {
  getAccessToken,
  setAccessToken,
  setAccessTokenAuth0,
  setFullname,
  clearAuthStorage,
  setEncryptedStorage,
  getEncryptedStorage,
} from '@utils/storage'

const initialState = {
  user: getEncryptedStorage('user_data') || null,
  token: getAccessToken() || null,
  isAuthenticated: !!getAccessToken(),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, isAuth0 } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true

      // Store token (encrypted)
      if (token) {
        if (isAuth0) {
          setAccessTokenAuth0(token)
        } else {
          setAccessToken(token)
        }
      }

      // Store user data (encrypted)
      if (user) {
        setEncryptedStorage('user_data', user)
        if (user.name || user.fullname) {
          setFullname(user.name || user.fullname)
        }
      }
    },
    setUser: (state, action) => {
      state.user = action.payload
      if (action.payload) {
        setEncryptedStorage('user_data', action.payload)
        if (action.payload.name || action.payload.fullname) {
          setFullname(action.payload.name || action.payload.fullname)
        }
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      // Clear all auth-related storage
      clearAuthStorage()
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setCredentials,
  setUser,
  logout,
  setLoading,
  setError,
  clearError,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
