import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { fetchReportsByFilter, acceptAllReport } from 'src/store/apps/reports'
import { fetchCourses } from 'src/store/apps/students'
import { useSelector, useDispatch } from 'react-redux'
import useReportsColumns from 'src/views/reports/all-reports/hooks/useReportsColumns'
import ReportsDataGrid from 'src/views/reports/all-reports/list/dataGrid'
const ReportsList = () => {
  const [selectedCourse, setSelectedCourse] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20
  const store = useSelector(state => state.reports)
  const courses = useSelector(state => state.students.coursesData)
  const dispatch = useDispatch()
  const columns = useReportsColumns()

  const fetchDataWithPagination = (page, courseValue) => {
    dispatch(fetchReportsByFilter({ improved: '', courseId: courseValue, PageSize: pageSize, PageNumber: page }))
    dispatch(fetchCourses())
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataWithPagination(currentPage, selectedCourse)
    }, 700)

    return () => clearTimeout(timer)
  }, [dispatch, currentPage, selectedCourse])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ReportsDataGrid
            columns={columns}
            store={store}
            dispatch={dispatch}
            courses={courses}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            acceptAllReport={acceptAllReport}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReportsList
