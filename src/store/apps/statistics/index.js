import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from 'src/lib/axiosInstance'

export const fetchStatisticsDashboard = createAsyncThunk('appStatistics/fetchDashboard', async () => {
  const response = await axiosInstance.get('/api/Statistics/Dashboard')

  return response.data
})

export const appStatisticsSlice = createSlice({
  name: 'appStatistics',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStatisticsDashboard.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStatisticsDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchStatisticsDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export default appStatisticsSlice.reducer
