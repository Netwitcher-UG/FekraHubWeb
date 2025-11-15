import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'
import { fetchEmployees } from '../users'

export const getPayrollTeacherFile = createAsyncThunk('appPayroll/getPayrollTeacher', async id => {
  try {
    const response = await axiosInstance.get(`/api/PayRolls/DownloadPayrolls?Id=${id}`)
    return response
  } catch (error) {
    return error.response
  }
})

export const deletePayroll = createAsyncThunk(
  'courses/deletePayroll',
  async (data, { getState, rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/api/PayRolls/${data.selectedId}`, {})

      ShowSuccessToast('success')
      dispatch(fetchEmployees('RoleName=Teacher&RoleName=Secretariat'))
    } catch (error) {
      ShowErrorToast('Error')

      return rejectWithValue(error.response.data)
    }
  }
)
export const AddPayrollFile = createAsyncThunk(
  'appPayroll/addPayrolls',
  async (data, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/PayRolls`, data, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      })
      ShowSuccessToast('Success')
      // Refetch employees data after successful upload
      dispatch(fetchEmployees('RoleName=Teacher&RoleName=Secretariat'))
      return response.data
    } catch (error) {
      ShowErrorToast(error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const appPayrollSlice = createSlice({
  name: 'appPayroll',
  initialState: {
    childPayroll: [],
    childPayrollLoading: false,
    invoiceFile: null,
    TeacherPayroll: [],
    studentPayrollLoading: false,
    studentInvoicesLoading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getPayrollTeacherFile.pending, state => {
        state.studentInvoicesLoading = true
      })
      .addCase(getPayrollTeacherFile.fulfilled, (state, action) => {
        state.studentInvoicesLoading = false
        state.TeacherPayroll = action.payload
      })
      .addCase(getPayrollTeacherFile.rejected, state => {
        state.studentInvoicesLoading = false
      })
  }
})

export default appPayrollSlice.reducer
