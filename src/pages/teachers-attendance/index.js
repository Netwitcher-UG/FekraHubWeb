import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useSelector, useDispatch } from 'react-redux'
import TeachersAttendanceDataGrid from 'src/views/teachers-attendance/list/DataGrid'
import { fetchTeacherAttendance, fetchTeacherNames, fetchAttendanceStatuses } from 'src/store/apps/attendance'
const TeachersAttendanceList = () => {
  const [value, setValue] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()
  const store = useSelector(state => state.attendance)
  const teacherNames = useSelector(state => state.attendance.teacherNames)

  const fetchDataWithPagination = (page, searchValue = '', teacherValue) => {
    dispatch(fetchTeacherNames())
    selectedTeacher && dispatch(fetchTeacherAttendance(teacherValue))
    dispatch(fetchAttendanceStatuses())
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataWithPagination(currentPage, searchTerm, selectedTeacher)
    }, 700)

    return () => clearTimeout(timer)
  }, [dispatch, currentPage, searchTerm, selectedTeacher])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TeachersAttendanceDataGrid
            store={store}
            setValue={setValue}
            value={value}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleFilter={setSearchTerm}
            selectedTeacher={selectedTeacher}
            setSelectedTeacher={setSelectedTeacher}
            teacherNames={teacherNames}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default TeachersAttendanceList
