// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// ** MUI Imports
// import Tab from '@mui/material/Tab'
// import TabList from '@mui/lab/TabList'
// import TabPanel from '@mui/lab/TabPanel'
// import TabContext from '@mui/lab/TabContext'
// import Typography from '@mui/material/Typography'
import TeacherProfile from 'src/views/teachers/profileTabs'

const TeacherProfileComponent = () => {
  const [teacherId, setTeacherId] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) setTeacherId(id)
  }, [id])

  return <TeacherProfile teacher={teacherId} />
}

export default TeacherProfileComponent
