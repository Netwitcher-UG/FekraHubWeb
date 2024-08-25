import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useSelector, useDispatch } from 'react-redux'
import StudentsAttendanceDataGrid from 'src/views/students-attendance/list/Datagrid'
import { fetchCourses } from 'src/store/apps/students'
import { fetchStudentsWithAttendance } from 'src/store/apps/attendance'
import { useRouter } from 'next/router'
// import Divider from '@mui/material/Divider'
const StudentsAttendanceList = () => {
  const [value, setValue] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const dispatch = useDispatch()
  const router = useRouter()
  const store = useSelector(state => state.attendance)
  const coursesData = useSelector(state => state.students.coursesData)

  const fetchDataWithPagination = (page, searchValue = '', courseValue) => {
    dispatch(
      fetchStudentsWithAttendance({
        search: searchValue,
        courseId: courseValue,
        PageSize: pageSize,
        PageNumber: page
      })
    )
    dispatch(fetchCourses())
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataWithPagination(currentPage, searchTerm, selectedCourse)
    }, 700)

    return () => clearTimeout(timer)
  }, [dispatch, currentPage, searchTerm, selectedCourse])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
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
