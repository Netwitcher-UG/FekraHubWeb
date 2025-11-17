import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'
import i18n from 'src/configs/i18n'

// ** Axios Imports
import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch School Info Basic
export const fetchSchoolInfoBasic = createAsyncThunk('appSettings/fetchSchoolInfoBasic', async () => {
  try {
    const response = await axiosInstance.get(`/api/SchoolInfo/SchoolInfoBasic`)

    return response.data
  } catch (error) {
    return error.response
  }
})

// ** Fetch School Info Email Sender
export const fetchSchoolInfoEmailSender = createAsyncThunk('appSettings/fetchSchoolInfoEmailSender', async () => {
  try {
    const response = await axiosInstance.get(`/api/SchoolInfo/SchoolInfoEmailSender`)

    return response.data
  } catch (error) {
    return error.response
  }
})

// ** Fetch School Info Report Keys
export const fetchSchoolInfoReportKeys = createAsyncThunk('appSettings/fetchSchoolInfoReportKeys', async () => {
  try {
    const response = await axiosInstance.get(`/api/SchoolInfo/GetSchoolInfoReportKeys`)

    return response.data
  } catch (error) {
    return error.response
  }
})

// ** Update School Info Basic
export const updateSchoolInfoBasic = createAsyncThunk(
  'appSettings/updateSchoolInfoBasic',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('SchoolName', data.schoolName)
      formData.append('SchoolOwner', data.schoolOwner)
      formData.append('FacebookLink', data.facebook || '')
      formData.append('InstagramLink', data.instagram || '')
      formData.append('PrivacyPolicyLink', data.privacyPolicy || '')

      // Only append logo if a file is provided
      if (data.logoFile) {
        formData.append('Logo', data.logoFile)
      }

      const response = await axiosInstance.post(`/api/SchoolInfo/SchoolInfo_Basic`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      ShowSuccessToast(i18n.t('Basic info updated successfully'))
      dispatch(fetchSchoolInfoBasic())

      return response.data
    } catch (error) {
      ShowErrorToast(error.response?.data || i18n.t('Failed to update basic info'))
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ** Update School Info Email Sender
export const updateSchoolInfoEmailSender = createAsyncThunk(
  'appSettings/updateSchoolInfoEmailSender',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('EmailServer', data.emailServer)
      formData.append('EmailPortNumber', data.emailPortNumber)
      formData.append('FromEmail', data.fromEmail)
      formData.append('Password', data.password)

      const response = await axiosInstance.post(`/api/SchoolInfo/SchoolInfo_EmailSender`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      ShowSuccessToast(i18n.t('Email settings updated successfully'))
      dispatch(fetchSchoolInfoEmailSender())

      return response.data
    } catch (error) {
      ShowErrorToast(error.response?.data || i18n.t('Failed to update email settings'))
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ** Update School Info Report Keys
export const updateSchoolInfoReportKeys = createAsyncThunk(
  'appSettings/updateSchoolInfoReportKeys',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData()

      // Append each report key to the array
      data.reportKeys.forEach((key, index) => {
        formData.append(`StudentsReportsKeys[${index}]`, key)
      })

      const response = await axiosInstance.post(`/api/SchoolInfo/SchoolInfo_ReportKeys`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      ShowSuccessToast(i18n.t('Report keys updated successfully'))
      dispatch(fetchSchoolInfoReportKeys())

      return response.data
    } catch (error) {
      ShowErrorToast(error.response?.data || i18n.t('Failed to update report keys'))
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState: {
    schoolInfoBasic: [],
    schoolInfoBasicLoading: false,
    schoolInfoBasicUpdating: false,
    schoolInfoEmailSender: [],
    schoolInfoEmailSenderLoading: false,
    schoolInfoEmailSenderUpdating: false,
    schoolInfoReportKeys: [],
    schoolInfoReportKeysLoading: false,
    schoolInfoReportKeysUpdating: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSchoolInfoBasic.pending, state => {
        state.schoolInfoBasicLoading = true
      })
      .addCase(fetchSchoolInfoBasic.fulfilled, (state, action) => {
        state.schoolInfoBasicLoading = false
        state.schoolInfoBasic = action.payload
      })
      .addCase(fetchSchoolInfoBasic.rejected, state => {
        state.schoolInfoBasicLoading = false
      })
      .addCase(fetchSchoolInfoEmailSender.pending, state => {
        state.schoolInfoEmailSenderLoading = true
      })
      .addCase(fetchSchoolInfoEmailSender.fulfilled, (state, action) => {
        state.schoolInfoEmailSenderLoading = false
        state.schoolInfoEmailSender = action.payload
      })
      .addCase(fetchSchoolInfoEmailSender.rejected, state => {
        state.schoolInfoEmailSenderLoading = false
      })
      .addCase(fetchSchoolInfoReportKeys.pending, state => {
        state.schoolInfoReportKeysLoading = true
      })
      .addCase(fetchSchoolInfoReportKeys.fulfilled, (state, action) => {
        state.schoolInfoReportKeysLoading = false
        state.schoolInfoReportKeys = action.payload
      })
      .addCase(fetchSchoolInfoReportKeys.rejected, state => {
        state.schoolInfoReportKeysLoading = false
      })
      .addCase(updateSchoolInfoBasic.pending, state => {
        state.schoolInfoBasicUpdating = true
      })
      .addCase(updateSchoolInfoBasic.fulfilled, state => {
        state.schoolInfoBasicUpdating = false
      })
      .addCase(updateSchoolInfoBasic.rejected, state => {
        state.schoolInfoBasicUpdating = false
      })
      .addCase(updateSchoolInfoEmailSender.pending, state => {
        state.schoolInfoEmailSenderUpdating = true
      })
      .addCase(updateSchoolInfoEmailSender.fulfilled, state => {
        state.schoolInfoEmailSenderUpdating = false
      })
      .addCase(updateSchoolInfoEmailSender.rejected, state => {
        state.schoolInfoEmailSenderUpdating = false
      })
      .addCase(updateSchoolInfoReportKeys.pending, state => {
        state.schoolInfoReportKeysUpdating = true
      })
      .addCase(updateSchoolInfoReportKeys.fulfilled, state => {
        state.schoolInfoReportKeysUpdating = false
      })
      .addCase(updateSchoolInfoReportKeys.rejected, state => {
        state.schoolInfoReportKeysUpdating = false
      })
  }
})

export default appSettingsSlice.reducer
