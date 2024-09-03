// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { ShowErrorToast } from 'src/@core/utils/showErrorToast'
import { ShowSuccessToast } from 'src/@core/utils/ShowSuccesToast'
import axiosInstance from 'src/lib/axiosInstance'

// ** Fetch Events
export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async (selectedCalendars, { getState }) => {
  try {
    const queryString = selectedCalendars?.map(id => `courseId=${id}`).join('&');

    // Use the query string directly in the URL
    const response = await axiosInstance.get(`/api/events?${queryString}`);

    return response.data
  } catch (error) {
    ShowErrorToast(error.response.data)
    throw error
  }
})


export const fetchEventsTypes = createAsyncThunk('appCalendar/fetchEventsTypes', async _ => {
  const response = await axiosInstance.get('/api/EventType', {

  })

  return response.data
})
// ** Add Event
export const addEvent = createAsyncThunk('appCalendar/addEvent', async (event, { dispatch }) => {
  try {
 const response = await axiosInstance.post('/api/events',
    event, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }

  )
  await dispatch(fetchEvents())
ShowSuccessToast('Added Event Successfully')
  }catch(error){
  console.log("🚀 ~ addEvent ~ error:", error)
ShowErrorToast(error.response.data)
  }

  return response.data.event
})

// ** Update Event
export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async (event, { dispatch }) => {
  try{
    const response = await axiosInstance.put(`/api/events/${event.id}`,    event, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    })
    await dispatch(fetchEvents())
  ShowSuccessToast('Updated Event Successfully')


  }catch(error)
  {
    ShowErrorToast(error.response.data)
  }

  return response.data.event
})

// ** Delete Event
export const deleteEvent = createAsyncThunk('appCalendar/deleteEvent', async (id, { dispatch }) => {
  try{
    const response = await axiosInstance.delete(`/api/events/${id}`, {
    })
    await dispatch(fetchEvents())
  ShowSuccessToast('Delete Event Successfully')
  }catch(error)
  {
ShowErrorToast(error.response.data)
  }

  return response.data
})

export const appCalendarSlice = createSlice({
  name: 'appCalendar',
  initialState: {
    events: [],
    types:[],
    selectedEvent: null,
    selectedCalendars: []
  },
  reducers: {
    handleSelectEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    handleCalendarsUpdate: (state, action) => {
      const filterIndex = state.selectedCalendars.findIndex(i => i === action.payload)
      if (state.selectedCalendars.includes(action.payload)) {
        state.selectedCalendars.splice(filterIndex, 1)
      } else {
        state.selectedCalendars.push(action.payload)
      }
      if (state.selectedCalendars.length === 0) {
        state.events.length = 0
      }
    },

    handleAllCalendars: (state, action) => {
      const value = action.payload
      if (value === true) {
        state.selectedCalendars = []
      } else {
        state.selectedCalendars = []
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.events = action.payload
    })
    builder.addCase(fetchEventsTypes.fulfilled, (state, action) => {
      state.types = action.payload
    })
  }
})

export const { handleSelectEvent, handleCalendarsUpdate, handleAllCalendars } = appCalendarSlice.actions

export default appCalendarSlice.reducer
