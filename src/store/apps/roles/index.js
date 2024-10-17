import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

export const fetchSchoolRolesAndPermissions = createAsyncThunk('appRoles/fetchSchoolRolesAndPermissions', async () => {
  try {
    const response = await axiosInstance.get('/api/AuthorizationUsers/SchoolPermissions')
    return response.data
  } catch (error) {
    return error.response
  }
})

export const fetchAllPermissions = createAsyncThunk('appRoles/fetchAllPermissions', async () => {
  try {
    const response = await axiosInstance.get('/api/AuthorizationUsers/AllRolesAndPermissions')
    return response.data
  } catch (error) {
    return error.response
  }
})
export const fetchAllRole = createAsyncThunk('appRoles/fetchAllRole', async () => {
  try {
    const response = await axiosInstance.get('/api/UsersManagment/AllRoles')
    return response.data
  } catch (error) {
    return error.response
  }
})

export const assignPermissionToRole = createAsyncThunk('appUsers/assignPermissionToRole', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/AuthorizationUsers/AssignPermissionToRole', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    thunkAPI.dispatch(fetchSchoolRolesAndPermissions())
    thunkAPI.dispatch(fetchAllPermissions())
    return response
  } catch (error) {
    return error.response
  }
})

export const appRolesSlice = createSlice({
  name: 'appRoles',
  initialState: {
    schoolRolesAndPermissions: [],
    allPermissions: [],
    loading: false,
    assignLoading: false,
    roles:[]
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSchoolRolesAndPermissions.pending, state => {
        state.loading = true
      })
      .addCase(fetchSchoolRolesAndPermissions.fulfilled, (state, action) => {
        state.loading = false
        state.schoolRolesAndPermissions = action.payload
      })
      .addCase(fetchSchoolRolesAndPermissions.rejected, state => {
        state.loading = false
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.allPermissions = action.payload
      })
      .addCase(fetchAllRole.fulfilled, (state, action) => {
        state.loading = false
        state.roles = action.payload
      })
      .addCase(assignPermissionToRole.pending, state => {
        state.assignLoading = true
      })
      .addCase(assignPermissionToRole.fulfilled, (state, action) => {
        state.assignLoading = false
      })
      .addCase(assignPermissionToRole.rejected, state => {
        state.assignLoading = false
      })
  }
})

export default appRolesSlice.reducer
