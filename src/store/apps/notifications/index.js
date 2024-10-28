import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch Notifications
export const fetchData = createAsyncThunk('appNotifications/fetchData', async params => {
  const response = await axios.get('/apps/notifications/list', {
    params
  })

  return response.data
})

// ** Fetch Notifications
export const fetchNotifications = createAsyncThunk('appNotifications/fetchData', async params => {
  const response = await axiosInstance.get('/api/Notifications')

  return response.data
})
// ** Read Notification
export const ReadNotification = createAsyncThunk('appNotifications/ReadNotification', async (data, {  dispatch }) => {
  const response = await axiosInstance.patch(`/api/Notifications/NotificationsRead?${data}`)
  dispatch(fetchNotifications())

  return response.data
})
// ** Add User
export const addUser = createAsyncThunk('appNotifications/addUser', async (data, { getState, dispatch }) => {
  const response = await axios.post('/apps/notifications/add-user', {
    data
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

// ** Delete User
export const deleteUser = createAsyncThunk('appNotifications/deleteUser', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/apps/notifications/delete', {
    data: id
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

export const appNotificationsSlice = createSlice({
  name: 'appNotifications',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    Notifications:[],
    loading:false
  },
  reducers: {},
  extraReducers: builder => {

    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.Notifications = action.payload
      state.loading=false
    })
    builder.addCase(fetchNotifications.pending, (state, action) => {
      state.Notifications = action.payload
      state.loading=true
    })
  }
})

export default appNotificationsSlice.reducer
