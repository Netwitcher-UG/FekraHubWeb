import { useState, useEffect, useCallback, useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import Translations from 'src/layouts/components/Translations'
import { convertDate } from 'src/@core/utils/convert-date'
import { Stack } from '@mui/system'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { IconButton, Typography, MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import EditParentDialog from './edit-parent'
import { useTranslation } from 'react-i18next'
// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchParents } from 'src/store/apps/users'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/users/parents/list/TableHeader'

const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const ParentsList = () => {
  const { t } = useTranslation()
  const ability = useContext(AbilityContext)
  const [dialogData, setDialogData] = useState(null)
  const [open, setOpen] = useState(false)

  // New State for User Status Filter
  const [selectedStatus, setSelectedStatus] = useState('true') // Default is 'Active'

  const handleEditClick = (e, row) => {
    e.stopPropagation()
    handleOpenDialog(row)
  }
  const handleOpenDialog = useCallback(data => {
    setDialogData(data)
    setOpen(true)
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
      width: 200,
      headerName: <Translations text={'User Name'} />,
      field: 'userName'
    },
    {
      width: 200,
      headerName: <Translations text={'Email'} />,
      field: 'email'
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
      headerName: <Translations text={'Parent Status'} />,
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
      headerName: <Translations text={'Emergency Phone Number'} />,
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

  // ** Hooks
  const dispatch = useDispatch()
  const router = useRouter()
  const store = useSelector(state => state.users)

  // Fetch data with status filter
  const fetchDataWithPagination = statusValue => {
    dispatch(fetchParents(`IsActive=${statusValue}`))
  }

  useEffect(() => {
    fetchDataWithPagination(selectedStatus) // Fetch active parents by default
  }, [dispatch, selectedStatus])

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
                  label={<Translations text={'Parent Status'} />}
                  id='validation-status-select'
                  defaultValue='true'
                  SelectProps={{
                    onChange: e => setSelectedStatus(e.target.value),
                    displayEmpty: true
                  }}
                >
                  <MenuItem value='true'>
                    <Translations text={'Active'} />
                  </MenuItem>
                  <MenuItem value='false'>
                    <Translations text={'Inactive'} />
                  </MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          {/* Table Header */}
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
                rowHeight={62}
                rows={store?.data || []}
                columns={columns}
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

      <EditParentDialog open={open} setOpen={setOpen} profileData={dialogData} />
    </Grid>
  )
}

export default ParentsList
