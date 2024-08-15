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
import { fetchChildProfileInfo } from 'src/store/apps/students'
import { fetchChildContracts } from 'src/store/apps/contracts'
import { fetchChildInvoices } from 'src/store/apps/invoices'
import { useDispatch, useSelector } from 'react-redux'
import StudentReportsTab from './reports-list/reports-tab'
import ContractsList from './contracts/contracts-list'
import InvoicesList from './invoices/invoices-list'
import ProfileTab from './profile'
const StudentProfile = ({ student, byParent = false }) => {
  // ** State
  const [value, setValue] = useState('1')
  const dispatch = useDispatch()
  const store = useSelector(state => state.reports)
  const childProfileInfo = useSelector(state => state.students.childProfileInfo)
  const childProfileLoading = useSelector(state => state.students.childProfileLoading)
  const { childContracts, childContractsLoading } = useSelector(state => state.contracts)
  const { childInvoices, childInvoicesLoading } = useSelector(state => state.invoices)

  useEffect(() => {
    if (!student) return
    if (byParent) {
      dispatch(fetchChildReports(student))
      dispatch(fetchChildProfileInfo(student))
      dispatch(fetchChildContracts(student))
      dispatch(fetchChildInvoices(student))
    } else dispatch(fetchReportsByFilter({ student: student, improved: true }))
  }, [student])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
        <Tab value='1' label='Profile info' />
        <Tab value='2' label={byParent ? 'Child Reports' : 'Student Reports'} />
        <Tab value='3' label={byParent ? 'Child Contracts' : 'Student Contracts'} />
        <Tab value='4' label={byParent ? 'Child Invoices' : 'Student Invoices'} />
      </TabList>
      <TabPanel value='1'>
        {childProfileLoading ? (
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
        ) : childProfileInfo?.id ? (
          <ProfileTab data={childProfileInfo} />
        ) : (
          <Grid item xs={12}>
            <Alert severity='error'>
              {' '}
              No child with id: {student} , or Something went wrong.
              <br />
              <br />
              <small>Please refresh and check if this child exists</small>
            </Alert>
          </Grid>
        )}
      </TabPanel>
      <TabPanel value='2'>
        <StudentReportsTab store={store} byParent={byParent} />
      </TabPanel>
      <TabPanel value='3'>
        {' '}
        <ContractsList contractsData={childContracts} loading={childContractsLoading} />{' '}
      </TabPanel>
      <TabPanel value='4'>
        {' '}
        <InvoicesList invoicesData={childInvoices} loading={childInvoicesLoading} />{' '}
      </TabPanel>
    </TabContext>
  )
}

export default StudentProfile
