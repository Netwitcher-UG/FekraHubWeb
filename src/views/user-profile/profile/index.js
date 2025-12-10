// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverview from './AboutOverivew'

const ProfileTab = ({ data }) => {
  return data && Object.values(data).length ? (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <AboutOverview about={data} />
      </Grid>
    </Grid>
  ) : null
}

export default ProfileTab
