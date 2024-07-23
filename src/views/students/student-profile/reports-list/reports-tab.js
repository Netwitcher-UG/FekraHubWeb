import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
// import { useSelector, useDispatch } from 'react-redux'
import useStudentReportsColumns from '../../hooks/useStudentReportsColumns'
import StudentReportsDataGrid from './dataGrid'
import { useRouter } from 'next/router'
const StudentReportsTab = ({ store }) => {
  // const [value, setValue] = useState('')
  // const [selectedCourse, setSelectedCourse] = useState(0)
  // const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const columns = useStudentReportsColumns()
  const handleRowClick = params => {
    const currentPath = window.location.pathname

    const newPath = `${currentPath}/report/${params.row.id}`

    router.push(newPath)
  }

  //   const fetchDataWithPagination = (searchValue = '', courseValue) => {
  //     dispatch(
  //       fetchStudents({
  //         search: searchValue,
  //         course: courseValue
  //       })
  //     )
  //     dispatch(fetchCourses())
  //   }

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       fetchDataWithPagination(searchTerm, selectedCourse)
  //     }, 700)

  //     return () => clearTimeout(timer)
  //   }, [dispatch, searchTerm, selectedCourse])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <StudentReportsDataGrid
            columns={columns}
            handleRowClick={handleRowClick}
            store={store}
            // setValue={setValue}
            // value={value}
            // handleFilter={setSearchTerm}
            // selectedCourse={selectedCourse}
            // setSelectedCourse={setSelectedCourse}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentReportsTab
