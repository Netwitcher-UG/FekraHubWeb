import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

export const fetchUserProfileInfo = createAsyncThunk('appAccount/fetchUserProfileInfo', async () => {
  try {
    const response = await axiosInstance.get(`/api/UsersManagment/UserProfile`)

    return response.data
  } catch (error) {
    return error.response
  }
})

export const appAccountSlice = createSlice({
  name: 'appAccount',
  initialState: {
    userProfileInfo: [],
    userProfileLoading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfileInfo.pending, state => {
        state.userProfileLoading = true
      })
      .addCase(fetchUserProfileInfo.fulfilled, (state, action) => {
        state.userProfileLoading = false
        state.userProfileInfo = action.payload
      })
      .addCase(fetchUserProfileInfo.rejected, state => {
        state.userProfileLoading = false
      })
  }
})

export default appAccountSlice.reducer
