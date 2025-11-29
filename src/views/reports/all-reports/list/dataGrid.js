import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import CustomTextField from 'src/@core/components/mui/text-field'
import Translations from 'src/layouts/components/Translations'
import ReportPreviewDrawer from '../preview-report/report-drawer'
import TableHeader from './TableHeader'
import { Autocomplete } from '@mui/material'
import toast from 'react-hot-toast'
import useReportsColumns from '../hooks/useReportsColumns'
import EditReportDrawer from '../edit-report/edit-report-drawer'
import { useTranslation } from 'react-i18next'
import CustomDataGrid from 'src/@core/components/custom-grid'

const ReportsDataGrid = ({
  store,
  courses,
  selectedCourse,
  setSelectedCourse,
  currentPage,
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

  return (
    <>
      <CardContent sx={{ flexShrink: 0, pb: 0 }}>
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
      <Divider sx={{ m: '0 !important', flexShrink: 0 }} />

      {store?.data?.reports?.length > 0 && <TableHeader handleApproveAllReports={handleApproveAllReports} />}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <CustomDataGrid
          rows={store?.data?.reports || []}
          columns={columns}
          loading={store.loading}
          handleRowClick={handleOpenDrawer}
          pagination={true}
          totalPages={store?.data?.totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          sx={{
            height: '100%'
          }}
        />
      </Box>
      {open && <ReportPreviewDrawer open={open} handleCloseDrawer={handleCloseDrawer} rowData={drawerData} />}
      {editDraweropen && (
        <EditReportDrawer open={editDraweropen} handleCloseDrawer={handleEditDrawerClose} rowData={editDrawerData} />
      )}
    </>
  )
}

export default ReportsDataGrid
