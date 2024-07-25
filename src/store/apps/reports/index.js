import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

export const fetchReportsByFilter = createAsyncThunk('appReports/fetchReportsByFilter', async params => {
  const { student = '', courseId = '', reportId = '', improved = '', PageNumber = 1, PageSize = 10 } = params
  try {
    const response = await axiosInstance.get(
      `/api/Reports/Filter?PageNumber=${PageNumber}&PageSize=${PageSize}&studentId=${student}&reportId=${reportId}&Improved=${improved}&courseId=${
        courseId == 0 ? '' : courseId
      }`
    )

    return {
      reports: response?.data?.data,
      currentPage: response?.data?.currentPage,
      totalPages: response?.data?.totalPages
    }
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

export const acceptAllReport = createAsyncThunk('appReports/acceptAllReport', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/api/Reports/AcceptAllReport`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
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
    data: {
      reports: [],
      currentPage: 1,
      totalPages: 1
    },
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
