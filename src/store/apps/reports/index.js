import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

export const fetchReportsByFilter = createAsyncThunk('appReports/fetchReportsByFilter', async params => {
  const { student = '', reportId = '', improved = '' } = params
  try {
    const response = await axiosInstance.get(
      `/api/Reports/Filter?studentId=${student}&reportId=${reportId}&Improved=${improved}`
    )

    return response.data
  } catch (error) {
    return error.response
  }
})

export const fetchReportKeys = createAsyncThunk('appReports/fetchReportKeys', async () => {
  try {
    const response = await axiosInstance.get(`/api/Reports/Keys`)

    return response.data
  } catch (error) {
    return error.response
  }
})

export const acceptReport = createAsyncThunk('appReports/acceptReport', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/api/Reports/AcceptReport?reportId=${id}`)
    thunkAPI.dispatch(fetchReportsByFilter({ improved: '' }))
    return response
  } catch (error) {
    return error.response
  }
})

export const unAcceptReport = createAsyncThunk('appReports/unAcceptReport', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/api/Reports/UnAcceptReport?reportId=${id}`)
    thunkAPI.dispatch(fetchReportsByFilter({ improved: '' }))

    return response
  } catch (error) {
    return error.response
  }
})

export const addReport = createAsyncThunk('appReports/addReport', async data => {
  try {
    const response = await axiosInstance.post('/api/Reports', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error) {
    return error.response
  }
})

export const appReportsSlice = createSlice({
  name: 'appReports',
  initialState: {
    data: [],
    reportKeys: [],
    loading: false,
    acceptLoading: false,
    unAcceptLoading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetchReportsByFilter cases
      .addCase(fetchReportsByFilter.pending, state => {
        state.loading = true
      })
      .addCase(fetchReportsByFilter.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchReportsByFilter.rejected, state => {
        state.loading = false
      })
      // acceptReport cases
      .addCase(acceptReport.pending, state => {
        state.acceptLoading = true
      })
      .addCase(acceptReport.fulfilled, (state, action) => {
        state.acceptLoading = false
      })
      .addCase(acceptReport.rejected, state => {
        state.acceptLoading = false
      })
      // unAcceptReport cases
      .addCase(unAcceptReport.pending, state => {
        state.unAcceptLoading = true
      })
      .addCase(unAcceptReport.fulfilled, (state, action) => {
        state.unAcceptLoading = false
      })
      .addCase(unAcceptReport.rejected, state => {
        state.unAcceptLoading = false
      })
      .addCase(fetchReportKeys.fulfilled, (state, action) => {
        state.reportKeys = action.payload
      })
  }
})

export default appReportsSlice.reducer
