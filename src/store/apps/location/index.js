import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch location
export const fetchLocation = createAsyncThunk('location/fetchLocations', async () => {
  const response = await axiosInstance.get('/api/Locations')

  return response.data
})

export const LocationSlice = createSlice({
  name: 'location',
  initialState: {
    data: [],
    loading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLocation.pending, state => {
        state.loading = true
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchLocation.rejected, state => {
        state.loading = false
      })
  }
})

export default LocationSlice.reducer
