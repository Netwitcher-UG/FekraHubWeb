import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
// import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
// import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
// import TableHead from '@mui/material/TableHead'
// import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
// import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
// import Icon from 'src/@core/components/icon'
// import CustomTextField from 'src/@core/components/mui/text-field'
import { assignPermissionToRole } from 'src/store/apps/roles'
import toast from 'react-hot-toast'

const RolesCards = props => {
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedRolePermissions, setSelectedRolePermissions] = useState([])

  const { rolesData, dispatch } = props
  const { schoolRolesAndPermissions, allPermissions } = rolesData

  const handleClickOpen = role => {
    setSelectedRole(role)
    setSelectedRolePermissions(schoolRolesAndPermissions[role] || [])
    setDialogTitle('Edit')
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async () => {
    const data = {
      RoleName: selectedRole,
      PermissionsName: selectedRolePermissions
    }

    const response = await dispatch(assignPermissionToRole(data))

    if (response?.payload?.status == 200) {
      handleClose()
      toast.success('Role updated successfully')
    } else console.log(response)
  }

  const isPermissionChecked = permission => selectedRolePermissions.includes(permission)

  const handlePermissionChange = permission => {
    setSelectedRolePermissions(prevPermissions =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter(p => p !== permission)
        : [...prevPermissions, permission]
    )
  }

  const renderCards = () =>
    allPermissions?.allRoles?.map((role, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography variant='h4' sx={{ mb: 1 }}>
                  {role}
                </Typography>
                <Typography
                  href='/'
                  component={Link}
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                  onClick={e => {
                    e.preventDefault()
                    handleClickOpen(role)
                  }}
                >
                  Edit Role
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))

  return (
    <Grid container spacing={6} className='match-height'>
      {rolesData?.loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            width: '100%',
            zIndex: 10
          }}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        renderCards()
      )}
      <Dialog fullWidth maxWidth='lg' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`${dialogTitle} Role`}</Typography>
          <Typography color='text.secondary'>Set Role Permissions</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Typography variant='h4' sx={{ mb: 4 }}>
            {selectedRole} Permissions
          </Typography>
          <TableContainer>
            <Table size='small'>
              <TableBody>
                {allPermissions?.allPermissions?.map((permission, index) => {
                  if (index % 3 === 0) {
                    return (
                      <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }} key={index}>
                        <TableCell>
                          <FormControlLabel
                            label={allPermissions.allPermissions[index]}
                            sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                            control={
                              <Checkbox
                                size='small'
                                checked={isPermissionChecked(allPermissions.allPermissions[index])}
                                onChange={() => handlePermissionChange(allPermissions.allPermissions[index])}
                              />
                            }
                          />
                        </TableCell>
                        {allPermissions.allPermissions[index + 1] && (
                          <TableCell>
                            <FormControlLabel
                              label={allPermissions.allPermissions[index + 1]}
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  checked={isPermissionChecked(allPermissions.allPermissions[index + 1])}
                                  onChange={() => handlePermissionChange(allPermissions.allPermissions[index + 1])}
                                />
                              }
                            />
                          </TableCell>
                        )}
                        {allPermissions.allPermissions[index + 2] && (
                          <TableCell>
                            <FormControlLabel
                              label={allPermissions.allPermissions[index + 2]}
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  checked={isPermissionChecked(allPermissions.allPermissions[index + 2])}
                                  onChange={() => handlePermissionChange(allPermissions.allPermissions[index + 2])}
                                />
                              }
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  }
                  return null
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button type='submit' disabled={rolesData?.assignLoading} variant='contained' onClick={handleSubmit}>
              {rolesData?.assignLoading ? <CircularProgress size={22} /> : 'Submit'}
            </Button>
            <Button color='secondary' disabled={rolesData?.assignLoading} variant='tonal' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RolesCards
