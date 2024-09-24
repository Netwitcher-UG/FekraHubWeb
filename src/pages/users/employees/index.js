import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Stack } from '@mui/system'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
// import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import CardHeader from '@mui/material/CardHeader'
// ** Actions Imports
import { fetchEmployees } from 'src/store/apps/users'
import { convertDate } from 'src/@core/utils/convert-date'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardContent from '@mui/material/CardContent'
// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/users/employees/list/TableHeader'
import { IconButton, Typography } from '@mui/material'
import EditEmployeeDialog from './edit-employee'
const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8 // Set the thickness for the horizontal scrollbar
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const EmployeesList = () => {
  const ability = useContext(AbilityContext)
  const [dialogData, setDialogData] = useState(null)
  const [open, setOpen] = useState(false)
  const handleEditClick = (e, row) => {
    e.stopPropagation()
    handleOpenDialog(row)
  }
  const handleOpenDialog = useCallback(data => {
    setDialogData(data)
    setOpen(true)
  }, [])
  const handleCloseDrawer = useCallback(() => {
    setOpen(false)
    setDialogData(null)
  }, [])
  const columns = [
    {
      width: 100,
      field: 'action',
      headerName: <Translations text={'Action'} />,
      renderCell: params => {
        return (
          <>
            {ability.can('update', 'User') && (
              <Stack direction={'row'} alignItems={'center'}>
                <IconButton onClick={e => handleEditClick(e, params.row)}>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'
                    ></path>
                  </svg>
                </IconButton>
              </Stack>
            )}
          </>
        )
      }
    },
    {
      width: 250,
      headerName: <Translations text={'Email'} />,
      field: 'email'
    },
    {
      width: 250,
      headerName: <Translations text={'Role'} />,
      field: 'roles',
      renderCell: ({ row }) => <Chip label={row.roles} color={'primary'} sx={{ textTransform: 'capitalize' }} />
    },
    {
      width: 200,
      headerName: <Translations text={'First Name'} />,
      field: 'firstName'
    },
    {
      width: 200,
      headerName: <Translations text={'Last Name'} />,
      field: 'lastName'
    },
    {
      width: 200,
      headerName: <Translations text={'User Status'} />,
      field: 'activeUser',
      renderCell: ({ row }) => (
        <>
          {row.activeUser ? (
            <Chip label={'Active'} color={'success'} sx={{ textTransform: 'capitalize' }} />
          ) : (
            <Chip label={'Inactive'} color={'secondary'} sx={{ textTransform: 'capitalize' }} />
          )}
        </>
      )
    },
    {
      width: 100,
      headerName: <Translations text={'Gender'} />,
      field: 'gender'
    },
    {
      width: 200,
      headerName: <Translations text={'Nationality'} />,
      field: 'nationality'
    },
    {
      width: 200,
      headerName: <Translations text={'Phone Number'} />,
      field: 'phoneNumber'
    },
    {
      width: 200,
      headerName: <Translations text={'Job'} />,
      field: 'job'
    },
    {
      width: 200,
      headerName: <Translations text={'BirthDay'} />,
      renderCell: ({ row }) => <div>{convertDate(row.birthday)}</div>
    },
    {
      width: 200,
      headerName: <Translations text={'City'} />,
      field: 'city'
    },
    {
      width: 200,
      headerName: <Translations text={'Street'} />,
      field: 'street'
    },
    {
      width: 200,
      headerName: <Translations text={'Street'} />,
      field: 'emergencyPhoneNumber'
    },
    {
      width: 200,
      headerName: <Translations text={'Birth Place'} />,
      field: 'birthplace'
    },
    {
      width: 200,
      headerName: <Translations text={'Street Num'} />,
      field: 'streetNr'
    }
  ]

  // ** State
  const { t } = useTranslation()
  const [selectedRole, setSelectedRole] = useState('')

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.users)

  const router = useRouter()
  const handleRowClick = params => {
    if (params.row.roles != 'Teacher') return

    const currentPath = window.location.pathname

    const newPath = `${currentPath}teachers/${params.row.id}`

    router.push(newPath)
  }

  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch])

  const fetchDataWithPagination = roleValue => {
    dispatch(fetchEmployees(roleValue == '' ? '' : `RoleName=${roleValue}`))
  }

  useEffect(() => {
    fetchDataWithPagination(selectedRole)
  }, [dispatch, selectedRole])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('Search Filters')} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label={<Translations text={'Role filter'} />}
                  id='validation-gender-select'
                  aria-describedby='validation-gender-select'
                  defaultValue=''
                  SelectProps={{
                    onChange: e => setSelectedRole(e.target.value),
                    displayEmpty: true
                  }}
                >
                  <MenuItem value=''>
                    <em>
                      <Translations text={'All Roles'} />
                    </em>
                  </MenuItem>
                  <MenuItem key={1} value={'Admin'}>
                    <Translations text={'Admin'} />
                  </MenuItem>
                  <MenuItem key={2} value={'Secretariat'}>
                    <Translations text={'Secretory'} />
                  </MenuItem>
                  <MenuItem key={3} value={'Teacher'}>
                    <Translations text={'Teacher'} />
                  </MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader />
          <Box sx={{ height: 'calc(100vh - 250px)' }}>
            {store.loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '90%',
                  zIndex: 10
                }}
              >
                <CircularProgress size={100} />
              </Box>
            ) : (
              <DataGrid
                //   autoHeight
                rowHeight={62}
                rows={store?.employeesData || []}
                columns={columns}
                onRowClick={handleRowClick}
                hideFooter={true}
                disableRowSelectionOnClick
                pagination={true}
                sx={{
                  overflowY: 'scroll',
                  overflowX: 'scroll',
                  ...customScrollbarStyles,
                  fontSize: '1rem'
                }}
              />
            )}
          </Box>
          <Divider sx={{ m: '0 !important' }} />
        </Card>
      </Grid>

      <EditEmployeeDialog open={open} setOpen={setOpen} profileData={dialogData} />
    </Grid>
  )
}

export default EmployeesList
// export default withRoleRestriction(EmployeesList)
