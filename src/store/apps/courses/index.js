import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'
import axiosInstance from 'src/lib/axiosInstance'

// git Courses

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (data, { rejectWithValue }) => {
  try {
    // Build URL with optional search parameter
    let url = '/api/Courses'
    if (data && data.trim()) {
      url += `?search=${data}`
    }

    const response = await axiosInstance.get(url, {})

    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

//***************************************************************************************************************** */

// git Courses Room

export const fetchCoursesRoom = createAsyncThunk('courses/fetchCoursesRoom', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/Rooms', {})

    return response.data
  } catch (error) {
    ShowErrorToast(error.response?.data || error.message)
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const fetchCourseSchedule = createAsyncThunk('courses/fetchCourseSchedule', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/CourseSchedule', {})

    return response.data
  } catch (error) {
    ShowErrorToast(error.response?.data || error.message)
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const FetchCourseScheduleDaysOfWeek = createAsyncThunk(
  'courses/FetchCourseScheduleDaysOfWeek',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/CourseSchedule/daysOfWeek', {})

      return response.data
    } catch (error) {
      ShowErrorToast(error.response?.data || error.message)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const addRoom = createAsyncThunk('courses/addRoom', async (data, { getState, dispatch }) => {
  try {
    const response = await axiosInstance.post(`/api/Rooms`, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    })
    ShowSuccessToast('Success')
    dispatch(fetchCoursesRoom(''))

    return response.data
  } catch (errors) {
    ShowErrorToast('Error')
    return rejectWithValue(errors.response?.data || errors.message)
  }
})

export const editRoom = createAsyncThunk('courses/editRoom', async (data, { getState, dispatch }) => {
  try {
    const response = await axiosInstance.put(`/api/Rooms/${data.id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    ShowSuccessToast('Success')
    dispatch(fetchCoursesRoom(''))
    return response.data
  } catch (error) {}
})

export const deleteRoom = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/api/Rooms/${id}`, {})

      ShowSuccessToast('success')
      dispatch(fetchCoursesRoom(''))
    } catch (error) {
      ShowErrorToast(error.response.data)

      return rejectWithValue(error.response.data)
    }
  }
)

//***************************************************************************************************************** */

// git Teacher

export const fetchTeacher = createAsyncThunk('courses/fetchTeacher', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/UsersManagment/GetTeacher', {})

    return response.data
  } catch (error) {
    ShowErrorToast(error.response?.data || error.message)
    return rejectWithValue(error.response?.data || error.message)
  }
})

// ** Add Courses
export const addCourses = createAsyncThunk('courses/addCourses', async (data, { getState, dispatch }) => {
  try {
    const response = await axiosInstance.post(`/api/Courses`, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    ShowSuccessToast('Success')
    await dispatch(fetchCourses(''))
  } catch (errors) {
    console.log('🚀 ~ addCourses ~ errors:', errors)
    //ShowErrorToast(errors.response?.data || errors.message)
    ShowErrorToast(errors.response.data.title || errors.response.data)
  }
})

// ** Edit Courses
export const editCourses = createAsyncThunk('courses/editCourses', async (data, { getState, dispatch }) => {
  try {
    const response = await axiosInstance.put(`/api/Courses/${data.id}`, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    await dispatch(fetchCourses(''))
    ShowSuccessToast('Success')
  } catch (errors) {
    ShowErrorToast(errors.response?.data.title || errors.message)
    return rejectWithValue(errors.response?.data || errors.message)
  }
  return response.data
})

// delete Courses

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/api/Courses/${id}`, {})

      ShowSuccessToast('success')
      dispatch(fetchCourses(''))
    } catch (errors) {
      ShowErrorToast(errors.response?.data || errors.message)

      return rejectWithValue(errors.response.data)
    }
  }
)

const CoursesSlice = createSlice({
  name: 'courses',
  initialState: {
    data: [],
    dataRooms: [],
    DaysOfWeeks: [],
    dataTeacher: [],
    status: 'idle',
    roomsStatus: 'idle',
    CourseScheduleStatus: 'idel',
    TeacherStatus: 'idle',
    error: null,
    deleteStatus: 'idle',
    loading: false,
    CourseSchedule: [],
    deleteError: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCourses.pending, state => {
        state.status = 'loading'
        state.loading = true
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false

        state.data = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(FetchCourseScheduleDaysOfWeek.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.DaysOfWeeks = action.payload
      })
      .addCase(fetchCoursesRoom.pending, state => {
        state.roomsStatus = 'loading'
      })
      .addCase(fetchCoursesRoom.fulfilled, (state, action) => {
        state.roomsStatus = 'succeeded'
        state.dataRooms = action.payload
      })
      .addCase(fetchCourseSchedule.fulfilled, (state, action) => {
        state.CourseScheduleStatus = 'succeeded'
        state.CourseSchedule = action.payload
      })
      .addCase(fetchCoursesRoom.rejected, (state, action) => {
        state.roomsStatus = 'failed'
        state.error = action.payload
      })
      .addCase(fetchTeacher.pending, state => {
        state.roomsStatus = 'loading'
      })
      .addCase(fetchTeacher.fulfilled, (state, action) => {
        state.roomsStatus = 'succeeded'
        state.dataTeacher = action.payload
      })
      .addCase(fetchTeacher.rejected, (state, action) => {
        state.TeacherStatus = 'failed'
        state.error = action.payload
      })
      .addCase(deleteCourse.pending, state => {
        state.deleteStatus = 'loading'
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.deleteError = action.payload
      })
  }
})

export default CoursesSlice.reducer
