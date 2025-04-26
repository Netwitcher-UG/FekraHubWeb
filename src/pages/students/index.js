import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useSelector, useDispatch } from 'react-redux'
import StudentsDataGrid from 'src/views/students/list/Datagrid'
import { fetchStudents, fetchCourses } from 'src/store/apps/students'
import { useRouter } from 'next/router'
import Divider from '@mui/material/Divider'
import StudentsPaginate from 'src/views/students/list/paginate'
const StudentsList = () => {
  const [value, setValue] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
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
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
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
          <Divider sx={{ m: '0 !important' }} />
          <StudentsPaginate
            totalPages={store?.data?.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentsList
