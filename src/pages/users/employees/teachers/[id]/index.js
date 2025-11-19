// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// ** MUI Imports
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
