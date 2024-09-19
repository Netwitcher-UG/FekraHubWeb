// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverview from './AboutOverivew'
import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'
import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'
import ConnectionsTeams from 'src/views/pages/user-profile/profile/ConnectionsTeams'

const ProfileTab = ({ data }) => {
  return data && Object.values(data).length ? (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverview about={data} />
      </Grid>
      {/* <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ActivityTimeline />
          </Grid>
          <ConnectionsTeams connections={data.connections} teams={data.teamsTech} />
          <Grid item xs={12}>
            <ProjectsTable />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  ) : null
}

export default ProfileTab
