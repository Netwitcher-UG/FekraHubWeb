import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { fetchReportsByFilter, acceptAllReport } from 'src/store/apps/reports'
import { fetchCourses } from 'src/store/apps/students'
import { useSelector, useDispatch } from 'react-redux'
import useReportsColumns from 'src/views/reports/all-reports/hooks/useReportsColumns'
import { useRouter } from 'next/router'
import Divider from '@mui/material/Divider'
import ReportsPaginate from 'src/views/reports/all-reports/list/paginate'
import ReportsDataGrid from 'src/views/reports/all-reports/list/dataGrid'
const ReportsList = () => {
  //   const [value, setValue] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(0)
  //   const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const router = useRouter()
  const store = useSelector(state => state.reports)
  const courses = useSelector(state => state.students.coursesData)
  const dispatch = useDispatch()
  const columns = useReportsColumns()

  const fetchDataWithPagination = (
    page,
    // searchValue = '',
    courseValue
  ) => {
    dispatch(fetchReportsByFilter({ improved: '', courseId: courseValue, PageSize: pageSize, PageNumber: page }))
    dispatch(fetchCourses())
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataWithPagination(
        // searchTerm,
        currentPage,
        selectedCourse
      )
    }, 700)

    return () => clearTimeout(timer)
  }, [
    dispatch,
    currentPage,
    // searchTerm
    selectedCourse
  ])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <ReportsDataGrid
            columns={columns}
            // handleRowClick={handleRowClick}
            store={store}
            dispatch={dispatch}
            courses={courses}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            acceptAllReport={acceptAllReport}
            // setValue={setValue}
            // value={value}
            // handleFilter={setSearchTerm}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
          />
          <Divider sx={{ m: '0 !important' }} />
          <ReportsPaginate
            totalPages={store?.data?.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReportsList
