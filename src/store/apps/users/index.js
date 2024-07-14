import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch Users
export const fetchParents = createAsyncThunk('appUsers/fetchParents', async () => {
  const response = await axiosInstance.get('/api/UsersManagment/GetPerent')

  return response.data
})
export const fetchEmployees = createAsyncThunk('appUsers/fetchEmployees', async () => {
  const response = await axiosInstance.get('/api/UsersManagment/GetEmployee')

  return response.data
})
export const addEmployee = createAsyncThunk('appUsers/addEmployee', async data => {
  try {
    const response = await axiosInstance.post('/api/UsersManagment', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    return error.response
  }
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    employeesData: [],
    loading: false // Add loading state
    // total: 1,
    // params: {},
    // allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchParents.pending, state => {
        state.loading = true
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchParents.rejected, state => {
        state.loading = false
      })
      .addCase(fetchEmployees.pending, state => {
        state.loading = true
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.employeesData = action.payload
      })
      .addCase(fetchEmployees.rejected, state => {
        state.loading = false
      })
      .addCase(addEmployee.pending, state => {
        state.loading = true
      })
      .addCase(addEmployee.fulfilled, state => {
        state.loading = false
      })
      .addCase(addEmployee.rejected, state => {
        state.loading = false
      })
  }
})

export default appUsersSlice.reducer
