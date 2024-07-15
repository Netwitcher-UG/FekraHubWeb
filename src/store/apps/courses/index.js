import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'

// git Courses

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://fekrahub.runasp.net/api/Courses', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        accept: 'text/plain'
      }
    })

    return response.data
  } catch (error) {
    ShowErrorToast(error.response?.data || error.message)
    return rejectWithValue(error.response?.data || error.message)
  }
})

// git Courses Room

export const fetchCoursesRoom = createAsyncThunk('courses/fetchCoursesRoom', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://fekrahub.runasp.net/api/Rooms', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        accept: 'text/plain'
      }
    })

    return response.data
  } catch (error) {
    ShowErrorToast(error.response?.data || error.message)
    return rejectWithValue(error.response?.data || error.message)
  }
})

// git Teacher

export const fetchTeacher = createAsyncThunk('courses/fetchTeacher', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://fekrahub.runasp.net/api/UsersManagment/GetTeacher', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        accept: 'text/plain'
      }
    })

    return response.data
  } catch (error) {
    ShowErrorToast(error.response?.data || error.message)
    return rejectWithValue(error.response?.data || error.message)
  }
})

// ** Add Courses
export const addCourses = createAsyncThunk('courses/addCourses', async (data, { getState, dispatch }) => {
  try {
    const response = await axios.post(`http://fekrahub.runasp.net/api/Courses`, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    ShowSuccessToast('Success')
    dispatch(fetchCourses())

    return response.data
  } catch (errors) {
    ShowErrorToast('Error')
    return rejectWithValue(errors.response?.data || errors.message)
  }
})

// ** Edit Courses
export const editCourses = createAsyncThunk('courses/editCourses', async (data, { getState, dispatch }) => {
  try {
    const response = await axios.put(`http://fekrahub.runasp.net/api/Courses/${data.id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    ShowSuccessToast('Success')
    dispatch(fetchCourses())
    return response.data
  } catch (error) {}
})

// delete Courses

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`http://fekrahub.runasp.net/api/Courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      ShowSuccessToast('success')
      dispatch(fetchCourses())
    } catch (error) {
      ShowErrorToast('Error')

      return rejectWithValue(error.response.data)
    }
  }
)

const CoursesSlice = createSlice({
  name: 'courses',
  initialState: {
    data: {},
    dataRooms: [],
    dataTeacher: [],
    status: 'idle',
    roomsStatus: 'idle',
    TeacherStatus: 'idle',
    error: null,
    deleteStatus: 'idle',
    deleteError: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCourses.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchCoursesRoom.pending, state => {
        state.roomsStatus = 'loading'
      })
      .addCase(fetchCoursesRoom.fulfilled, (state, action) => {
        state.roomsStatus = 'succeeded'
        state.dataRooms = action.payload
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
