import { useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useSelector, useDispatch } from 'react-redux'
import StudentsApprovalsDataGrid from 'src/views/students/approvals/list/Datagrid'
import { fetchStudentsApprovals } from 'src/store/apps/students'
import { fetchCourses } from 'src/store/apps/courses'

const StudentsList = () => {
  const dispatch = useDispatch()

  const store = useSelector(state => state.students)
  const courses = useSelector(state => state.courses.data)

  useEffect(() => {
    dispatch(fetchStudentsApprovals())
    dispatch(fetchCourses())
  }, [dispatch])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <StudentsApprovalsDataGrid store={store} courses={courses} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentsList
