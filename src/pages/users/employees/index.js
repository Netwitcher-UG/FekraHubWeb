import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import CardHeader from '@mui/material/CardHeader'
// ** Actions Imports
import { fetchEmployees } from 'src/store/apps/users'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardContent from '@mui/material/CardContent'
// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/users/employees/list/TableHeader'
import EditEmployeeDialog from './edit-employee'
import CustomDataGrid from 'src/@core/components/custom-grid'
import useEmployeesColumns from './hooks/useEmployeesColumns'

const EmployeesList = () => {
  const [dialogData, setDialogData] = useState(null)
  const [open, setOpen] = useState(false)

  // New State for User Status Filter
  const [selectedStatus, setSelectedStatus] = useState('true') // Default is 'Active'
  const [paramsQuery, setParamsQuery] = useState([])

  const handleOpenDialog = useCallback(data => {
    setDialogData(data)
    setOpen(true)
  }, [])

  const handleEditClick = useCallback(
    (e, row) => {
      e.stopPropagation()
      handleOpenDialog(row)
    },
    [handleOpenDialog]
  )

  const { columns } = useEmployeesColumns({ handleEditClick })

  // ** State
  const { t } = useTranslation()
  const [selectedRole, setSelectedRole] = useState('')

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.users)
  const router = useRouter()

  // Updated fetch method with role and status filter
  const fetchDataWithPagination = useCallback(
    (roleValue, statusValue) => {
      const query = []
      if (roleValue) query.push(`RoleName=${roleValue}`)
      query.push(`IsActive=${statusValue}`)
      setParamsQuery(query)
      dispatch(fetchEmployees(query.join('&')))
    },
    [dispatch]
  )

  const handleRowClick = params => {
    if (params.row.roles == 'Admin') return

    const currentPath = window.location.pathname

    const newPath = `${currentPath}teachers/${params.row.id}?role=${encodeURIComponent(params.row.roles || '')}`

    router.push(newPath)
  }

  useEffect(() => {
    fetchDataWithPagination(selectedRole, selectedStatus) // Fetch with status filter
  }, [fetchDataWithPagination, selectedRole, selectedStatus])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <CardHeader title={t('Search Filters')} />
          <CardContent>
            <Grid container spacing={6}>
              {/* Role Filter */}
              <Grid item sm={2} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label={<Translations text={'Role filter'} />}
                  id='validation-role-select'
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

              {/* User Status Filter */}
              <Grid item sm={2} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label={<Translations text={'User Status'} />}
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
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader />
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <CustomDataGrid
              rows={store?.employeesData || []}
              columns={columns}
              loading={store.loading}
              handleRowClick={handleRowClick}
              sx={{
                height: '100%'
              }}
            />
          </Box>
        </Card>
      </Grid>

      <EditEmployeeDialog open={open} paramsQuery={paramsQuery} setOpen={setOpen} profileData={dialogData} />
    </Grid>
  )
}

export default EmployeesList
