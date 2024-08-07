import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

export const fetchStudents = createAsyncThunk('appStudents/fetchStudents', async params => {
  const { search, course = '', PageNumber = 1, PageSize = 10 } = params
  const response = await axiosInstance.get(
    `/api/Student?PageNumber=${PageNumber}&PageSize=${PageSize}&search=${search}&courseId=${course == 0 ? '' : course}`
  )

  // return response.data.students
  return {
    students: response?.data?.students,
    currentPage: response?.data?.currentPage,
    totalPages: response?.data?.totalPages
  }
})
export const fetchCourses = createAsyncThunk('appStudents/fetchCourses', async () => {
  const response = await axiosInstance.get('/api/Courses/GetCoursesName')

  return response.data
})

export const fetchAvailableCourses = createAsyncThunk('appStudents/fetchAvailableCourses', async () => {
  const response = await axiosInstance.get('/api/Student/CoursesCapacity')

  return response.data
})

export const addStudent = createAsyncThunk('appUsers/addStudent', async data => {
  try {
    const response = await axiosInstance.post('/api/Student', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    return error.response
  }
})

export const acceptContract = createAsyncThunk('appUsers/acceptContract', async data => {
  try {
    const response = await axiosInstance.post('/api/Student/AcceptedContract', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    return error.response
  }
})

export const fetchParentStudents = createAsyncThunk('appStudents/fetchParentStudents', async () => {
  const response = await axiosInstance.get(`/api/Student/ByParent`)

  return response.data
})

export const appStudentsSlice = createSlice({
  name: 'appStudents',
  initialState: {
    data: {
      students: [],
      currentPage: 1,
      totalPages: 1
    },
    coursesData: [],
    availableCourses: [],
    acceptContractLoading: false,
    parentStudents: [],
    childrenLoading: false
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
      .addCase(fetchAvailableCourses.fulfilled, (state, action) => {
        state.availableCourses = action.payload
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

      .addCase(fetchParentStudents.pending, state => {
        state.childrenLoading = true
      })
      .addCase(fetchParentStudents.fulfilled, (state, action) => {
        state.childrenLoading = false
        state.parentStudents = action.payload
      })
      .addCase(fetchParentStudents.rejected, state => {
        state.childrenLoading = false
      })
  }
})

export default appStudentsSlice.reducer
