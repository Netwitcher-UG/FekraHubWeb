import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch Users
export const fetchChildInvoices = createAsyncThunk('appInvoices/fetchChildInvoices', async id => {
  try {
    const response = await axiosInstance.get(`/api/Invoice/GetInvoicesStudent?studentId=${id}`)
    return response.data
  } catch (error) {
    return error.response
  }
})

export const getChildInvoiceFile = createAsyncThunk('appInvoices/getChildInvoiceFile', async id => {
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
    invoiceFile: null
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
  }
})

export default appInvoicesSlice.reducer
