// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TabContext from '@mui/lab/TabContext'
import CircularProgress from '@mui/material/CircularProgress'
import { fetchTeacherProfileInfo, fetchTeacherPayroll } from 'src/store/apps/users'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTeacherAttendance, fetchAttendanceStatuses } from 'src/store/apps/attendance'
import TeacherAttendanceTab from './attendance-list/attendance-tab'
import TeacherPayrolltab from './payroll-list/payroll-tab'
import ProfileTab from './profile'
import { useTranslation } from 'react-i18next'

const TeacherProfile = ({ teacher }) => {
  // ** State
  const [value, setValue] = useState('1')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { teacherProfileInfo, teacherProfileLoading, teacherPayrollData, teacherPayrollLoading } = useSelector(
    state => state.users
  )
  const { teacherAttendance, teacherAttendanceLoading } = useSelector(state => state.attendance)
  useEffect(() => {
    if (!teacher) return
    dispatch(fetchTeacherProfileInfo(teacher))
    dispatch(fetchTeacherAttendance(teacher))
    dispatch(fetchTeacherPayroll(teacher))
    dispatch(fetchAttendanceStatuses())
  }, [teacher])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <TabContext value={value}>
        <TabList
          sx={{
            '& .MuiTab-root': {
              fontSize: {
                xs: '0.5rem',
                sm: '0.6rem',
                md: '0.75rem',
                lg: '0.82rem',
                xl: '1.2rem'
              }
            }
          }}
          variant='fullWidth'
          onChange={handleChange}
          aria-label={t('teacher profile tabs')}
        >
          <Tab value='1' label={t('Profile info')} />
          <Tab value='2' label={t('Teacher Attendance')} />
          <Tab value='3' label={t('Teacher Payroll Slips')} />
        </TabList>
        <TabPanel value='1'>
          {teacherProfileLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
              }}
            >
              <CircularProgress size={100} />
            </Box>
          ) : teacherProfileInfo?.teacher?.id ? (
            <ProfileTab data={teacherProfileInfo} setValue={setValue} />
          ) : (
            <Grid item xs={12}>
              <Alert severity='error'>
                {t('No')} {t('teacher')} {t('with id')}: {teacher} , {t('or Something went wrong.')}.
                <br />
                <br />
                <small>
                  {t('Please refresh and check if this')} {t('teacher')} {t('exists')}
                </small>
              </Alert>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value='2'>
          <TeacherAttendanceTab
            teacherAttendance={teacherAttendance}
            loading={teacherAttendanceLoading}
            teacher={teacher}
          />
        </TabPanel>

        <TabPanel value='3'>
          <TeacherPayrolltab
            teacherPayrollData={teacherPayrollData}
            loading={teacherPayrollLoading}
            teacher={teacher}
          />
        </TabPanel>
      </TabContext>
    </>
  )
}

export default TeacherProfile
