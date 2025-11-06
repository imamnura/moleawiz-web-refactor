import { createSlice } from '@reduxjs/toolkit'

/**
 * Onboarding Slice
 * Manages user onboarding state and last login platform
 */
const initialState = {
  lastLogin: null,
  showOnboarding: false,
}

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setLastLogin: (state, action) => {
      state.lastLogin = action.payload
    },
    setShowOnboarding: (state, action) => {
      state.showOnboarding = action.payload
    },
    resetOnboarding: (state) => {
      state.lastLogin = null
      state.showOnboarding = false
    },
  },
})

export const { setLastLogin, setShowOnboarding, resetOnboarding } =
  onboardingSlice.actions

export const selectLastLogin = (state) => state.onboarding?.lastLogin
export const selectShowOnboarding = (state) => state.onboarding?.showOnboarding

export default onboardingSlice.reducer
