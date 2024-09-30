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
import { fetchReportsByFilter, fetchChildReports } from 'src/store/apps/reports'
import { fetchChildProfileInfo, fetchStudentProfileInfo } from 'src/store/apps/students'
import { fetchChildContracts, fetchStudentContracts } from 'src/store/apps/contracts'
import { fetchChildInvoices, fetchStudentInvoices } from 'src/store/apps/invoices'
import { fetchChildWorksheets, fetchStudentWorsheets } from 'src/store/apps/worksheets'
import { fetchStudentAttendance, fetchAttendanceStatuses, fetchChildAttendance } from 'src/store/apps/attendance'
import { useDispatch, useSelector } from 'react-redux'
import StudentReportsTab from './reports-list/reports-tab'
import StudentAttendanceTab from './attendance-list/attendance-tab'
import ContractsList from './contracts/contracts-list'
import InvoicesList from './invoices/invoices-list'
import ProfileTab from './profile'
import ProfileEditDrawer from './profile/edit-profile/edit-profile-drawer'
import WorksheetsList from './worksheets/worksheets-list'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const StudentProfile = ({ student, byParent = false }) => {
  const ability = useContext(AbilityContext)
  // ** State
  const [value, setValue] = useState('1')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const store = useSelector(state => state.reports)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)

  const { childProfileInfo, childProfileLoading, studentProfileInfo, studentProfileLoading } = useSelector(
    state => state.students
  )

  const { childContracts, childContractsLoading, studentContracts, studentContractsLoading } = useSelector(
    state => state.contracts
  )
  const { childInvoices, childInvoicesLoading, studentInvoices, studentInvoicesLoading } = useSelector(
    state => state.invoices
  )
  const { childWorksheets, childWorksheetLoading, studentWorksheets, studentWorksheetsLoading } = useSelector(
    state => state.worksheet
  )
  const { studentAttendance, childAttendance } = useSelector(state => state.attendance)

  useEffect(() => {
    if (!student) return
    if (byParent) {
      dispatch(fetchChildReports(student))
      dispatch(fetchChildProfileInfo(student))
      dispatch(fetchChildContracts(student))
      dispatch(fetchChildInvoices(student))
      dispatch(fetchChildWorksheets(student))
      dispatch(fetchChildAttendance(student))
    } else {
      ability.can('read', 'StudentReport') && dispatch(fetchReportsByFilter({ student: student, improved: true }))
      dispatch(fetchStudentProfileInfo(student))
      ability.can('manage', 'Invoices') && dispatch(fetchStudentInvoices(student))
      ability.can('read', 'Contract') && dispatch(fetchStudentContracts(student))
      ability.can('manage', 'File') && dispatch(fetchStudentWorsheets(student))
      ability.can('read', 'StudentAttendance') && dispatch(fetchStudentAttendance(student))
      ability.can('read', 'StudentAttendance') && dispatch(fetchAttendanceStatuses())
    }
  }, [student])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleEditDrawerClose = () => {
    setEditDrawerOpen(false)
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
          aria-label={t('full width tabs example')}
        >
          <Tab value='1' label={t('Profile info')} />
          {byParent ? (
            <Tab value='2' label={byParent ? t('Reports') : t('Reports')} />
          ) : ability.can('read', 'StudentReport') ? (
            <Tab value='2' label={byParent ? t('Reports') : t('Reports')} />
          ) : null}

          {byParent ? (
            <Tab value='3' label={byParent ? t('Contracts') : t('Contracts')} />
          ) : ability.can('read', 'Contract') ? (
            <Tab value='3' label={byParent ? t('Contracts') : t('Contracts')} />
          ) : null}

          {byParent ? (
            <Tab value='4' label={byParent ? t('Invoices') : t('Invoices')} />
          ) : ability.can('manage', 'Invoices') ? (
            <Tab value='4' label={byParent ? t('Invoices') : t('Invoices')} />
          ) : null}

          {byParent ? (
            <Tab value='5' label={byParent ? t('Course Files') : t('Course Files')} />
          ) : ability.can('manage', 'File') ? (
            <Tab value='5' label={byParent ? t('Course Files') : t('Course Files')} />
          ) : null}
          {byParent ? (
            <Tab value='6' label={byParent ? t('Attendance') : t('Attendance')} />
          ) : ability.can('read', 'StudentAttendance') ? (
            <Tab value='6' label={byParent ? t('Attendance') : t('Attendance')} />
          ) : null}
        </TabList>
        <TabPanel value='1'>
          {childProfileLoading || studentProfileLoading ? (
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
          ) : childProfileInfo?.id || studentProfileInfo?.id ? (
            <ProfileTab
              data={byParent ? childProfileInfo : studentProfileInfo}
              byParent={byParent}
              setValue={setValue}
              setEditDrawerOpen={setEditDrawerOpen}
            />
          ) : (
            <Grid item xs={12}>
              <Alert severity='error'>
                {t('No')} {byParent ? t('child') : t('student')} {t('with id')}: {student} ,{' '}
                {t('or Something went wrong.')}.
                <br />
                <br />
                <small>
                  {t('Please refresh and check if this')} {byParent ? t('child') : t('student')} {t('exists')}
                </small>
              </Alert>
            </Grid>
          )}
        </TabPanel>
        {byParent ? (
          <TabPanel value='2'>
            <StudentReportsTab store={store} byParent={byParent} />
          </TabPanel>
        ) : ability.can('read', 'StudentReport') ? (
          <TabPanel value='2'>
            <StudentReportsTab store={store} byParent={byParent} />
          </TabPanel>
        ) : null}

        {byParent ? (
          <TabPanel value='3'>
            <ContractsList
              byParent={byParent}
              contractsData={byParent ? childContracts : studentContracts}
              loading={byParent ? childContractsLoading : studentContractsLoading}
            />
          </TabPanel>
        ) : ability.can('manage', 'File') ? (
          <TabPanel value='3'>
            <ContractsList
              byParent={byParent}
              contractsData={byParent ? childContracts : studentContracts}
              loading={byParent ? childContractsLoading : studentContractsLoading}
            />
          </TabPanel>
        ) : null}

        {byParent ? (
          <TabPanel value='4'>
            <InvoicesList
              invoicesData={byParent ? childInvoices : studentInvoices}
              loading={byParent ? childInvoicesLoading : studentInvoicesLoading}
              byParent={byParent}
              student={student}
            />{' '}
          </TabPanel>
        ) : ability.can('manage', 'Invoices') ? (
          <TabPanel value='4'>
            <InvoicesList
              invoicesData={byParent ? childInvoices : studentInvoices}
              loading={byParent ? childInvoicesLoading : studentInvoicesLoading}
              byParent={byParent}
              student={student}
            />{' '}
          </TabPanel>
        ) : null}

        {byParent ? (
          <TabPanel value='5'>
            <WorksheetsList
              worksheetData={byParent ? childWorksheets : studentWorksheets}
              loading={byParent ? childWorksheetLoading : studentWorksheetsLoading}
              byParent={byParent}
            />
          </TabPanel>
        ) : ability.can('manage', 'File') ? (
          <TabPanel value='5'>
            <WorksheetsList
              worksheetData={byParent ? childWorksheets : studentWorksheets}
              loading={byParent ? childWorksheetLoading : studentWorksheetsLoading}
              byParent={byParent}
            />
          </TabPanel>
        ) : null}

        {byParent ? (
          <TabPanel value='6'>
            <StudentAttendanceTab store={byParent ? childAttendance : studentAttendance} studentId={student} />
          </TabPanel>
        ) : ability.can('read', 'StudentAttendance') ? (
          <TabPanel value='6'>
            <StudentAttendanceTab store={byParent ? childAttendance : studentAttendance} studentId={student} />
          </TabPanel>
        ) : null}
      </TabContext>

      <ProfileEditDrawer open={editDrawerOpen} handleCloseDrawer={handleEditDrawerClose} dataDef={childProfileInfo} />
    </>
  )
}

export default StudentProfile
