import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

export const fetchStudents = createAsyncThunk('appStudents/fetchStudents', async params => {
  const { search, course = '' } = params
  const response = await axiosInstance.get(`/api/Student?search=${search}&courseId=${course == 0 ? '' : course}`)

  return response.data
})
export const fetchCourses = createAsyncThunk('appStudents/fetchCourses', async () => {
  const response = await axiosInstance.get('/api/Courses')

  return response.data
})

export const appStudentsSlice = createSlice({
  name: 'appStudents',
  initialState: {
    data: [],
    coursesData: [],
    loading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStudents.pending, state => {
        state.loading = true
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchStudents.rejected, state => {
        state.loading = false
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.coursesData = action.payload
      })
  }
})

export default appStudentsSlice.reducer
