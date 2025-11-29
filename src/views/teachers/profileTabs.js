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

const TeacherProfile = ({ teacher, role }) => {
  // ** State
  const [value, setValue] = useState('1')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { teacherProfileInfo, teacherProfileLoading, teacherPayrollData, teacherPayrollLoading } = useSelector(
    state => state.users
  )
  const { teacherAttendance, teacherAttendanceLoading } = useSelector(state => state.attendance)

  // Determine if this is a Secretariat role - use role from URL or fallback to teacherProfileInfo
  const userRole = role || teacherProfileInfo?.teacher?.roles
  const isSecretariat = userRole === 'Secretariat'
  useEffect(() => {
    if (!teacher) return
    dispatch(fetchTeacherProfileInfo(teacher))
    // Only fetch attendance if not Secretariat (check role prop first, then fallback to teacherProfileInfo)
    const currentRole = role || teacherProfileInfo?.teacher?.roles
    if (currentRole !== 'Secretariat') {
      dispatch(fetchTeacherAttendance(teacher))
      dispatch(fetchAttendanceStatuses())
    }
    dispatch(fetchTeacherPayroll(teacher))
  }, [teacher, role, teacherProfileInfo?.teacher?.roles, dispatch])

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
          {!isSecretariat && <Tab value='2' label={t('Teacher Attendance')} />}
          <Tab value='3' label={isSecretariat ? t('Secretary Payroll Slips') : t('Teacher Payroll Slips')} />
        </TabList>
        <TabPanel value='1' sx={{ px: 0 }}>
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
            <ProfileTab data={teacherProfileInfo} setValue={setValue} role={role} />
          ) : (
            <Grid item xs={12}>
              <Alert severity='error'>
                {t('No')} {isSecretariat ? t('secretary') : t('teacher')} {t('with id')}: {teacher} ,{' '}
                {t('or Something went wrong.')}.
                <br />
                <br />
                <small>
                  {t('Please refresh and check if this')} {isSecretariat ? t('secretary') : t('teacher')} {t('exists')}
                </small>
              </Alert>
            </Grid>
          )}
        </TabPanel>
        {!isSecretariat && (
          <TabPanel value='2' sx={{ px: 0 }}>
            <TeacherAttendanceTab
              teacherAttendance={teacherAttendance}
              loading={teacherAttendanceLoading}
              teacher={teacher}
            />
          </TabPanel>
        )}

        <TabPanel value='3' sx={{ px: 0 }}>
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
