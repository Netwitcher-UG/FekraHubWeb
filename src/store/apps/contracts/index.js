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

export const fetchStudentContracts = createAsyncThunk('appContracts/fetchStudentContracts', async id => {
  try {
    const response = await axiosInstance.get(`/api/Student/GetContractsByStudent?studentId=${id}`)
    return response.data
  } catch (error) {
    return error.response
  }
})

export const getStudentContract = createAsyncThunk('appContracts/getStudentContract', async id => {
  try {
    const response = await axiosInstance.get(`/api/Student/DownloadContractFileForAdmin?contractId=${id}`)
    return response
  } catch (error) {
    return error.response
  }
})

export const acceptContract = createAsyncThunk('appContracts/acceptContract', async data => {
  try {
    const response = await axiosInstance.post('/api/Student/accept-contract', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
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
    contractFile: null,
    studentContracts: [],
    studentContractsLoading: false,
    acceptContractLoading: false
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

      .addCase(fetchStudentContracts.pending, state => {
        state.studentContractsLoading = true
      })
      .addCase(fetchStudentContracts.fulfilled, (state, action) => {
        state.studentContractsLoading = false
        state.studentContracts = action.payload
      })
      .addCase(fetchStudentContracts.rejected, state => {
        state.studentContractsLoading = false
      })

      .addCase(acceptContract.pending, state => {
        state.acceptContractLoading = true
      })
      .addCase(acceptContract.fulfilled, (state, action) => {
        state.acceptContractLoading = false
      })
      .addCase(acceptContract.rejected, state => {
        state.acceptContractLoading = false
      })
  }
})

export default appContractsSlice.reducer
