import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useSelector, useDispatch } from 'react-redux'
import StudentsDataGrid from 'src/views/students/list/Datagrid'
import { fetchStudents, fetchCourses } from 'src/store/apps/students'
import { useRouter } from 'next/router'
const StudentsList = () => {
  const [value, setValue] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20
  const dispatch = useDispatch()
  const router = useRouter()
  const store = useSelector(state => state.students)
  const handleRowClick = params => {
    router.push(`/students/${params.row.id}`)
  }

  const fetchDataWithPagination = (page, searchValue = '', courseValue) => {
    dispatch(
      fetchStudents({
        search: searchValue,
        course: courseValue,
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
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <StudentsDataGrid
            store={store}
            setValue={setValue}
            value={value}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleFilter={setSearchTerm}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            handleRowClick={handleRowClick}
            pageSize={pageSize}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentsList
