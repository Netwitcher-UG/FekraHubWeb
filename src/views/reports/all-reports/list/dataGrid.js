import { useState, useEffect, useCallback } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import Translations from 'src/layouts/components/Translations'
import CardHeader from '@mui/material/CardHeader'
import ReportPreviewDrawer from '../preview-report/report-drawer'
import TableHeader from './TableHeader'
import { Autocomplete } from '@mui/material'
import toast from 'react-hot-toast'
import useReportsColumns from '../hooks/useReportsColumns'
import EditReportDrawer from '../edit-report/edit-report-drawer'
import { useTranslation } from 'react-i18next'

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

const ReportsDataGrid = ({
  store,
  courses,
  // setValue,
  // value,
  // handleFilter,
  selectedCourse,
  setSelectedCourse,
  // handleRowClick
  setCurrentPage,
  dispatch,
  acceptAllReport
}) => {
  const { t } = useTranslation()
  const [drawerData, setDrawerData] = useState(null)
  const [open, setOpen] = useState(false)

  const { columns, handleEditDrawerClose, editDraweropen, editDrawerData } = useReportsColumns()

  const handleOpenDrawer = useCallback(params => {
    setDrawerData(params.row)
    setOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setOpen(false)
    setDrawerData(null)
  }, [])

  const handleCourseChange = (event, newValue) => {
    setCurrentPage(1)
    setSelectedCourse(newValue ? newValue.value : '')
  }

  const handleApproveAllReports = async () => {
    const nullImprovedIds = store?.data?.reports.filter(item => item.improved === null).map(item => item.id)

    if (nullImprovedIds.length == 0) toast.error(<Translations text={'No report needs approval on this page'} />)
    else {
      const response = await dispatch(acceptAllReport(nullImprovedIds))
      if (response?.payload?.status == 200) toast.success(<Translations text={'Reports approved successfully'} />)
      else toast.error(<Translations text={'Something went wrong try again !'} />)
    }
  }

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       handleFilter(value)
  //     }, 700)

  //     return () => clearTimeout(timer)
  //   }, [value, handleFilter])

  return (
    <>
      <CardHeader title={t('Search Filters')} />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item sm={4} xs={12}>
            <Autocomplete
              options={courses?.map(course => ({ value: course.id, label: course.name }))}
              fullWidth
              id='autocomplete-courseFilter'
              getOptionLabel={option => option.label}
              value={
                selectedCourse
                  ? {
                      value: selectedCourse,
                      label: courses?.find(course => course.id === selectedCourse)?.name || ''
                    }
                  : null
              }
              onChange={handleCourseChange}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  fullWidth
                  sx={{ mb: 4 }}
                  placeholder={t('Select course')}
                  label={t('Course filter')}
                  id='validation-billing-select'
                  aria-describedby='validation-billing-select'
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />

      {store?.data?.reports?.length > 0 && <TableHeader handleApproveAllReports={handleApproveAllReports} />}
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
            rows={store?.data?.reports || []}
            columns={columns}
            hideFooter={true}
            disableRowSelectionOnClick
            pagination={true}
            onRowClick={handleOpenDrawer}
            sx={{
              overflowY: 'scroll',
              overflowX: 'scroll',
              ...customScrollbarStyles,
              fontSize: '1rem'
            }}
          />
        )}
      </Box>
      {open && <ReportPreviewDrawer open={open} handleCloseDrawer={handleCloseDrawer} rowData={drawerData} />}
      {editDraweropen && (
        <EditReportDrawer open={editDraweropen} handleCloseDrawer={handleEditDrawerClose} rowData={editDrawerData} />
      )}
    </>
  )
}

export default ReportsDataGrid
