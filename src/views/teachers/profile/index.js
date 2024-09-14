// ** MUI Components
import Grid from '@mui/material/Grid'
import { useContext } from 'react'

// ** Demo Components
import AboutOverivew from './AboutOverivew'
import CoursesOverview from './CoursesOverview'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import courses from 'src/store/apps/courses'

const ProfileTab = ({ data, setValue, setEditDrawerOpen, byParent }) => {
  const ability = useContext(AbilityContext)

  return data && Object.values(data).length ? (
    <Grid container spacing={6}>
      {/* {ability.can('read', 'ParentInfo') && data?.parent?.id && (
        <Grid item lg={4} md={5} xs={12}>
          <AboutOverivew
            about={data?.parent}
            setEditDrawerOpen={setEditDrawerOpen}
            parentCard={true}
            byParent={byParent}
          />
        </Grid>
      )} */}
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverivew about={data.teacher} />
      </Grid>

      {data.courses.map((course, index) => (
        <Grid item lg={4} md={5} xs={12} key={index}>
          <CoursesOverview about={course} count={index + 1} />
        </Grid>
      ))}

      {/* <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ActivityTimeline recent={data?.news} setValue={setValue} />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  ) : null
}

export default ProfileTab
