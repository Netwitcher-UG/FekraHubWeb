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
import { useDispatch, useSelector } from 'react-redux'
import StudentReportsTab from './reports-list/reports-tab'
import ContractsList from './contracts/contracts-list'
import InvoicesList from './invoices/invoices-list'
import ProfileTab from './profile'
import ProfileEditDrawer from './profile/edit-profile/edit-profile-drawer'
import WorksheetsList from './worksheets/worksheets-list'
const StudentProfile = ({ student, byParent = false }) => {
  // ** State
  const [value, setValue] = useState('1')
  const dispatch = useDispatch()
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

  useEffect(() => {
    if (!student) return
    if (byParent) {
      dispatch(fetchChildReports(student))
      dispatch(fetchChildProfileInfo(student))
      dispatch(fetchChildContracts(student))
      dispatch(fetchChildInvoices(student))
      dispatch(fetchChildWorksheets(student))
    } else {
      dispatch(fetchReportsByFilter({ student: student, improved: true }))
      dispatch(fetchStudentProfileInfo(student))
      dispatch(fetchStudentInvoices(student))
      dispatch(fetchStudentContracts(student))
      dispatch(fetchStudentWorsheets(student))
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
        <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
          <Tab value='1' label='Profile info' />
          <Tab value='2' label={byParent ? 'Child Reports' : 'Student Reports'} />
          <Tab value='3' label={byParent ? 'Child Contracts' : 'Student Contracts'} />
          <Tab value='4' label={byParent ? 'Child Invoices' : 'Student Invoices'} />
          <Tab value='5' label={byParent ? 'Child Worksheets' : 'Student Worksheets'} />
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
                {' '}
                No {byParent ? 'child' : 'student'} with id: {student} , or Something went wrong.
                <br />
                <br />
                <small>Please refresh and check if this {byParent ? 'child' : 'student'} exists</small>
              </Alert>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value='2'>
          <StudentReportsTab store={store} byParent={byParent} />
        </TabPanel>
        <TabPanel value='3'>
          {' '}
          <ContractsList
            byParent={byParent}
            contractsData={byParent ? childContracts : studentContracts}
            loading={byParent ? childContractsLoading : studentContractsLoading}
          />{' '}
        </TabPanel>
        <TabPanel value='4'>
          {' '}
          <InvoicesList
            invoicesData={byParent ? childInvoices : studentInvoices}
            loading={byParent ? childInvoicesLoading : studentInvoicesLoading}
            byParent={byParent}
          />{' '}
        </TabPanel>
        <TabPanel value='5'>
          {' '}
          <WorksheetsList
            worksheetData={byParent ? childWorksheets : studentWorksheets}
            loading={byParent ? childWorksheetLoading : studentWorksheetsLoading}
            byParent={byParent}
          />{' '}
        </TabPanel>
      </TabContext>

      <ProfileEditDrawer open={editDrawerOpen} handleCloseDrawer={handleEditDrawerClose} dataDef={childProfileInfo} />
    </>
  )
}

export default StudentProfile
