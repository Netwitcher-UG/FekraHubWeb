import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch Users
export const fetchChildContracts = createAsyncThunk('appContracts/fetchChildContracts', async id => {
  try {
    const response = await axiosInstance.get(`/api/Student/SonContractsForParent?studentId=${id}`)
    return response.data
  } catch (error) {
    return error.response
  }
})

export const getContractFile = createAsyncThunk('appContracts/getContractFile', async id => {
  try {
    const response = await axiosInstance.get(`/api/Student/DownloadContractFile?contractId=${id}`)
    return response
  } catch (error) {
    return error.response
  }
})

export const appContractsSlice = createSlice({
  name: 'appContracts',
  initialState: {
    childContracts: [],
    childContractsLoading: false,
    contractFile: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchChildContracts.pending, state => {
        state.childContractsLoading = true
      })
      .addCase(fetchChildContracts.fulfilled, (state, action) => {
        state.childContractsLoading = false
        state.childContracts = action.payload
      })
      .addCase(fetchChildContracts.rejected, state => {
        state.childContractsLoading = false
      })

      .addCase(getContractFile.fulfilled, (state, action) => {
        state.contractFile = action.payload.data
      })
  }
})

export default appContractsSlice.reducer
