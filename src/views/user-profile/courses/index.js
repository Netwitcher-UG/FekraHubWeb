// ** Next Import
import Grid from '@mui/material/Grid'

// ** Icon Imports

// ** Custom Components Imports
import CoursesOverview from '../CoursesOverview'
const Courses = ({ data }) => {
  return (
    <Grid container spacing={6}>
      {data?.map((course, index) => (
        <Grid item lg={4} md={5} xs={12} key={index}>
          <CoursesOverview about={course} count={index + 1} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Courses
