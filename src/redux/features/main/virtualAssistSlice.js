import { createSlice } from '@reduxjs/toolkit'

/**
 * Virtual Assistant Slice
 * Manages virtual assistant chat visibility and configuration
 */
const initialState = {
  isShowChat: false,
  vaTitle: '',
}

const virtualAssistSlice = createSlice({
  name: 'virtualAssist',
  initialState,
  reducers: {
    setIsShowChat: (state, action) => {
      state.isShowChat = action.payload
    },
    setVATitle: (state, action) => {
      state.vaTitle = action.payload
    },
    resetVirtualAssist: (state) => {
      state.isShowChat = false
      state.vaTitle = ''
    },
  },
})

export const { setIsShowChat, setVATitle, resetVirtualAssist } =
  virtualAssistSlice.actions

export const selectIsShowChat = (state) => state.virtualAssist?.isShowChat
export const selectVATitle = (state) => state.virtualAssist?.vaTitle

export default virtualAssistSlice.reducer
