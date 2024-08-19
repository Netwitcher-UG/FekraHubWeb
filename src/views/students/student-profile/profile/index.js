// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverivew from './AboutOverivew'
import SchoolOverview from './SchoolOverview'
import ActivityTimeline from './ActivityTimeline'

const ProfileTab = ({ data, setValue, setEditDrawerOpen }) => {
  return data && Object.values(data).length ? (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverivew about={data} setEditDrawerOpen={setEditDrawerOpen} />
      </Grid>

      <Grid item lg={4} md={5} xs={12}>
        <SchoolOverview about={data} />
      </Grid>

      <Grid item lg={4} md={5} xs={12}>
        <SchoolOverview about={data} showOverView={true} />
      </Grid>

      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ActivityTimeline recent={data?.news} setValue={setValue} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : null
}

export default ProfileTab
