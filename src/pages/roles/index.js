// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { fetchAllPermissions, fetchSchoolRolesAndPermissions } from 'src/store/apps/roles'
import { useDispatch, useSelector } from 'react-redux'
// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import Alert from '@mui/material/Alert'
import RoleCards from 'src/views/roles/RoleCards'
import Translations from 'src/layouts/components/Translations'

const RolesComponent = () => {
  const dispatch = useDispatch()
  const rolesData = useSelector(state => state.roles)
  useEffect(() => {
    dispatch(fetchAllPermissions())
    dispatch(fetchSchoolRolesAndPermissions())
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h4' sx={{ mb: 6 }}>
            <Translations text={'Roles List'} />
          </Typography>
        }
        subtitle={
          <>
            <Typography sx={{ color: 'text.secondary' }}>
              <Translations text={'A role provided access to predefined menus and features so that depending on'} />
              <br />
              <Translations text={'assigned role an administrator can have access to what he need'} />
            </Typography>
            <Alert icon={false} severity='info' sx={{ py: 3, m: 6, ml: 0, '& .MuiAlert-message': { p: 0 } }}>
              <Typography variant='body2' sx={{ mb: 2, color: 'info.main' }}>
                <Translations text={'The updated permissions will take effect after the user refreshes the page.'} />
              </Typography>
            </Alert>
          </>
        }
      />

      <Grid item xs={12}>
        <RoleCards rolesData={rolesData} dispatch={dispatch} />
      </Grid>
    </Grid>
  )
}

export default RolesComponent
