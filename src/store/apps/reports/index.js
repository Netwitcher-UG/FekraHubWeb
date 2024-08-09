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

export const exportReport = createAsyncThunk('appReports/exportReport', async id => {
  try {
    const response = await axiosInstance.get(`/api/Reports/ExportReport?reportId=${id}`)
    return response
  } catch (error) {
    return error.response
  }
})

export const updateReport = createAsyncThunk('appReports/updateReport', async (updatedData, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`/api/Reports/UpdateReport`, updatedData, {
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

export const fetchChildReports = createAsyncThunk('appReports/fetchChildReports', async student => {
  try {
    const response = await axiosInstance.get(`/api/Reports/GetReportsByStudent?studentId=${student}`)
    return response.data
  } catch (error) {
    return error.response
  }
})

export const fetchSingleChildReport = createAsyncThunk('appReports/fetchSingleChildReport', async id => {
  try {
    const response = await axiosInstance.get(`/api/Reports/GetOneReport/${id}`)
    return response.data
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
    unAcceptLoading: false,
    exportLoading: false,
    childReports: [],
    childReportsLoading: false
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
      // fetchReportKeys cases
      .addCase(fetchReportKeys.fulfilled, (state, action) => {
        state.reportKeys = action.payload
      })
      // exportReport cases
      .addCase(exportReport.pending, state => {
        state.exportLoading = true
      })
      .addCase(exportReport.fulfilled, (state, action) => {
        state.exportLoading = false
      })
      .addCase(exportReport.rejected, state => {
        state.exportLoading = false
      })
      .addCase(fetchChildReports.pending, state => {
        state.childReportsLoading = true
      })
      .addCase(fetchChildReports.fulfilled, (state, action) => {
        state.childReportsLoading = false
        state.childReports = action.payload
      })
      .addCase(fetchChildReports.rejected, state => {
        state.childReportsLoading = false
      })
  }
})

export default appReportsSlice.reducer
