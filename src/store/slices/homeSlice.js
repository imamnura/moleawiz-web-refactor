import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  journeyData: null,
  ongoingCourses: [],
  newPrograms: [],
  expiringPrograms: [],
  ongoingPrograms: [],
  upcomingEvents: [],
  bannerData: [],
  isLoading: false,
  error: null,
  layoutState: {
    isOneCol: null,
    isMobileVersion: false,
  },
  // Upcoming Events Modal State
  isOpenModalUE: false,
  eventDetailData: null,
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setJourneyData: (state, action) => {
      state.journeyData = action.payload
    },
    setOngoingCourses: (state, action) => {
      state.ongoingCourses = action.payload
    },
    setNewPrograms: (state, action) => {
      state.newPrograms = action.payload
    },
    setExpiringPrograms: (state, action) => {
      state.expiringPrograms = action.payload
    },
    setOngoingPrograms: (state, action) => {
      state.ongoingPrograms = action.payload
    },
    setUpcomingEvents: (state, action) => {
      state.upcomingEvents = action.payload
    },
    setBannerData: (state, action) => {
      state.bannerData = action.payload
    },
    setLayoutState: (state, action) => {
      state.layoutState = { ...state.layoutState, ...action.payload }
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
    setIsOpenModalUE: (state, action) => {
      state.isOpenModalUE = action.payload
    },
    setEventDetailData: (state, action) => {
      state.eventDetailData = action.payload
    },
    resetHome: () => initialState,
  },
})

export const {
  setJourneyData,
  setOngoingCourses,
  setNewPrograms,
  setExpiringPrograms,
  setOngoingPrograms,
  setUpcomingEvents,
  setBannerData,
  setLayoutState,
  setLoading,
  setError,
  clearError,
  setIsOpenModalUE,
  setEventDetailData,
  resetHome,
} = homeSlice.actions

export default homeSlice.reducer

// Selectors
export const selectJourneyData = (state) => state.home.journeyData
export const selectOngoingCourses = (state) => state.home.ongoingCourses
export const selectNewPrograms = (state) => state.home.newPrograms
export const selectExpiringPrograms = (state) => state.home.expiringPrograms
export const selectOngoingPrograms = (state) => state.home.ongoingPrograms
export const selectUpcomingEvents = (state) => state.home.upcomingEvents
export const selectBannerData = (state) => state.home.bannerData
export const selectLayoutState = (state) => state.home.layoutState
export const selectHomeLoading = (state) => state.home.isLoading
export const selectHomeError = (state) => state.home.error
