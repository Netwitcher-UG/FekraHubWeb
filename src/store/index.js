// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
// import chat from 'src/store/apps/chat'
// import user from 'src/store/apps/user'
 import email from 'src/store/apps/email'
// import invoice from 'src/store/apps/invoice'
// import calendar from 'src/store/apps/calendar'
// import permissions from 'src/store/apps/permissions'
import users from 'src/store/apps/users'
import students from 'src/store/apps/students'
import courses from 'src/store/apps/courses'
import location from 'src/store/apps/location'
import reports from 'src/store/apps/reports'
import worksheet from 'src/store/apps/worksheets'
import roles from 'src/store/apps/roles'
import contracts from 'src/store/apps/contracts'
import invoices from 'src/store/apps/invoices'
import attendance from 'src/store/apps/attendance'
import calendar from './apps/calendar'
import account from './apps/account'
import payroll from './apps/payroll'
export const store = configureStore({
  reducer: {
    users,
    students,
    courses,
    location,
    reports,
    worksheet,
    roles,
    contracts,
    invoices,
    attendance,
    payroll,
    email,
    invoices,
    calendar,
    account
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
