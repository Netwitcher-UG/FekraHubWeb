// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
// import chat from 'src/store/apps/chat'
// import user from 'src/store/apps/user'
// import email from 'src/store/apps/email'
// import invoice from 'src/store/apps/invoice'
// import calendar from 'src/store/apps/calendar'
// import permissions from 'src/store/apps/permissions'
import users from 'src/store/apps/users'
import students from 'src/store/apps/students'

export const store = configureStore({
  reducer: {
    // user,
    // chat,
    // email,
    // invoice,
    // calendar,
    // permissions
    users,
    students
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})