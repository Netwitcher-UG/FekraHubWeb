import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { fetchReportsByFilter } from 'src/store/apps/reports'
import { useSelector, useDispatch } from 'react-redux'
import useReportsColumns from 'src/views/reports/all-reports/hooks/useReportsColumns'
import { useRouter } from 'next/router'
import ReportsDataGrid from 'src/views/reports/all-reports/list/dataGrid'
const ReportsList = () => {
  //   const [value, setValue] = useState('')
  //   const [selectedCourse, setSelectedCourse] = useState(0)
  //   const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const store = useSelector(state => state.reports)
  const dispatch = useDispatch()
  const columns = useReportsColumns()

  //   const fetchDataWithPagination = (searchValue = '', courseValue) => {
  //     dispatch(
  //       fetchStudents({
  //         search: searchValue,
  //         course: courseValue
  //       })
  //     )
  //     dispatch(fetchCourses())
  //   }

  useEffect(() => {
    dispatch(fetchReportsByFilter({ improved: '' }))
  }, [dispatch])

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
          <ReportsDataGrid
            columns={columns}
            // handleRowClick={handleRowClick}
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

export default ReportsList
