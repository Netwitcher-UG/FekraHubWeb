import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Translations from 'src/layouts/components/Translations'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import EditParentDialog from './edit-parent'
import { useTranslation } from 'react-i18next'
// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchParents } from 'src/store/apps/users'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/users/parents/list/TableHeader'
import CustomDataGrid from 'src/@core/components/custom-grid'
import useParentsColumns from './hooks/useParentsColumns'

const ParentsList = () => {
  const { t } = useTranslation()
  const [dialogData, setDialogData] = useState(null)
  const [open, setOpen] = useState(false)

  // New State for User Status Filter
  const [selectedStatus, setSelectedStatus] = useState('true') // Default is 'Active'
  const [paramsQuery, setParamsQuery] = useState('')

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

  const { columns } = useParentsColumns({ handleEditClick })

  // ** Hooks
  const dispatch = useDispatch()
  const router = useRouter()
  const store = useSelector(state => state.users)

  // Fetch data with status filter
  const fetchDataWithPagination = statusValue => {
    setParamsQuery(`IsActive=${statusValue}`)
    dispatch(fetchParents(`IsActive=${statusValue}`))
  }

  useEffect(() => {
    fetchDataWithPagination(selectedStatus) // Fetch active parents by default
  }, [dispatch, selectedStatus])

  return (
    <Grid container spacing={6.5} sx={{ height: 'calc(100vh - 145px)', overflow: 'hidden' }}>
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, overflow: 'hidden' }}>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item sm={2} xs={12}>
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
            <Divider sx={{ m: '0 !important', flexShrink: 0 }} />
            <Box sx={{ flexShrink: 0 }}>
              <TableHeader />
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <CustomDataGrid
                rows={store?.data || []}
                columns={columns}
                loading={store.loading}
                sx={{
                  height: '100%'
                }}
              />
            </Box>
          </Box>
        </Card>
      </Grid>

      <EditParentDialog paramsQuery={paramsQuery} open={open} setOpen={setOpen} profileData={dialogData} />
    </Grid>
  )
}

export default ParentsList
