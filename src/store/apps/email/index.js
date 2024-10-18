// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'
import axiosInstance from 'src/lib/axiosInstance'


// ** Fetch Mails
export const fetchMails = createAsyncThunk('appEmail/fetchMails', async params => {
  const response = await axiosInstance.get('/api/MessageSender')

  return response.data
})

// ** Fetch Mails
export const fetchUsersMail = createAsyncThunk('appEmail/fetchUsersMail', async params => {
  const response = await axiosInstance.get('/api/UsersManagment/GetAllUsersWithRole')

  return response.data
})

// ** Get Current Mail
export const getCurrentMail = createAsyncThunk('appEmail/selectMail', async id => {
  const response = await axiosInstance.get('/api/MessageSender/UserMessages', {
    params: {
      id
    }
  })

  return response.data
})

// ** Update Mail
export const postMail = createAsyncThunk('appEmail/postMail', async (data, { dispatch, getState }) => {
  try {
    const response = await axiosInstance.post('/api/MessageSender/UserMessages', data,{
      headers:{
        'Content-Type':'multipart/form-data'
      }
    })
    await dispatch(fetchMails())

  ShowSuccessToast('Success')

  }catch(error){

    ShowErrorToast(error.response.data.title)
  }
  return response.data
})

// ** Update Mail Label
export const updateMailLabel = createAsyncThunk('appEmail/updateMailLabel', async (params, { dispatch, getState }) => {
  const response = await axiosInstance.post('/apps/email/update-emails-label', {
    data: { emailIds: params.emailIds, label: params.label }
  })
  await dispatch(fetchMails(getState().email.filter))
  if (Array.isArray(params.emailIds)) {
    await dispatch(getCurrentMail(params.emailIds[0]))
  }

  return response.data
})

// ** Prev/Next Mails
export const paginateMail = createAsyncThunk('appEmail/paginateMail', async params => {
  const response = await axiosInstance.get('/apps/email/paginate-email', { params })

  return response.data
})

export const appEmailSlice = createSlice({
  name: 'appEmail',
  initialState: {
    mails: null,
    mailMeta: null,
    filter: {
      q: '',
      label: '',
      folder: 'inbox'
    },
    currentMail: null,
    selectedMails: [],
    messages:[],
    users:[]
  },
  reducers: {
    handleSelectMail: (state, action) => {
      const mails = state.selectedMails
      if (!mails.includes(action.payload)) {
        mails.push(action.payload)
      } else {
        mails.splice(mails.indexOf(action.payload), 1)
      }
      state.selectedMails = mails
    },
    handleSelectAllMail: (state, action) => {
      const selectAllMails = []
      if (action.payload && state.mails !== null) {
        selectAllMails.length = 0

        // @ts-ignore
        state.mails.forEach(mail => selectAllMails.push(mail.id))
      } else {
        selectAllMails.length = 0
      }
      state.selectedMails = selectAllMails
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMails.fulfilled, (state, action) => {
      state.messages = action.payload
    })
    builder.addCase(fetchUsersMail.fulfilled, (state, action) => {
      state.users = action.payload
    })
    builder.addCase(getCurrentMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
    builder.addCase(paginateMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
  }
})

export const { handleSelectMail, handleSelectAllMail } = appEmailSlice.actions

export default appEmailSlice.reducer
