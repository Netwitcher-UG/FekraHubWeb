// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { fetchReportsByFilter, fetchChildReports } from 'src/store/apps/reports'
import { useDispatch, useSelector } from 'react-redux'
import StudentReportsTab from './reports-list/reports-tab'

const StudentProfile = ({ student, byParent = false }) => {
  // ** State
  const [value, setValue] = useState('1')
  const dispatch = useDispatch()
  const store = useSelector(state => state.reports)
  useEffect(() => {
    if (!student) return
    if (byParent) dispatch(fetchChildReports(student))
    else dispatch(fetchReportsByFilter({ student: student, improved: true }))
  }, [student])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
        <Tab value='1' label='Profile info' />
        <Tab value='2' label='Student reports' />
      </TabList>
      <TabPanel value='1'>
        <Typography>Profile</Typography>
      </TabPanel>
      <TabPanel value='2'>
        <StudentReportsTab store={store} byParent={byParent} />
      </TabPanel>
    </TabContext>
  )
}

export default StudentProfile
