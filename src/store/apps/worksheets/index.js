import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'

import axiosInstance from 'src/lib/axiosInstance'
import { identifier } from 'stylis'

// ** Fetch hWorksheet
export const fetchWorksheet = createAsyncThunk('worksheet/fetchWorksheet', async data => {
  const response = await axiosInstance.get(`/api/Upload`)

  return response.data
})

export const addWorksheet = createAsyncThunk('worksheet/addWorksheet', async (data, { getState, dispatch }) => {
  try {
    const response = await axiosInstance.post(`/api/Upload`, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    })
    ShowSuccessToast('Success')
    dispatch(fetchWorksheet())

    return response.data
  } catch (errors) {
    ShowErrorToast('Error')
    return rejectWithValue(errors.response?.data || errors.message)
  }
})

export const editLocation = createAsyncThunk('location/editLocation', async (data, { getState, dispatch }) => {
  try {
    const response = await axiosInstance.put(`/api/Locations/${data.id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    ShowSuccessToast('Success')
    dispatch(fetchLocation(''))
    return response.data
  } catch (error) {}
})

export const deleteWorksheet = createAsyncThunk(
  'worksheet/deleteWorksheet',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/api/Upload/${id}`, {})

      ShowSuccessToast('success')
      dispatch(fetchWorksheet())
    } catch (error) {
      ShowErrorToast(error?.message)

      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchUploadType = createAsyncThunk('worksheet/fetchUploadType', async data => {
  const response = await axiosInstance.get(`/api/UploadType`)

  return response.data
})

export const DownloadUploadFile = createAsyncThunk('worksheet/DownloadUploadFile', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/Upload/DownloadUploadFile?Id=${id}`)
    return response.data
  } catch (error) {
    ShowErrorToast(error?.message)
    return rejectWithValue(error.response.data)
  }
})

export const fetchChildWorksheets = createAsyncThunk('worksheet/fetchChildWorksheets', async id => {
  try {
    const response = await axiosInstance.get(`/api/Upload/GetUploadForPerant?studentID=${id}`)
    return response.data
  } catch (error) {
    return error.response
  }
})

export const getChildWorksheetFile = createAsyncThunk('worksheet/getChildWorksheetFile', async id => {
  try {
    const response = await axiosInstance.get(`/api/Upload/FileForPernt?Id=${id}`)
    return response
  } catch (error) {
    return error.response
  }
})

export const fetchStudentWorsheets = createAsyncThunk('worksheet/fetchStudentWorsheets', async id => {
  try {
    const response = await axiosInstance.get(`/api/Upload?studentId=${id}`)

    return response.data
  } catch (error) {
    return error.response
  }
})

export const WorksheetsSlice = createSlice({
  name: 'worksheet',
  initialState: {
    data: [],
    dataUploadType: [],
    ShowFile: [],
    loading: false,
    status: 'idle',
    error: null,
    childWorksheets: [],
    childWorksheetsLoading: false,
    studentWorksheets: [],
    studentWorksheetsLoading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchWorksheet.pending, state => {
        state.loading = true
        state.status = 'loading'
      })
      .addCase(fetchWorksheet.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchWorksheet.rejected, (state, action) => {
        state.loading = false
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchUploadType.pending, state => {
        state.loading = true
      })
      .addCase(fetchUploadType.fulfilled, (state, action) => {
        state.loading = false
        state.dataUploadType = action.payload
      })
      .addCase(fetchUploadType.rejected, state => {
        state.loading = false
      })
      .addCase(DownloadUploadFile.pending, state => {
        state.loading = true
      })
      .addCase(DownloadUploadFile.fulfilled, (state, action) => {
        state.loading = false
        state.ShowFile = action.payload
      })
      .addCase(DownloadUploadFile.rejected, state => {
        state.loading = false
      })

      .addCase(fetchChildWorksheets.pending, state => {
        state.childWorksheetsLoading = true
      })
      .addCase(fetchChildWorksheets.fulfilled, (state, action) => {
        state.childWorksheetsLoading = false
        state.childWorksheets = action.payload
      })
      .addCase(fetchChildWorksheets.rejected, state => {
        state.childWorksheetsLoading = false
      })

      .addCase(fetchStudentWorsheets.pending, state => {
        state.studentWorksheetsLoading = true
      })
      .addCase(fetchStudentWorsheets.fulfilled, (state, action) => {
        state.studentWorksheetsLoading = false
        state.studentWorksheets = action.payload
      })
      .addCase(fetchStudentWorsheets.rejected, state => {
        state.studentWorksheetsLoading = false
      })
  }
})

export default WorksheetsSlice.reducer
