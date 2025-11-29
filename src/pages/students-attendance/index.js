import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useSelector, useDispatch } from 'react-redux'
import StudentsAttendanceDataGrid from 'src/views/students-attendance/list/Datagrid'
import { fetchCourses } from 'src/store/apps/students'
import { fetchStudentsWithAttendance } from 'src/store/apps/attendance'
const StudentsAttendanceList = () => {
  const [value, setValue] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const dispatch = useDispatch()
  const store = useSelector(state => state.attendance)
  const coursesData = useSelector(state => state.students.coursesData)

  const fetchDataWithPagination = (page, searchValue = '', courseValue) => {
    courseValue &&
      dispatch(
        fetchStudentsWithAttendance({
          search: searchValue,
          courseId: courseValue,
          PageSize: pageSize,
          PageNumber: page
        })
      )
    dispatch(fetchCourses('?IsAttendance=true'))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataWithPagination(currentPage, searchTerm, selectedCourse)
    }, 700)

    return () => clearTimeout(timer)
  }, [dispatch, currentPage, searchTerm, selectedCourse])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <StudentsAttendanceDataGrid
            store={store}
            setValue={setValue}
            value={value}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleFilter={setSearchTerm}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            coursesData={coursesData}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentsAttendanceList
