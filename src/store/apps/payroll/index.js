import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'
import { fetchEmployees } from '../users'

export const fetchMyPayroll = createAsyncThunk('appPayroll/fetchMyPayroll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/PayRolls/payroll-teacher')
    return response.data
  } catch (error) {
    ShowErrorToast('Error fetching payroll')
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const fetchEmployeesPayrollInfo = createAsyncThunk(
  'appPayroll/fetchEmployeesPayrollInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/UsersManagment/payroll-info?IsActive=true')
      return response.data
    } catch (error) {
      ShowErrorToast('Error fetching employees payroll info')
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

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
    studentInvoicesLoading: false,
    myPayroll: [],
    myPayrollLoading: false,
    employeesPayrollInfo: [],
    employeesPayrollInfoLoading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMyPayroll.pending, state => {
        state.myPayrollLoading = true
      })
      .addCase(fetchMyPayroll.fulfilled, (state, action) => {
        state.myPayrollLoading = false
        state.myPayroll = action.payload
      })
      .addCase(fetchMyPayroll.rejected, state => {
        state.myPayrollLoading = false
      })
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
      .addCase(fetchEmployeesPayrollInfo.pending, state => {
        state.employeesPayrollInfoLoading = true
      })
      .addCase(fetchEmployeesPayrollInfo.fulfilled, (state, action) => {
        state.employeesPayrollInfoLoading = false
        state.employeesPayrollInfo = action.payload
      })
      .addCase(fetchEmployeesPayrollInfo.rejected, state => {
        state.employeesPayrollInfoLoading = false
      })
  }
})

export default appPayrollSlice.reducer
