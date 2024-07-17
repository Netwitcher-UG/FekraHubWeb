import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useSelector, useDispatch } from 'react-redux'
import StudentsDataGrid from 'src/views/students/list/Datagrid'
import { fetchStudents, fetchCourses } from 'src/store/apps/students'
import useStudentsColumns from 'src/views/students/hooks/useStudentsColumns'

const StudentsList = () => {
  const [value, setValue] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const store = useSelector(state => state.students)

  const columns = useStudentsColumns()

  const fetchDataWithPagination = (searchValue = '', courseValue) => {
    dispatch(
      fetchStudents({
        search: searchValue,
        course: courseValue
      })
    )
    dispatch(fetchCourses())
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataWithPagination(searchTerm, selectedCourse)
    }, 700)

    return () => clearTimeout(timer)
  }, [dispatch, searchTerm, selectedCourse])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <StudentsDataGrid
            columns={columns}
            store={store}
            setValue={setValue}
            value={value}
            handleFilter={setSearchTerm}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentsList
