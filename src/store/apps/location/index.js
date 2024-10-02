import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'

import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch location
export const fetchLocation = createAsyncThunk('location/fetchLocations', async data => {
  const response = await axiosInstance.get(`/api/Locations?search=${data}`)

  return response.data
})

export const addLocation = createAsyncThunk('location/addLocation', async (data, { getState, dispatch }) => {
  try {
    const response = await axiosInstance.post(`/api/Locations`, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    })
    ShowSuccessToast('Success')
    dispatch(fetchLocation(''))

    return response.data
  } catch (errors) {
    ShowErrorToast('Error')
    return rejectWithValue(errors.response?.data || errors.message)
  }
})

export const editLocation = createAsyncThunk('location/editLocation', async (data, { getState, dispatch }) => {
  try {
    const response = await axiosInstance.put(`/api/Locations/${data.id}`, data.formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    ShowSuccessToast('Success')
    dispatch(fetchLocation(''))
    return response.data
  } catch (error) {}
})

export const deleteLocations = createAsyncThunk(
  'location/deleteLocations',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/api/Locations/${id}`, {})

      ShowSuccessToast('success')
      dispatch(fetchLocation(''))
    } catch (error) {
      console.log("🚀 ~ error:", error)
      ShowErrorToast('location has been assigned to course' )

      return rejectWithValue(error.response.data)
    }
  }
)

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
