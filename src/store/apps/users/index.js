import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch Users
export const fetchParents = createAsyncThunk('appUsers/fetchParents', async () => {
  const response = await axiosInstance.get('/api/UsersManagment/GetPerent')

  return response.data
})
export const fetchEmployees = createAsyncThunk('appUsers/fetchEmployees', async param => {
  const response = await axiosInstance.get(`/api/UsersManagment/GetEmployee?${param}`)

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

export const editEmployee = createAsyncThunk('appUsers/editEmployee', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/api/UsersManagment/userData/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    thunkAPI.dispatch(fetchEmployees())
    return response
  } catch (error) {
    return error.response
  }
})

export const uploadPaysilp = createAsyncThunk('appUsers/uploadPaysilp', async ({ data, teacherId }, { dispatch }) => {
  try {
    const response = await axiosInstance.post(`/api/PayRolls`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    dispatch(fetchTeacherPayroll(teacherId))
    return response
  } catch (error) {
    return error.response
  }
})

export const editParent = createAsyncThunk('appUsers/editParent', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/api/UsersManagment/parentData/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    thunkAPI.dispatch(fetchParents())
    return response
  } catch (error) {
    return error.response
  }
})

export const changeUserStatus = createAsyncThunk('appUsers/changeUserStatus', async (params, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/api/UsersManagment/DeactivateUser/${params}`)
    thunkAPI.dispatch(fetchEmployees())
    thunkAPI.dispatch(fetchParents())
    return response
  } catch (error) {
    return error.response
  }
})

export const fetchTeacherProfileInfo = createAsyncThunk('appUsers/fetchTeacherProfileInfo', async id => {
  try {
    const response = await axiosInstance.get(`/api/UsersManagment/TeacherProfile?id=${id}`)

    return response.data
  } catch (error) {
    return error.response
  }
})

export const fetchTeacherPayroll = createAsyncThunk('appUsers/fetchTeacherPayroll', async id => {
  try {
    const response = await axiosInstance.get(`/api/PayRolls/TeacherProfile?id=${id}`)

    return response.data
  } catch (error) {
    return error.response
  }
})

export const deleteteacherPayroll = createAsyncThunk(
  'appUsers/deleteteacherPayroll',
  async ({ id, teacherId }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/PayRolls/${id}`)
      thunkAPI.dispatch(fetchTeacherPayroll(teacherId))
      return response
    } catch (error) {
      return error.response
    }
  }
)

export const downloadTeacherPayrollslip = createAsyncThunk('appUsers/downloadTeacherPayrollslip', async id => {
  try {
    const response = await axiosInstance.get(`/api/PayRolls/DownloadPayrolls?id=${id}`)

    return response.data
  } catch (error) {
    return error.response
  }
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    employeesData: [],
    loading: false,
    teacherProfileInfo: [],
    teacherProfileLoading: false,
    teacherPayrollData: [],
    teacherPayrollLoading: false,
    payrollFileLoading: false
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
      //teacher cases :
      .addCase(fetchTeacherProfileInfo.pending, state => {
        state.teacherProfileLoading = true
      })
      .addCase(fetchTeacherProfileInfo.fulfilled, (state, action) => {
        state.teacherProfileLoading = false
        state.teacherProfileInfo = action.payload
      })
      .addCase(fetchTeacherProfileInfo.rejected, state => {
        state.teacherProfileLoading = false
      })

      .addCase(fetchTeacherPayroll.pending, state => {
        state.teacherPayrollLoading = true
      })
      .addCase(fetchTeacherPayroll.fulfilled, (state, action) => {
        state.teacherPayrollLoading = false
        state.teacherPayrollData = action.payload
      })
      .addCase(fetchTeacherPayroll.rejected, state => {
        state.teacherPayrollLoading = false
      })

      .addCase(downloadTeacherPayrollslip.pending, state => {
        state.payrollFileLoading = true
      })
      .addCase(downloadTeacherPayrollslip.fulfilled, (state, action) => {
        state.payrollFileLoading = false
      })
      .addCase(downloadTeacherPayrollslip.rejected, state => {
        state.payrollFileLoading = false
      })
  }
})

export default appUsersSlice.reducer
