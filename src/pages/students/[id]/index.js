// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import StudentProfile from 'src/views/students/student-profile/profileTabs'

const TabsFullWidth = () => {
  const [studentId, setStudentId] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) setStudentId(id)
  }, [id])

  return <StudentProfile student={studentId} />
}

export default TabsFullWidth
