// ** MUI Components
import Grid from '@mui/material/Grid'
import { useContext } from 'react'

// ** Demo Components
import AboutOverivew from './AboutOverivew'
import SchoolOverview from './SchoolOverview'
import ActivityTimeline from './ActivityTimeline'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const ProfileTab = ({ data, setValue, setEditDrawerOpen, byParent }) => {
  const ability = useContext(AbilityContext)

  return data && Object.values(data).length ? (
    <Grid container spacing={4}>
      {ability.can('read', 'ParentInfo') && data?.parent?.id && (
        <Grid item xs={12}>
          <AboutOverivew
            about={data?.parent}
            setEditDrawerOpen={setEditDrawerOpen}
            parentCard={true}
            byParent={byParent}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <AboutOverivew about={data} setEditDrawerOpen={setEditDrawerOpen} byParent={byParent} />
      </Grid>

      <Grid item xs={12}>
        <SchoolOverview about={data} />
      </Grid>

      <Grid item xs={12}>
        <SchoolOverview about={data} showOverView={true} />
      </Grid>

      <Grid item xs={12}>
        <ActivityTimeline recent={data?.news} setValue={setValue} />
      </Grid>
    </Grid>
  ) : null
}

export default ProfileTab
