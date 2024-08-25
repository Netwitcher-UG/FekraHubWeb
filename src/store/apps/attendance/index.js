import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

export const fetchStudentsWithAttendance = createAsyncThunk(
  'appAttendance/fetchStudentsWithAttendance',
  async ({ courseId }) => {
    try {
      const response = await axiosInstance.get(`/api/Student/studentForAttendance?courseId=${courseId}`)
      return response?.data
    } catch (error) {
      return error.response
    }
  }
)

export const submitCourseAttendance = createAsyncThunk(
  'appAttendance/submitCourseAttendance',
  async ({ courseId, data }) => {
    try {
      const response = await axiosInstance.post(`/api/Attendance/Student?courseId=${courseId}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response
    } catch (error) {
      return error.response
    }
  }
)

export const fetchAttendanceStatuses = createAsyncThunk('appAttendance/fetchAttendanceStatuses', async () => {
  try {
    const response = await axiosInstance.get(`/api/Attendance/AttendanceStatus`)
    return response.data
  } catch (error) {
    return error.response
  }
})

export const appSliceAttendance = createSlice({
  name: 'appAttendance',
  initialState: {
    students: [],

    studentsLoading: false,
    attendanceStatuses: [],
    submitLoading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStudentsWithAttendance.pending, state => {
        state.studentsLoading = true
      })
      .addCase(fetchStudentsWithAttendance.fulfilled, (state, action) => {
        state.studentsLoading = false
        state.students = action.payload
      })
      .addCase(fetchStudentsWithAttendance.rejected, state => {
        state.studentsLoading = false
      })
      .addCase(fetchAttendanceStatuses.fulfilled, (state, action) => {
        state.attendanceStatuses = action.payload
      })
      .addCase(submitCourseAttendance.pending, state => {
        state.submitLoading = true
      })
      .addCase(submitCourseAttendance.fulfilled, (state, action) => {
        state.submitLoading = false
        state.students = action.payload
      })
      .addCase(submitCourseAttendance.rejected, state => {
        state.submitLoading = false
      })
  }
})

export default appSliceAttendance.reducer
