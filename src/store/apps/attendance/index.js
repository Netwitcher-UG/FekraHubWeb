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

export const editStudentAttendance = createAsyncThunk(
  'appAttendance/editStudentAttendance',
  async ({ statusId, id, studentId }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/Attendance/Student?id=${id}&statusId=${statusId}`)
      thunkAPI.dispatch(fetchStudentAttendance(studentId))
      return response
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

export const fetchStudentAttendance = createAsyncThunk('appAttendance/fetchStudentAttendance', async id => {
  try {
    const response = await axiosInstance.get(`/api/Attendance/StudentAttendance/${id}`)
    return response?.data
  } catch (error) {
    return error.response
  }
})

export const fetchChildAttendance = createAsyncThunk('appAttendance/fetchChildAttendance', async id => {
  try {
    const response = await axiosInstance.get(`/api/Attendance/StudentAttendanceForParent/${id}`)
    return response?.data
  } catch (error) {
    return error.response
  }
})

export const deleteAttendanceRecord = createAsyncThunk(
  'appAttendance/deleteAttendanceRecord',
  async ({ id, studentId }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/Attendance/Student?id=${id}`)
      thunkAPI.dispatch(fetchStudentAttendance(studentId))
      return response
    } catch (error) {
      return error.response
    }
  }
)

export const addNewAttendanceRecord = createAsyncThunk(
  'appAttendance/addNewAttendanceRecord',
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/Attendance/newAttendanceForProfile', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      thunkAPI.dispatch(fetchStudentAttendance(data.studentId))
      return response
    } catch (error) {
      return error.response
    }
  }
)

// TEACHER ATTENDANCE

export const fetchTeacherAttendance = createAsyncThunk('appAttendance/fetchTeacherAttendance', async id => {
  try {
    const response = await axiosInstance.get(`/api/Attendance/TeacherAttendance/${id}`)
    return response?.data
  } catch (error) {
    return error.response
  }
})

export const fetchTeacherNames = createAsyncThunk('appAttendance/fetchTeacherNames', async () => {
  try {
    const response = await axiosInstance.get(`/api/Attendance/TeachersName`)
    return response?.data
  } catch (error) {
    return error.response
  }
})

export const addNewTeacherAttendanceRecord = createAsyncThunk(
  'appAttendance/addNewTeacherAttendanceRecord',
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/Attendance/Teacher', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      thunkAPI.dispatch(fetchTeacherAttendance(data.teacherId))
      return response
    } catch (error) {
      return error.response
    }
  }
)

export const editTeacherAttendance = createAsyncThunk(
  'appAttendance/editTeacherAttendance',
  async ({ statusId, id, teacherId }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/Attendance/Teacher?id=${id}&statusId=${statusId}`)
      thunkAPI.dispatch(fetchTeacherAttendance(teacherId))
      return response
    } catch (error) {
      return error.response
    }
  }
)

export const deleteTeacherAttendanceRecord = createAsyncThunk(
  'appAttendance/deleteTeacherAttendanceRecord',
  async ({ id, teacherId }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/Attendance/DeleteTeacherAttendance?id=${id}`)
      thunkAPI.dispatch(fetchTeacherAttendance(teacherId))
      return response
    } catch (error) {
      return error.response
    }
  }
)

export const fetchCourseAttendanceReport = createAsyncThunk(
  'appAttendance/fetchCourseAttendanceReport',
  async params => {
    try {
      let url = params ? `/api/Attendance/ExportAttendanceReport?${params}` : '/api/Attendance/ExportAttendanceReport'
      const response = await axiosInstance.get(url)
      return response.data
    } catch (error) {
      return error.response
    }
  }
)

export const fetchAttendanceMonths = createAsyncThunk('appAttendance/fetchAttendanceMonths', async courseId => {
  try {
    let url = `/api/Attendance/CourseWorkingDates?courseId=${courseId}`
    const response = await axiosInstance.get(url)
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
    submitLoading: false,
    studentAttendance: [],
    studentAttendanceLoading: false,
    editLoading: false,
    childAttendance: [],
    teacherAttendance: [],
    teacherAttendanceLoading: false,
    teacherNames: [],
    teacherNamesLoading: false,
    courseMonths: []
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

      .addCase(fetchStudentAttendance.pending, state => {
        state.studentAttendanceLoading = true
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.studentAttendanceLoading = false
        state.studentAttendance = action.payload
      })
      .addCase(fetchStudentAttendance.rejected, state => {
        state.studentAttendanceLoading = false
      })

      .addCase(editStudentAttendance.pending, state => {
        state.editLoading = true
      })
      .addCase(editStudentAttendance.fulfilled, state => {
        state.editLoading = false
      })
      .addCase(editStudentAttendance.rejected, state => {
        state.editLoading = false
      })

      .addCase(fetchChildAttendance.fulfilled, (state, action) => {
        state.childAttendance = action.payload
      })

      .addCase(fetchTeacherNames.pending, state => {
        state.teacherNamesLoading = true
      })
      .addCase(fetchTeacherNames.fulfilled, (state, action) => {
        state.teacherNamesLoading = false
        state.teacherNames = action.payload
      })
      .addCase(fetchTeacherNames.rejected, state => {
        state.teacherNamesLoading = false
      })

      .addCase(fetchTeacherAttendance.pending, state => {
        state.teacherAttendanceLoading = true
      })
      .addCase(fetchTeacherAttendance.fulfilled, (state, action) => {
        state.teacherAttendanceLoading = false
        state.teacherAttendance = action.payload
      })
      .addCase(fetchTeacherAttendance.rejected, state => {
        state.teacherAttendanceLoading = false
      })
      .addCase(fetchAttendanceMonths.fulfilled, (state, action) => {
        state.courseMonths = action.payload
      })
  }
})

export default appSliceAttendance.reducer
