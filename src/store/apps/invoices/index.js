import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch Users
export const fetchChildInvoices = createAsyncThunk('appInvoices/fetchChildInvoices', async id => {
  try {
    const response = await axiosInstance.get(`/api/Invoice/GetInvoicesStudentForPerant?studentId=${id}`)
    return response.data
  } catch (error) {
    return error.response
  }
})

export const getChildInvoiceFile = createAsyncThunk('appInvoices/getChildInvoiceFile', async id => {
  try {
    const response = await axiosInstance.get(`/api/Invoice/ReturnInvoiceForPerant?Id=${id}`)
    return response
  } catch (error) {
    return error.response
  }
})

export const fetchStudentInvoices = createAsyncThunk('appInvoices/fetchStudentInvoices', async id => {
  try {
    const response = await axiosInstance.get(`/api/Invoice/GetInvoicesStudent?studentId=${id}`)
    return response.data
  } catch (error) {
    return error.response
  }
})

export const getStudentInvoiceFile = createAsyncThunk('appInvoices/getStudentInvoiceFile', async id => {
  try {
    const response = await axiosInstance.get(`/api/Invoice/ReturnInvoice?Id=${id}`)
    return response
  } catch (error) {
    return error.response
  }
})

export const appInvoicesSlice = createSlice({
  name: 'appInvoices',
  initialState: {
    childInvoices: [],
    childInvoicesLoading: false,
    invoiceFile: null,
    studentInvoices: [],
    studentInvoicesLoading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchChildInvoices.pending, state => {
        state.childInvoicesLoading = true
      })
      .addCase(fetchChildInvoices.fulfilled, (state, action) => {
        state.childInvoicesLoading = false
        state.childInvoices = action.payload
      })
      .addCase(fetchChildInvoices.rejected, state => {
        state.childInvoicesLoading = false
      })

      .addCase(getChildInvoiceFile.fulfilled, (state, action) => {
        state.invoiceFile = action.payload.data
      })

      .addCase(fetchStudentInvoices.pending, state => {
        state.studentInvoicesLoading = true
      })
      .addCase(fetchStudentInvoices.fulfilled, (state, action) => {
        state.studentInvoicesLoading = false
        state.studentInvoices = action.payload
      })
      .addCase(fetchStudentInvoices.rejected, state => {
        state.studentInvoicesLoading = false
      })
  }
})

export default appInvoicesSlice.reducer
