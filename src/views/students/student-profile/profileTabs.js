// ** React Imports
import { useEffect, useState, useContext } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TabPanel from '@mui/lab/TabPanel'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TabContext from '@mui/lab/TabContext'
import CircularProgress from '@mui/material/CircularProgress'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Store Actions
import { fetchReportsByFilter, fetchChildReports } from 'src/store/apps/reports'
import { fetchChildProfileInfo, fetchStudentProfileInfo } from 'src/store/apps/students'
import { fetchChildContracts, fetchStudentContracts } from 'src/store/apps/contracts'
import { fetchChildInvoices, fetchStudentInvoices } from 'src/store/apps/invoices'
import { fetchChildWorksheets, fetchStudentWorsheets } from 'src/store/apps/worksheets'
import { fetchStudentAttendance, fetchAttendanceStatuses, fetchChildAttendance } from 'src/store/apps/attendance'

// ** Components Imports
import StudentReportsTab from './reports-list/reports-tab'
import StudentAttendanceTab from './attendance-list/attendance-tab'
import ContractsList from './contracts/contracts-list'
import InvoicesList from './invoices/invoices-list'
import ProfileTab from './profile'
import ProfileEditDrawer from './profile/edit-profile/edit-profile-drawer'
import WorksheetsList from './worksheets/worksheets-list'

// ** Translation and ACL
import { useTranslation } from 'react-i18next'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const StudentProfile = ({ student, byParent = false }) => {
  const ability = useContext(AbilityContext)
  const [value, setValue] = useState('1')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const store = useSelector(state => state.reports)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)

  // ** Selectors for profile, contracts, invoices, worksheets, and attendance data
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

  // ** Fetching Data based on whether it's by parent or direct student
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

  // ** Handle Tab Change
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // ** Handle Closing of Edit Drawer
  const handleEditDrawerClose = () => {
    setEditDrawerOpen(false)
  }

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant='scrollable' // Enable horizontal scrolling
            scrollButtons='auto' // Display scroll buttons when necessary
            aria-label={t('full width tabs example')}
            sx={{
              '& .MuiTabs-flexContainer': {
                justifyContent: 'space-between' // Ensure even spacing between tabs
              },
              '& .MuiTab-root': {
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.75rem',
                  md: '0.85rem',
                  lg: '0.95rem',
                  xl: '1.2rem'
                },
                minWidth: '120px' // Ensure tabs are wide enough for scrolling
              }
            }}
          >
            <Tab value='1' label={t('Profile info')} />
            {byParent || ability.can('read', 'StudentReport') ? <Tab value='2' label={t('Reports')} /> : null}
            {byParent || ability.can('read', 'Contract') ? <Tab value='3' label={t('Contracts')} /> : null}
            {byParent || ability.can('manage', 'Invoices') ? <Tab value='4' label={t('Invoices')} /> : null}
            {byParent || ability.can('manage', 'File') ? <Tab value='5' label={t('Course Files')} /> : null}
            {byParent || ability.can('read', 'StudentAttendance') ? <Tab value='6' label={t('Attendance')} /> : null}
          </Tabs>
        </Box>

        <TabPanel value='1'>
          {childProfileLoading || studentProfileLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
                {t('or Something went wrong.')}.<br />
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
        ) : ability.can('read', 'Contract') ? (
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
            />
          </TabPanel>
        ) : ability.can('manage', 'Invoices') ? (
          <TabPanel value='4'>
            <InvoicesList
              invoicesData={byParent ? childInvoices : studentInvoices}
              loading={byParent ? childInvoicesLoading : studentInvoicesLoading}
              byParent={byParent}
              student={student}
            />
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
