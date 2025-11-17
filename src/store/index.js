// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import email from 'src/store/apps/email'
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
import notifications from './apps/notifications'
import settings from './apps/settings'
export const store = configureStore({
  reducer: {
    users,
    students,
    notifications,
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
    account,
    settings
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
