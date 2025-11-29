// ** MUI Components
import Grid from '@mui/material/Grid'
import { useContext } from 'react'

// ** Demo Components
import AboutOverivew from './AboutOverivew'
import CoursesOverview from './CoursesOverview'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import courses from 'src/store/apps/courses'

const ProfileTab = ({ data, setValue, setEditDrawerOpen, byParent, role }) => {
  const ability = useContext(AbilityContext)

  return data && Object.values(data).length ? (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <AboutOverivew about={data.teacher} role={role} />
      </Grid>

      {data.courses.map((course, index) => (
        <Grid item xs={12} key={index}>
          <CoursesOverview about={course} count={index + 1} />
        </Grid>
      ))}
    </Grid>
  ) : null
}

export default ProfileTab
