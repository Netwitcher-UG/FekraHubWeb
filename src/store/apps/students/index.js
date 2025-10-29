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
export const fetchCourses = createAsyncThunk('appStudents/fetchCourses', async params => {
  let url = params ? `/api/Courses/GetCoursesName${params}` : `/api/Courses/GetCoursesName`
  const response = await axiosInstance.get(url)

  return response.data
})

export const fetchAvailableCourses = createAsyncThunk('appStudents/fetchAvailableCourses', async () => {
  const response = await axiosInstance.get('/api/Student/CoursesCapacity')

  return response.data
})

export const addStudent = createAsyncThunk('appStudents/addStudent', async data => {
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

export const acceptContract = createAsyncThunk('appStudents/acceptContract', async data => {
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

export const fetchChildProfileInfo = createAsyncThunk('appStudents/fetchChildProfileInfo', async id => {
  try {
    const response = await axiosInstance.get(`/api/Student/GetStudentByParent/${id}`)

    return response.data
  } catch (error) {
    return error.response
  }
})

export const fetchStudentProfileInfo = createAsyncThunk('appStudents/fetchStudentProfileInfo', async id => {
  try {
    const response = await axiosInstance.get(`/api/Student/GetStudent/${id}`)

    return response.data
  } catch (error) {
    return error.response
  }
})

export const updateChildInfo = createAsyncThunk('appStudents/updateChildInfo', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/api/Student/UpdateSonDataFromProfile', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    thunkAPI.dispatch(fetchChildProfileInfo(data?.studentId))
    return response
  } catch (error) {
    return error.response
  }
})

export const updateStudentCourse = createAsyncThunk('appStudents/updateStudentCourse', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(
      '/api/Student/UpdateCourseStudent',
      {
        CourseId: data?.courseId,
        StudentId: data?.studentId
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    thunkAPI.dispatch(
      fetchStudents({
        search: data?.search || '',
        course: data?.course,
        PageNumber: data?.currentPage || 1,
        PageSize: data?.pageSize || 10
      })
    )
    return response
  } catch (error) {
    return error.response
  }
})

export const fetchPendingApprovals = createAsyncThunk('appStudents/fetchPendingApprovals', async () => {
  const response = await axiosInstance.get(`/api/Student/ByParent-Pending`)

  return response.data
})

export const fetchStudentsApprovals = createAsyncThunk('appStudents/fetchStudentsApprovals', async () => {
  const response = await axiosInstance.get(`/api/Student/pending-student`)

  return response.data
})

export const rejectStudent = createAsyncThunk('appStudents/rejectStudent', async data => {
  try {
    const response = await axiosInstance.post('/api/Student/reject-student', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error) {
    return error.response
  }
})

export const approveStudent = createAsyncThunk('appStudents/approveStudent', async data => {
  try {
    const response = await axiosInstance.post('/api/Student/accept-student', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error) {
    return error.response
  }
})

// Import students from Excel
export const importStudentsFromExcel = createAsyncThunk(
  'appStudents/importStudentsFromExcel',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axiosInstance.post('/api/ExcelMigration/UploadData', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response
    } catch (error) {
      return rejectWithValue(error.response || error)
    }
  }
)

// Download Excel template
export const downloadStudentsExcelTemplate = createAsyncThunk('appStudents/downloadStudentsExcelTemplate', async () => {
  try {
    const response = await axiosInstance.get('/api/ExcelMigration/download-excelFile', {
      responseType: 'blob'
    })
    return response
  } catch (error) {
    return error.response
  }
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
    childrenLoading: false,
    childProfileInfo: [],
    childProfileLoading: false,
    studentProfileInfo: [],
    studentProfileLoading: false,
    pendingApprovals: [],
    pendingApprovalsLoading: false,
    studentsApprovals: [],
    studentsApprovalsLoading: false,
    importFromExcelLoading: false,
    downloadTemplateLoading: false
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

      .addCase(fetchChildProfileInfo.pending, state => {
        state.childProfileLoading = true
      })
      .addCase(fetchChildProfileInfo.fulfilled, (state, action) => {
        state.childProfileLoading = false
        state.childProfileInfo = action.payload
      })
      .addCase(fetchChildProfileInfo.rejected, state => {
        state.childProfileLoading = false
      })

      .addCase(fetchStudentProfileInfo.pending, state => {
        state.studentProfileLoading = true
      })
      .addCase(fetchStudentProfileInfo.fulfilled, (state, action) => {
        state.studentProfileLoading = false
        state.studentProfileInfo = action.payload
      })
      .addCase(fetchStudentProfileInfo.rejected, state => {
        state.studentProfileLoading = false
      })
      .addCase(fetchPendingApprovals.pending, state => {
        state.pendingApprovalsLoading = true
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.pendingApprovalsLoading = false
        state.pendingApprovals = action.payload
      })
      .addCase(fetchPendingApprovals.rejected, state => {
        state.pendingApprovalsLoading = false
      })
      .addCase(fetchStudentsApprovals.pending, state => {
        state.studentsApprovalsLoading = true
      })
      .addCase(fetchStudentsApprovals.fulfilled, (state, action) => {
        state.studentsApprovalsLoading = false
        state.studentsApprovals = action.payload
      })
      .addCase(fetchStudentsApprovals.rejected, state => {
        state.studentsApprovalsLoading = false
      })
      .addCase(importStudentsFromExcel.pending, state => {
        state.importFromExcelLoading = true
      })
      .addCase(importStudentsFromExcel.fulfilled, state => {
        state.importFromExcelLoading = false
      })
      .addCase(importStudentsFromExcel.rejected, state => {
        state.importFromExcelLoading = false
      })
      .addCase(downloadStudentsExcelTemplate.pending, state => {
        state.downloadTemplateLoading = true
      })
      .addCase(downloadStudentsExcelTemplate.fulfilled, state => {
        state.downloadTemplateLoading = false
      })
      .addCase(downloadStudentsExcelTemplate.rejected, state => {
        state.downloadTemplateLoading = false
      })
  }
})

export default appStudentsSlice.reducer
