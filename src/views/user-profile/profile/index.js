// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverview from './AboutOverivew'

const ProfileTab = ({ data }) => {
  return data && Object.values(data).length ? (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverview about={data} />
      </Grid>
    </Grid>
  ) : null
}

export default ProfileTab
